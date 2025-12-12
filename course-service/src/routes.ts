import { Router } from "express";
import { controllers } from "./controllers";

export const router = Router();

router.post("/", controllers.createCourse);
router.get("/", controllers.getAllCourses);
router.get("/:id", controllers.getSingleCourse);
router.patch("/:id/price", controllers.updateCoursePrice);
router.patch("/:id/reserveSeat", controllers.reserveSeat);
