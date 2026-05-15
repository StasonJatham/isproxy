export interface ReputationResult {
  query: string;
  detected: boolean;
  score: number;
  primaryCategory: string;
  summary?: string | null;
  confidenceReason?: string | null;
  classificationBasis?: string | null;
  categories?: string[];
  checkedAt?: string;
  details?: Record<string, string | number | boolean | null>;
}

export type ApiStatus = 'idle' | 'loading' | 'warming_up' | 'success' | 'error';

export interface ApiError {
  message: string;
  code?: number;
}

export interface HostApiGeo {
  country?: string | null;
  region?: string | null;
  city?: string | null;
  timezone?: string | null;
  ll?: [number, number] | number[] | null;
  eu?: boolean | null;
}

export interface HostApiPrivacy {
  detected: boolean;
  confidence?: 'low' | 'medium' | 'high' | null;
  confidenceReason?: string | null;
  primaryCategory: 'tor' | 'open_proxy' | 'vpn_or_datacenter' | 'hosting' | 'suspected_residential_proxy' | 'unknown';
  classificationBasis?: 'feed' | 'behavioral' | 'mixed' | 'none';
  categories?: string[];
  reasons?: string[];
  summary?: string | null;
  firstSeen?: string | null;
  lastSeen?: string | null;
  observationCount?: number | null;
  asn?: number | null;
  asnOrg?: string | null;
  rdns?: string | null;
  sourceTypes?: string[];
  matchedSources?: {
    count: number;
    top: string[];
    categories?: string[];
  };
  evidence?: {
    feedMatches?: {
      count: number;
      top: string[];
      categories?: string[];
    };
    baitHostsHit?: {
      count: number;
      top: string[];
    };
    highSignalPathsHit?: {
      count: number;
      top: string[];
      weightedScore?: number;
      windowHours?: number;
    };
    loginPostCount?: number;
    sensorTypes?: string[];
    eventCounts?: Record<string, number>;
  };
  honeypotSeen?: boolean;
}

export interface HostApiFreshness {
  lastEvaluatedAt?: string | null;
  cacheAgeSeconds?: number | null;
  cached?: boolean;
}

export interface HostApiResponse {
  query: string;
  type: 'ip' | 'domain' | 'unknown';
  valid: boolean;
  privacy: HostApiPrivacy;
  geo?: HostApiGeo | null;
  resolvedIPs?: string[];
  hostnames?: string[];
  cached?: boolean;
  freshness?: HostApiFreshness;
  cacheExpires?: string;
  error?: string;
}
