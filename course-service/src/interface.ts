export interface TCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  availableSeats: number;
  instructorName: string;
  createdAt: Date;
}