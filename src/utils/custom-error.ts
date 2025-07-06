import { ErrorDetail } from "../constants/error-codes";

export class CustomError extends Error {
  errorDetail: ErrorDetail;
  errors: string[];

  constructor(errorDetail: ErrorDetail, errors: string[] = []) {
    super(errorDetail.message);
    this.errorDetail = errorDetail;
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
