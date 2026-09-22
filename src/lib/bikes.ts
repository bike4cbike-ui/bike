import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

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

export type BikeListItem = {
  id: string;
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  notes: string;
  imageUrl: string | null;
  status: BikeStatus;
  createdAt: string;
};

/** Load bike documents for the IDs stored on user.bikes[]. */
export async function getBikesByIds(bikeIds: string[]): Promise<BikeListItem[]> {
  const validIds = bikeIds.filter((id) => ObjectId.isValid(id));
  if (validIds.length === 0) return [];

  const db = await getDb();
  const objectIds = validIds.map((id) => new ObjectId(id));
  const bikes = await db
    .collection<BikeDocument>("bikes")
    .find({ _id: { $in: objectIds } })
    .toArray();

  const byId = new Map(
    bikes.map((bike) => [
      bike._id.toString(),
      {
        id: bike._id.toString(),
        brand: bike.brand,
        model: bike.model,
        color: bike.color,
        serialNumber: bike.serialNumber,
        notes: bike.notes ?? "",
        imageUrl: bike.imageUrl,
        status: bike.status,
        createdAt:
          bike.createdAt instanceof Date
            ? bike.createdAt.toISOString()
            : String(bike.createdAt),
      } satisfies BikeListItem,
    ]),
  );

  // Keep the order from the user's bikes[] array.
  return validIds
    .map((id) => byId.get(id))
    .filter((bike): bike is BikeListItem => bike != null);
}
