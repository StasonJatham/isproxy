# isproxy.org

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fisproxy.org&label=website)](https://isproxy.org)
[![API](https://img.shields.io/website?url=https%3A%2F%2Fapi.isproxy.org%2Fapi%2Fv1%2Fhost%2F1.1.1.1&label=api)](https://api.isproxy.org/api/v1/host/1.1.1.1)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Free API](https://img.shields.io/badge/API-free-16a34a)

Free proxy, VPN, Tor, hosting, and residential-proxy lookup for security teams, scripts, and infrastructure triage. `isproxy.org` combines open-source proxy intelligence with local honeypot telemetry to answer a simple question: what kind of network is this IP really coming from?

![isproxy.org social preview](https://isproxy.org/og-image.jpg)

No tracking. No account. No API key.

## Live Service

- Website: [https://isproxy.org](https://isproxy.org)
- Public API: [https://api.isproxy.org/api/v1/host/1.1.1.1](https://api.isproxy.org/api/v1/host/1.1.1.1)

## What It Checks

`isproxy.org` classifies IPs and hostnames into one primary category:

- `tor`
- `open_proxy`
- `vpn_or_datacenter`
- `hosting`
- `suspected_residential_proxy`
- `unknown`

The result also includes confidence, summary text, reasons, ASN context, reverse DNS, matched source data, and honeypot-derived evidence where relevant.

## How It Works

`isproxy.org` uses two layers of evidence.

### 1. Open proxy and network-origin data

The backend checks IPs against:

- official Tor exit data
- public open-proxy feeds
- free VPN and datacenter ranges
- local ASN and geo databases

If an IP has strong feed or range evidence, it is classified immediately.

### 2. Honeypot behavior

The system also uses local telemetry:

- Cowrie SSH and Telnet honeypot events
- Cloudflare edge honeypot events from bait subdomains such as `login`, `auth`, `gitlab`, `cpanel`, and `owa`
- selected origin-side fallback traps for residual traffic

This matters most for residential proxy detection. The core heuristic is:

> residential-looking IP + bot-like honeypot behavior = suspected residential proxy

That classification is intentionally heuristic and confidence-based, not absolute.

## Public API

```text
GET https://api.isproxy.org/api/v1/host/{ip-or-domain}
```

Example:

```bash
curl -s https://api.isproxy.org/api/v1/host/1.1.1.1 | jq
```

Example response shape:

```json
{
  "query": "1.1.1.1",
  "type": "ip",
  "valid": true,
  "privacy": {
    "detected": false,
    "primaryCategory": "unknown",
    "confidence": null,
    "summary": "No Tor, open-proxy, VPN/datacenter, hosting, or repeated honeypot behavior signal found."
  }
}
```

## Frontend

This repository contains the public frontend for `isproxy.org`.

- Framework: React 19
- Build tool: Vite 8
- Language: TypeScript
- Deployment target: Cloudflare Pages

The backend API is served separately at [https://api.isproxy.org](https://api.isproxy.org).

The UI is intentionally minimal:

- enter IP or hostname
- get result

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Optional environment variable:

```bash
VITE_API_BASE_URL=https://api.isproxy.org
```

## Deployment

Recommended Cloudflare Pages settings:

- Framework preset: `React (Vite)`
- Build command: `npm run build`
- Build output directory: `dist`

Required environment variable:

```bash
VITE_API_BASE_URL=https://api.isproxy.org
```

## Data Policy

- free and open-source data only
- no commercial enrichment APIs
- local-first enrichment where possible
- residential proxy detection is heuristic

## Related Services

- [isbadip.com](https://isbadip.com) — malicious IP and domain reputation lookup
- [is-windows-broken.com](https://is-windows-broken.com) — Windows patch and release-health rollout monitor

## Author

Built by Karl — [karl.fail](https://karl.fail) · [karlcom.de](https://karlcom.de)

## License

MIT
