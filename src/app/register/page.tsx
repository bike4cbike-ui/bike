import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div>
      <PageHeader
        title="Register a bicycle"
        description="Fill in the form below. This is UI-only for now — connect it to an API or database later."
      />

      <form className="max-w-xl space-y-5 rounded-lg border border-border bg-surface p-6">
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
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Submit registration
        </button>
        <p className="text-xs text-muted">
          TODO: prevent default submit and save to your backend.
        </p>
      </form>
    </div>
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
