import { auth, currentUser } from "@clerk/nextjs/server";
import { ensureUser } from "@/lib/users";

/** Syncs the signed-in Clerk user into MongoDB on first visit (incl. OAuth). */
export default async function EnsureUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
    user.username ||
    null;

  try {
    await ensureUser({
      clerkId: user.id,
      email,
      name,
      imageUrl: user.imageUrl ?? null,
    });
  } catch (error) {
    console.error("Failed to sync Clerk user to MongoDB:", error);
  }

  return null;
}
