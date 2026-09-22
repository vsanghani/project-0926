"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Find Twins" },
  { href: "/explore", label: "Explore" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 md:px-6">
        <Link href="/" className="shrink-0 text-[15px] font-semibold tracking-tight">
          Appkin
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-faint/12 px-3 py-1.5 text-sm text-foreground"
                    : "rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-4 md:flex">
          <button
            type="button"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Sign In
          </button>
          <Link
            href="/"
            className="rounded-full bg-faint px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Check an idea
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="flex w-4 flex-col gap-1" aria-hidden>
            <span className={`block h-px bg-current transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`block h-px bg-current transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px bg-current transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-line bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-card hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-faint px-3 py-2.5 text-center text-sm font-semibold text-ink"
            >
              Check an idea
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
