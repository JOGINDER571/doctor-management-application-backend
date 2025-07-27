import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleControllerError } from "../../utils/error-handler-util";
import { CustomError } from "../../utils/custom-error";
import { ERROR_CODES } from "../../constants/error-codes";

export const createDoctorSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().url("Image is required")
  ),
  speciality: z.string().min(1, "Speciality is required"),
  degree: z.string().min(1, "Degree is required"),
  experience: z.string().min(1, "Experience is required"),
  about: z.string().min(10, "About must be at least 10 characters"),

  available: z.boolean(),
  fees: z.number().positive("Fees must be positive"),
  date: z.number(),

  address: z.object({
    line1: z.string(),
    line2: z.string(),
  }),
  slotsBooked: z.record(z.string(), z.array(z.string())).optional(),
});

export const loginAdminSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const transformDoctorData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body.image = (req.file as any)?.cloudinary?.url ?? "";
    req.body.available = JSON.parse(req.body.available);
    req.body.fees = parseFloat(req.body.fees);
    req.body.date = parseFloat(req.body.date);
    req.body.address = JSON.parse(req.body.address || "{}");
    req.body.slotsBooked = req.body.slotsBooked
      ? JSON.parse(req.body.slotsBooked)
      : {};
    next();
  } catch (err: any) {
    handleControllerError(
      res,
      new CustomError(ERROR_CODES.GENERAL.CONFLICT, [
        "Invalid form-data format",
      ])
    );
  }
};

export type CreateUserInput = z.infer<typeof loginAdminSchema>;
export type DoctorSchemaInput = z.infer<typeof createDoctorSchema>;
