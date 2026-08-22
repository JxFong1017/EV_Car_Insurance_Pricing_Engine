const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchQuote(payload: import('@/app/types/quote').QuoteRequest): Promise<import('@/app/types/quote').QuoteResponse> {
  const res = await fetch(`${API_BASE}/api/v1/quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchCatalogModels(): Promise<import('@/app/types/quote').EVModel[]> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/models`);
  if (!res.ok) throw new Error('Failed to fetch catalog');
  return res.json();
}

export async function fetchCatalogOptions(): Promise<import('@/app/types/quote').CatalogOptions> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/options`);
  if (!res.ok) throw new Error('Failed to fetch options');
  return res.json();
}

export async function fetchICPreset(ic: string): Promise<{ found: boolean; data?: { age: number; age_cat: string; ncd_str: string; label: string }; defaults?: object }> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/ic/${encodeURIComponent(ic)}`);
  return res.json();
}

export async function fetchPlatePreset(plate: string): Promise<{ found: boolean; data?: { state: string; veh_age_cat: string; soh_cat: string; label: string }; defaults?: object }> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/plate/${encodeURIComponent(plate)}`);
  return res.json();
}

export async function fetchAdminConfig(): Promise<import('@/app/types/quote').AdminConfig> {
  const res = await fetch(`${API_BASE}/api/v1/admin/config`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to fetch admin config');
  }
  return res.json();
}

export async function saveAdminGlobalConfig(payload: Record<string, number>): Promise<import('@/app/types/quote').AdminConfig> {
  const res = await fetch(`${API_BASE}/api/v1/admin/config/global`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to save global config');
  }
  return res.json();
}

export async function saveFactorConfig(factorName: string, payload: Record<string, number>): Promise<{ [key: string]: Record<string, number> }> {
  const res = await fetch(`${API_BASE}/api/v1/admin/config/factors/${encodeURIComponent(factorName)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to save factor config');
  }
  return res.json();
}
