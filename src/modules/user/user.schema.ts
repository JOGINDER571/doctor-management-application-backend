import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleControllerError } from "../../utils/error-handler-util";
import { CustomError } from "../../utils/custom-error";
import { ERROR_CODES } from "../../constants/error-codes";
// Schema for creating a user
export const createUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),

  address: z
    .object({
      line: z.string().optional(),
      line2: z.string().optional(),
    })
    .optional(),

  gender: z.enum(["Male", "Female", "Other", "Not Selected"]).optional(),
  phone: z.string().min(10).max(15).optional(),
  dob: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Schema for updating a user (partial)
export const updateUserSchema = z.object({
  name: z.string().min(3, "Name is required"),
  address: z
    .object({
      line: z.string().optional(),
      line2: z.string().optional(),
    })
    .optional(),

  gender: z.enum(["Male", "Female", "Other", "Not Selected"]).optional(),
  phone: z.string().min(10).max(15).optional(),
  dob: z.string().optional(),
  image: z.string().url("Image must be a valid URL").optional(),
});

export const bookAppointmentSchema = z.object({
  docId: z.number({ required_error: "docId is required" }),
  slotDate: z.string({ required_error: "slotDate is required" }),
  slotTime: z.string({ required_error: "slotTime is required" }),
});

export const transformUserData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req?.file && "cloudinary" in req.file) {
      req.body.image =
        (req.file as { cloudinary: { url: string } }).cloudinary?.url ?? "";
    }
    req.body.address = JSON.parse(req.body.address || "{}");
    next();
  } catch (err: any) {
    handleControllerError(
      res,
      new CustomError(ERROR_CODES.GENERAL.CONFLICT, [
        "Invalid user form data format",
      ])
    );
  }
};

// Type inference from Zod
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type bookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
