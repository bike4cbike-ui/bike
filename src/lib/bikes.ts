import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { addBikeToUser, removeBikeFromUser } from "@/lib/users";

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

export type UpdateBikeInput = {
  brand?: string;
  model?: string;
  color?: string;
  serialNumber?: string;
  notes?: string;
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

export async function updateBikeForUser(
  bikeId: string,
  ownerClerkId: string,
  updates: UpdateBikeInput,
): Promise<BikeListItem | null> {
  if (!ObjectId.isValid(bikeId)) return null;

  const $set: Record<string, string | Date> = {
    updatedAt: new Date(),
  };

  if (updates.brand !== undefined) $set.brand = updates.brand.trim();
  if (updates.model !== undefined) $set.model = updates.model.trim();
  if (updates.color !== undefined) $set.color = updates.color.trim();
  if (updates.serialNumber !== undefined) {
    $set.serialNumber = updates.serialNumber.trim();
  }
  if (updates.notes !== undefined) $set.notes = updates.notes.trim();
  if (updates.status !== undefined) $set.status = updates.status;

  const db = await getDb();
  const result = await db.collection<BikeDocument>("bikes").findOneAndUpdate(
    { _id: new ObjectId(bikeId), userId: ownerClerkId },
    { $set },
    { returnDocument: "after" },
  );

  if (!result) return null;

  return {
    id: result._id.toString(),
    brand: result.brand,
    model: result.model,
    color: result.color,
    serialNumber: result.serialNumber,
    notes: result.notes ?? "",
    imageUrl: result.imageUrl,
    status: result.status,
    createdAt:
      result.createdAt instanceof Date
        ? result.createdAt.toISOString()
        : String(result.createdAt),
  };
}

export async function transferBikeOwnership(options: {
  bikeId: string;
  fromClerkId: string;
  toClerkId: string;
}): Promise<BikeListItem | null> {
  const { bikeId, fromClerkId, toClerkId } = options;
  if (!ObjectId.isValid(bikeId)) return null;
  if (fromClerkId === toClerkId) return null;

  const db = await getDb();
  const bikes = db.collection<BikeDocument>("bikes");
  const objectId = new ObjectId(bikeId);

  const owned = await bikes.findOne({ _id: objectId, userId: fromClerkId });
  if (!owned) return null;

  const result = await bikes.findOneAndUpdate(
    { _id: objectId, userId: fromClerkId },
    {
      $set: {
        userId: toClerkId,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  if (!result) return null;

  await removeBikeFromUser(fromClerkId, bikeId);
  await addBikeToUser(toClerkId, bikeId);

  return {
    id: result._id.toString(),
    brand: result.brand,
    model: result.model,
    color: result.color,
    serialNumber: result.serialNumber,
    notes: result.notes ?? "",
    imageUrl: result.imageUrl,
    status: result.status,
    createdAt:
      result.createdAt instanceof Date
        ? result.createdAt.toISOString()
        : String(result.createdAt),
  };
}
