import { SignInButton, Show } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import DashboardBikesTable from "@/components/DashboardBikesTable";
import PageHeader from "@/components/PageHeader";
import { getBikesByIds, type BikeListItem } from "@/lib/bikes";
import { ensureUser, getUserByClerkId } from "@/lib/users";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  let bikes: BikeListItem[] = [];

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
      bikes = await getBikesByIds(user.bikes ?? []);
    }
  }

  const registered = bikes.filter((b) => b.status === "registered").length;
  const pending = bikes.filter((b) => b.status === "pending").length;
  const reported = bikes.filter((b) => b.status === "reported").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of the bicycles linked to your account in MongoDB."
      />

      <Show when="signed-out">
        <div className="max-w-xl rounded-lg border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            Sign in to see your registered bikes and status counts.
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
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Registered" value={registered} />
          <Stat label="Pending" value={pending} />
          <Stat label="Reported" value={reported} />
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium">
            Your bikes
            <span className="ml-2 text-sm font-normal text-muted">
              ({bikes.length})
            </span>
          </h2>
          <Link href="/register" className="text-sm text-accent hover:underline">
            + Register new
          </Link>
        </div>

        {bikes.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted">
            No bikes in your account yet.{" "}
            <Link href="/register" className="text-accent hover:underline">
              Register a bicycle
            </Link>{" "}
            to see it here.
          </div>
        ) : (
          <DashboardBikesTable initialBikes={bikes} />
        )}
      </Show>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
