import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-accent">
          Campus bicycle registry
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          BikeReg
        </h1>
        <p className="mt-4 text-lg text-muted">
          A simple starter for registering and tracking campus bikes. Pages and
          sample data are ready so your team can wire up auth, storage, and
          styling later.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Register a bike
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent-soft"
          >
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Register",
            body: "Submit bike details like brand, model, and serial number.",
            href: "/register",
          },
          {
            title: "Track",
            body: "See status for registered, pending, or reported bikes.",
            href: "/shopbikes",
          },
          {
            title: "Profile",
            body: "Placeholder owner info for student or staff accounts.",
            href: "/profile",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border border-border bg-surface p-5 hover:border-accent"
          >
            <h2 className="text-lg font-medium text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
