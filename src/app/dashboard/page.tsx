import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { sampleBikes } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const registered = sampleBikes.filter((b) => b.status === "registered").length;
  const pending = sampleBikes.filter((b) => b.status === "pending").length;
  const reported = sampleBikes.filter((b) => b.status === "reported").length;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of sample registrations. Replace these numbers with live queries later."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Registered" value={registered} />
        <Stat label="Pending" value={pending} />
        <Stat label="Reported" value={reported} />
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-medium">Recent bikes</h2>
        <Link href="/register" className="text-sm text-accent hover:underline">
          + Register new
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-accent-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Bike</th>
              <th className="px-4 py-3 font-medium">Serial</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sampleBikes.map((bike) => (
              <tr key={bike.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  {bike.brand} {bike.model}
                  <span className="block text-xs text-muted">{bike.color}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{bike.serialNumber}</td>
                <td className="px-4 py-3">{bike.registeredAt}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={bike.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
