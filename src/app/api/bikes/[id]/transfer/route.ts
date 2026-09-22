import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { transferBikeOwnership } from "@/lib/bikes";
import { getUserByClerkId, getUserByEmail } from "@/lib/users";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to transfer a bicycle." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  let body: { recipientEmail?: unknown };
  try {
    body = (await request.json()) as { recipientEmail?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const recipientEmail =
    typeof body.recipientEmail === "string" ? body.recipientEmail.trim() : "";

  if (!recipientEmail || !recipientEmail.includes("@")) {
    return NextResponse.json(
      { error: "Enter the recipient's account email." },
      { status: 400 },
    );
  }

  const sender = await getUserByClerkId(userId);
  if (!sender) {
    return NextResponse.json(
      { error: "Your account was not found in the database." },
      { status: 404 },
    );
  }

  const recipient = await getUserByEmail(recipientEmail);
  if (!recipient) {
    return NextResponse.json(
      { error: "No BikeReg user found with that email." },
      { status: 404 },
    );
  }

  if (recipient.clerkId === userId) {
    return NextResponse.json(
      { error: "You already own this bicycle." },
      { status: 400 },
    );
  }

  try {
    const transferred = await transferBikeOwnership({
      bikeId: id,
      fromClerkId: userId,
      toClerkId: recipient.clerkId,
    });

    if (!transferred) {
      return NextResponse.json(
        { error: "Bike not found or you do not own it." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      bike: transferred,
      recipient: {
        name: recipient.name,
        email: recipient.email,
        userId: recipient.userId,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not transfer bicycle. Try again." },
      { status: 500 },
    );
  }
}
