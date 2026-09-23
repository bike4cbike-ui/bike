"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/shopbikes", label: "Bike Shop" },
  { href: "/register", label: "Register" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const minimal = pathname?.startsWith("/certificate") ?? false;
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-50 border-transparent bg-transparent"
          : "relative z-40 border-b border-border bg-surface"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/Firefly (1).png"
            alt="BikeReg"
            width={1022}
            height={560}
            className="h-11 w-auto sm:h-12"
            priority
          />
        </Link>

        {!minimal ? (
          <nav
            className={`flex flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:gap-x-3 ${
              isHome ? "text-white" : "text-muted"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isHome
                    ? "rounded-full px-3 py-1.5 transition hover:bg-accent hover:text-white"
                    : "rounded-full px-3 py-1.5 transition hover:bg-accent-soft hover:text-accent"
                }
              >
                {link.label}
              </Link>
            ))}
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={
                    isHome
                      ? "rounded-full bg-white/20 px-3.5 py-1.5 font-medium text-white backdrop-blur-sm transition hover:bg-accent hover:text-white"
                      : "rounded-full px-3.5 py-1.5 transition hover:bg-accent-soft hover:text-accent"
                  }
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-full bg-accent px-3.5 py-1.5 font-medium text-white transition hover:bg-accent-hover"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
