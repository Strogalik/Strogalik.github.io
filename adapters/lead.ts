import type { LeadPayload, LeadReceipt, LeadTransport } from "@/domain/lead";
export class DemoLeadTransport implements LeadTransport {
  constructor(private readonly fail = false) {}
  async submit(_payload: LeadPayload): Promise<LeadReceipt> {
    void _payload;
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (this.fail)
      throw new Error("Не удалось завершить демонстрацию. Попробуйте ещё раз.");
    return { mode: "demo" };
  }
}
export class ApiLeadTransport implements LeadTransport {
  constructor(private readonly endpoint: string) {}
  async submit(payload: LeadPayload): Promise<LeadReceipt> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok)
      throw new Error(
        "Не удалось отправить заявку. Данные сохранены в форме. Попробуйте ещё раз.",
      );
    return { mode: "live" };
  }
}
