import express from "express";
import { payOrder } from "./payment.controller.js";

const router = express.Router();

router.post("/pay", payOrder);

export default router;
