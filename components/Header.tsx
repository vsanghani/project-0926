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
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-faint font-mono text-lg font-semibold text-ink">
            ≈
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight">Twinly</span>
            <span className="block font-mono text-[11px] text-faint-2">v0.1.0</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
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
                    ? "rounded-lg bg-faint/10 px-3 py-1.5 font-mono text-sm text-faint"
                    : "rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                }
              >
                {active ? `> ${link.label}` : link.label}
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
            className="rotate-2 rounded-xl bg-faint px-4 py-2 text-left text-[13px] font-semibold leading-tight text-ink transition hover:rotate-0 hover:bg-white"
          >
            Check Your
            <br />
            Idea{" "}
            <span className="font-mono" aria-hidden>
              {">"}
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-line text-faint md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          <span className="font-mono text-lg">{open ? "x" : "="}</span>
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
              className="mt-2 rounded-xl bg-faint px-3 py-2.5 text-center text-sm font-semibold text-ink"
            >
              Check Your Idea
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
