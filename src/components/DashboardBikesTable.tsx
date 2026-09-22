"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TransferBikeButton from "@/components/TransferBikeButton";
import type { BikeListItem } from "@/lib/bikes";

type DashboardBikesTableProps = {
  initialBikes: BikeListItem[];
};

export default function DashboardBikesTable({
  initialBikes,
}: DashboardBikesTableProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bikes, setBikes] = useState(initialBikes);
  const [editingBike, setEditingBike] = useState<BikeListItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBikes(initialBikes);
  }, [initialBikes]);

  function openEdit(bike: BikeListItem) {
    setEditingBike(bike);
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeEdit() {
    dialogRef.current?.close();
    setEditingBike(null);
    setError(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingBike) return;

    setSaving(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(`/api/bikes/${editingBike.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: formData.get("brand"),
          model: formData.get("model"),
          color: formData.get("color"),
          serialNumber: formData.get("serialNumber"),
          status: formData.get("status"),
          notes: formData.get("notes"),
        }),
      });

      const data = (await response.json()) as BikeListItem & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not update bicycle.");
        return;
      }

      setBikes((current) =>
        current.map((bike) => (bike.id === data.id ? data : bike)),
      );
      closeEdit();
      router.refresh();
    } catch {
      setError("Could not update bicycle. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border bg-accent-soft text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Bike</th>
              <th className="px-4 py-3 font-medium">Serial</th>
              <th className="px-4 py-3 font-medium">Registered</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Certificate</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.id} className="border-b border-border last:border-0">
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
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(bike)}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent-soft"
                    >
                      Edit
                    </button>
                    <TransferBikeButton
                      bikeId={bike.id}
                      bikeLabel={`${bike.brand} ${bike.model}`}
                      onTransferred={() => {
                        setBikes((current) =>
                          current.filter((item) => item.id !== bike.id),
                        );
                        router.refresh();
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-50 m-0 w-[min(calc(100%-2rem),28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-0 text-foreground shadow-lg backdrop:bg-black/40"
        onClose={() => {
          setEditingBike(null);
          setError(null);
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-medium">Edit bicycle</h2>
          <button
            type="button"
            onClick={closeEdit}
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-accent-soft hover:text-foreground"
          >
            Close
          </button>
        </div>

        {editingBike ? (
          <form onSubmit={onSubmit} className="space-y-4 p-4">
            <Field
              label="Brand"
              name="brand"
              defaultValue={editingBike.brand}
              required
            />
            <Field
              label="Model"
              name="model"
              defaultValue={editingBike.model}
              required
            />
            <Field
              label="Color"
              name="color"
              defaultValue={editingBike.color}
            />
            <Field
              label="Serial number"
              name="serialNumber"
              defaultValue={editingBike.serialNumber}
              required
            />

            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-sm font-medium"
              >
                Status <span className="text-danger">*</span>
              </label>
              <select
                id="status"
                name="status"
                required
                defaultValue={editingBike.status}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="registered">Registered</option>
                <option value="pending">Pending</option>
                <option value="reported">Reported</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="mb-1.5 block text-sm font-medium"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                defaultValue={editingBike.notes}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            {error ? <p className="text-sm text-danger">{error}</p> : null}

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={closeEdit}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-soft disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </dialog>
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
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
