# Next production step

The current Next App Router application exports static HTML to GitHub Pages. Page copy and service routes are generated at build time. Only dialogs/forms/navigation and WebGL are client components.

## Ports

- `domain/content.ts`: SiteSettings, ContactDetails, Service, ServiceCategory, Project, FAQ, Document, Partner and ContentProvider.
- `content/local.ts`: LocalContentProvider. Add PayloadContentProvider behind the same domain interface. UI must never import Payload collection implementations.
- `domain/lead.ts`: LeadPayload, validation, LeadReceipt, LeadTransport.
- `adapters/lead.ts`: DemoLeadTransport currently used; ApiLeadTransport ready for an explicitly configured trusted API endpoint.
- `lib/analytics.ts`: typed analytics port, no-op in demo; events contain no contact fields.
- `components/3d/state.ts`: isolated scene store with pageScroll, valveState, flowProgress, boilerState, animationMode, graphicsQuality, sceneStatus. Scroll does not close valves or rewind gas.

## Implementation sequence

1. Deploy Payload CMS + PostgreSQL on a server platform that supports them. GitHub Pages remains demo-only.
2. Define collections and editorial permissions, including versioned and approved services, projects, contacts, documents and lead records.
3. Add authenticated CMS read adapter for build-time content; rebuild on publish or move to server rendering.
4. Implement validated `/api/leads` on the backend: consent record, idempotency, rate limiting, abuse controls, request limits, secure logging without PII, transactional PostgreSQL persistence.
5. Add CRM delivery using an outbox/queue and retry policy. Success to the visitor must mean durable acceptance, not merely a attempted CRM request.
6. Inject ApiLeadTransport at the form boundary and tailor live receipts. Add integration tests and approved data-retention/consent texts.
7. Add server analytics only after approval and avoid importing PII into analytics events.

No `.env`, credentials, CRM secrets, real lead data or user-provided screenshot data are stored in this repository.
