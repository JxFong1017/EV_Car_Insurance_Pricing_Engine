'use client';
import { useState } from 'react';
import { QuoteResponse } from '@/app/types/quote';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { FrequencyStep } from './FrequencyStep';
import { SeverityStep } from './SeverityStep';
import { cn, formatRM } from '@/app/lib/utils';

interface Props {
  quote: QuoteResponse;
}

export function ActuarialStepper({ quote }: Props) {
  const [openStep, setOpenStep] = useState<number>(1);

  const steps = [
    { id: 1, title: 'Step 1: Expected Frequency (Poisson GLM)' },
    { id: 2, title: 'Step 2: Expected Severity (Mixture Model)' },
    { id: 3, title: 'Step 3: Commercial Build-Up' },
    { id: 4, title: 'Step 4: Packaging & Riders' },
  ];

  return (
    <div className="space-y-3 mt-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Actuarial Breakdown</h2>
      {steps.map((step) => {
        const isOpen = openStep === step.id;
        return (
          <div key={step.id} className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              onClick={() => setOpenStep(isOpen ? 0 : step.id)}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-slate-800">{step.title}</span>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            <div className={cn(
              'transition-all duration-300 ease-in-out',
              isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            )}>
              <div className="p-5 border-t border-slate-100">
                {step.id === 1 && <FrequencyStep breakdown={quote.frequency} />}
                {step.id === 2 && <SeverityStep breakdown={quote.severity} />}
                {step.id === 3 && (
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Pure Premium (Freq × Sev)</span>
                      <span className="font-mono">{formatRM(quote.pure_premium)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Risk Margin Loading (+{(quote.risk_margin_loading * 100).toFixed(0)}%)</span>
                      <span className="font-mono text-amber-600">+{formatRM(quote.pure_premium * quote.risk_margin_loading)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Policy Admin Fee</span>
                      <span className="font-mono text-emerald-600">+{formatRM(quote.policy_admin_fee)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Underwriting Target Denominator</span>
                      <span className="font-mono">÷ {quote.uw_denominator.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold pt-2">
                      <span>Unadjusted Gross</span>
                      <span className="font-mono">{formatRM(quote.unadjusted_gross)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed text-emerald-600">
                      <span>NCD Discount ({(quote.ncd_rate * 100).toFixed(0)}%)</span>
                      <span className="font-mono">-{formatRM(quote.ncd_discount_amount)}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-lg text-emerald-700 pt-2">
                      <span>Base Motor Gross</span>
                      <span className="font-mono">{formatRM(quote.base_motor_gross)}</span>
                    </div>
                  </div>
                )}
                {step.id === 4 && (
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900 mb-2">Package: {quote.packaging.tier_name}</div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span>Tier Loading Factor</span>
                      <span className="font-mono">× {quote.packaging.tier_loading_factor.toFixed(2)}</span>
                    </div>
                    {quote.packaging.smart_grid_discount < 1.0 && (
                      <div className="flex justify-between py-1 border-b border-dashed text-emerald-600">
                        <span>Smart Grid Discount (-5%)</span>
                        <span className="font-mono">-{formatRM(quote.base_motor_gross * (1 - quote.packaging.smart_grid_discount))}</span>
                      </div>
                    )}
                    {quote.packaging.rider_items.map(r => (
                      <div key={r.label} className="flex justify-between py-1 border-b border-dashed text-slate-500">
                        <span>+ {r.label}</span>
                        <span className="font-mono">{formatRM(r.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-1 font-bold text-lg text-emerald-700 pt-2">
                      <span>Final Package Premium</span>
                      <span className="font-mono">{formatRM(quote.packaging.package_premium)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
