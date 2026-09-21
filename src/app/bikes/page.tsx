import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { sampleBikes } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "My Bikes",
};

export default function BikesPage() {
  return (
    <div>
      <PageHeader
        title="My bikes"
        description="List of sample bicycles tied to the current profile. Add detail pages or edit actions when you are ready."
      />

      <div className="mb-6">
        <Link
          href="/register"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Register another bike
        </Link>
      </div>

      <ul className="space-y-4">
        {sampleBikes.map((bike) => (
          <li
            key={bike.id}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-medium">
                  {bike.brand} {bike.model}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {bike.color} · Serial {bike.serialNumber}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Registered {bike.registeredAt}
                </p>
              </div>
              <span className="rounded bg-accent-soft px-2 py-0.5 text-xs font-medium capitalize text-accent">
                {bike.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
