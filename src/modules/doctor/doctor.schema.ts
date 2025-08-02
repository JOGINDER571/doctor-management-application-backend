import { z } from "zod";


export const loginDoctorSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const updateDoctorSchema = z.object({
  available: z.boolean(),
  fees: z.number().positive("Fees must be positive"),
  address: z.object({
    line1: z.string(),
    line2: z.string(),
  }),
});

export type LoginDoctorType = z.infer<typeof loginDoctorSchema>;
export type UpdateDoctorSchemaType = z.infer<typeof updateDoctorSchema>;