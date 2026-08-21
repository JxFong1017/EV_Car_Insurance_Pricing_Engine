'use client';
import { RiderId } from '@/app/types/quote';
import { cn } from '@/app/lib/utils';
import { Plug, Link, Bus, Waves, ShieldAlert, Lock } from 'lucide-react';

interface Props {
  selectedRiders: RiderId[];
  toggleRider: (r: RiderId) => void;
}

export function RiderToggles({ selectedRiders, toggleRider }: Props) {
  const riders = [
    { id: 'wall_charger' as RiderId, name: 'Wall Charger Cover', price: 'RM 33.80', icon: Plug, desc: 'Damage or theft of home wallbox' },
    { id: 'cable' as RiderId, name: 'Cable Theft Cover', price: 'RM 150.00', icon: Link, desc: 'Public charging cable replacement' },
    { id: 'mobility' as RiderId, name: 'Downtime Mobility', price: 'RM 341.77', icon: Bus, desc: 'Rental car for battery repair downtime' },
    { id: 'flood' as RiderId, name: 'Flood Cash Allowance', price: 'RM 42.48', icon: Waves, desc: 'Lump sum on flood total loss' },
    { id: 'ncd_shield' as RiderId, name: 'NCD Shield', price: '+10% loading', icon: ShieldAlert, desc: 'Protects NCD for 1 at-fault claim' },
    { id: 'cyber' as RiderId, name: 'Cyber V2G Rider', price: '+10% loading', icon: Lock, desc: 'Hacking & remote bricking protection' },
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
