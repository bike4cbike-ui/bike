import { randomUUID } from "crypto";
import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

export type UserRole = "USER" | "ADMIN";

export type UserDocument = {
  userId: string;
  clerkId: string;
  role: UserRole;
  bikes: string[];
  shop: string[];
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  phone: string | null;
  studentId: string | null;
  campus: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ClerkUserSnapshot = {
  clerkId: string;
  email?: string | null;
  name?: string | null;
  imageUrl?: string | null;
};

export type UserProfileUpdate = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  studentId?: string | null;
  campus?: string | null;
};

export type PublicUser = {
  userId: string;
  clerkId: string;
  role: UserRole;
  bikes: string[];
  shop: string[];
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  phone: string | null;
  studentId: string | null;
  campus: string | null;
  createdAt: string;
  updatedAt: string;
};

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    userId: user.userId,
    clerkId: user.clerkId,
    role: user.role,
    bikes: user.bikes ?? [],
    shop: user.shop ?? [],
    email: user.email ?? null,
    name: user.name ?? null,
    imageUrl: user.imageUrl ?? null,
    phone: user.phone ?? null,
    studentId: user.studentId ?? null,
    campus: user.campus ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getUsersCollection() {
  const db = await getDb();
  const users = db.collection<UserDocument>("users");
  await users.createIndex({ clerkId: 1 }, { unique: true });
  await users.createIndex({ userId: 1 }, { unique: true });
  return users;
}

export async function getUserByClerkId(
  clerkId: string,
): Promise<UserDocument | null> {
  const users = await getUsersCollection();
  return users.findOne({ clerkId });
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
    role: "USER",
    bikes: [],
    shop: [],
    email: snapshot.email ?? null,
    name: snapshot.name ?? null,
    imageUrl: snapshot.imageUrl ?? null,
    phone: null,
    studentId: null,
    campus: null,
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

export async function updateUserProfile(
  clerkId: string,
  updates: UserProfileUpdate,
): Promise<UserDocument | null> {
  const users = await getUsersCollection();
  const $set: Record<string, string | null | Date> = {
    updatedAt: new Date(),
  };

  if ("name" in updates) $set.name = normalizeOptional(updates.name);
  if ("email" in updates) $set.email = normalizeOptional(updates.email);
  if ("phone" in updates) $set.phone = normalizeOptional(updates.phone);
  if ("studentId" in updates) {
    $set.studentId = normalizeOptional(updates.studentId);
  }
  if ("campus" in updates) $set.campus = normalizeOptional(updates.campus);

  const result = await users.findOneAndUpdate(
    { clerkId },
    { $set },
    { returnDocument: "after" },
  );

  return result;
}

function normalizeOptional(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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
