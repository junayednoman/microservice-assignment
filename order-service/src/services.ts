import { TOrder } from "./interface";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "dotenv/config";
import { orders } from "./models";

const courserApiUrl = process.env.COURSE_API_URL;

const fetchCourseWithRetry = async (
  courseId: string,
  retries = 3,
  delay = 200
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(`${courserApiUrl}/${courseId}`);
      if (!res?.data?.data) throw new Error("Invalid course id!");
      return res.data.data;
    } catch (err: any) {
      if (err.message.includes("Invalid"))
        throw new Error("Invalid course id!");
      if (i === retries - 1) {
        throw new Error("Course Service unavailable! Try again later.");
      }
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

const createOrder = async (payload: TOrder) => {
  const alreadyPurchased = orders.find(
    (order) =>
      order.courseId === payload.courseId &&
      order.studentName === payload.studentName
  );
  if (alreadyPurchased)
    throw new Error("You can't purchase the same course twice!");

  payload.id = uuidv4();
  payload.createdAt = new Date();

  await fetchCourseWithRetry(payload.courseId);

  const reserveRes = await axios.patch(
    `${courserApiUrl}/${payload.courseId}/reserveSeat`
  );
  if (!reserveRes?.data?.success)
    throw new Error(reserveRes?.data?.message || "Error reserving seat!");

  const reservationId = reserveRes.data.data.id;
  payload.priceAtPurchase = reserveRes.data.data.lockedPrice;

  try {
    const confirmRes = await axios.patch(
      `${courserApiUrl}/${reservationId}/confirmReservation`
    );
    if (!confirmRes?.data?.success)
      throw new Error(
        confirmRes?.data?.message || "Error confirming reservation!"
      );

    orders.push(payload);
    return payload;
  } catch (err: any) {
    await axios.patch(`${courserApiUrl}/${reservationId}/cancelReservation`);
    throw new Error(`Order failed: ${err.message || err}`);
  }
};

const getAllOrders = () => orders;

export const services = {
  createOrder,
  getAllOrders,
};
