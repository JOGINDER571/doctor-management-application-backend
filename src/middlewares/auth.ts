import { CustomError } from "../utils/custom-error";
import { ERROR_CODES } from "../constants/error-codes";
import { handleControllerError } from "../utils/error-handler-util";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
  userId?: string;
  docId?: string;
}

export const authAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { atoken } = req.headers;
    if (!atoken) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED, [
          "token not found",
        ])
      );
    }
    const tokenDecode = jwt.verify(
      atoken as string,
      process.env.JWT_SECRET as string
    );
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASSWORD;
    if (!email || !pass) return;
    if (tokenDecode !== email + pass) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED, [
          "token not found",
        ])
      );
    }
    next();
  } catch (error) {
    console.log("autherr");
    handleControllerError(res, error);
  }
};

export const authDoctor = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED, [
          "token not found",
        ])
      );
    }
    const tokenDecode = jwt.verify(
      dtoken as string,
      process.env.JWT_SECRET as string
    );

    if (!tokenDecode) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED, [
          "token not found",
        ])
      );
    }
    req.docId = tokenDecode as string;
    next();
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const authUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED, [
          "token missing",
        ])
      );
    }
    const tokenDecode = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    );
    if (!tokenDecode) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    req.userId = tokenDecode as string;
    console.log(tokenDecode);
    next();
  } catch (error) {
    console.log("hello");
    handleControllerError(res, error);
  }
};
