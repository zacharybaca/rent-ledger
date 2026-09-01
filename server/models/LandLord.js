import mongoose from "mongoose";
import argon2 from "argon2";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const landLordSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        subdomain: { type: String, required: true, unique: true },
        stripeAccountId: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const LandLord = mongoose.model("LandLord", landLordSchema);

export default LandLord;
