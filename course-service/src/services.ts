import { ReservationStatus, TCourse, TReservation } from "./interface";
import { v4 as uuidv4 } from "uuid";
import { courses, reservations } from "./models";

const courseLocks: Record<string, boolean> = {};

const createCourse = (payload: TCourse) => {
  payload.id = uuidv4();
  payload.createdAt = new Date();

  courses.push(payload);
  return payload;
};

const getSingleCourse = (id: string) => {
  const course = courses.find((course) => course.id === id);

  return course || null;
};

const updateCoursePrice = (id: string, price: number) => {
  const course = courses.find((course) => course.id === id);
  if (!course) throw new Error("Invalid course id!");

  course.price = price;
  return course;
};

const reserveSeat = async (id: string) => {
  while (courseLocks[id]) {
    await new Promise((r) => setTimeout(r, 10));
  }

  courseLocks[id] = true;

  try {
    const course = courses.find((c) => c.id === id);
    if (!course) throw new Error("Invalid course id!");
    if (course.availableSeats <= 0) throw new Error("No seats available!");

    const reservationPayload: TReservation = {
      id: uuidv4(),
      courseId: course.id,
      lockedPrice: course.price,
      status: ReservationStatus.RESERVED,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    };

    reservations.push(reservationPayload);
    course.availableSeats -= 1;

    return reservationPayload;
  } finally {
    courseLocks[id] = false;
  }
};

const confirmReservation = (id: string) => {
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) throw new Error("Invalid reservation id!");
  if (reservation.expiresAt < new Date()) {
    const course = courses.find((c) => c.id === reservation.courseId);
    if (course) course.availableSeats += 1;
    reservation.status = ReservationStatus.EXPIRED;
    throw new Error("Reservation expired!");
  }

  reservation.status = ReservationStatus.CONFIRMED;
  return reservation;
};

const cancelReservation = (id: string) => {
  const reservation = reservations.find((r) => r.id === id);
  if (!reservation) throw new Error("Invalid reservation id!");

  const course = courses.find((c) => c.id === reservation.courseId);
  if (!course) throw new Error("Invalid course id!");

  if (reservation.expiresAt < new Date()) {
    course.availableSeats += 1;
    reservation.status = ReservationStatus.EXPIRED;
    return reservation;
  }
  course.availableSeats += 1;
  reservation.status = ReservationStatus.CANCELLED;
  return reservation;
};

export const services = {
  createCourse,
  getSingleCourse,
  updateCoursePrice,
  reserveSeat,
  confirmReservation,
  cancelReservation,
};
