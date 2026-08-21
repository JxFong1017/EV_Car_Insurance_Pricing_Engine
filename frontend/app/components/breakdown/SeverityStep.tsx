'use client';
import { SeverityBreakdown } from '@/app/types/quote';
import { formatRM, cn } from '@/app/lib/utils';

interface Props {
  breakdown: SeverityBreakdown;
}

export function SeverityStep({ breakdown }: Props) {
  const multipliers = [
    { label: 'Battery Multiplier', value: breakdown.battery_multiplier },
    { label: 'Flood Index (Territory × Clearance)', value: breakdown.flood_multiplier },
    { label: 'State of Health', value: breakdown.soh_multiplier },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-slate-900">Mixture Components</h4>
        <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
          <span className="text-slate-600">Partial Loss Expected Value</span>
          <span className="font-mono text-slate-900">{formatRM(breakdown.partial_loss_component)}</span>
        </div>
        <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
          <span className="text-slate-600">Total Loss Expected Value</span>
          <span className="font-mono text-slate-900">{formatRM(breakdown.total_loss_component)}</span>
        </div>
        <div className="flex justify-between items-center text-sm p-2 font-semibold border-t">
          <span className="text-slate-900">Base Severity Mixture</span>
          <span className="font-mono text-slate-900">{formatRM(breakdown.base_severity_mixture)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm text-slate-900">Risk Multipliers</h4>
        <div className="space-y-2">
          {multipliers.map(m => {
            const width = Math.min(Math.max((m.value / 2) * 100, 5), 100);
            return (
              <div key={m.label} className="text-sm">
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>{m.label}</span>
                  <span className="font-mono">{m.value.toFixed(2)}x</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', m.value > 1 ? 'bg-amber-400' : m.value < 1 ? 'bg-emerald-400' : 'bg-slate-300')}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg font-bold">
        <span className="text-emerald-900">Final Expected Severity</span>
        <span className="font-mono text-emerald-700 text-lg">{formatRM(breakdown.exp_severity)}</span>
      </div>
    </div>
  );
}
