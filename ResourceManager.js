"use client";

import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";

const emptyValue = (type) => {
  if (type === "checkbox") return false;
  if (type === "number") return 0;
  return "";
};

export default function ResourceManager({ title, endpoint, fields, columns, emptyState }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = fechado, {} = novo, {...} = a editar
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch(endpoint);
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    const draft = {};
    fields.forEach((f) => (draft[f.name] = emptyValue(f.type)));
    setEditing(draft);
    setError("");
  }

  function openEdit(item) {
    const draft = {};
    fields.forEach((f) => {
      let v = item[f.name];
      if (f.type === "checkbox") v = !!v;
      draft[f.name] = v ?? emptyValue(f.type);
    });
    draft.id = item.id;
    setEditing(draft);
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const isNew = !editing.id;
    const url = isNew ? endpoint : `${endpoint}/${editing.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao guardar.");
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Eliminar "${item[columns[0]] || "este item"}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    const res = await fetch(`${endpoint}/${item.id}`, { method: "DELETE" });
    if (res.ok) load();
  }

  async function toggleActive(item) {
    await fetch(`${endpoint}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: item.active ? 0 : 1 }),
    });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-dark"
        >
          + Adicionar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">A carregar...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 p-12 text-center text-sm text-ink/50">
          {emptyState || "Ainda não há itens. Clique em Adicionar para criar o primeiro."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream-dark/50 text-xs font-semibold uppercase tracking-wide text-ink/50">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3">
                    {fields.find((f) => f.name === col)?.label || col}
                  </th>
                ))}
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-ink/5">
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-ink/80">
                      {String(item[col] ?? "").slice(0, 60)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {"active" in item ? (
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.active
                            ? "bg-green-100 text-green-700"
                            : "bg-ink/10 text-ink/50"
                        }`}
                      >
                        {item.active ? "Ativo" : "Inativo"}
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="mr-3 text-xs font-semibold text-rose-dark hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
          onClick={() => setEditing(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSave}
            className="admin-scroll max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
          >
            <h2 className="font-display text-2xl font-semibold text-ink">
              {editing.id ? "Editar" : "Adicionar"} — {title}
            </h2>

            <div className="mt-5 grid gap-4">
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
                      <input
                        type="checkbox"
                        checked={!!editing[f.name]}
                        onChange={(e) =>
                          setEditing((ed) => ({ ...ed, [f.name]: e.target.checked }))
                        }
                      />
                      {f.label}
                    </label>
                  ) : f.type === "image" ? (
                    <ImageUploader
                      label={f.label}
                      value={editing[f.name]}
                      onChange={(url) =>
                        setEditing((ed) => ({ ...ed, [f.name]: url }))
                      }
                    />
                  ) : f.type === "textarea" ? (
                    <>
                      <label className="mb-1.5 block text-sm font-medium text-ink/70">
                        {f.label}
                      </label>
                      <textarea
                        rows={3}
                        required={f.required}
                        value={editing[f.name] ?? ""}
                        onChange={(e) =>
                          setEditing((ed) => ({ ...ed, [f.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
                      />
                    </>
                  ) : f.type === "select" ? (
                    <>
                      <label className="mb-1.5 block text-sm font-medium text-ink/70">
                        {f.label}
                      </label>
                      <input
                        list={`${f.name}-options`}
                        required={f.required}
                        value={editing[f.name] ?? ""}
                        onChange={(e) =>
                          setEditing((ed) => ({ ...ed, [f.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
                      />
                      <datalist id={`${f.name}-options`}>
                        {(f.options || []).map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <>
                      <label className="mb-1.5 block text-sm font-medium text-ink/70">
                        {f.label}
                      </label>
                      <input
                        type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                        required={f.required}
                        value={editing[f.name] ?? ""}
                        onChange={(e) =>
                          setEditing((ed) => ({
                            ...ed,
                            [f.name]: f.type === "number" ? e.target.value : e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink/70"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-rose px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-dark disabled:opacity-60"
              >
                {saving ? "A guardar..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
