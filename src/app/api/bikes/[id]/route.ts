import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getBikeCertificateById } from "@/lib/certificates";
import {
  isBikeStatus,
  updateBikeForUser,
  type UpdateBikeInput,
} from "@/lib/bikes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const certificate = await getBikeCertificateById(id);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(certificate);
  } catch {
    return NextResponse.json(
      { error: "Could not load certificate. Try again." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to edit a bicycle." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  let body: UpdateBikeInput;
  try {
    body = (await request.json()) as UpdateBikeInput;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: UpdateBikeInput = {};

  try {
    if ("brand" in body) {
      updates.brand = requiredString(body.brand, "Brand");
    }
    if ("model" in body) {
      updates.model = requiredString(body.model, "Model");
    }
    if ("serialNumber" in body) {
      updates.serialNumber = requiredString(body.serialNumber, "Serial number");
    }
    if ("color" in body) {
      updates.color = optionalString(body.color);
    }
    if ("notes" in body) {
      updates.notes = optionalString(body.notes);
    }
    if ("status" in body) {
      if (!isBikeStatus(body.status)) {
        throw new Error("Status must be registered, pending, or reported.");
      }
      updates.status = body.status;
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid input." },
      { status: 400 },
    );
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No bike fields to update." },
      { status: 400 },
    );
  }

  try {
    const updated = await updateBikeForUser(id, userId, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Bike not found or you do not own it." },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Could not update bicycle. Try again." },
      { status: 500 },
    );
  }
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
