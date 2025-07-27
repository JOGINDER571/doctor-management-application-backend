import express from "express";
import {
  appointmentData,
  cancelAppointment,
  createDoctor,
  dashboard,
  doctorList,
  loginAdmin,
} from "./admin.controller";
import { validatePayload } from "../../middlewares/validatePayload";
import {
  createDoctorSchema,
  transformDoctorData,
  loginAdminSchema,
} from "./admin.schema";
import { upload, uploadToCloudinary } from "../../middlewares/multer";
import { authAdmin } from "../../middlewares/auth";
import { changeAvailability } from "../doctor/doctor.controller";

const router = express.Router();
router.post("/login", validatePayload(loginAdminSchema), loginAdmin);
router.use(authAdmin);

router.post(
  "/add-doctor",
  upload.single("image"),
  uploadToCloudinary,
  transformDoctorData,
  validatePayload(createDoctorSchema),
  createDoctor
);

router.get("/doctors", doctorList);

router.put("/change-doctor-availability", changeAvailability);

router.get("/dashboard", dashboard);
router.get("/appointments", appointmentData);

router.put("/cancel-appointment", cancelAppointment);

export default router;
