import { Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { AdminService } from "./admin.service";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import { generateToken } from "../../utils/generateToken";
import { UserService } from "../user/user.service";
import { string } from "zod";
import { DoctorSchemaInput } from "./admin.schema";
import { CreateUserInput } from "../user/user.schema";
import { DoctorService } from "../doctor/doctor.service";

interface FormattedAppointment {
  name: string;
  slotDate: string;
  image: string;
}
interface Appointment {
  id: number;
  name: string;
  userName: string;
  slotTime: string;
  slotDate: string;
  image: string;
  fees: number;
  dob: string;
  isCompleted: boolean;
  payment: boolean;
  cancelled: boolean;
}

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

export const dashboard = async (req: Request, res: Response) => {
  try {
    const totalDoctors = await AdminService.getAll();
    const totalPatients = await UserService.getAllUsers();
    const totalAppointments = await UserService.getAllAppointments();

    let formatedAppointments: FormattedAppointment[] = [];
    if (totalAppointments.length > 0) {
      formatedAppointments = totalAppointments
        .slice(-5)
        .reverse()
        .map((appointment) => {
          const doc = appointment.docData as DoctorSchemaInput;
          return {
            name: doc.name,
            slotDate: appointment.slotDate,
            image: doc.image,
          };
        });
    }
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED, {
      doctors: totalDoctors?.length || 0,
      patient: totalPatients?.length || 0,
      totalAppointments: formatedAppointments,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const appointmentData = async (req: Request, res: Response) => {
  try {
    const totalAppointments = await UserService.getAllAppointments();
    let appointments: Appointment[] = [];
    if (totalAppointments.length > 0) {
      appointments = totalAppointments.map((appointment) => {
        const doc = appointment.docData as DoctorSchemaInput;
        const user = appointment.userData as CreateUserInput;
        return {
          id: appointment.id,
          name: doc.name,
          userName: user.name,
          slotDate: appointment.slotDate,
          slotTime: appointment.slotTime,
          image: doc.image,
          fees: appointment.amount,
          dob: user?.dob ?? "",
          isCompleted: appointment.isCompleted,
          payment: appointment.payment,
          cancelled: appointment.cancelled,
        };
      });
    }
    sendSuccessResponse(
      res,
      SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED,
      appointments
    );
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await UserService.getAppointment(appointmentId);
    if (!appointment) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.NOT_FOUND, [
          "Appointment not found!",
        ])
      );
    }

    const doctor = await DoctorService.getDoctor({
      id: appointment.docId,
      email: "",
    });
    if (!doctor) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.NOT_FOUND, ["Doctor not exist!"])
      );
    }
    let slotsBooked: any = doctor?.slotsBooked;
    if (slotsBooked[appointment.slotDate]) {
      slotsBooked[appointment.slotDate] = slotsBooked[
        appointment.slotDate
      ].filter((time: string) => time !== appointment.slotTime);
    }
    await UserService.cancelAppointment(appointmentId);
    await UserService.updateDoctor(slotsBooked, appointment.docId);
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_DELETED);
  } catch (error) {
    handleControllerError(res, error);
  }
};
