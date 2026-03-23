import express from "express";
import { createOrder } from "./order.controller.js";
import { orderHistory } from "./order.controller.js";

const router = express.Router();

router.post("/place", createOrder);
router.get("/:userId", orderHistory);

export default router;
