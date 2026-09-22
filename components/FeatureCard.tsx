type FeatureCardProps = {
  title: string;
  body: string;
  note: string;
};

export function FeatureCard({ title, body, note }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border border-line bg-card p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
      <p className="mt-5 text-xs text-faint-2">{note}</p>
    </article>
  );
}
