import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/", label: "Find Twins" },
      { href: "/explore", label: "Explore" },
      { href: "/sources", label: "Sources" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Catalog",
    links: [
      { href: "/explore?source=marc-lou", label: "Marc Lou" },
      { href: "/explore?source=pieter-levels", label: "Pieter Levels" },
      { href: "/explore?source=product-hunt", label: "Product Hunt" },
      { href: "/explore?source=indie-maker", label: "Indie makers" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/sources", label: "How we source" },
      { href: "mailto:hello@twinly.app", label: "Contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-background/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-6">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-faint font-mono font-semibold text-ink">
              ≈
            </span>
            <span className="font-semibold">Twinly</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
            One place for builders to paste an idea and see similar apps already
            live — Marc Lou, Product Hunt, indie makers, and more.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="text-sm font-semibold">{column.title}</h4>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-faint"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-4 py-5 text-xs text-dim md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-mono">{">"} 2026 Twinly. First draft.</p>
        <p>Made for builders who look before they ship.</p>
      </div>
    </footer>
  );
}
