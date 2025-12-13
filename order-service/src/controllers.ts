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

export const controllers = {
  createOrder,
};
