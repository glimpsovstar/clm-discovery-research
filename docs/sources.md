---

## Sources

- [CA/B Forum SC-081v3](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/)
- [NCSC UK — Web PKI certificate management (Dec 2025)](https://www.ncsc.gov.uk/guidance/provisioning-and-managing-certificates-in-the-web-pki)
- [ASD ISM — Guidelines for cryptography](https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/ism/cybersecurity-guidelines/guidelines-cryptography)
- [ASD — Managing cryptographic keys and secrets (Aug 2025)](https://www.cyber.gov.au/sites/default/files/2025-08/Managing%20cryptographic%20keys%20and%20secrets_D4.pdf)
- [APRA CPS 234](https://www.apra.gov.au/standards/cps-234)
- [GC Web Sites and Services Configuration Requirements](https://www.canada.ca/en/government/system/digital-government/policies-standards/enterprise-it-service-common-configurations/web-sites.html) (mandates GC TLS recommendations)
- [GC Recommendations for TLS Server Certificates (May 2021 PDF)](https://wiki.gccollab.ca/images/9/92/Recommendations_for_TLS_Server_Certificates_-_14_May_2021.pdf) — validity must not exceed CA/B Forum guidelines
- [DORA RTS — Commission Delegated Regulation 2024/1532 (Art. 6–7)](https://ec.europa.eu/finance/docs/level-2-measures/dora-regulation-rts--2024-1532_en.pdf)
- [PCI DSS v4.0 Summary of Changes (4.2.1.1)](https://listings.pcisecuritystandards.org/documents/PCI-DSS-v3-2-1-to-v4-0-Summary-of-Changes-r1.pdf)
- [Vault Enterprise 2.0 release notes](https://github.com/hashicorp/vault/releases/tag/v2.0.0)
- [Vault Enterprise 2.0 blog](https://www.hashicorp.com/en/blog/vault-enterprise-20-modernizes-identity-security-at-scale)
- [Vault PKI External CA docs](https://developer.hashicorp.com/vault/docs/secrets/pki-external-ca)
- [Vault sys/billing/certificates API](https://developer.hashicorp.com/vault/api-docs/system/billing#read-billing-certificate-count)
- [Vault sys/billing/overview API](https://developer.hashicorp.com/vault/api-docs/system/billing#read-billing-overview) (includes `normalized_external_ca_cert_units`)
- [HashiCorp Vault PKI docs](https://developer.hashicorp.com/vault/docs/secrets/pki)
- [HashiCorp Vault Sentinel (Enterprise)](https://developer.hashicorp.com/vault/docs/enterprise/sentinel)
- [Open Policy Agent (OPA)](https://www.openpolicyagent.org/)
- [Vault PKI — list certificates API](https://developer.hashicorp.com/vault/api-docs/secret/pki#list-certificates) (serials only at list)
- [Vault PKI considerations](https://developer.hashicorp.com/vault/docs/secrets/pki/considerations) (scale / audit-log tracking guidance)
- [Vault GitHub #27249 — CN in certificate list UI](https://github.com/hashicorp/vault/issues/27249) (open)
- [HCP Certificates Inventory Reporting](https://developer.hashicorp.com/hcp/docs/vault/reporting/certificates-inventory-reporting)
- [Vault Agent PKI External CA](https://developer.hashicorp.com/vault/docs/agent-and-proxy/agent/pki-external-ca)
