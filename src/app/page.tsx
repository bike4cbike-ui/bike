import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Video hero with overlay buttons */}
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 -mt-10 overflow-hidden bg-[#121412]">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/bichleg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        {/* Stronger dark overlay for readable text/buttons */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/25"
        />

        <div className="relative z-10 mx-auto flex min-h-[calc(80dvh-5.5rem)] max-w-5xl flex-col justify-center px-6 py-24 sm:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/85 drop-shadow">
            Campus bicycle registry
          </p>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-5xl">
            BikeReg
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/90 drop-shadow">
            A simple starter for registering and tracking campus bikes. Pages
            and sample data are ready so your team can wire up auth, storage,
            and styling later.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/30 hover:bg-accent-hover"
            >
              Register a bike
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-white bg-white px-6 py-3.5 text-base font-semibold text-[#1a1f1c] shadow-lg shadow-black/25 hover:bg-[#f0f2ef]"
            >
              Open dashboard
            </Link>
          </div>
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
            <h2 className="text-lg font-medium text-foreground">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
