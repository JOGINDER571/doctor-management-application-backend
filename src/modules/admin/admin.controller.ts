import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { AdminService } from "./admin.service";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import { generateToken } from "../../utils/generateToken";

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const isDoctorPresent = await AdminService.getDoctorByEmail(req.body.email);
    if (isDoctorPresent) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.CONFLICT, [
          "doctor already present",
        ])
      );
    } else {
      await AdminService.create(req.body);
      sendSuccessResponse(res, SUCCESS_CODES.GENERAL.OPERATION_COMPLETED, [
        req.body,
      ]);
    }
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const doctorList = async (req: Request, res: Response) => {
  try {
    const list = await AdminService.getAll();
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED, list);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS, [])
      );
    }

    const token = generateToken(
      email + password,
      process.env.JWT_SECRET as string
    );
    sendSuccessResponse(res, SUCCESS_CODES.AUTHENTICATION.VALIDATE_TOKEN, [
      token,
    ]);
  } catch (error) {
    handleControllerError(res, error);
  }
};