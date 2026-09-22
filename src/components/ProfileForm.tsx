"use client";

import { useState } from "react";
import type { PublicUser } from "@/lib/users";

type ProfileFormProps = {
  initialUser: PublicUser;
};

export default function ProfileForm({ initialUser }: ProfileFormProps) {
  const [user, setUser] = useState(initialUser);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          studentId: formData.get("studentId"),
          campus: formData.get("campus"),
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
              <ReadField label="Student ID" value={user.studentId} />
              <ReadField label="Campus" value={user.campus} />
              <ReadField label="User ID" value={user.userId} mono />
              <ReadField
                label="Bikes linked"
                value={String(user.bikes.length)}
              />
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
            <EditField
              label="Student ID"
              name="studentId"
              defaultValue={user.studentId ?? ""}
            />
            <EditField
              label="Campus"
              name="campus"
              defaultValue={user.campus ?? ""}
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
