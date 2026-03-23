import express from "express";
import { addToCart } from "./cart.controller.js";
import {viewCart} from "./cart.controller.js";
import {updateCart} from "./cart.controller.js";
import {removeItem} from "./cart.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", viewCart);
router.put("/update", updateCart);
router.delete("/remove", removeItem);

export default router;
