'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { fetchAdminConfig, saveAdminGlobalConfig, saveFactorConfig } from '@/app/lib/api-client';
import type { AdminConfig } from '@/app/types/quote';

const FACTOR_KEYS = [
  'POWER_RELATIVITIES',
  'DRIVER_AGE_RELATIVITIES',
  'VEHICLE_AGE_RELATIVITIES',
  'ADAS_RELATIVITIES',
  'BRAND_RELATIVITIES',
  'BATTERY_CAPACITY_RELATIVITIES',
  'FLOOD_TERRITORY_RELATIVITIES',
  'GROUND_CLEARANCE_MULTIPLIERS',
  'BATTERY_SOH_RELATIVITIES',
  'STATUTORY_NCD_RATES',
];

const GLOBAL_KEYS = [
  'BASE_FREQUENCY_LAMBDA0',
  'PARTIAL_REPAIR_M_PARTIAL',
  'TOTAL_LOSS_PROB_P_TL',
  'RISK_MARGIN',
  'POLICY_ADMIN_FEE',
  'AUDITED_UW_DENOMINATOR',
];

export default function AdminPage() {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'globals' | 'factors'>('globals');

  const factorEntries = useMemo(
    () => (config ? FACTOR_KEYS.filter((key) => key in config.factors).map((key) => ({ key, entries: Object.entries(config.factors[key]) })) : []),
    [config]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminConfig();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load admin config');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updateGlobalField = (key: string, value: string) => {
    if (!config) return;
    setConfig({
      ...config,
      global_constants: {
        ...config.global_constants,
        [key]: Number(value),
      },
    });
  };

  const updateFactorValue = (factorName: string, rowKey: string, value: string) => {
    if (!config) return;
    const nextFactorMap = { ...config.factors[factorName] };
    nextFactorMap[rowKey] = Number(value);

    setConfig({
      ...config,
      factors: {
        ...config.factors,
        [factorName]: nextFactorMap,
      },
    });
  };

  const addFactorRow = (factorName: string) => {
    if (!config) return;
    const existing = config.factors[factorName] ?? {};
    const nextKey = `New Category ${Object.keys(existing).length + 1}`;
    setConfig({
      ...config,
      factors: {
        ...config.factors,
        [factorName]: {
          ...existing,
          [nextKey]: 1.0,
        },
      },
    });
  };

  const removeFactorRow = (factorName: string, rowKey: string) => {
    if (!config) return;
    const next = { ...config.factors[factorName] };
    delete next[rowKey];
    setConfig({
      ...config,
      factors: {
        ...config.factors,
        [factorName]: next,
      },
    });
  };

  const saveGlobals = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      await saveAdminGlobalConfig(config.global_constants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save global constants');
    } finally {
      setSaving(false);
    }
  };

  const saveFactor = async (factorName: string) => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      await saveFactorConfig(factorName, config.factors[factorName]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save factor values');
    } finally {
      setSaving(false);
    }
  };

  const saveAll = async () => {
    if (!config) return;
    setSaving(true);
    setError(null);
    try {
      await saveAdminGlobalConfig(config.global_constants);
      for (const factor of FACTOR_KEYS) {
        if (config.factors[factor]) {
          await saveFactorConfig(factor, config.factors[factor]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save admin config');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-slate-600">Loading admin config…</div>;
  }

  if (!config) {
    return <div className="p-10 text-red-600">{error || 'Unable to load config'}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Admin panel</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Volt-Rated Pricing Engine</h1>
          </div>
          <Button onClick={saveAll} disabled={saving}>
            {saving ? 'Saving…' : 'Save all changes'}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2 rounded-xl bg-slate-200 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('globals')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'globals' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Global constants
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('factors')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'factors' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            Factor tables
          </button>
        </div>

        {activeTab === 'globals' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Global Constants & Base Rates</h2>
              <Button variant="secondary" onClick={saveGlobals} disabled={saving}>Save constants</Button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {GLOBAL_KEYS.map((key) => (
                <label key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <span className="mb-2 block text-sm font-medium text-slate-700">{key}</span>
                  <input
                    type="number"
                    step="any"
                    value={config.global_constants[key] ?? 0}
                    onChange={(e) => updateGlobalField(key, e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-0 focus:border-emerald-500"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'factors' && (
          <div className="space-y-6">
            {factorEntries.map(({ key, entries }) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900">{key}</h2>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => addFactorRow(key)}>Add row</Button>
                    <Button onClick={() => saveFactor(key)}>Save {key}</Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-y-2 text-left">
                    <thead>
                      <tr className="text-sm text-slate-600">
                        <th className="pb-2 pr-4 font-medium">Category</th>
                        <th className="pb-2 pr-4 font-medium">Multiplier</th>
                        <th className="pb-2 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map(([rowKey, value]) => (
                        <tr key={rowKey} className="align-top">
                          <td className="pr-4">
                            <input
                              value={rowKey}
                              onChange={(e) => {
                                if (!config) return;
                                const nextMap = { ...config.factors[key] };
                                const currentValue = nextMap[rowKey];
                                delete nextMap[rowKey];
                                nextMap[e.target.value] = currentValue;
                                setConfig({
                                  ...config,
                                  factors: { ...config.factors, [key]: nextMap },
                                });
                              }}
                              className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
                            />
                          </td>
                          <td className="pr-4">
                            <input
                              type="number"
                              step="any"
                              value={value}
                              onChange={(e) => updateFactorValue(key, rowKey, e.target.value)}
                              className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900"
                            />
                          </td>
                          <td className="text-right">
                            <Button variant="ghost" onClick={() => removeFactorRow(key, rowKey)}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
