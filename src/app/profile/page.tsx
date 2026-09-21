import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { sampleProfile } from "@/lib/sample-data";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  const fields = [
    { label: "Name", value: sampleProfile.name },
    { label: "Email", value: sampleProfile.email },
    { label: "Phone", value: sampleProfile.phone },
    { label: "Student ID", value: sampleProfile.studentId },
    { label: "Campus", value: sampleProfile.campus },
  ];

  return (
    <div>
      <PageHeader
        title="Profile"
        description="Sample owner details. Replace with Clerk, NextAuth, or your own auth later."
      />

      <div className="max-w-lg rounded-lg border border-border bg-surface p-6">
        <dl className="space-y-4">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                {field.label}
              </dt>
              <dd className="mt-1 text-sm text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          className="mt-6 rounded-md border border-border px-4 py-2 text-sm hover:bg-accent-soft"
        >
          Edit profile (placeholder)
        </button>
      </div>
    </div>
  );
}
