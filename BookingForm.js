"use client";

import { useState } from "react";

export default function BookingForm({ services, whatsapp }) {
  const [form, setForm] = useState({
    client_name: "",
    phone: "",
    whatsapp: "",
    service_id: "",
    booking_date: "",
    booking_time: "",
    notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const selectedService = services.find((s) => s.id === form.service_id);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service_name: selectedService ? selectedService.name : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível enviar o agendamento.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  const digits = (whatsapp || "").replace(/\D/g, "");
  const phone = digits.startsWith("244") ? digits : `244${digits}`;
  const waMessage = `Olá! Gostaria de confirmar o meu agendamento: ${form.client_name || ""} — ${
    services.find((s) => s.id === form.service_id)?.name || ""
  } — ${form.booking_date || ""} às ${form.booking_time || ""}`;
  const waHref = `https://wa.me/${phone}?text=${encodeURIComponent(waMessage)}`;

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose/10 text-rose-dark">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink">
          Agendamento recebido com sucesso
        </h3>
        <p className="mt-2 text-sm text-ink/60">
          Entraremos em contacto para confirmar o seu horário. Se preferir,
          pode também confirmar diretamente pelo WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"
          >
            Confirmar pelo WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setForm({
                client_name: "",
                phone: "",
                whatsapp: "",
                service_id: "",
                booking_date: "",
                booking_time: "",
                notes: "",
              });
              setStatus("idle");
            }}
            className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink/70"
          >
            Novo agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="client_name" className="mb-1.5 block text-sm font-medium text-ink/70">
            Nome *
          </label>
          <input
            id="client_name"
            required
            value={form.client_name}
            onChange={(e) => update("client_name", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink/70">
            Telefone *
          </label>
          <input
            id="phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="9XX XXX XXX"
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-ink/70">
            WhatsApp (se diferente)
          </label>
          <input
            id="whatsapp"
            type="tel"
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          />
        </div>
        <div>
          <label htmlFor="service_id" className="mb-1.5 block text-sm font-medium text-ink/70">
            Serviço
          </label>
          <select
            id="service_id"
            value={form.service_id}
            onChange={(e) => update("service_id", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="booking_date" className="mb-1.5 block text-sm font-medium text-ink/70">
            Data *
          </label>
          <input
            id="booking_date"
            required
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={form.booking_date}
            onChange={(e) => update("booking_date", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          />
        </div>
        <div>
          <label htmlFor="booking_time" className="mb-1.5 block text-sm font-medium text-ink/70">
            Horário *
          </label>
          <input
            id="booking_time"
            required
            type="time"
            value={form.booking_time}
            onChange={(e) => update("booking_time", e.target.value)}
            className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-ink/70">
          Observações
        </label>
        <textarea
          id="notes"
          rows={3}
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm focus:border-rose"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-2 rounded-full bg-rose px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-rose-dark disabled:opacity-60"
      >
        {status === "loading" ? "A enviar..." : "Confirmar agendamento"}
      </button>
    </form>
  );
}
