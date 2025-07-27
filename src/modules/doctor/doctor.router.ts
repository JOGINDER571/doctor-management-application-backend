import express from "express";
import { doctorList, doctorLogin } from "./doctor.controller";

const router = express.Router();

router.post("/login", doctorLogin);

router.get("/list", doctorList);

export default router;