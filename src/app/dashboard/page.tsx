import { SignInButton, Show } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getBikesByIds, type BikeListItem } from "@/lib/bikes";
import {
  ensureUser,
  getUserByClerkId,
} from "@/lib/users";

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
          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border bg-accent-soft text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Bike</th>
                  <th className="px-4 py-3 font-medium">Serial</th>
                  <th className="px-4 py-3 font-medium">Registered</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {bikes.map((bike) => (
                  <tr
                    key={bike.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3">
                      {bike.brand} {bike.model}
                      <span className="block text-xs text-muted">
                        {bike.color || "No color"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {bike.serialNumber}
                    </td>
                    <td className="px-4 py-3">{formatDate(bike.createdAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={bike.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/certificate/${bike.id}`}
                        className="text-accent hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    registered: "bg-accent-soft text-accent",
    pending: "bg-yellow-50 text-[var(--warning)]",
    reported: "bg-red-50 text-danger",
  };

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium capitalize ${styles[status] ?? "bg-accent-soft"}`}
    >
      {status}
    </span>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
