'use client';
import { useState, useCallback } from 'react';
import type { QuoteRequest, QuoteResponse, TierMode, RiderId, CatalogOptions, EVModel } from '@/app/types/quote';
import { fetchQuote } from '@/app/lib/api-client';

type InputMode = 'manual' | 'auto' | 'hybrid';

const DEFAULT_FORM: QuoteRequest = {
  sum_insured: 150000,
  power_cat: '1. Urban / Commuter (<150 kW)',
  capacity_cat: '1. Standard Pack (<60 kWh)',
  clearance_cat: '2. Sedan / Hatchback (140-170mm)',
  brand_cat: '1. Mass Market / Standard (BYD, Chery, GWM, Neta, MG)',
  adas_cat: '1. Standard / Level 0-1 (No Active AEB)',
  age_cat: '3. 31-40 years',
  ncd_str: '0%',
  veh_age_cat: '1. 0-1 years',
  state: 'Kuala Lumpur',
  soh_cat: '2. Base (70-85% SoH)',
  tier_mode: 'basic',
  selected_riders: [],
  smart_grid_enrolled: false,
  model_name: 'Custom Configuration',
};

export function useActuarialQuote() {
  const [inputMode, setInputMode] = useState<InputMode>('manual');
  const [form, setForm] = useState<QuoteRequest>(DEFAULT_FORM);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof QuoteRequest>(key: K, value: QuoteRequest[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const applyEVModel = useCallback((model: EVModel) => {
    setForm(prev => ({
      ...prev,
      power_cat: model.power_cat,
      capacity_cat: model.capacity_cat,
      clearance_cat: model.clearance_cat,
      brand_cat: model.brand_cat,
      adas_cat: model.adas_cat,
      sum_insured: model.default_si,
      model_name: model.model_name,
    }));
  }, []);

  const toggleRider = useCallback((rider: RiderId) => {
    setForm(prev => ({
      ...prev,
      selected_riders: prev.selected_riders.includes(rider)
        ? prev.selected_riders.filter(r => r !== rider)
        : [...prev.selected_riders, rider],
    }));
  }, []);

  const setTierMode = useCallback((mode: TierMode) => {
    setForm(prev => ({ ...prev, tier_mode: mode, selected_riders: [] }));
  }, []);

  const submitQuote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchQuote(form);
      setQuote(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to calculate quote');
    } finally {
      setLoading(false);
    }
  }, [form]);

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM);
    setQuote(null);
    setError(null);
  }, []);

  return {
    inputMode, setInputMode,
    form, updateField, applyEVModel, toggleRider, setTierMode,
    quote, loading, error,
    submitQuote, resetForm,
  };
}
