export interface LeadPayload {
  name?: string;
  phone: string;
  location?: string;
  serviceId?: string;
  message?: string;
  consent: boolean;
  attribution?: Record<string, string>;
}
export interface LeadReceipt {
  mode: "demo" | "live";
}
export interface LeadTransport {
  submit(payload: LeadPayload): Promise<LeadReceipt>;
}
export type LeadErrors = Partial<Record<keyof LeadPayload, string>>;
export function validateLead(value: LeadPayload): LeadErrors {
  const errors: LeadErrors = {};
  const digits = value.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15)
    errors.phone = "Укажите телефон: от 10 до 15 цифр.";
  if (!value.consent)
    errors.consent = "Подтвердите согласие, чтобы продолжить.";
  if ((value.name?.length ?? 0) > 120) errors.name = "Не более 120 символов.";
  if ((value.message?.length ?? 0) > 1500)
    errors.message = "Не более 1500 символов.";
  return errors;
}
