import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { handleControllerError } from "../utils/error-handler-util";
import { ERROR_CODES } from "../constants/error-codes";
import { CustomError } from "../utils/custom-error";
export const validatePayload = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => e.message);
        return handleControllerError(
          res,
          new CustomError(ERROR_CODES.VALIDATION.INVALID_DATA_FORMAT, messages)
        );
      }
      handleControllerError(res, err);
    }
  };
};
