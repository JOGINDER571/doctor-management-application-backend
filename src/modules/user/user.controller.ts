import { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendSuccessResponse } from "../../utils/apiResponse";
import { SUCCESS_CODES } from "../../constants/success-codes";
import { handleControllerError } from "../../utils/error-handler-util";
import { ERROR_CODES } from "../../constants/error-codes";
import { CustomError } from "../../utils/custom-error";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";
import { DoctorService } from "../doctor/doctor.service";
import razorpay from "razorpay";
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const isUserPresent = await UserService.getUser(req.body.email);
    if (isUserPresent) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.CONFLICT, ["user already present"])
      );
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await UserService.create({ ...req.body, password: hashedPassword });
    sendSuccessResponse(res, SUCCESS_CODES.USER.USER_CREATED, []);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.getUser(email);
    if (!user) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.NOT_FOUND)
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
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

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const id = parseInt(req.userId);
    const user = await UserService.getProfile(id);
    sendSuccessResponse(res, SUCCESS_CODES.USER.USER_RETRIEVED, user);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const id = parseInt(req.userId);

    await UserService.update(req.body, id);
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_UPDATED);
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const bookAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const id = parseInt(req.userId);
    const user = await UserService.getProfile(id);
    if (!user) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.NOT_FOUND)
      );
    }
    const { docId, slotDate, slotTime } = req.body;
    const doctor = await DoctorService.getDoctor(docId);
    if (!doctor) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.NOT_FOUND, ["Doctor not exist!"])
      );
    }
    let slotsBooked: any = doctor?.slotsBooked;
    if (Array.isArray(slotsBooked)) {
      slotsBooked = {};
    }

    if (slotsBooked[slotDate]) {
      if (slotsBooked[slotDate].includes(slotTime)) {
        return handleControllerError(
          res,
          new CustomError(ERROR_CODES.APPOINTMENTS.ALREADY_FILLED)
        );
      } else {
        slotsBooked[slotDate].push(slotTime);
      }
    } else {
      slotsBooked[slotDate] = [];
      slotsBooked[slotDate].push(slotTime);
    }

    // if (
    //   doctor?.slotsBooked &&
    //   typeof doctor.slotsBooked === "object" &&
    //   !Array.isArray(doctor.slotsBooked)
    // ) {
    //   delete doctor.slotsBooked;
    // }

    const appointmentData = {
      userId: id,
      docId: docId,
      slotDate,
      slotTime,
      docData: doctor,
      userData: user,
      amount: doctor?.fees,
      date: `${Date.now()}`,
    };

    await UserService.bookAppointment(appointmentData);
    await UserService.updateDoctor(slotsBooked, docId);
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_CREATED);
  } catch (error) {
    console.log("running");
    handleControllerError(res, error);
  }
};

export const getUserAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const id = parseInt(req.userId);
    const appointments = await UserService.getAppointments(id);
    sendSuccessResponse(
      res,
      SUCCESS_CODES.RESOURCE.RESOURCE_RETRIEVED,
      appointments
    );
  } catch (error) {
    handleControllerError(res, error);
  }
};

export const cancelAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
      );
    }
    const id = parseInt(req.userId);
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
    if (appointment.userId !== id) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.AUTHENTICATION.UNAUTHORIZED)
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

const RazorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const razorpayPayment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await UserService.getAppointment(appointmentId);
    if (!appointmentId || appointment?.cancelled) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.INVALID_INPUT, [
          "Appointment ID and Payment ID must be provided.",
        ])
      );
    }
    const options = {
      amount: appointment?.amount ? appointment.amount : 60,
      currency: process.env.CURRENCY || "INR",
      receipt: `receipt_${appointmentId}`,
    };
    console.log("options");
    // Create a new order
    const order = await RazorpayInstance.orders.create(options);
    sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_CREATED, order);
  } catch (error) {
    console.log("hello", error);
    handleControllerError(res, error);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return handleControllerError(
        res,
        new CustomError(ERROR_CODES.INVALID_INPUT, [
          "Order ID must be provided.",
        ])
      );
    }
    const orderInfo = await RazorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      let id = orderInfo.receipt ? orderInfo.receipt.split("_")[1] : "1";
      await UserService.updateAppointment(parseInt(id));
      return sendSuccessResponse(res, SUCCESS_CODES.RESOURCE.RESOURCE_CREATED);
    } else {
      handleControllerError(
        res,
        new CustomError(ERROR_CODES.GENERAL.NOT_FOUND, ["Payment failed."])
      );
    }
  } catch (error) {
    handleControllerError(res, error);
  }
};
