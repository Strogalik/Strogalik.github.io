import { describe, it, expect, vi } from "vitest";
import { validateLead } from "../domain/lead";
import { DemoLeadTransport } from "../adapters/lead";
import { content } from "../content/local";
describe("lead contract", () => {
  it("accepts pasted international and formatted phones", () => {
    expect(
      validateLead({ phone: "+7 (999) 000-00-00", consent: true }),
    ).toEqual({});
    expect(validateLead({ phone: "+44 20 0000 0000", consent: true })).toEqual(
      {},
    );
  });
  it("requires a phone and explicit consent", () => {
    expect(validateLead({ phone: "12", consent: false })).toHaveProperty(
      "phone",
    );
    expect(validateLead({ phone: "12", consent: false })).toHaveProperty(
      "consent",
    );
  });
  it("demo returns truthful receipt and never makes a network request", async () => {
    const spy = vi.spyOn(globalThis, "fetch");
    expect(
      await new DemoLeadTransport().submit({
        phone: "+79990000000",
        consent: true,
      }),
    ).toEqual({ mode: "demo" });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  it("exposes deterministic error for retry QA", async () => {
    await expect(
      new DemoLeadTransport(true).submit({
        phone: "+79990000000",
        consent: true,
      }),
    ).rejects.toThrow("Попробуйте");
  });
});
describe("content integrity", () => {
  it("has all ten distinct service URLs", () => {
    const s = content.services();
    expect(s).toHaveLength(10);
    expect(new Set(s.map((v) => v.id)).size).toBe(10);
  });
  it("does not invent project records", () => {
    expect(content.projects()).toEqual([]);
  });
});
