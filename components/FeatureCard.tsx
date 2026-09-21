type FeatureCardProps = {
  icon: string;
  title: string;
  body: string;
  note: string;
};

export function FeatureCard({ icon, title, body, note }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-line bg-card p-6">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-faint/12 font-mono text-lg text-faint">
        {icon}
      </span>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
      <p className="mt-5 inline-flex rounded-lg bg-faint/8 px-3 py-1.5 font-mono text-[12px] text-faint">
        {note}
      </p>
    </article>
  );
}
