import { ObjectId } from "mongodb";
import type { BikeDocument } from "@/lib/bikes";
import { getDb } from "@/lib/mongodb";
import { getUserByClerkId } from "@/lib/users";

export type BikeCertificateData = {
  id: string;
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  notes: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
  ownerName: string | null;
};

export async function getBikeCertificateById(
  id: string,
): Promise<BikeCertificateData | null> {
  if (!ObjectId.isValid(id)) return null;

  const db = await getDb();
  const bike = await db.collection<BikeDocument>("bikes").findOne({
    _id: new ObjectId(id),
  });

  if (!bike) return null;

  const owner = await getUserByClerkId(bike.userId);

  return {
    id: bike._id.toString(),
    brand: bike.brand,
    model: bike.model,
    color: bike.color,
    serialNumber: bike.serialNumber,
    notes: bike.notes ?? "",
    status: bike.status,
    imageUrl: bike.imageUrl,
    createdAt:
      bike.createdAt instanceof Date
        ? bike.createdAt.toISOString()
        : String(bike.createdAt),
    ownerName: owner?.name ?? null,
  };
}
