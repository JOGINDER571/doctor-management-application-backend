import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { ERROR_CODES } from "../constants/error-codes";
import { CustomError } from "../utils/custom-error";
import { handleControllerError } from "../utils/error-handler-util";

// Set up multer to store files temporarily
const upload = multer({ dest: "uploads/" });

// Middleware to upload file to Cloudinary after multer
const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.file, "req.file");
  if (!req.file) return next();
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctors",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    // Add Cloudinary URL and public_id to request object
    (req.file as any).cloudinary = {
      url: result.secure_url,
      public_id: result.public_id,
    };

    // Remove the temp file
    fs.unlinkSync(req.file.path);

    next();
  } catch (err) {
    handleControllerError(
      res,
      new CustomError(ERROR_CODES.GENERAL.CONFLICT, [ 
        "Cloudinary upload failed",
      ])
    );
  }
};

export { upload, uploadToCloudinary };
