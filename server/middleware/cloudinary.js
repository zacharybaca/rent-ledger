import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];

/**
 * Express middleware that reads a raw multipart body for a single image field,
 * validates size/type, and uploads it directly to Cloudinary via an upload stream.
 *
 * On success, populates `req.uploadedFile` with:
 *   { url: string, publicId: string }
 *
 * @param {string} fieldName  The multipart form-data field name for the file.
 */
export const handleUpload = (fieldName) => async (req, res, next) => {
  // If the request is not multipart, skip silently so non-file requests still work
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    return next();
  }

  try {
    const { default: busboy } = await import("busboy");
    const bb = busboy({
      headers: req.headers,
      limits: { fileSize: MAX_FILE_SIZE },
    });

    let uploadError = null;
    let uploadPromise = null;

    bb.on("file", (name, stream, info) => {
      if (name !== fieldName) {
        stream.resume(); // drain and ignore other fields
        return;
      }

      const { mimeType } = info;
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        stream.resume();
        uploadError = Object.assign(new Error("Only JPEG and PNG images are allowed."), { status: 415 });
        return;
      }

      uploadPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "avatar_uploads", resource_type: "image" },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              req.uploadedFile = { url: result.secure_url, publicId: result.public_id };
              resolve();
            }
          },
        );

        stream.on("limit", () => {
          const err = Object.assign(new Error("File too large. Maximum size is 5 MB."), { status: 413 });
          reject(err);
        });

        stream.pipe(uploadStream);
      });
    });

    bb.on("finish", async () => {
      if (uploadError) {
        res.status(uploadError.status || 500);
        return next(uploadError);
      }
      if (uploadPromise) {
        try {
          await uploadPromise;
        } catch (err) {
          res.status(err.status || 500);
          return next(err);
        }
      }
      next();
    });

    bb.on("error", (err) => next(err));

    req.pipe(bb);
  } catch (err) {
    next(err);
  }
};

export { cloudinary };
