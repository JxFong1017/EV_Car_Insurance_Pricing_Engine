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
