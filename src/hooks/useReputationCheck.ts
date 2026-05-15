import { useState, useCallback } from 'react';
import type { ReputationResult, ApiStatus, ApiError, HostApiResponse } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? '' : 'https://api.isproxy.org');

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

function buildDetails(data: HostApiResponse): Record<string, string | number | boolean | null> {
  const privacy = data.privacy;
  const resolvedIPs = data.resolvedIPs ?? [];
  const hostnames = data.hostnames ?? [];
  const categories = unique(privacy.categories ?? []);
  const matchedSources = privacy.matchedSources;
  const evidence = privacy.evidence;
  const details: Record<string, string | number | boolean | null> = {
    type: data.type,
    confidence: privacy.confidence ?? 'none',
    primary_category: privacy.primaryCategory,
    classification_basis: privacy.classificationBasis ?? 'none',
    asn: privacy.asn ?? null,
    asn_org: privacy.asnOrg ?? null,
  };

  const optionalDetails: Array<[string, string | number | boolean | null]> = [
    ['rdns', privacy.rdns ?? null],
    ['confidence_reason', privacy.confidenceReason ?? null],
    ['geo', formatLocation(data)],
    ['first_seen', privacy.firstSeen ?? null],
    ['last_seen', privacy.lastSeen ?? null],
    ['observation_count', (privacy.observationCount ?? 0) > 0 ? (privacy.observationCount ?? 0) : null],
    ['resolved_ips', resolvedIPs.length > 0 ? resolvedIPs.join(', ') : null],
    ['hostnames', hostnames.length > 0 ? hostnames.join(', ') : null],
    ['categories', categories.length > 1 ? categories.join(', ') : null],
    ['matched_sources', matchedSources && matchedSources.count > 0 ? `${matchedSources.count} (${matchedSources.top.join(', ')})` : null],
    ['matched_source_categories', matchedSources?.categories && matchedSources.categories.length > 0 ? matchedSources.categories.join(', ') : null],
    ['feed_matches', evidence?.feedMatches && evidence.feedMatches.count > 0 ? `${evidence.feedMatches.count} (${evidence.feedMatches.top.join(', ')})` : null],
    ['bait_hosts_hit', evidence?.baitHostsHit && evidence.baitHostsHit.count > 0 ? `${evidence.baitHostsHit.count} (${evidence.baitHostsHit.top.join(', ')})` : null],
    ['high_signal_paths_hit', evidence?.highSignalPathsHit && evidence.highSignalPathsHit.count > 0 ? `${evidence.highSignalPathsHit.count} (${evidence.highSignalPathsHit.top.join(', ')})` : null],
    ['recent_web_signal_weight', evidence?.highSignalPathsHit?.weightedScore ?? null],
    ['recent_web_window_hours', evidence?.highSignalPathsHit?.windowHours ?? null],
    ['login_post_count', evidence?.loginPostCount && evidence.loginPostCount > 0 ? evidence.loginPostCount : null],
    ['sensor_types', evidence?.sensorTypes && evidence.sensorTypes.length > 0 ? evidence.sensorTypes.join(', ') : null],
    ['sensor_families', evidence?.sensorFamilies && Object.keys(evidence.sensorFamilies).length > 0 ? Object.entries(evidence.sensorFamilies).map(([key, value]) => `${key}:${value}`).join(', ') : null],
    ['event_counts', evidence?.eventCounts && Object.keys(evidence.eventCounts).length > 0 ? Object.entries(evidence.eventCounts).map(([key, value]) => `${key}:${value}`).join(', ') : null],
    ['trigger_window_minutes', evidence?.highSignalPathsHit?.triggerWindowMinutes ?? null],
    ['trigger_high_signal_pairs', evidence?.highSignalPathsHit?.triggerPairCount ?? null],
    ['last_evaluated_at', data.freshness?.lastEvaluatedAt ?? null],
    ['cache_age_seconds', typeof data.freshness?.cacheAgeSeconds === 'number' ? data.freshness.cacheAgeSeconds : null],
  ];

  for (const [key, value] of optionalDetails) {
    if (value !== null && value !== '') {
      details[key] = value;
    }
  }

  return details;
}

function mapApiResponse(data: HostApiResponse): ReputationResult {
  if (!data.valid) {
    throw new Error(data.error ?? 'Input does not look like a valid IPv4 address or domain name.');
  }

  const privacy = data.privacy;
  const categories = unique(privacy.categories ?? []);

  return {
    query: data.query,
    detected: privacy.detected,
    score: confidenceScore(privacy.confidence, privacy.detected),
    primaryCategory: privacy.primaryCategory,
    summary: privacy.summary ?? null,
    confidenceReason: privacy.confidenceReason ?? null,
    classificationBasis: privacy.classificationBasis ?? null,
    categories,
    checkedAt: new Date().toISOString(),
    details: buildDetails(data),
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
        const response = await fetch(`${API_BASE_URL}/api/v1/host/${encodeURIComponent(query)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

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
