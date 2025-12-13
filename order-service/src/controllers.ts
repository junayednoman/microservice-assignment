import { Request, Response } from "express";
import { services } from "./services";

const createOrder = async (req: Request, res: Response) => {
  try {
    const result = await services.createOrder(req.body);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(error.status || 500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      statusCode: 500,
    });
  }
};

const getAllOrders = (_req: Request, res: Response) => {
  try {
    const result = services.getAllOrders();

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  } catch (error: any) {
    const statusCode = error.status || 500;
    res.status(statusCode).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
      statusCode: statusCode,
    });
  }
};

export const controllers = {
  createOrder,
  getAllOrders,
};
