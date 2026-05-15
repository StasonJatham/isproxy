import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import CodeBlock from '@/components/CodeBlock';
import { TerminalIcon, InfoIcon } from '@/components/icons';

interface ApiDocsProps {
  host?: string;
}

const ApiDocs: React.FC<ApiDocsProps> = ({ host }) => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: curlRef, isVisible: curlVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: pythonRef, isVisible: pythonVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: jsRef, isVisible: jsVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: responseRef, isVisible: responseVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: refTableRef, isVisible: refTableVisible } = useScrollReveal<HTMLDivElement>();

  const exampleHost = host?.trim() || '185.220.101.1';
  const exampleDomain = host?.trim() || 'google.com';

  const curlCode = `curl "https://api.isproxy.org/api/v1/host/${exampleHost}"`;

  const pythonCode = `import requests

response = requests.get("https://api.isproxy.org/api/v1/host/${exampleHost}")
result = response.json()
print(result["privacy"]["detected"])
print(result["privacy"]["primaryCategory"])`;

  const jsCode = `const lookupProxy = async (query) => {
  const res = await fetch(\`https://api.isproxy.org/api/v1/host/\${encodeURIComponent(query)}\`);
  return await res.json();
};

const result = await lookupProxy("${exampleDomain}");
console.log(result.privacy.primaryCategory);`;

  const responseCode = `{
  "query": "${exampleHost}",
  "type": "ip",
  "valid": true,
  "geo": {
    "country": "DE",
    "city": "Brandenburg an der Havel"
  },
  "privacy": {
    "detected": true,
    "confidence": "high",
    "confidenceReason": "Matched authoritative Tor exit data.",
    "primaryCategory": "tor",
    "classificationBasis": "feed",
    "categories": ["tor"],
    "reasons": ["Matched official/public Tor exit data"],
    "summary": "Matched official/public Tor exit infrastructure.",
    "observationCount": 0,
    "asn": 60729,
    "asnOrg": "TORSERVERS-NET",
    "matchedSources": {
      "count": 2,
      "top": ["tor_exit_addresses", "onionoo_running_exits"],
      "categories": ["tor"]
    },
    "evidence": {
      "feedMatches": {
        "count": 2,
        "top": ["tor_exit_addresses", "onionoo_running_exits"],
        "categories": ["tor"]
      },
      "baitHostsHit": { "count": 0, "top": [] },
      "highSignalPathsHit": { "count": 0, "top": [], "weightedScore": 0, "windowHours": 72 },
      "loginPostCount": 0,
      "sensorTypes": [],
      "eventCounts": {}
    },
    "honeypotSeen": false
  },
  "freshness": {
    "lastEvaluatedAt": "2026-05-15T10:00:00Z",
    "cacheAgeSeconds": 12,
    "cached": true
  }
}`;

  const scrollRevealClass = (visible: boolean) =>
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]';

  return (
    <section
      id="api-docs"
      className="w-full max-w-[720px] mx-auto px-5 sm:px-6 pt-24 sm:pt-32 md:pt-[120px] pb-16"
      aria-labelledby="api-docs-heading"
    >
      <div
        ref={headerRef}
        className={`text-center mb-12 sm:mb-16 transition-all duration-500 ease-out ${scrollRevealClass(headerVisible)}`}
      >
        <div className="inline-flex items-center gap-2 text-accent-blue mb-4">
          <TerminalIcon size={16} />
          <span className="text-sm font-medium">API Reference</span>
        </div>
        <h2
          id="api-docs-heading"
          className="text-2xl sm:text-3xl md:text-[32px] font-medium text-text-primary tracking-tight mb-3"
          style={{ lineHeight: 1.25 }}
        >
          Query proxy intelligence from your own tools
        </h2>
        <p className="text-text-secondary text-base sm:text-lg max-w-md mx-auto">
          Free and open-source data only. Residential proxy detection is confidence-based and heuristic.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-10">
        <div
          ref={curlRef}
          className={`transition-all duration-500 ease-out ${scrollRevealClass(curlVisible)}`}
          style={{ transitionDelay: '80ms' }}
        >
          <CodeBlock code={curlCode} label="cURL" />
        </div>

        <div
          ref={pythonRef}
          className={`transition-all duration-500 ease-out ${scrollRevealClass(pythonVisible)}`}
          style={{ transitionDelay: '80ms' }}
        >
          <CodeBlock code={pythonCode} label="Python" />
        </div>

        <div
          ref={jsRef}
          className={`transition-all duration-500 ease-out ${scrollRevealClass(jsVisible)}`}
          style={{ transitionDelay: '80ms' }}
        >
          <CodeBlock code={jsCode} label="JavaScript" />
        </div>

        <div
          ref={responseRef}
          className={`transition-all duration-500 ease-out ${scrollRevealClass(responseVisible)}`}
          style={{ transitionDelay: '80ms' }}
        >
          <CodeBlock code={responseCode} label="Response JSON" />
        </div>
      </div>

      <div
        ref={refTableRef}
        className={`mt-12 sm:mt-16 transition-all duration-500 ease-out ${scrollRevealClass(refTableVisible)}`}
        style={{ transitionDelay: '80ms' }}
      >
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-2 text-text-secondary mb-5">
            <InfoIcon size={16} />
            <h3 className="text-sm font-medium uppercase tracking-wide">Endpoint Reference</h3>
          </div>

          <div className="hidden sm:block overflow-x-auto" role="region" aria-label="API endpoint reference">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th scope="col" className="text-left py-2.5 pr-4 text-text-muted font-medium">Property</th>
                  <th scope="col" className="text-left py-2.5 pr-4 text-text-muted font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4 text-text-secondary font-medium">Endpoint</td>
                  <td className="py-3 pr-4 font-mono text-accent-blue">GET /api/v1/host/:query</td>
                </tr>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4 text-text-secondary font-medium">Header</td>
                  <td className="py-3 pr-4 font-mono text-text-primary">None</td>
                </tr>
                <tr className="border-b border-border-subtle/50">
                  <td className="py-3 pr-4 text-text-secondary font-medium">Parameter</td>
                  <td className="py-3 pr-4 font-mono text-text-primary">
                    <span className="text-code-key">:query</span>
                    <span className="text-text-muted mx-2">—</span>
                    <span className="text-text-secondary">path segment, required</span>
                    <p className="text-text-muted text-xs mt-1">IP address or domain to inspect</p>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-text-secondary font-medium">Response</td>
                  <td className="py-3 pr-4 font-mono text-success-green">200 OK</td>
                </tr>
              </tbody>
            </table>
          </div>

          <dl className="sm:hidden space-y-4">
            <div>
              <dt className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Endpoint</dt>
              <dd className="font-mono text-accent-blue text-sm">GET /api/v1/host/:query</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Header</dt>
              <dd className="font-mono text-text-primary text-sm">None</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Parameter</dt>
              <dd className="font-mono text-sm">
                <span className="text-code-key">:query</span>
                <span className="text-text-muted mx-1.5">—</span>
                <span className="text-text-secondary">path segment, required</span>
                <p className="text-text-muted text-xs mt-1">IP address or domain to inspect</p>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted font-medium uppercase tracking-wide mb-1">Response</dt>
              <dd className="font-mono text-success-green text-sm">200 OK</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ApiDocs;
