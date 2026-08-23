'use client';
import { useEffect, useState } from 'react';
import { useActuarialQuote } from '@/app/hooks/useActuarialQuote';
import { fetchCatalogModels, fetchCatalogOptions } from '@/app/lib/api-client';
import { EVModel, CatalogOptions } from '@/app/types/quote';

import { ModeSwitcher } from '@/app/components/calculator/ModeSwitcher';
import { ManualFactorForm } from '@/app/components/calculator/ManualFactorForm';
import { AutoMapSelector } from '@/app/components/calculator/AutoMapSelector';
import { HybridSelector } from '@/app/components/calculator/HybridSelector';
import { ProductTierCards } from '@/app/components/calculator/ProductTierCards';
import { RiderToggles } from '@/app/components/calculator/RiderToggles';
import { PremiumSummary } from '@/app/components/calculator/PremiumSummary';
import { ActuarialStepper } from '@/app/components/breakdown/ActuarialStepper';

export default function QuotePage() {
  const {
    inputMode, setInputMode,
    form, updateField, applyEVModel, toggleRider, setTierMode,
    quote, loading, error, submitQuote, resetForm
  } = useActuarialQuote();

  const [models, setModels] = useState<EVModel[]>([]);
  const [options, setOptions] = useState<CatalogOptions | null>(null);

  useEffect(() => {
    fetchCatalogModels().then(setModels).catch(console.error);
    fetchCatalogOptions().then(setOptions).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            VoltVision Pricing Engine
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/" className="text-slate-600 hover:text-slate-900">Home</a>
            <a href="/admin" className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-100">Admin Metrics</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">1. Vehicle & Risk Rating</h2>
              <ModeSwitcher mode={inputMode} onChange={setInputMode} />
              <div className="mt-6">
                {inputMode === 'manual' && <ManualFactorForm form={form} updateField={updateField} options={options} />}
                {inputMode === 'auto' && <AutoMapSelector form={form} models={models} options={options} applyEVModel={applyEVModel} updateField={updateField} />}
                {inputMode === 'hybrid' && <HybridSelector form={form} models={models} options={options} applyEVModel={applyEVModel} updateField={updateField} />}
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6">2. Commercial Packaging</h2>
              <ProductTierCards 
                tierMode={form.tier_mode} 
                setTierMode={setTierMode}
              />
              {form.tier_mode === 'basic' && (
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <RiderToggles selectedRiders={form.selected_riders} toggleRider={toggleRider} />
                </div>
              )}
            </section>
            
            {quote && (
              <div className="hidden lg:block">
                <ActuarialStepper quote={quote} />
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <PremiumSummary 
              quote={quote} 
              loading={loading} 
              error={error} 
              onSubmit={submitQuote} 
              onReset={resetForm} 
            />
            {quote && (
              <div className="lg:hidden mt-8">
                <ActuarialStepper quote={quote} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
