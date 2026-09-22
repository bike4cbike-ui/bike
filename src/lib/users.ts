import { randomUUID } from "crypto";
import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type UserRole = "user" | "admin" | "shop";

export type UserDocument = {
  userId: string;
  clerkId: string;
  role: UserRole;
  bikes: string[];
  shop: string[];
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ClerkUserSnapshot = {
  clerkId: string;
  email?: string | null;
  name?: string | null;
  imageUrl?: string | null;
};

export async function getUsersCollection() {
  const db = await getDb();
  const users = db.collection<UserDocument>("users");
  await users.createIndex({ clerkId: 1 }, { unique: true });
  await users.createIndex({ userId: 1 }, { unique: true });
  return users;
}

/** Create the Mongo user on first sign-in/sign-up; no-op if they already exist. */
export async function ensureUser(
  snapshot: ClerkUserSnapshot,
): Promise<UserDocument> {
  const users = await getUsersCollection();
  const existing = await users.findOne({ clerkId: snapshot.clerkId });

  if (existing) {
    return existing;
  }

  const now = new Date();
  const doc: UserDocument = {
    userId: randomUUID(),
    clerkId: snapshot.clerkId,
    role: "user",
    bikes: [],
    shop: [],
    email: snapshot.email ?? null,
    name: snapshot.name ?? null,
    imageUrl: snapshot.imageUrl ?? null,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await users.insertOne(doc);
    return doc;
  } catch (error) {
    // Concurrent first login — another request may have inserted first.
    const raced = await users.findOne({ clerkId: snapshot.clerkId });
    if (raced) return raced;
    throw error;
  }
}

export async function addBikeToUser(
  clerkId: string,
  bikeId: string | ObjectId,
): Promise<void> {
  const users = await getUsersCollection();
  const id = typeof bikeId === "string" ? bikeId : bikeId.toString();

  await users.updateOne(
    { clerkId },
    {
      $addToSet: { bikes: id },
      $set: { updatedAt: new Date() },
    },
  );
}
