'use client';
import { Home, Building, Zap, Shield, Check } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { TierMode } from '@/app/types/quote';

interface Props {
  tierMode: TierMode;
  setTierMode: (mode: TierMode) => void;
  smartGridEnrolled: boolean;
  setSmartGrid: (v: boolean) => void;
}

export function ProductTierCards({ tierMode, setTierMode, smartGridEnrolled, setSmartGrid }: Props) {
  const tiers = [
    {
      id: '1' as TierMode,
      name: 'Tier 1 — Condo Dweller',
      price: '+ RM 95',
      icon: Home,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      activeBorder: 'border-sky-500 ring-1 ring-sky-500',
      features: ['Cable Theft Cover', 'Public Charger TPL', '24hr Battery Towing'],
      hasSmartGrid: true,
    },
    {
      id: '2' as TierMode,
      name: 'Tier 2 — Landed Homeowner',
      price: '+ RM 150',
      icon: Building,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      border: 'border-violet-200',
      activeBorder: 'border-violet-500 ring-1 ring-violet-500',
      features: ['Tier 1 Benefits', 'Wall Charger Physical', 'Wall Charger Liability', 'Collateral Fire'],
    },
    {
      id: '3' as TierMode,
      name: 'Tier 3 — EV Pluss',
      price: '+10% + Mobility',
      icon: Zap,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-500 ring-1 ring-emerald-500',
      features: ['Full ecosystem', 'NCD Shield', 'Cyber V2G', 'Downtime Mobility', 'Pest & Tire Hazard'],
      badge: 'BEST VALUE',
    },
    {
      id: 'basic' as TierMode,
      name: 'Basic Only',
      price: 'Base Price',
      icon: Shield,
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      activeBorder: 'border-slate-500 ring-1 ring-slate-500',
      features: ['Basic comprehensive only'],
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Select Commercial Tier</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tiers.map(t => {
          const Icon = t.icon;
          const isActive = tierMode === t.id;
          return (
            <div key={t.id} className="relative flex flex-col">
              <button
                type="button"
                onClick={() => setTierMode(t.id)}
                className={cn(
                  'flex-1 text-left relative flex flex-col p-4 rounded-xl border bg-white shadow-sm transition-all hover:shadow-md',
                  isActive ? t.activeBorder : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {t.badge && (
                  <span className="absolute -top-2.5 right-4 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    {t.badge}
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('p-2 rounded-lg', t.bg)}>
                    <Icon className={cn('h-5 w-5', t.color)} />
                  </div>
                  {isActive && <Check className={cn('h-5 w-5', t.color)} />}
                </div>
                <h4 className="font-semibold text-slate-900">{t.name}</h4>
                <p className="text-sm font-medium text-slate-500 mb-3">{t.price}</p>
                <ul className="mt-auto space-y-1.5">
                  {t.features.map(f => (
                    <li key={f} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <div className="mt-0.5 h-1 w-1 rounded-full bg-slate-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
              {t.hasSmartGrid && isActive && (
                <div className="mt-3 p-3 rounded-lg bg-sky-50 border border-sky-100 animate-slide-up">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smartGridEnrolled}
                      onChange={e => setSmartGrid(e.target.checked)}
                      className="rounded text-sky-500 focus:ring-sky-500"
                    />
                    <span className="text-sm font-medium text-sky-900">Smart Grid Enrolled (-5%)</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
