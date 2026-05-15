import { useState, useCallback } from 'react';
import type { ReputationResult, ApiStatus, ApiError, HostApiResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '' : 'https://api.isbadip.com');

function confidenceScore(confidence: HostApiResponse['privacy']['confidence'], detected: boolean) {
  if (!detected) return 0;
  if (confidence === 'high') return 95;
  if (confidence === 'medium') return 75;
  if (confidence === 'low') return 55;
  return 65;
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function formatLocation(data: HostApiResponse) {
  const parts = [data.geo?.city, data.geo?.region, data.geo?.country].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

function mapApiResponse(data: HostApiResponse): ReputationResult {
  if (!data.valid) {
    throw new Error(data.error ?? 'Input does not look like a valid IPv4 address or domain name.');
  }

  const privacy = data.privacy;
  const resolvedIPs = data.resolvedIPs ?? [];
  const hostnames = data.hostnames ?? [];
  const categories = unique(privacy.categories ?? []);
  const reasons = unique(privacy.reasons ?? []);
  const sourceTypes = unique(privacy.sourceTypes ?? []);

  return {
    query: data.query,
    detected: privacy.detected,
    score: confidenceScore(privacy.confidence, privacy.detected),
    primaryCategory: privacy.primaryCategory,
    categories,
    checkedAt: new Date().toISOString(),
    details: {
      type: data.type,
      confidence: privacy.confidence ?? 'none',
      primary_category: privacy.primaryCategory,
      asn: privacy.asn ?? null,
      asn_org: privacy.asnOrg ?? null,
      rdns: privacy.rdns ?? null,
      source_types: sourceTypes.length > 0 ? sourceTypes.join(', ') : 'none',
      reasons: reasons.length > 0 ? reasons.join(' | ') : 'none',
      geo: formatLocation(data),
      first_seen: privacy.firstSeen ?? null,
      last_seen: privacy.lastSeen ?? null,
      observation_count: privacy.observationCount ?? 0,
      honeypot_seen: privacy.honeypotSeen ?? false,
      resolved_ips: resolvedIPs.length > 0 ? resolvedIPs.join(', ') : null,
      hostnames: hostnames.length > 0 ? hostnames.join(', ') : null,
      cached: data.cached ?? false,
    },
  };
}

export function useReputationCheck() {
  const [status, setStatus] = useState<ApiStatus>('idle');
  const [result, setResult] = useState<ReputationResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  const check = useCallback(async (query: string) => {
    setStatus('loading');
    setError(null);
    setResult(null);

    const MAX_WARMUP_RETRIES = 4;
    const RETRY_DELAY_MS = 10_000;

    for (let attempt = 0; attempt <= MAX_WARMUP_RETRIES; attempt++) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/host/${encodeURIComponent(query)}?mode=proxy`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'x-isproxy-service': '1',
            },
          }
        );

        if (response.status === 503 && attempt < MAX_WARMUP_RETRIES) {
          setStatus('warming_up');
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          setStatus('loading');
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: HostApiResponse = await response.json();
        setResult(mapApiResponse(data));
        setStatus('success');
        return;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError({ message: errorMessage });
        setStatus('error');
        return;
      }
    }

    setError({ message: 'Service is still warming up after several retries. Please try again in a moment.' });
    setStatus('error');
  }, []);

  return { check, status, result, error };
}
