"use client";

import { useState } from "react";
import type { LiveApp, Source } from "@/lib/types";

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
  sourceId: "indie-products",
  maker: "",
  year: "",
  featured: false,
  gap: "",
};

export function AdminEditor({ apps, sources }: AdminEditorProps) {
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  function load(app: LiveApp) {
    setEditing(app.id);
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
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={save} className="space-y-3 rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-semibold">{editing ? `Edit ${editing}` : "Add a product"}</h2>
        {(["id", "name", "url", "tagline", "category", "maker", "year"] as const).map((field) => (
          <input
            key={field}
            required={field !== "maker" && field !== "year"}
            value={form[field]}
            onChange={(event) => setForm({ ...form, [field]: event.target.value })}
            placeholder={field}
            disabled={field === "id" && Boolean(editing)}
            className="w-full rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none"
          />
        ))}
        <textarea
          required
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="description"
          rows={3}
          className="w-full rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none"
        />
        <textarea
          required
          value={form.gap}
          onChange={(event) => setForm({ ...form, gap: event.target.value })}
          placeholder="gap"
          rows={2}
          className="w-full rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none"
        />
        <input
          required
          value={form.tags}
          onChange={(event) => setForm({ ...form, tags: event.target.value })}
          placeholder="tags, comma separated"
          className="w-full rounded-xl border border-line bg-background px-3 py-2 text-sm outline-none"
        />
        <select
          value={form.sourceId}
          onChange={(event) => setForm({ ...form, sourceId: event.target.value })}
          className="w-full rounded-xl border border-line bg-background px-3 py-2 text-sm"
        >
          {sources.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm({ ...form, featured: event.target.checked })}
          />
          Featured on the home page
        </label>
        {message ? <p className="text-sm text-red-300">{message}</p> : null}
        <button type="submit" className="rounded-full bg-faint px-4 py-2 text-sm font-semibold text-ink">
          Save product
        </button>
      </form>
      <ul className="space-y-2">
        {apps.map((app) => (
          <li key={app.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2">
            <button type="button" onClick={() => load(app)} className="text-left text-sm">
              {app.name}
              {app.featured ? <span className="ml-2 text-xs text-faint">featured</span> : null}
            </button>
            <button type="button" onClick={() => remove(app.id)} className="text-xs text-dim">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
