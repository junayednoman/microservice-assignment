import cron from "node-cron";
import { courses, reservations } from "./models";
import { ReservationStatus } from "./interface";

cron.schedule("* * * * *", () => {
  const expiredReservations = reservations.filter(
    (r) => r.status === ReservationStatus.RESERVED && r.expiresAt < new Date()
  );

  expiredReservations.forEach((r) => {
    r.status = ReservationStatus.EXPIRED;
    const course = courses.find((c) => c.id === r.courseId);
    if (course) course.availableSeats += 1;
  });
});
