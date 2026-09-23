import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Video hero — seamless under transparent header */}
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
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-black/15"
        />

        <div className="relative z-10 mx-auto flex min-h-[min(68vh,46rem)] max-w-6xl flex-col justify-center px-6 pb-16 pt-24 sm:min-h-[min(72vh,70rem)] sm:px-8 lg:pt-28">
          <div className="max-w-3xl-">
            <h1 className="text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white drop-shadow-md">
              Register your bike.
              <br />
              Ride with confidence.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/85 drop-shadow sm:text-lg">
              Kickstart campus bike safety with registration, tracking, and a
              clear ownership record — built for students and staff.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_28px_rgba(47,107,79,0.45)] transition hover:bg-accent-hover"
              >
                Register a bike
              </Link>
              <Link
                href="/dashboard"
                className="rounded-full border-2 border-accent bg-accent-soft px-7 py-3.5 text-base font-semibold text-accent transition hover:bg-white"
              >
                Open dashboard
              </Link>
            </div>
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
