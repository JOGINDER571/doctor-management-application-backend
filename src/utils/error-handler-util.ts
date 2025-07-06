import { ERROR_CODES } from "../constants/error-codes";
import { sendErrorResponse } from "./apiResponse";
import { CustomError } from "./custom-error";
import { Response } from "express";

export function handleControllerError(res: Response, error: unknown): void {
  if (error instanceof CustomError) {
    sendErrorResponse(res, error.errorDetail, error.errors);
  } else {
    sendErrorResponse(res, ERROR_CODES.GENERAL.SERVER_ERROR);
  }
}
