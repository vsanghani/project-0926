type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-3 py-1 font-mono text-[13px] text-faint">
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  badge: string;
  title: string;
  comment?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  badge,
  title,
  comment,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Badge>{badge}</Badge>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        <span className="text-faint">{">"} </span>
        {title}
      </h2>
      {comment ? (
        <p className="mt-3 font-mono text-sm leading-6 text-muted md:text-[15px]">
          {`// ${comment}`}
        </p>
      ) : null}
    </div>
  );
}
