import express from "express";
import cors from "cors";
import userRouter from "./modules/user/user.router";
import adminRouter from "./modules/admin/admin.router";
import doctorRouter from "./modules/doctor/doctor.router";
import { connectCloudinary } from "./config/cloudinary";
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://doctor-management-application.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
connectCloudinary();
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/user", userRouter);

export default app;
