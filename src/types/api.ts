export interface ReputationResult {
  query: string;
  detected: boolean;
  score: number;
  primaryCategory: string;
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
  primaryCategory: 'tor' | 'open_proxy' | 'vpn_or_datacenter' | 'hosting' | 'suspected_residential_proxy' | 'unknown';
  categories?: string[];
  reasons?: string[];
  firstSeen?: string | null;
  lastSeen?: string | null;
  observationCount?: number | null;
  asn?: number | null;
  asnOrg?: string | null;
  rdns?: string | null;
  sourceTypes?: string[];
  honeypotSeen?: boolean;
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
  cacheExpires?: string;
  error?: string;
}
