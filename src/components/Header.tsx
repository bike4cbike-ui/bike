import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bikes", label: "My Bikes" },
  { href: "/register", label: "Register" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
];

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
          BikeReg
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
