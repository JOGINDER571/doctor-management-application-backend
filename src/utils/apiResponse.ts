import { ErrorDetail } from "../constants/error-codes";
import { SuccessDetail } from "../constants/success-codes";

import { Response } from "express";

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
  status_code?: number;
  error_code?: string; // Application-specific error code
  errors?: string[];
}

function createSuccessResponse(
  successDetail: SuccessDetail,
  data?: any
): ApiResponse {
  return {
    success: true,
    message: successDetail.message,
    status_code: successDetail.status_code,
    data: data,
  };
}

function createErrorResponse(
  error: ErrorDetail,
  errors: any = null
): ApiResponse {
  return {
    success: false,
    message: error.message,
    status_code: error.status_code,
    error_code: error.error_code,
    errors,
  };
}

export function sendErrorResponse(
  res: Response,
  errorDetail: ErrorDetail,
  errors: any = null
) {
  res
    .status(errorDetail.status_code)
    .json(createErrorResponse(errorDetail, errors));
}

export function sendSuccessResponse(
  res: Response,
  successDetail: SuccessDetail,
  data?: any
) {
  res
    .status(successDetail.status_code)
    .json(createSuccessResponse(successDetail, data));
}
