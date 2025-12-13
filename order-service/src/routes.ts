import { Router } from "express";
import { controllers } from "./controllers";

export const router = Router();

router.post("/", controllers.createOrder);
router.get("/", controllers.getAllOrders);
