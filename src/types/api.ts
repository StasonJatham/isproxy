export interface ReputationResult {
  query: string;
  bad: boolean;
  score: number;
  categories?: string[];
  checked_at?: string;
  details?: Record<string, string | number | boolean | null>;
}

export type ApiStatus = 'idle' | 'loading' | 'warming_up' | 'success' | 'error';

export interface ApiError {
  message: string;
  code?: number;
}

export interface HostApiThreat {
  categories?: string[];
  sources?: string[];
  matchType?: string;
}

export interface HostApiGeo {
  country?: string | null;
  region?: string | null;
  city?: string | null;
  timezone?: string | null;
  ll?: [number, number] | number[] | null;
  eu?: boolean | null;
}

export interface HostApiTop1m {
  rank?: number | null;
  source?: string | null;
}

export interface HostApiResponse {
  query: string;
  type: 'ip' | 'domain' | 'unknown';
  valid: boolean;
  malicious: boolean;
  confidence?: 'low' | 'medium' | 'high' | null;
  threat?: HostApiThreat | null;
  geo?: HostApiGeo | null;
  top1m?: HostApiTop1m | number | null;
  resolvedIPs?: string[];
  hostnames?: string[];
  ip_threats?: HostApiThreat[];
  domain_threats?: HostApiThreat[];
  cached?: boolean;
  listUpdated?: string;
  domListUpdated?: string;
  top1mUpdated?: string;
  cacheExpires?: string;
  error?: string;
}
