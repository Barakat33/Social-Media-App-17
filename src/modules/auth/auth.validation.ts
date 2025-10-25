import { z } from "zod";
import { GENDER } from "../../utlis/common/enum";

// Register Validation
export const registerSchema = z
  .object({
    firstName: z.string().min(2).max(20).optional(),
    lastName: z.string().min(2).max(20).optional(),
    fullName: z.string().min(2).optional(),
    email: z.string().email(),
    password: z.string().min(6),
    phoneNumber: z.string().optional(),
    gender: z.nativeEnum(GENDER),
  })
  .refine(
    (data) => Boolean(data.fullName) || (Boolean(data.firstName) && Boolean(data.lastName)),
    { message: "Provide either fullName or both firstName and lastName" }
  );

// Login Validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Confirm Email Validation
export const confirmEmailSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});
