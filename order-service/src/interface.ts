export type OrderStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface TOrder {
  id: string;
  courseId: string;
  studentName: string;
  status: OrderStatus;
  priceAtPurchase: number;
  createdAt: Date;
}
