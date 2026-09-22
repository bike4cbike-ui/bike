"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "saving" | "done" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  function clearImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      setPreviewUrl(null);
      setImageFile(null);
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMessage(null);
    setStatus("idle");
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    let imageUrl: string | null = null;

    if (imageFile) {
      setStatus("uploading");
      const uploadBody = new FormData();
      uploadBody.append("file", imageFile);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const data = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (!response.ok || !data.url) {
          setStatus("error");
          setMessage(data.error ?? "Image upload failed.");
          return;
        }

        imageUrl = data.url;
      } catch {
        setStatus("error");
        setMessage("Image upload failed. Check your connection and try again.");
        return;
      }
    }

    setStatus("saving");

    try {
      const response = await fetch("/api/bikes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: formData.get("brand"),
          model: formData.get("model"),
          color: formData.get("color"),
          serialNumber: formData.get("serialNumber"),
          status: formData.get("status"),
          notes: formData.get("notes"),
          imageUrl,
        }),
      });

      const data = (await response.json()) as {
        id?: string;
        error?: string;
      };

      if (!response.ok || !data.id) {
        setStatus("error");
        setMessage(data.error ?? "Could not save bicycle.");
        return;
      }

      setStatus("done");
      setMessage("Bicycle registered successfully.");
      form.reset();
      clearImage();
      router.push("/bikes");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Could not save bicycle. Check your connection and try again.");
    }
  }

  const busy = status === "uploading" || status === "saving";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="max-w-xl space-y-5 rounded-lg border border-border bg-surface p-6"
    >
      <Field label="Brand" name="brand" placeholder="e.g. Giant" required />
      <Field label="Model" name="model" placeholder="e.g. Escape 3" required />
      <Field label="Color" name="color" placeholder="e.g. Black" />
      <Field
        label="Serial number"
        name="serialNumber"
        placeholder="Usually stamped on the frame"
        required
      />

      <div>
        <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
          Status <span className="text-danger">*</span>
        </label>
        <select
          id="status"
          name="status"
          required
          defaultValue="registered"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="registered">Registered</option>
          <option value="pending">Pending</option>
          <option value="reported">Reported</option>
        </select>
      </div>

      <div>
        <label htmlFor="photo" className="mb-1.5 block text-sm font-medium">
          Bike photo
        </label>
        <input
          ref={fileInputRef}
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onImageChange}
          className="block w-full text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/15"
        />
        <p className="mt-1.5 text-xs text-muted">
          Optional. JPEG, PNG, WebP, or GIF up to 5 MB.
        </p>

        {previewUrl ? (
          <div className="mt-3 overflow-hidden rounded-md border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected bike preview"
              className="max-h-56 w-full object-cover"
            />
            <div className="border-t border-border px-3 py-2">
              <button
                type="button"
                onClick={clearImage}
                className="text-sm text-muted hover:text-foreground"
              >
                Remove photo
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Optional details (lock type, distinguishing marks…)"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "uploading"
          ? "Uploading photo…"
          : status === "saving"
            ? "Saving…"
            : "Submit registration"}
      </button>

      {message ? (
        <p
          className={`whitespace-pre-wrap text-xs ${status === "error" ? "text-danger" : "text-muted"}`}
        >
          {message}
        </p>
      ) : (
        <p className="text-xs text-muted">
          Registrations are saved to MongoDB. Photos upload to Cloudinary when
          included.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
