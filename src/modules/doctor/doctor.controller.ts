import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import { DoctorService } from "./doctor.service";
import { generateToken } from "../../utils/generateToken";

export const changeAvailability = async (req: Request, res: Response) => {
  try {
    const { docId } = req.body;
    if (!docId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.INVALID_INPUT, ["Id must be present!"])
      );
    }
    await DoctorService.updateAvailability(parseInt(docId));
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const doctorList = async (req: Request, res: Response) => {
  try {
    const list = await DoctorService.getAll();
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED, list);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const doctor = await DoctorService.getDoctor({ email });
    if (!doctor || email !== doctor.email || password !== doctor.password) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS, [])
      );
    }
    const token = generateToken(
      `${doctor.id}` as string,
      process.env.JWT_SECRET as string
    );
    sendSuccessResponse(res, SUCCESS_CODES.AUTHENTICATION.VALIDATE_TOKEN, [
      token,
    ]);
  } catch (error) {
    handleControllerError(res, error);
  }
};
