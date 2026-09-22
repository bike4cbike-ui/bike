"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicUser } from "@/lib/users";

type ProfileFormProps = {
  initialUser: PublicUser;
};

type BikeSummary = {
  id: string;
  brand: string;
  model: string;
  color: string;
  serialNumber: string;
  status: string;
  imageUrl: string | null;
  createdAt: string;
};

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bikes, setBikes] = useState<BikeSummary[]>([]);
  const [bikesLoading, setBikesLoading] = useState(false);
  const [bikesError, setBikesError] = useState<string | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function onClose() {
      setBikesError(null);
    }

    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  async function openBikesDialog() {
    const dialog = dialogRef.current;
    if (!dialog) return;

    setBikesError(null);
    setBikesLoading(true);
    dialog.showModal();

    try {
      const response = await fetch("/api/bikes");
      const data = (await response.json()) as BikeSummary[] | { error?: string };

      if (!response.ok || !Array.isArray(data)) {
        setBikes([]);
        setBikesError(
          !Array.isArray(data) && data.error
            ? data.error
            : "Could not load bicycles.",
        );
        return;
      }

      setBikes(data);
    } catch {
      setBikes([]);
      setBikesError("Could not load bicycles. Check your connection.");
    } finally {
      setBikesLoading(false);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
        }),
      });

      const data = (await response.json()) as PublicUser & { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Could not update profile.");
        return;
      }

      setUser(data);
      setEditing(false);
      setMessage("Profile updated.");
    } catch {
      setError("Could not update profile. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="mb-6 flex items-center gap-4">
          {user.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-sm font-medium text-accent">
              {(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">
              {user.name || "Unnamed user"}
            </p>
            <p className="text-sm text-muted">{user.role}</p>
          </div>
        </div>

        {!editing ? (
          <>
            <dl className="space-y-4">
              <ReadField label="Name" value={user.name} />
              <ReadField label="Email" value={user.email} />
              <ReadField label="Phone" value={user.phone} />
              <ReadField label="User ID" value={user.userId} mono />
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  Bikes
                </dt>
                <dd className="mt-2">
                  <button
                    type="button"
                    onClick={openBikesDialog}
                    className="rounded-md border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
                  >
                    View bikes ({user.bikes.length})
                  </button>
                </dd>
              </div>
              <ReadField
                label="Shops linked"
                value={String(user.shop.length)}
              />
            </dl>

            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setMessage(null);
                setError(null);
              }}
              className="mt-6 rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-soft"
            >
              Edit profile
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <EditField
              label="Name"
              name="name"
              defaultValue={user.name ?? ""}
            />
            <EditField
              label="Email"
              name="email"
              type="email"
              defaultValue={user.email ?? ""}
            />
            <EditField
              label="Phone"
              name="phone"
              defaultValue={user.phone ?? ""}
            />

            <div className="flex flex-wrap gap-3 pt-2">
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
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-soft disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {message ? <p className="text-sm text-muted">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-50 m-0 w-[min(calc(100%-2rem),28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-0 text-foreground shadow-lg backdrop:bg-black/40"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-medium">Your bikes</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-accent-soft hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-4">
          {bikesLoading ? (
            <p className="text-sm text-muted">Loading bikes…</p>
          ) : null}

          {!bikesLoading && bikesError ? (
            <p className="text-sm text-danger">{bikesError}</p>
          ) : null}

          {!bikesLoading && !bikesError && bikes.length === 0 ? (
            <p className="text-sm text-muted">No bikes registered yet.</p>
          ) : null}

          {!bikesLoading && !bikesError && bikes.length > 0 ? (
            <ul className="space-y-3">
              {bikes.map((bike) => (
                <li
                  key={bike.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex gap-3">
                    {bike.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bike.imageUrl}
                        alt=""
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {bike.brand} {bike.model}
                      </p>
                      <p className="text-sm text-muted">
                        {bike.color || "No color"} · {bike.serialNumber}
                      </p>
                      <p className="mt-1 text-xs capitalize text-accent">
                        {bike.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </dialog>
    </div>
  );
}

function ReadField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm text-foreground ${mono ? "font-mono text-xs break-all" : ""}`}
      >
        {value || "—"}
      </dd>
    </div>
  );
}

function EditField({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
