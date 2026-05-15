# isproxy

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![No Auth](https://img.shields.io/badge/API-no--auth-16a34a)

Free proxy and privacy-origin lookup UI for `isproxy.org`.

This frontend is the browser-facing sibling to `isbadip`, but the result model is different:

- Tor exit detection
- open proxy detection
- VPN / datacenter / hosting classification
- heuristic residential-proxy suspicion
- honeypot observation visibility

The backend is currently served by the shared public API host and selected in request mode:

- `GET https://api.isbadip.com/api/v1/host/{query}?mode=proxy`
- header: `x-isproxy-service: 1`

## Status

- frontend is ready
- API path is live
- `isproxy.org` / `api.isproxy.org` DNS is not yet delegated

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Configuration

Optional `.env`:

```bash
VITE_API_BASE_URL=https://api.isbadip.com
```

## Notes

- Free and open-source data only
- No commercial enrichment APIs
- Residential proxy detection is heuristic, not authoritative

## Author

Built by Karl — [karl.fail](https://karl.fail)

## License

MIT
