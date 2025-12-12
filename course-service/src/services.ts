import { TCourse } from "./interface";
import { v4 as uuidv4 } from "uuid";
import { courses } from "./models";

const createCourse = (payload: TCourse) => {
  payload.id = uuidv4();
  payload.createdAt = new Date();

  courses.push(payload);
  return payload;
};

const getAllCourses = () => {
  return courses;
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

const reserveSeat = (id: string): TCourse => {
  const course = courses.find((c) => c.id === id);
  if (!course) throw new Error("Invalid course id!");
  if (course.availableSeats <= 0) throw new Error("No seats available!");

  course.availableSeats -= 1;
  return course;
};

export const services = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCoursePrice,
  reserveSeat,
};
