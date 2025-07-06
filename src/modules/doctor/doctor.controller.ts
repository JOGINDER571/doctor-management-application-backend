import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import { DoctorService } from "./doctor.service";
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
