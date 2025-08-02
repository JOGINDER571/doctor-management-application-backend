import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import { DoctorService } from "./doctor.service";
import { generateToken } from "../../utils/generateToken";

interface AuthenticatedRequest extends Request {
  docId?: string;
}

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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await DoctorService.getDoctorByEmail(email);
    if (!user) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.NOT_FOUND)
      );
    }

    if (user.password !== password) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS)
      );
    }
    const token = generateToken(
      `${user.id}` as string,
      process.env.JWT_SECRET as string
    );

    sendSuccessResponse(res, SUCCESS_CODES.AUTHENTICATION.LOGIN_SUCCESS, [
      token,
    ]);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const docId = req.docId;
    if (!docId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.getAppointments(parseInt(docId));

    return sendSuccessResponse(
      res,
      SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED,
      result
    );
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const appointmentComplete = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
    if (!docId || !appointmentId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.appointment(appointmentId);

    if (result && result.docId === parseInt(docId)) {
      await DoctorService.updateAppointment(appointmentId, {
        isCompleted: true,
      });
      return sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED);
    }
    return handleControllerError(
      res,
      new CustomError(ERROR_CODES.DATABASE.OPERATION_FAILED)
    );
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const appointmentCancel = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
    if (!docId || !appointmentId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.appointment(appointmentId);

    if (result && result.docId === parseInt(docId)) {
      await DoctorService.updateAppointment(appointmentId, { cancelled: true });
      return sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED);
    }
    return handleControllerError(
      res,
      new CustomError(ERROR_CODES.DATABASE.OPERATION_FAILED)
    );
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const dashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const docId = req.docId;
    if (!docId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.getAppointments(parseInt(docId));
    let earnings: number = 0;
    result?.forEach((item) => {
      earnings += item.amount;
    });
    let patients: number[] = [];
    result?.forEach((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      totalEarning: earnings,
      patients: patients?.length || 0,
      appointments: result?.length || 0,
      latestAppointment: result?.reverse().slice(0,5)
    }
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED,dashData);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const docId = req.docId;
    if (!docId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.getDoctor(parseInt(docId));
    
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED,result);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const docId = req.docId;
    if (!docId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const result = await DoctorService.updateDoctor(parseInt(docId),req.body);
    
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED,result);
  } catch (error) {
    handleControllerError(res, error);
  }
};
