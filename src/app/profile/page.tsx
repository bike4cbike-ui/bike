import { SignInButton, Show } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import CertificatePanel from "@/components/CertificatePanel";
import PageHeader from "@/components/PageHeader";
import ProfileForm from "@/components/ProfileForm";
import {
  ensureUser,
  getUserByClerkId,
  toPublicUser,
} from "@/lib/users";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const { userId } = await auth();

  let initialUser = null;

  if (userId) {
    let user = await getUserByClerkId(userId);

    if (!user) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email =
          clerkUser.primaryEmailAddress?.emailAddress ??
          clerkUser.emailAddresses[0]?.emailAddress ??
          null;
        const name =
          [clerkUser.firstName, clerkUser.lastName]
            .filter(Boolean)
            .join(" ")
            .trim() ||
          clerkUser.username ||
          null;

        user = await ensureUser({
          clerkId: clerkUser.id,
          email,
          name,
          imageUrl: clerkUser.imageUrl ?? null,
        });
      }
    }

    if (user) {
      initialUser = toPublicUser(user);
    }
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Your account details from the database. Sign in to view and update them."
      />

      <Show when="signed-out">
        <div className="max-w-lg rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            You need to be signed in to view your profile.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="mt-4 rounded-md border border-accent px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent-soft"
            >
              Sign in
            </button>
          </SignInButton>
        </div>
      </Show>

      <Show when="signed-in">
        {initialUser ? (
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <ProfileForm initialUser={initialUser} />
            <CertificatePanel ownerName={initialUser.name} />
          </div>
        ) : (
          <div className="max-w-lg rounded-lg border border-border bg-surface p-6">
            <p className="text-sm text-muted">
              Could not load your profile from the database. Refresh the page or
              try signing in again.
            </p>
          </div>
        )}
      </Show>
    </div>
  );
}
