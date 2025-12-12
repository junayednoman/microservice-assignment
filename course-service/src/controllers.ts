import { Request, Response } from "express";
import { services } from "./services";

const createCourse = (req: Request, res: Response) => {
  try {
    const result = services.createCourse(req.body);
    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 500,
    });
  }
};

const getAllCourses = (_req: Request, res: Response) => {
  try {
    const result = services.getAllCourses();
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 500,
    });
  }
};

const getSingleCourse = (req: Request, res: Response) => {
  try {
    const result = services.getSingleCourse(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 500,
    });
  }
};

const updateCoursePrice = (req: Request, res: Response) => {
  try {
    const result = services.updateCoursePrice(
      req.params.id as string,
      req.body.price
    );
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 500,
    });
  }
};

const reserveSeat = (req: Request, res: Response) => {
  try {
    const result = services.reserveSeat(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Seat reserved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      statusCode: 500,
    });
  }
};

export const controllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCoursePrice,
  reserveSeat,
};
