"use client";

import { useRef, useState } from "react";

type TransferBikeButtonProps = {
  bikeId: string;
  bikeLabel: string;
  onTransferred?: () => void;
  className?: string;
};

export default function TransferBikeButton({
  bikeId,
  bikeLabel,
  onTransferred,
  className = "rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent-soft",
}: TransferBikeButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    setSuccess(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
    setError(null);
    setSuccess(null);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const recipientEmail = String(formData.get("recipientEmail") ?? "").trim();

    try {
      const response = await fetch(`/api/bikes/${bikeId}/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail }),
      });

      const data = (await response.json()) as {
        error?: string;
        recipient?: { name?: string | null; email?: string | null };
      };

      if (!response.ok) {
        setError(data.error ?? "Could not transfer bicycle.");
        return;
      }

      const recipientName =
        data.recipient?.name || data.recipient?.email || recipientEmail;
      setSuccess(`Ownership transferred to ${recipientName}.`);
      onTransferred?.();

      window.setTimeout(() => {
        closeDialog();
      }, 900);
    } catch {
      setError("Could not transfer bicycle. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button type="button" onClick={openDialog} className={className}>
        Transfer
      </button>

      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-50 m-0 w-[min(calc(100%-2rem),28rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-surface p-0 text-foreground shadow-lg backdrop:bg-black/40"
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-base font-medium">Transfer ownership</h2>
          <button
            type="button"
            onClick={closeDialog}
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-accent-soft hover:text-foreground"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <p className="text-sm text-muted">
            Transfer <span className="font-medium text-foreground">{bikeLabel}</span>{" "}
            to another BikeReg account. This updates the bike owner and both
            users&apos; bike lists in MongoDB.
          </p>

          <div>
            <label
              htmlFor={`recipientEmail-${bikeId}`}
              className="mb-1.5 block text-sm font-medium"
            >
              Recipient email <span className="text-danger">*</span>
            </label>
            <input
              id={`recipientEmail-${bikeId}`}
              name="recipientEmail"
              type="email"
              required
              placeholder="user@example.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          {success ? <p className="text-sm text-accent">{success}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? "Transferring…" : "Transfer ownership"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={closeDialog}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-soft disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
