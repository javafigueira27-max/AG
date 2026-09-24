"use client";

import { useState } from "react";

export default function Jobs({ jobs, settings }) {
  const [openJob, setOpenJob] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  const hasOpenings = !!settings.jobs_has_openings;
  const activeJobs = jobs.filter((j) => j.active === 1);

  async function handleApply(e) {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: openJob?.id || null,
          job_title: openJob?.title || "",
          ...form,
        }),
      });
    } catch {
      // mesmo que falhe o registo interno, ainda seguimos para o mailto abaixo
    }
    const subject = encodeURIComponent(
      `Candidatura: ${openJob?.title || "Trabalhe Connosco"}`
    );
    const body = encodeURIComponent(
      `Nome: ${form.name}\nEmail: ${form.email}\nTelefone: ${form.phone}\n\n${form.message}`
    );
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <section id="trabalhe-connosco" className="bg-cream-dark/40 py-24">
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <p className="font-display text-lg italic text-rose-dark">Junte-se a nós</p>
          <h2 className="mt-2 font-display text-4xl font-semibold text-ink sm:text-5xl">
            Trabalhe Connosco
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink/60">
            {hasOpenings
              ? settings.jobs_message_with_openings
              : settings.jobs_message_without_openings}
          </p>
        </div>

        {hasOpenings && activeJobs.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {activeJobs.map((job) => (
              <div key={job.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {job.title}
                </h3>
                {job.description && (
                  <p className="mt-2 text-sm text-ink/60">{job.description}</p>
                )}
                {job.requirements && (
                  <p className="mt-2 text-xs text-ink/50">
                    <span className="font-semibold">Requisitos:</span> {job.requirements}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setOpenJob(job);
                    setStatus("idle");
                  }}
                  className="mt-4 rounded-full border border-rose px-4 py-2 text-xs font-semibold text-rose-dark hover:bg-rose hover:text-white"
                >
                  Candidatar-me
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => {
              setOpenJob({ id: null, title: "Candidatura espontânea" });
              setStatus("idle");
            }}
            className="rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white hover:bg-rose-dark"
          >
            Enviar candidatura
          </button>
        </div>

        {openJob && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Candidatura para ${openJob.title}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5"
            onClick={() => setOpenJob(null)}
          >
            <form
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleApply}
              className="w-full max-w-md rounded-2xl bg-white p-6"
            >
              <h3 className="font-display text-2xl font-semibold text-ink">
                {openJob.title}
              </h3>
              <p className="mt-1 text-xs text-ink/50">
                O botão abaixo abre o seu email para enviar a candidatura para{" "}
                {settings.email}.
              </p>

              <div className="mt-4 grid gap-3">
                <input
                  required
                  placeholder="Nome completo"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm"
                />
                <input
                  placeholder="Telefone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm"
                />
                <textarea
                  placeholder="Mensagem (experiência, disponibilidade...)"
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenJob(null)}
                  className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-rose px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Abrir email e enviar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
