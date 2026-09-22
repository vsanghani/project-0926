type BadgeProps = {
  children: React.ReactNode;
};

export function Badge({ children }: BadgeProps) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
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
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {comment ? (
        <p className="mt-3 text-sm leading-6 text-muted md:text-[15px]">{comment}</p>
      ) : null}
    </div>
  );
}
