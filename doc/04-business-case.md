# Business case: CLM Discovery plugin

**Part of:** CLM Discovery initiative document set  
**Audience:** Executives, procurement, business analysts, program office  
**See also:** [Executive brief](./01-executive-brief.md) · [CLM reference](./02-clm-reference.md) (regulatory context)

---

## Business case for the plugin

### 8.1 Problem statement (for executives)

Public TLS certificate lifetimes are dropping to 47 days by 2029. Renewal frequency roughly **8×** current levels. Domain validation reuse drops to **10 days**. Most enterprises cannot produce a complete certificate inventory today. Manual renewal and spreadsheet tracking will cause outages and audit findings.

**Cost of inaction:** **§8.5** — outage risk, compliance failure (PCI inventory already mandatory), operational load manual teams cannot absorb. **Procurement worksheet:** **§8.6**. **What the rules mean organisationally:** **§3.1.1**.

Vault customers already trust HashiCorp for secrets and PKI. They still have **large blind spots** outside Vault-managed issuance — legacy apps, cloud LBs, third-party public CAs, acquired systems, and shadow IT.

### 8.2 Why now

| Factor | Timing |
|---|---|
| SC-081 enforcement stage 1 (200-day ballot / **199-day issued**) | **In effect** (from Mar 2026) |
| PCI 4.2.1.1 inventory | **Mandatory** (from Mar 2025) |
| DORA RTS | In force for EU finance |
| NCSC/ACSC guidance | Explicit automation + prepare for 47-day |
| APRA supervision | Indirect pressure via CPS 234/230 |

### 8.3 Value proposition

| Stakeholder | Value |
|---|---|
| **CISO / Risk** | Posture visibility, standards-based reporting, reduced unknown cert risk |
| **App owner / SRE** | Human-readable inventory (service, endpoint, owner) — not serial/key hunting in PKI UI |
| **Platform / PKI / SRE** | Vault stays issuance engine; readable estate view, prioritised renewal queue, Vault cert correlation |
| **Audit / Compliance** | Evidence packs mapped to ISM, DORA, PCI, APRA themes |
| **HashiCorp field** | Extends Vault into CLM conversations; import & replace drives PKI/Agent adoption |
| **Customer** | One control plane (Vault) + visibility/compliance layer + migration path for shadow certs |

### 8.4 What is technically viable vs not (honest view)

| Viable (Release 1–2) | Hard / customer-specific (Release 3+) |
|---|---|
| TLS network discovery | Auto-deploy to every legacy appliance |
| Cert parsing, chain analysis, classification | Full ServiceNow workflow replacement |
| Tagging model + manual/auto enrichment | All cloud LB APIs in one product |
| SC-081 + ISM + PCI rule packs | Real-time sync with every CMDB |
| Vault PKI inventory correlation | 100% automated owner assignment |
| CSV/PDF audit reports | Zero-touch renewal for non-ACME legacy |
| Expiry alerting | Full mTLS mesh observability |
| Read-only ITSM ticket creation | On-prem air-gapped CT streaming at scale |
| Vault API integration for remediation | Competing with DigiCert/Sectigo full CLM suites |
| Import to inventory + replace via Vault PKI/Agent | Zero-touch replace on every legacy appliance type |
| Replace workflow with verify + rollback | Universal LB API coverage day one |

**Recommendation:** Lead with visibility, compliance, and prioritisation. Treat import & replace as a Release 2 migration story backed by Vault, not a day-one promise for every deployment target. See §6.4 for competitive framing and ideal customer; §6.5 for discovery scope.

### 8.5 Cost of doing nothing

This is the executive counterweight to plugin investment: **what happens if the organisation keeps spreadsheets, ad-hoc renewals, and Vault-only visibility?**

#### Consequence categories

| Category | If we do nothing | Who feels it first |
|---|---|---|
| **Outage / revenue** | Expired or mis-deployed cert takes down customer-facing TLS (payments, login, API) | App owner, SRE, customer |
| **Operational load** | Manual renewal workload scales with SC-081 (~**8×** renewals per public cert by 2029) | Platform / PKI team — burnout, missed certs |
| **Audit / compliance** | PCI 4.2.1.1 inventory gap; DORA register incomplete; ISM/APRA "timely renewal" finding | GRC, internal audit, regulators |
| **Incident cost** | During breach or outage, **unknown certs** extend MTTR — team hunts serial numbers instead of services | Security ops, incident commander |
| **Migration debt** | Shadow certs stay external; each SC-081 phase forces **fire-drill replacements** under time pressure | Program office, all teams |
| **Vault ROI gap** | Vault PKI investment covers only the **managed subset**; leadership still cannot answer "how many certs do we have?" | CISO, HashiCorp customer sponsor |

#### Illustrative operational math (public TLS estate)

Assumptions for planning — adjust with your real inventory:

| Variable | Today | SC-081 phase (2029) |
|---|---:|---:|
| Public TLS certs in scope | 500 | 500 |
| Renewals per cert per year (~199-day issued → ~8 by 2029) | ~1 | ~8 |
| **Total renewal events / year** | **500** | **~4,000** |
| Manual effort per event (find, order, deploy, verify) | ~2 hours | ~2 hours (if still manual) |
| **Manual hours / year** | **~1,000 h** | **~8,000 h** |

At ~8,000 hours/year, manual renewal is roughly **four full-time equivalents** for renewal alone — before counting discovery, audit prep, or shadow cert remediation. Automation and inventory are not optional optimisations; they are **capacity requirements**.

> This is illustrative FTE math, not a quote for your organisation. Replace 500 and 2 hours with discovery scan results.

#### Outage and audit — qualitative but real

We do not cite specific dollar figures here (outage cost varies enormously by industry and channel). Patterns that consistently appear in post-incident reviews:

- **Customer-facing TLS expiry** — immediate revenue and reputation impact for e-commerce, banking, SaaS login flows
- **Audit finding → remediation program** — months of consultant-led inventory projects costing far more than proactive tooling
- **Regulatory scrutiny** — APRA CPS 234/230 themes: control weakness becomes supervisory question; PCI QSA **fail** on 4.2.1.1 blocks attestation
- **Program delay** — SC-081 phase transitions force **compressed** replacement projects when overlong certs can no longer be reissued

#### What "do something" looks like (contrast)

| Do nothing | Do something (plugin + Vault) |
|---|---|
| Spreadsheet inventory, stale on day one | Continuous discovery + delta reports |
| Renew when calendar reminder fires | Policy-driven queue; auto-renew where safe |
| Audit scramble every year | Evidence chain: report → act → operate → export |
| Vault sees Vault-issued only | Unified human-readable estate + Vault correlation |
| 8× manual renewals by 2029 | Automated operate path via Vault PKI / External CA / Agent |

**Executive one-liner:** Doing nothing still has a cost: outage risk, audit failure, and roughly 8× renewal load on a fixed calendar, while most organisations still cannot list their certificates.

See also **§3.1.1** (what the rules mean organisationally), **§8.1–8.2** (problem statement and timing), and **§8.6** (ROI worksheet for procurement).

### 8.6 ROI worksheet, TCO & payback (for procurement)

§8.5 explains *why* inaction is costly. This section gives a **worksheet** a business analyst can take to procurement — replace placeholders with org-specific numbers from a pilot scan.

#### Step 1 — Inventory baseline (from Release 1 pilot)

| Input | Your value | Notes |
|---|---|---|
| Public TLS certs discovered | _____ | From first network + cloud scan |
| Internal / shadow certs discovered | _____ | Often 2–5× Vault-issued count in hybrid estates |
| Certs with no owner tag | _____ | % untagged = audit finding risk |
| Certs expiring < 60 days | _____ | Immediate queue |
| SC-081 / PCI violations | _____ | From standards pack report |

#### Step 2 — Cost of one outage (customer fills in)

| Input | Low | Mid | High | Your estimate |
|---|---:|---:|---:|---:|
| Revenue per hour (customer-facing TLS) | $50K | $500K | $5M+ | _____ |
| Typical cert-outage duration before detect + fix | 2 h | 4 h | 8 h | _____ |
| **Direct outage cost (single event)** | $100K | $2M | $40M+ | _____ |
| Reputational / regulatory follow-up | Qualitative | APRA CPS 230 reportable event; PCI attestation risk | | |

> One prevented SEV1 cert outage often pays for the program. Use **your** payment-channel numbers — do not rely on industry averages in the business case.

#### Step 3 — FTE savings (extends §8.5 math)

| Variable | Today | With plugin (Release 1–2) | Your value |
|---|---:|---:|---:|
| Public TLS certs in scope | 500 | 500 | _____ |
| Renewals per cert per year (199-day issued → ~8 by 2029) | ~1 now | ~8 by 2029 | _____ |
| Manual hours per renewal event | 2 h | 0.5 h (automated where policy allows) | _____ |
| **Manual hours / year** | 1,000 h | 2,000 h automated + 500 h manual | _____ |
| FTE equivalent (@ 1,800 h/FTE) | ~0.6 | ~1.4 manual remaining | _____ |
| Audit prep hours / year (inventory scramble) | 200 h | 40 h (continuous evidence) | _____ |

#### Step 4 — TCO (3-year planning horizon)

| Cost line | Year 1 | Year 2 | Year 3 | Notes |
|---|---:|---:|---:|---|
| Plugin licence (Vault add-on / HCP) | $_____ | $_____ | $_____ | Pricing TBD — model as Vault-adjacent SKU |
| Vault Enterprise / HCP (existing) | (baseline) | | | Usually already budgeted |
| Professional services — scanner placement, firewall rules, pilot | $_____ | $_____ | $0 | Higher for segmented on-prem FSI |
| Ansible Automation Platform integration (optional) | $_____ | $_____ | $_____ | Deploy playbooks only — if customer already uses AAP |
| ServiceNow / CMDB integration (Release 2–3) | $0 | $_____ | $_____ | Customer or SI effort |
| Internal FTE — platform team run | _____ h | _____ h | _____ h | Lower after Release 2 automation |

#### Step 5 — Payback summary

Use **ranges**, not a single unsourced outage probability. Derive P(outage) from the org's own incident history where possible.

| Metric | Formula | Low | Mid | High |
|---|---|---:|---:|---:|
| **P(cert-related outage / year)** | From incident log or risk register | 1% | 3% | 8% |
| **Cost per outage** | Customer revenue / channel impact (Step 2) | $500K | $2M | $10M+ |
| **Annual risk avoided** | P(outage) × cost | $5K | $60K | $800K |
| **Annual FTE saved** | (hours saved / 1,800) × loaded FTE cost | $40K | $120K | $200K |
| **Annual audit efficiency** | audit hours saved × consultant rate | $10K | $32K | $80K |
| **Total annual benefit** | sum of above | ~$55K | ~$212K | ~$1.08M |
| **Year 1 TCO** | licence + PS + internal (Step 4) | | e.g. $280K | |
| **Simple payback** | Year 1 TCO ÷ annual benefit | | **Mid case ~16 mo** if benefit = FTE + audit only; **faster** if outage avoided | |

> **Procurement tip:** Lead with FTE and audit savings (numbers you can back from a pilot scan). Treat outage avoidance as upside. If you use a probability, derive it from your own cert or TLS incidents over the last 3–5 years.

Replace every example with pilot data. The worksheet is meant to start the conversation, not imply false precision.

#### Honest constraints for the BA

1. The ideal customer is narrower than "every enterprise." Strongest fit: Vault-heavy estates with shadow certs (§6.4).
2. The plugin finds problems; the customer still assigns owners and runs remediation (unless policy + Ansible automates that).
3. Many accounts already own incumbent CLM. Position as a Vault complement and migration accelerator, not rip-and-replace.

---

