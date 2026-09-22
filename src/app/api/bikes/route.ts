import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  isBikeStatus,
  type BikeDocument,
  type BikeStatus,
  type CreateBikeInput,
} from "@/lib/bikes";
import { getDb } from "@/lib/mongodb";
import { addBikeToUser } from "@/lib/users";

function trimRequired(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function trimOptional(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to view your bicycles." },
      { status: 401 },
    );
  }

  try {
    const db = await getDb();
    const bikes = await db
      .collection<BikeDocument>("bikes")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      bikes.map((bike) => ({
        id: bike._id.toString(),
        brand: bike.brand,
        model: bike.model,
        color: bike.color,
        serialNumber: bike.serialNumber,
        notes: bike.notes,
        imageUrl: bike.imageUrl,
        status: bike.status,
        createdAt:
          bike.createdAt instanceof Date
            ? bike.createdAt.toISOString()
            : bike.createdAt,
      })),
    );
  } catch {
    return NextResponse.json(
      { error: "Could not load bicycles. Try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to register a bicycle." },
      { status: 401 },
    );
  }

  let body: CreateBikeInput;
  try {
    body = (await request.json()) as CreateBikeInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let brand: string;
  let model: string;
  let serialNumber: string;
  let color: string;
  let notes: string;
  let imageUrl: string | null;
  let bikeStatus: BikeStatus;

  try {
    brand = trimRequired(body.brand, "Brand");
    model = trimRequired(body.model, "Model");
    serialNumber = trimRequired(body.serialNumber, "Serial number");
    color = trimOptional(body.color);
    notes = trimOptional(body.notes);
    imageUrl =
      typeof body.imageUrl === "string" && body.imageUrl.trim()
        ? body.imageUrl.trim()
        : null;

    if (body.status === undefined || body.status === null) {
      bikeStatus = "registered";
    } else if (isBikeStatus(body.status)) {
      bikeStatus = body.status;
    } else {
      throw new Error("Status must be registered, pending, or reported.");
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid input." },
      { status: 400 },
    );
  }

  const now = new Date();
  const bike: BikeDocument = {
    userId,
    brand,
    model,
    color,
    serialNumber,
    notes,
    imageUrl,
    status: bikeStatus,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const db = await getDb();
    const result = await db.collection<BikeDocument>("bikes").insertOne(bike);
    await addBikeToUser(userId, result.insertedId);

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        ...bike,
        createdAt: bike.createdAt.toISOString(),
        updatedAt: bike.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not save bicycle. Try again." },
      { status: 500 },
    );
  }
}
