import express from "express";
import { appointmentCancel, appointmentComplete, dashboard, doctorList, getAppointments, getProfile, login, updateProfile } from "./doctor.controller";
import { authDoctor } from "../../middlewares/auth";
import { loginDoctorSchema, updateDoctorSchema } from "./doctor.schema";
import { validatePayload } from "../../middlewares/validatePayload";

const router = express.Router();

router.get("/list", doctorList);
router.post("/login", validatePayload(loginDoctorSchema), login);
router.get("/appointments",authDoctor,getAppointments);
router.put("/complete-appointment",authDoctor,appointmentComplete);
router.put("/cancel-appointment",authDoctor,appointmentCancel);
router.get("/dash-data",authDoctor,dashboard);
router.get("/profile",authDoctor,getProfile);
router.put("/profile-update",authDoctor, validatePayload(updateDoctorSchema),updateProfile);

export default router;