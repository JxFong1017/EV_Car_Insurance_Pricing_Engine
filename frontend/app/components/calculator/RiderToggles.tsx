'use client';
import { RiderId } from '@/app/types/quote';
import { cn } from '@/app/lib/utils';
import { Bus, ShieldAlert, Lock } from 'lucide-react';

interface Props {
  selectedRiders: RiderId[];
  toggleRider: (r: RiderId) => void;
}

export function RiderToggles({ selectedRiders, toggleRider }: Props) {
  const riders = [
    { id: 'ncd_shield' as RiderId, name: 'NCD Shield / Step-Down Protector', price: '+10% base gross', icon: ShieldAlert, desc: 'Applies a 1.1000 base multiplier' },
    { id: 'cyber' as RiderId, name: 'Cyber Security V2G Rider', price: '+10% base gross', icon: Lock, desc: 'Applies a 1.1000 base multiplier' },
    { id: 'mobility' as RiderId, name: 'Battery Downtime Mobility Allowance', price: 'RM 223.92', icon: Bus, desc: 'Flat premium (RM 4,000 limit)' },
  ];

  return (
    <div className="space-y-4 animate-slide-up">
      <h3 className="text-lg font-semibold text-slate-900">A La Carte Riders</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {riders.map(r => {
          const Icon = r.icon;
          const isSelected = selectedRiders.includes(r.id);
          return (
            <label
              key={r.id}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-slate-50',
                isSelected ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 bg-white'
              )}
            >
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                checked={isSelected}
                onChange={() => toggleRider(r.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                  <Icon className="h-4 w-4 text-slate-500" />
                  {r.name}
                </div>
                <div className="text-xs font-medium text-emerald-600 mt-0.5">{r.price}</div>
                <div className="text-xs text-slate-500 mt-1 leading-tight">{r.desc}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
