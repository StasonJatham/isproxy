# isproxy

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![API](https://img.shields.io/badge/API-public-16a34a)

`isproxy.org` is a simple proxy and privacy-origin lookup service.

Enter an IP address or hostname and get a clear answer about whether the traffic looks like:
- Tor
- an open proxy
- a VPN or datacenter address
- hosting infrastructure
- a suspected residential proxy

The goal is straightforward: make it easy to check where suspicious traffic is likely coming from without forcing the user through a complicated UI.

## Live Service

- Website: [isproxy.org](https://isproxy.org)
- API: [api.isproxy.org/api/v1/host/1.1.1.1](https://api.isproxy.org/api/v1/host/1.1.1.1)

## How It Works

`isproxy` combines two kinds of evidence:

### 1. Public and local data sources

The backend checks IPs against:
- official Tor exit data
- public open-proxy feeds
- free VPN / datacenter / hosting ranges
- local ASN and geo databases

If an IP is already known from strong public evidence, it is classified immediately.

### 2. Honeypot behavior

The backend also uses your own telemetry:
- SSH/Telnet honeypot activity from Cowrie
- Cloudflare edge honeypot events from bait subdomains such as `login`, `auth`, `gitlab`, `cpanel`, and `owa`
- selected origin-side fallback traps for residual traffic

This is especially important for residential proxy detection.

The core logic is:

> residential-looking IP + bot-like honeypot behavior = suspected residential proxy

That result is intentionally heuristic. It is meant to be useful, not absolute.

## Classification Model

Results are returned in one primary category:

- `tor`
- `open_proxy`
- `vpn_or_datacenter`
- `hosting`
- `suspected_residential_proxy`
- `unknown`

The API also returns:
- confidence
- short summary
- reasons
- ASN / reverse DNS context
- matched source information
- honeypot evidence

## Example API Response

```bash
curl https://api.isproxy.org/api/v1/host/1.1.1.1
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

## Detection Notes

- `tor`, `open_proxy`, and `vpn_or_datacenter` are strong classifications backed by feed or range data.
- `suspected_residential_proxy` is behavior-based and confidence-based.
- A residential ISP IP is not labeled suspicious just because it exists. It must also show bot-like activity against the honeypot surface.

## Frontend

This repository contains the public frontend for `isproxy.org`.

The backend is served separately at:

- `https://api.isproxy.org`

The UI is intentionally minimal:
- enter IP or hostname
- get result

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Configuration

Optional local environment file:

```bash
VITE_API_BASE_URL=https://api.isproxy.org
```

## Deployment

This frontend is designed to work well with Cloudflare Pages.

Recommended settings:

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

## License

MIT
