import express, { Router } from "express";
import {
  getUserProfile,
  createUser,
  login,
  updateUserProfile,
  bookAppointment,
} from "./user.controller";
import { validatePayload } from "../../middlewares/validatePayload";
import {
  bookAppointmentSchema,
  createUserSchema,
  loginUserSchema,
  transformUserData,
  updateUserSchema,
} from "./user.schema";
import { authUser } from "../../middlewares/auth";
import { upload, uploadToCloudinary } from "../../middlewares/multer";
const router = express.Router();
router.post("/create-user", validatePayload(createUserSchema), createUser);
router.post("/login", validatePayload(loginUserSchema), login);
router.use(authUser);
router.get("/profile", getUserProfile);
router.put(
  "/update-profile",
  upload.single("image"),
  uploadToCloudinary,
  transformUserData,
  validatePayload(updateUserSchema),
  updateUserProfile
);

router.post(
  "/book-appointment",
  validatePayload(bookAppointmentSchema),
  bookAppointment
);

export default router;
