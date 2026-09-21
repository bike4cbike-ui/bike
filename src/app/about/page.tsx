import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        title="About this template"
        description="Starter structure for a campus bicycle registration group project."
      />

      <div className="max-w-2xl space-y-4 text-sm leading-relaxed text-muted">
        <p>
          BikeReg is a front-end scaffold. Navigation, sample data, and basic
          pages are in place so teammates can split work without fighting over
          empty folders.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Pages:</strong> Home, Dashboard,
            My Bikes, Register, Profile, About
          </li>
          <li>
            <strong className="text-foreground">Sample data:</strong>{" "}
            <code className="rounded bg-accent-soft px-1 py-0.5 text-xs text-foreground">
              src/lib/sample-data.ts
            </code>
          </li>
          <li>
            <strong className="text-foreground">Shared UI:</strong> Header,
            Footer, PageHeader under{" "}
            <code className="rounded bg-accent-soft px-1 py-0.5 text-xs text-foreground">
              src/components/
            </code>
          </li>
        </ul>
        <p>
          Suggested next steps: add authentication, persist registrations,
          improve styling, and add bike detail / report-lost flows.
        </p>
      </div>
    </div>
  );
}
