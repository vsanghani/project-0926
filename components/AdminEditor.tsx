"use client";

import { useMemo, useState } from "react";
import type { LiveApp, Source, SourceId } from "@/lib/types";

type AdminEditorProps = {
  apps: LiveApp[];
  sources: Source[];
};

const empty = {
  id: "",
  name: "",
  url: "",
  tagline: "",
  description: "",
  category: "",
  tags: "",
  sourceId: "indie-products" as SourceId,
  maker: "",
  year: "",
  featured: false,
  gap: "",
};

const fieldClass =
  "w-full rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none placeholder:text-dim focus:border-faint/40";

export function AdminEditor({ apps, sources }: AdminEditorProps) {
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceId | "all">("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter((app) => {
      if (sourceFilter !== "all" && app.sourceId !== sourceFilter) return false;
      if (featuredOnly && !app.featured) return false;
      if (!q) return true;
      const blob = `${app.name} ${app.tagline} ${app.category} ${app.maker} ${app.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [apps, featuredOnly, query, sourceFilter]);

  const groups = useMemo(
    () =>
      sources
        .map((source) => ({
          source,
          apps: filtered.filter((app) => app.sourceId === source.id),
        }))
        .filter((group) => group.apps.length > 0),
    [filtered, sources],
  );

  function load(app: LiveApp) {
    setEditing(app.id);
    setFormOpen(true);
    setMessage("");
    setConfirming(null);
    setForm({
      id: app.id,
      name: app.name,
      url: app.url,
      tagline: app.tagline,
      description: app.description,
      category: app.category,
      tags: app.tags.join(", "),
      sourceId: app.sourceId,
      maker: app.maker,
      year: app.year ? String(app.year) : "",
      featured: Boolean(app.featured),
      gap: app.gap,
    });
  }

  function startNew() {
    setEditing(null);
    setFormOpen(true);
    setMessage("");
    setForm({ ...empty, sourceId: sourceFilter === "all" ? "indie-products" : sourceFilter });
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setMessage("");
    setForm(empty);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    const payload = { ...form, tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
    const response = await fetch(editing ? `/api/apps/${editing}` : "/api/apps", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(data.error ?? "Could not save.");
      return;
    }
    window.location.reload();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/apps/${id}`, { method: "DELETE" });
    if (response.ok) window.location.reload();
    else setMessage("Could not delete that product.");
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, tag, or category"
          className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none placeholder:text-dim focus:border-faint/40"
        />
        <button
          type="button"
          onClick={startNew}
          className="shrink-0 rounded-full bg-faint px-4 py-2.5 text-sm font-semibold text-ink"
        >
          Add product
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={sourceFilter === "all" && !featuredOnly} onClick={() => { setSourceFilter("all"); setFeaturedOnly(false); }}>
          All · {apps.length}
        </Chip>
        {sources.map((source) => {
          const count = apps.filter((app) => app.sourceId === source.id).length;
          return (
            <Chip
              key={source.id}
              active={sourceFilter === source.id && !featuredOnly}
              onClick={() => { setSourceFilter(source.id); setFeaturedOnly(false); }}
            >
              {source.name} · {count}
            </Chip>
          );
        })}
        <Chip active={featuredOnly} onClick={() => { setFeaturedOnly(true); setSourceFilter("all"); }}>
          Featured · {apps.filter((app) => app.featured).length}
        </Chip>
      </div>

      <p className="mt-4 text-xs text-dim">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      <div className={formOpen ? "mt-4 grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_20rem]" : "mt-4"}>
        <div className="min-w-0 space-y-6">
          {groups.length === 0 ? (
            <p className="rounded-2xl border border-line bg-card px-5 py-8 text-sm text-muted">
              No products match this search.
            </p>
          ) : (
            groups.map(({ source, apps: group }) => (
              <section key={source.id}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h2 className="text-sm font-semibold">{source.name}</h2>
                  <span className="text-xs text-dim">{group.length}</span>
                </div>
                <ul className="overflow-hidden rounded-2xl border border-line bg-card">
                  {group.map((app) => {
                      const selected = editing === app.id;
                    return (
                      <li key={app.id} className={`border-b border-line last:border-b-0 ${selected ? "bg-faint/8" : ""}`}>
                        <div className="flex items-start gap-3 px-4 py-3">
                          <button type="button" onClick={() => load(app)} className="min-w-0 flex-1 text-left">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium">{app.name}</span>
                              {app.featured ? (
                                <span className="rounded-full bg-faint/12 px-2 py-0.5 text-[11px] font-medium text-faint">
                                  Featured
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-1 block truncate text-xs text-muted">{app.tagline}</span>
                            <span className="mt-1 block text-[11px] text-dim">
                              {app.category}
                              {app.year ? ` · ${app.year}` : ""}
                            </span>
                          </button>
                          {confirming === app.id ? (
                            <div className="flex shrink-0 items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => remove(app.id)}
                                className="text-xs font-medium text-red-300"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirming(null)}
                                className="text-xs text-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirming(app.id)}
                              className="shrink-0 pt-1 text-xs text-dim hover:text-foreground"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>

        {formOpen ? (
          <form
            onSubmit={save}
            className="order-first max-h-[calc(100vh-2rem)] space-y-5 overflow-y-auto rounded-2xl border border-line bg-card p-5 md:sticky md:top-6 md:order-last"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">
                  {editing ? "Editing" : "New product"}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{editing ? form.name || editing : "Add a product"}</h2>
              </div>
              <button type="button" onClick={closeForm} className="text-xs text-muted">
                Close
              </button>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium text-muted">Identity</legend>
              <Field label="Id" hint="Short slug. Cannot change after save.">
                <input
                  required
                  value={form.id}
                  disabled={Boolean(editing)}
                  onChange={(event) => setForm({ ...form, id: event.target.value })}
                  placeholder="shipfast"
                  className={`${fieldClass} disabled:text-dim`}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="ShipFast"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Year">
                  <input
                    value={form.year}
                    onChange={(event) => setForm({ ...form, year: event.target.value })}
                    placeholder="2023"
                    inputMode="numeric"
                    className={fieldClass}
                  />
                </Field>
              </div>
              <Field label="URL">
                <input
                  required
                  value={form.url}
                  onChange={(event) => setForm({ ...form, url: event.target.value })}
                  placeholder="https://shipfa.st"
                  className={fieldClass}
                />
              </Field>
              <Field label="Maker" hint="Product or company. Leave blank to use the name.">
                <input
                  value={form.maker}
                  onChange={(event) => setForm({ ...form, maker: event.target.value })}
                  placeholder="ShipFast"
                  className={fieldClass}
                />
              </Field>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium text-muted">What it does</legend>
              <Field label="Tagline">
                <input
                  required
                  value={form.tagline}
                  onChange={(event) => setForm({ ...form, tagline: event.target.value })}
                  className={fieldClass}
                />
              </Field>
              <Field label="Description">
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => setForm({ ...form, description: event.target.value })}
                  rows={3}
                  className={fieldClass}
                />
              </Field>
              <Field label="Gap" hint="What is still open around this product.">
                <textarea
                  required
                  value={form.gap}
                  onChange={(event) => setForm({ ...form, gap: event.target.value })}
                  rows={2}
                  className={fieldClass}
                />
              </Field>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-xs font-medium text-muted">Catalog</legend>
              <Field label="Category">
                <input
                  required
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Boilerplate"
                  className={fieldClass}
                />
              </Field>
              <Field label="Tags" hint="Comma separated.">
                <input
                  required
                  value={form.tags}
                  onChange={(event) => setForm({ ...form, tags: event.target.value })}
                  placeholder="saas, nextjs, boilerplate"
                  className={fieldClass}
                />
              </Field>
              <Field label="Source">
                <select
                  value={form.sourceId}
                  onChange={(event) => setForm({ ...form, sourceId: event.target.value as SourceId })}
                  className={fieldClass}
                >
                  {sources.map((source) => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setForm({ ...form, featured: event.target.checked })}
                />
                Featured on the home page
              </label>
            </fieldset>

            {message ? <p className="text-sm text-red-300">{message}</p> : null}
            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-full bg-faint px-4 py-2 text-sm font-semibold text-ink">
                {editing ? "Save changes" : "Save product"}
              </button>
              <button type="button" onClick={closeForm} className="text-sm text-muted">
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted">{label}</span>
      {hint ? <span className="mt-0.5 block text-[11px] leading-4 text-dim">{hint}</span> : null}
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-faint px-3 py-1.5 text-xs font-medium text-ink"
          : "rounded-full border border-line bg-card px-3 py-1.5 text-xs text-muted hover:text-faint"
      }
    >
      {children}
    </button>
  );
}
