import mongoose from "mongoose";
import argon2 from "argon2";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: { type: String },
    avatarPublicId: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await argon2.hash(this.password);
  next();
});

// Compare entered password against stored hash (supports legacy bcrypt and current argon2)
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Bcrypt hashes start with "$2b$" or "$2a$"
  if (this.password.startsWith("$2b$") || this.password.startsWith("$2a$")) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    if (isMatch) {
      // Re-hash with argon2 on successful login for seamless migration
      this.password = await argon2.hash(enteredPassword);
      await this.save();
    }
    return isMatch;
  }
  return await argon2.verify(this.password, enteredPassword);
};

// Generate a short-lived password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Expires in 10 minutes
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate a 24-hour email verification token
userSchema.methods.getVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.verificationExpire = Date.now() + 24 * 60 * 60 * 1000;

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
