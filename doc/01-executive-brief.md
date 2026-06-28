# Executive brief: Vault CLM Discovery & Compliance

**Part of:** CLM Discovery initiative document set  
**Audience:** Executives, field leadership, program sponsors  
**Version:** 1.6.1 · **Updated:** 27 Jun 2026  
**See also:** [Full report](./certificate-lifecycle-management-research-report.md) · [Vault gap & plugin](./03-vault-gap-and-plugin.md) · [Business case](./04-business-case.md) · [HTML briefing](../html-doc/clm-discovery-research-report/index.html)

---

## The problem

Certificate Lifecycle Management (CLM) is often reduced to "issue and renew certs." That is not enough for regulated or large enterprises.

Issuance alone is not CLM. You also need to know which certificates you have, govern how they are created and changed, renew and revoke reliably, and keep audit evidence even when policy auto-approves a change.

Two things are hitting at once:

1. **Industry enforcement.** CA/B Forum Ballot SC-081v3 is shortening public TLS certificate validity toward **47 days by 15 March 2029**. The **200-day ballot ceiling applies from 15 March 2026**; major CAs issue at **199 days** in practice.
2. **Regulatory expectation.** Standards such as ISM, DORA, PCI DSS 4, and sector rules (APRA, MAS, RBI) do not typically mandate "47 days," but they do require inventory, timely renewal, lifecycle governance, and demonstrable control effectiveness.

Most enterprises cannot produce a complete certificate inventory today. Manual renewal and spreadsheet tracking will not scale to ~8× renewal load by 2029.

---

## Where Vault fits

**HashiCorp Vault is strong as CA and secrets platform:** dynamic PKI issuance, ACME/SCEP/EST/CMPv2 (Enterprise), Agent-based delivery, audit logs, and (on HCP) certificate inventory for **Vault-issued** certs. **Vault Enterprise 2.0** adds a dedicated **PKI External CA** engine and native Agent ACME for public CA workflows.

**Where enterprises hurt in practice:** Vault cannot discover certs it did not issue. Inventory is keyed by serial, key, and mount, not by service, endpoint, or owner. It does not bind certs to owners and endpoints, track status across rotations, integrate change records, run standards-based compliance reports, or manage the full estate (external public, internal private, orphaned/unknown).

That gap matters for ANZ financial services, government, and any organisation under SC-081v3 plus APRA/ISM audit pressure.

---

## Recommendation

Build a Vault-adjacent **CLM Discovery & Compliance plugin** (not a replacement CA).

**Release 1:** discover, human-readable inventory, SC-081/PCI reports, alert. Prove the blind spot.

**Release 2–3** (operate, import & replace, policy engine, enterprise integration) is vision, not the initial commitment.

### What Release 1 delivers

The plugin scans TLS endpoints and cloud load balancers, builds a human-readable inventory (including certs Vault never issued), flags SC-081 and PCI problems (including weak algorithms), exports audit reports, and sends alerts over API using your existing Vault login.

It does not auto-fix certs, run a policy engine, or replace Venafi. The point is to prove the blind spot quickly.

---

## Market positioning

A narrow wedge for **Vault-standardised estates with shadow certs**, not a Venafi replacement.

**What to say in the room:**

> We are not rebuilding Venafi. We are closing the Vault blind spot: certs Vault did not issue, reported in audit language, remediated back through Vault PKI, External CA, or Agent, on the same token, namespace, and audit model the customer already runs.

See [§6.4 in the full report](./certificate-lifecycle-management-research-report.md#64-market-positioning-competitors-and-build--buy--partner) for competitors, build/buy/partner, and ideal customer profile. See [§9.0](./certificate-lifecycle-management-research-report.md#90-release-1-commitment-vs-product-vision) for committed Release 1 scope.

---

## Research conclusion

| Prove | Ship | Defer |
|---|---|---|
| Blind-spot reveal demo on a hybrid estate | Discovery, human-readable inventory, standards reports | Operate loop, policy engine, import & replace to Release 2+ |

The deck and full report show the complete CLM spec, where Vault stops, and a narrow Release 1 proof before scoping a multi-year platform.
