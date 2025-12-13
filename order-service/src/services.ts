import { TOrder } from "./interface";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "dotenv/config";
import { orders } from "./models";

const courserApiUrl = process.env.COURSE_API_URL;

export const callWithRetry = async <T>(
  requestFn: () => Promise<T>,
  retries = 3,
  delayMs = 300
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await requestFn();
    } catch (err: any) {
      console.log("attempt, ", err);
      const status = err?.response?.status;

      if (status && status < 500) {
        throw err;
      }

      if (attempt === retries) {
        throw new Error("Course service unavailable!");
      }

      await new Promise((r) => setTimeout(r, delayMs));
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

  await callWithRetry(() => axios.get(`${courserApiUrl}/${payload.courseId}`));

  const reserveRes = await axios.patch(
    `${courserApiUrl}/${payload.courseId}/reserveSeat`
  );

  if (!reserveRes?.data?.success)
    throw new Error(reserveRes?.data?.message || "Error reserving seat!");

  const reservationId = reserveRes.data.data.id;
  payload.priceAtPurchase = reserveRes.data.data.lockedPrice;

  try {
    const confirmRes = await callWithRetry(() =>
      axios.patch(`${courserApiUrl}/${reservationId}/confirmReservation`)
    );
    if (!confirmRes?.data?.success)
      throw new Error(
        confirmRes?.data?.message || "Error confirming reservation!"
      );

    orders.push(payload);
    return payload;
  } catch (err: any) {
    await callWithRetry(
      () => axios.patch(`${courserApiUrl}/${reservationId}/cancelReservation`),
      1
    );
    throw new Error(`Order failed: ${err.message || err}`);
  }
};

export const services = {
  createOrder,
};
