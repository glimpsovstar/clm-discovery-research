# Changelog

### 1.6.1 · 27 Jun 2026 · David Joo

- §9.0 Release 1 commitment vs product vision — ruthless wedge fence; policy/operate moved to Release 2+ vision
- §6.4 product sponsor rationale — Vault product sponsor; explicit **not** IBM Verify/Guardium/Concert (operational/architectural weight)
- §6.0 billing fix — `sys/billing/certificates` vs `normalized_external_ca_cert_units` (via `sys/billing/overview`)
- §8.6 payback — outage probability ranges; FTE/audit-led defensible case
- §6.5 — inventory dedup honesty, PQC algorithm inventory (Release 1), revocation deferred
- §1.1 six-term glossary; "how to read" navigation box
- §11/§12 — blind-spot reveal demo first

### 1.6.0 · 27 Jun 2026 · David Joo

- §6.4 market positioning — competitors, build/buy/partner, ideal customer, public vs internal TLS clarity
- §6.5 discovery scope boundaries & collector topology (in-scope / deferred; Ansible AAP as optional integration)
- §8.6 ROI worksheet, TCO & payback for procurement
- Terminology pass: **lifecycle stage 1–13** (§4) vs **Release 1–3** (§9) vs **SC-081 enforcement stage** (§3.1)
- SC-081: 199-day issued lifetime vs 200-day ballot ceiling
- Executive summary: Release 1 plain-language deliverable; competitive pointer

### 1.5.5 · 27 Jun 2026 · David Joo

- §3.1.1 what SC-081/regulatory changes mean for organisations
- §8.5 cost of doing nothing (outage, audit, 8× renewal FTE math, do-nothing vs do-something)

### 1.5.4 · 27 Jun 2026 · David Joo

- §6.0 Vault version scope — 1.x baseline vs Enterprise 2.0 (PKI External CA, Agent ACME); gaps that remain

### 1.5.3 · 27 Jun 2026 · David Joo

- §6.3 visibility gap — Vault PKI/HCP grouped by serial/key/mount; plugin provides human-readable CLM view (validated against Vault UI, API, GitHub #27249)

### 1.5.2 · 27 Jun 2026 · David Joo

- Canada GC TLS source links (CA/B validity delegation by reference)
- Policy engine folded into **Govern** (§4 lifecycle stage 4) — not a separate lifecycle stage
- API-first reframed as **customer/platform requirement** (§2.11), not lifecycle capability
- Capability model → **19 lifecycle capabilities** + Govern depth + platform requirements

### 1.5.1 · 27 Jun 2026 · David Joo

- §2.11 ease of use / integration — API-first approach (OpenAPI, webhooks, async jobs)
- Release 1 roadmap: OpenAPI v1 + webhooks
- Validation pass: reference links, SC-081 exec summary wording, §4 vs §9 phase disambiguation

### 1.5.0 · 27 Jun 2026 · David Joo

### 1.4.0 · Jun 2026 · David Joo

- §2.8 policy engine (OPA, three layers, starter catalogue)
- §2.9 natural language → draft → review → publish
- §2.10 Org → Team → Project policy inheritance with Vault namespace examples

### 1.3.0 · Jun 2026 · David Joo

- §2.6 traceability & auditability
- §2.7 fine-grained RBAC

### 1.2.0 · Jun 2026 · David Joo

- Report → Act → Operate → Evidence lifecycle
- Baseline + delta reporting
- §2.5.1 operate action items (create / renew / revoke → evidence)

### 1.1.0 · Jun 2026 · David Joo

- Diagrams converted to Mermaid
- Import & replace (certificate adoption) — §10

### 1.0.0 · Jun 2026 · David Joo

- Initial report: CLM definition, regulatory landscape, Vault gap analysis, business case, phased plugin proposal

---



See also [archive](./archive/certificate-lifecycle-management-research-report-v1.6.1-full.md) for the pre-split monolith.
