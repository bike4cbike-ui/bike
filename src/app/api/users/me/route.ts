import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  ensureUser,
  getUserByClerkId,
  toPublicUser,
  updateUserProfile,
  type UserProfileUpdate,
} from "@/lib/users";

async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  let user = await getUserByClerkId(userId);
  if (user) return user;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    null;

  return ensureUser({
    clerkId: clerkUser.id,
    email,
    name,
    imageUrl: clerkUser.imageUrl ?? null,
  });
}

export async function GET() {
  const user = await requireDbUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in to view your profile." }, { status: 401 });
  }

  return NextResponse.json(toPublicUser(user));
}

export async function PATCH(request: Request) {
  const user = await requireDbUser();
  if (!user) {
    return NextResponse.json(
      { error: "Sign in to update your profile." },
      { status: 401 },
    );
  }

  let body: UserProfileUpdate;
  try {
    body = (await request.json()) as UserProfileUpdate;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const updates: UserProfileUpdate = {};
  if ("name" in body) updates.name = asOptionalString(body.name);
  if ("email" in body) updates.email = asOptionalString(body.email);
  if ("phone" in body) updates.phone = asOptionalString(body.phone);

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No profile fields to update." },
      { status: 400 },
    );
  }

  if (updates.email && !updates.email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  try {
    const updated = await updateUserProfile(user.clerkId, updates);
    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(toPublicUser(updated));
  } catch {
    return NextResponse.json(
      { error: "Could not update profile. Try again." },
      { status: 500 },
    );
  }
}

function asOptionalString(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  return value;
}
