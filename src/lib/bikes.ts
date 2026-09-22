export type BikeStatus = "registered" | "pending" | "reported";

export const BIKE_STATUSES: BikeStatus[] = [
  "registered",
  "pending",
  "reported",
];

export function isBikeStatus(value: unknown): value is BikeStatus {
  return (
    typeof value === "string" &&
    (BIKE_STATUSES as string[]).includes(value)
  );
}

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
  status?: BikeStatus;
};
