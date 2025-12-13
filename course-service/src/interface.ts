export interface TCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  instructorName: string;
  createdAt: Date;
}

export enum ReservationStatus {
  RESERVED = "RESERVED",
  CONFIRMED = "CONFIRMED",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
}

export interface TReservation {
  id: string;
  courseId: string;
  lockedPrice: number;
  status: ReservationStatus;
  expiresAt: Date;
}
