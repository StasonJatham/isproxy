# isbadip

Free IP and domain reputation lookup — [isbadip.com](https://isbadip.com)

A small, privacy-respecting web app that checks whether an IPv4 address or hostname appears on public threat-intelligence lists. No tracking, no account, no API key.

## Live

- Web: <https://isbadip.com>
- API: <https://api.isbadip.com/api/v1/host/{ip-or-domain}>

```bash
curl https://api.isbadip.com/api/v1/host/8.8.8.8
```

## Data freshness

Threat intelligence lists are refreshed **daily** from multiple public sources. The database is rebuilt automatically every night so results always reflect the latest known malicious IPs and domains.

In addition to public feeds, the database includes **custom IP and domain lists** populated from Karl's own IPS/IDS alerts and webapp attack logs. Hosts that actively probe or attack his infrastructure get added automatically and are included in every lookup.

## Stack

- React 19 + Vite 8 + TypeScript 6
- Tailwind CSS 3 + shadcn/ui
- Deployed as a static site on Cloudflare Pages

## Develop

```bash
npm install
npm run dev      # http://localhost:3000  (proxies /api -> api.isbadip.com)
npm run build    # output: ./dist
npm run preview
```

## Configuration

Optional `.env` (or `.env.local`):

```
VITE_API_BASE_URL=https://api.isbadip.com
```

If unset, production builds default to `https://api.isbadip.com` and dev uses the Vite proxy.

## Author

Built by Karl — [karl.fail](https://karl.fail) · [karlcom.de](https://karlcom.de)

## License

MIT
