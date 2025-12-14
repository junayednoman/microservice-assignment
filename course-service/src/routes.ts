import { Router } from "express";
import { controllers } from "./controllers";

export const router = Router();

router.post("/", controllers.createCourse);
router.get("/:id", controllers.getSingleCourse);
router.patch("/:id/price", controllers.updateCoursePrice);
router.patch("/:id/reserveSeat", controllers.reserveSeat);
router.patch("/:id/confirmReservation", controllers.confirmReservation);
router.patch("/:id/cancelReservation", controllers.cancelReservation);
