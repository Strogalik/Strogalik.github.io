export interface AnalyticsPort {
  track(
    event: "lead_open" | "lead_demo" | "valve_open" | "service_open",
    properties?: { serviceId?: string },
  ): void;
}
// No third-party analytics and no PII in the presentation build.
export const analytics: AnalyticsPort = { track() {} };
