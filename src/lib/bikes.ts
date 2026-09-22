export type BikeStatus = "registered" | "pending" | "reported";

export type BikeDocument = {
  userId: string;
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  notes: string;
  imageUrl: string | null;
  status: BikeStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateBikeInput = {
  brand: string;
  model: string;
  color?: string;
  serialNumber: string;
  notes?: string;
  imageUrl?: string | null;
};
