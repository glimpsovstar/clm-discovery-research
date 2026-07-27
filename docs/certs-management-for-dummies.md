# Certificate architecture for dummies

A plain-language guide to how TLS certificates are structured, who trusts them, and where Vault fits. Written to complement the [CLM research report](./certificate-lifecycle-management-research-report.md).

---

## 1. The one-minute version

A TLS certificate is a **digital ID card** for a server (or sometimes a client). It says:

- **Who** this server claims to be (`www.example.com`)
- **Who vouches for that claim** (a Certificate Authority, or CA)
- **How long** the ID is valid (`notBefore` → `notAfter`)

Browsers and API clients only trust the connection if:

1. The cert is **not expired**
2. The name matches the site they asked for
3. The cert **chains** to a CA they already trust (built into the OS/browser)

That chain is usually: **leaf → intermediate CA → root CA**.

---

## 2. Root, intermediate, and leaf (the chain)

Think of it like a company org chart for trust.

```mermaid
flowchart TB
    ROOT["Root CA<br/>(self-signed, kept offline)<br/>e.g. DigiCert Global Root G2"]
    INT["Intermediate CA<br/>(signs day-to-day certs)<br/>e.g. DigiCert TLS RSA SHA256 2020 CA1"]
    LEAF["Leaf / end-entity cert<br/>(the one on your server)<br/>CN=www.example.com"]

    ROOT --> INT
    INT --> LEAF
```

| Piece | What it is | Typical lifetime | Where it lives |
|---|---|---|---|
| **Root CA** | Top of the trust pyramid. Self-signed. Browsers ship its public key in their trust store. | 10–25 years | CA vault, offline / HSM |
| **Intermediate CA** | Signs leaf certs. Protects the root (if intermediate is compromised, revoke intermediate, root survives). | ~5–10 years | CA systems, HSM |
| **Leaf (end-entity)** | The cert on **your** load balancer, web server, or API gateway. | **Short** for public TLS (199 days now; ~47 days by 2029 under SC-081) | Your LB, K8s secret, Vault, etc. |

**Leaf** = the cert clients actually see when they connect to `https://www.example.com`.

**Intermediate** = the CA that signed the leaf (clients may download this as part of the chain).

**Root** = already trusted on the laptop/phone; usually not sent on the wire.

---

## 3. What happens during a TLS handshake (simplified)

```mermaid
sequenceDiagram
    participant Browser as Browser / API client
    participant Server as Your server (LB)
    participant Trust as Trust store (OS / browser)

    Browser->>Server: ClientHello (I want www.example.com)
    Server->>Browser: Here's my leaf cert + intermediate chain
    Browser->>Browser: Is leaf expired?
    Browser->>Browser: Does name match www.example.com?
    Browser->>Trust: Does chain reach a trusted root?
    alt All checks pass
        Browser->>Server: Encrypted session continues
    else Expired / wrong name / untrusted chain
        Browser->>Browser: Certificate error / connection fails
    end
```

**If the leaf expires:** step "Is leaf expired?" fails → **TLS fails** → users see errors or APIs break. No grace period from the browser.

---

## 4. Public PKI vs private PKI (two different worlds)

This is the confusion behind "can't Vault just mint the rest?"

### Public PKI (Web PKI)

- CAs like **DigiCert, Sectigo, Let's Encrypt**
- Roots are **pre-installed** in Chrome, Safari, Firefox, phones
- Used for **internet-facing** sites customers visit
- Rules set by **CA/B Forum** (including SC-081 max leaf lifetime)
- You get **leaf certs** from them (via portal, CSR, or ACME). You do **not** normally get your own public intermediate.

```mermaid
flowchart LR
    subgraph public["Public PKI (internet-facing)"]
        PR[DigiCert / Sectigo / Let's Encrypt root]
        PI[Their intermediate]
        PL[Your leaf: www.bank.com<br/>max ~47 days by 2029]
        PR --> PI --> PL
    end
    USER[Customer browser] -->|trusts| PR
    USER -->|connects to| PL
```

### Private PKI (your org)

- **You** run the root (or buy a private hierarchy), often via **Vault PKI**, Microsoft AD CS, etc.
- Trust only exists on machines **you configure** (corp laptops, internal services)
- **SC-081 does not apply** to purely internal certs
- You **can** issue long-lived leaves (e.g. 1 year) because **you** control policy

```mermaid
flowchart LR
    subgraph private["Private PKI (internal only)"]
        VR[Your root or Vault mount]
        VI[Vault intermediate]
        VL[Internal leaf: api.internal.corp<br/>TTL you choose]
        VR --> VI --> VL
    end
    APP[Internal service] -->|trusts corp root| VR
    APP -->|connects with| VL
```

| | Public PKI | Private PKI (e.g. Vault) |
|---|---|---|
| **Who trusts it** | Everyone on the internet | Only devices you configure |
| **Typical use** | Public website, public API | Internal APIs, mTLS east-west, dev/test |
| **Max leaf lifetime (2029)** | ~47 days (SC-081) | Your policy (often longer) |
| **Wildcard on public site** | Still a **leaf**, still short-lived | N/A for public trust |

---

## 5. Wildcard certs are still leaves (not a CA)

`*.example.com` covers many hostnames **in one leaf certificate**. It is **not** a permission to mint child certificates.

```mermaid
flowchart TB
    WRONG["Wrong mental model<br/>wildcard = mini-CA that mints subs"]
    RIGHT["Correct model<br/>wildcard = one leaf valid for *.example.com"]

    WRONG -.->|no| SUBS["Public-trusted sub-certs<br/>with 1-year life"]
    RIGHT --> ONE["Single cert on LB<br/>still expires on notAfter<br/>still SC-081 lifetime cap"]
```

You cannot sign new publicly trusted certs with a wildcard's private key unless that cert were explicitly a **CA certificate** (public CAs do not issue those to normal customers via ACME).

---

## 6. "Can Vault be a public intermediate?" (the FAQ)

**What people hope:**

```mermaid
flowchart LR
    PUB[DigiCert public root] --> VINT[Vault as public intermediate]
    VINT --> L1[1-year public cert]
    VINT --> L2[1-year public cert]
    VINT --> L3[1-year public cert]
```

**What actually happens for almost all organisations:**

```mermaid
flowchart TB
    subgraph usual["Normal Vault + public CA"]
        ACME[Vault PKI External CA / ACME]
        ACME -->|requests| PLEAF[Public leaf from DigiCert<br/>~47 days max in 2029]
        PLEAF --> LB[Deploy to LB / ingress]
    end

    subgraph internal["Separate: Vault private PKI"]
        VROOT[Vault root / intermediate]
        VROOT --> ILEAF[Internal leaf<br/>longer TTL OK]
    end
```

| Question | Answer |
|---|---|
| Can Vault PKI issue certificates? | Yes, as **private** CA |
| Does ACME make Vault a public intermediate? | **No.** ACME returns **leaf** certs only |
| Could we get a public sub-CA cert into Vault? | Theoretically for a tiny number of enterprises; **not** standard; heavy audit |
| If we had a public sub-CA in Vault, can we issue 1-year **public** leaves? | **No.** SC-081 caps **subscriber certificate** lifetime regardless of who signs |
| What should we do? | Automate **short public leaf** renewal; use **private PKI** for internal long-lived certs |

---

## 7. Split termination (pattern that actually works)

Common in banks and large enterprises:

```mermaid
flowchart LR
    USER[Internet user]
    PUB[Public leaf cert<br/>DigiCert / LE<br/>short life SC-081]
    LB[Load balancer / CDN]
    PRIV[Private leaf cert<br/>Vault PKI<br/>longer life OK]
    APP[App servers]

    USER -->|TLS 1| PUB
    PUB --> LB
    LB -->|TLS 2 internal| PRIV
    PRIV --> APP
```

- **Public cert** on the edge: must follow SC-081
- **Private cert** behind the edge: your rules
- You are **not** bypassing SC-081; you are using two trust domains for two audiences

---

## 8. Where Vault sits (three common patterns)

```mermaid
flowchart TB
    subgraph p1["Pattern 1: Vault private CA only"]
        V1[Vault PKI issues internal certs]
        V1 --> I1[Internal services]
    end

    subgraph p2["Pattern 2: Vault orchestrates public CA"]
        V2[Vault External CA / Agent ACME]
        V2 -->|order leaf| CA2[DigiCert / Sectigo / LE]
        CA2 --> L2[Public leaf]
        L2 --> E2[LB / ingress]
    end

    subgraph p3["Pattern 3: Shadow certs (the gap)"]
        SH[DigiCert cert on ALB<br/>issued outside Vault]
        SH --> E3[LB]
        V3[Vault] -.->|does not see| SH
    end
```

| Pattern | Vault role | SC-081 on public cert? |
|---|---|---|
| Private CA | Issues and renews internal certs | N/A (internal) |
| External CA / ACME | Automates public **leaf** issue/renew | **Yes** |
| Shadow cert | No visibility until discovery plugin finds it | **Yes**, and easy to miss |

The CLM discovery plugin targets **Pattern 3**: certs in use that Vault did not issue.

---

## 9. Renewal in plain terms

**Renewal** = get a **new** leaf cert (new `notAfter`) and **deploy** it before the old one expires.

```mermaid
flowchart LR
    OLD[Old leaf<br/>expires 15 May]
    NEW[New leaf<br/>valid 15 May → 1 Jul]
    DEP[Deploy to LB]
    VER[Verify TLS]

    OLD -->|before expiry| NEW
    NEW --> DEP --> VER
```

SC-081 means you do this **~8 times per year per public cert** by 2029, not once a year.

Failure modes:

| Failure | Result |
|---|---|
| Forgot to renew | Leaf expires → TLS fails |
| Renewed at CA but not deployed | Old expired cert still on LB → TLS fails |
| DCV / domain validation failed | No new cert issued → old expires → TLS fails |
| Cert not in inventory | Nobody owns renewal → TLS fails |

---

## 10. Glossary (quick reference)

| Term | Meaning |
|---|---|
| **CA** | Certificate Authority. Signs certs vouching for identities. |
| **Root CA** | Top of chain. Trusted by browsers/OS. |
| **Intermediate CA** | Signs leaf certs. Chains to root. |
| **Leaf / end-entity** | Cert on your server. What clients validate. |
| **CSR** | Certificate Signing Request. "Please sign this public key for this name." |
| **ACME** | Protocol to automate public cert issue/renew (e.g. Let's Encrypt). |
| **SC-081** | CA/B rule shortening max **public leaf** lifetime toward ~47 days by Mar 2029. |
| **Public CA** | DigiCert, Sectigo, Let's Encrypt (internet trust). |
| **Private PKI** | Your own CA (e.g. Vault PKI). Trust you control. |
| **Shadow cert** | Cert in production that your control plane (Vault) did not issue or track. |

---

## 11. Mental model checklist

Before proposing an architecture, ask:

1. **Who must trust this cert?** Internet users → public PKI. Internal services only → private PKI.
2. **Is this a leaf or a CA cert?** Almost always a **leaf** on a server.
3. **Does SC-081 apply?** Only to **publicly trusted TLS server leaves**.
4. **Where does the private key live?** LB, HSM, Vault, K8s secret, appliance?
5. **Who renews and deploys before `notAfter`?** If the answer is "someone gets a calendar reminder," SC-081 will hurt.

---

## Related reading

- [CLM research report §3.1](./certificate-lifecycle-management-research-report.md) — SC-081 timeline
- [CLM research report §6.0](./certificate-lifecycle-management-research-report.md) — Vault 2.0 and External CA
- [CLM research report §6.4](./certificate-lifecycle-management-research-report.md) — public vs internal TLS positioning
- [CA/B Forum SC-081v3](https://cabforum.org/2025/04/11/ballot-sc081v3-introduce-schedule-of-reducing-validity-and-data-reuse-periods/)
- [Vault PKI docs](https://developer.hashicorp.com/vault/docs/secrets/pki)
- [Vault PKI External CA docs](https://developer.hashicorp.com/vault/docs/secrets/pki-external-ca)
