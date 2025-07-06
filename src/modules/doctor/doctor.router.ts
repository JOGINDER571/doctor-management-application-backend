import express from "express";
import { doctorList } from "./doctor.controller";

const router = express.Router();

router.get("/list", doctorList);

export default router;