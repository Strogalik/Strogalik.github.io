"use client";
import { useState, useRef, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { services, settings } from "@/content/local";
import { DemoLeadTransport } from "@/adapters/lead";
import {
  validateLead,
  type LeadErrors,
  type LeadPayload,
  type LeadTransport,
} from "@/domain/lead";
import { analytics } from "@/lib/analytics";
export function LeadForm({
  serviceId,
  transport,
}: {
  serviceId?: string;
  transport?: LeadTransport;
}) {
  const [value, setValue] = useState<LeadPayload>({
    phone: "",
    consent: false,
    serviceId: serviceId ?? "gazifikaciya",
  });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const attempts = useRef(0);
  const update = (key: keyof LeadPayload, v: string | boolean) => {
    setValue((p) => ({ ...p, [key]: v }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };
  async function submit(e: FormEvent) {
    e.preventDefault();
    const next = validateLead(value);
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        form.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const fail =
        new URLSearchParams(window.location.search).get("formTest") ===
          "error" && attempts.current++ === 0;
      await (transport ?? new DemoLeadTransport(fail)).submit(value);
      setStatus("success");
      analytics.track("lead_demo");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Попробуйте ещё раз.");
    }
  }
  if (status === "success")
    return (
      <div className="form-success" role="status">
        <span className="success-mark">
          <Check size={28} />
        </span>
        <h3>Всё заполнено верно.</h3>
        <p>
          Это демонстрация формы. Данные никуда не отправлены. Для реального
          расчёта позвоните нам.
        </p>
        <a className="button" href={`tel:${settings.contacts.phones[0]}`}>
          +7 (910) 069-70-00 <ArrowUpRight size={18} />
        </a>
        <button className="text-link" onClick={() => setStatus("idle")}>
          Вернуться к форме
        </button>
      </div>
    );
  return (
    <form ref={form} onSubmit={submit} noValidate className="lead-form">
      <div className="form-grid">
        <label>
          Как к вам обращаться
          <input
            value={value.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            placeholder="Имя"
            maxLength={120}
          />
        </label>
        <label>
          Телефон <span aria-hidden="true">*</span>
          <input
            type="tel"
            name="phone"
            value={value.phone}
            onChange={(e) => update("phone", e.target.value)}
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <span className="field-error" id="phone-error">
              {errors.phone}
            </span>
          )}
        </label>
      </div>
      <label>
        Где находится объект
        <input
          value={value.location ?? ""}
          onChange={(e) => update("location", e.target.value)}
          placeholder="Город или населённый пункт"
          autoComplete="address-level2"
          maxLength={200}
        />
      </label>
      <label>
        Что планируете
        <select
          value={value.serviceId}
          onChange={(e) => update("serviceId", e.target.value)}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Несколько слов о задаче
        <textarea
          value={value.message ?? ""}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Например, хочу провести газ в готовый дом"
          rows={3}
          maxLength={1500}
        />
      </label>
      <div>
        <label className="consent">
          <input
            type="checkbox"
            checked={value.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            Согласен с{" "}
            <a
              href={settings.documents[1].url}
              target="_blank"
              rel="noreferrer"
            >
              политикой обработки персональных данных
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <span className="field-error" id="consent-error">
            {errors.consent}
          </span>
        )}
      </div>
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="button full" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            Проверяем форму <LoaderCircle className="spin" size={18} />
          </>
        ) : (
          <>
            {status === "error" ? "Попробовать ещё раз" : "Проверить заявку"}
            <ArrowUpRight size={18} />
          </>
        )}
      </button>
      <p className="demo-note">
        Демонстрационный режим · данные не отправляются
      </p>
    </form>
  );
}
