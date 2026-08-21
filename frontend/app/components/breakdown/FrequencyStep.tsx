'use client';
import { FrequencyBreakdown } from '@/app/types/quote';
import { formatPct, cn } from '@/app/lib/utils';

interface Props {
  breakdown: FrequencyBreakdown;
}

export function FrequencyStep({ breakdown }: Props) {
  return (
    <div className="space-y-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="py-2 font-medium">Factor Name</th>
            <th className="py-2 font-medium">Category</th>
            <th className="py-2 font-medium text-right">Multiplier</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="py-2.5 font-medium text-slate-700">Base λ₀</td>
            <td className="py-2.5 text-slate-500">System Baseline</td>
            <td className="py-2.5 text-right font-mono text-slate-900">{breakdown.base_lambda.toFixed(4)}</td>
          </tr>
          {breakdown.factors.map(f => {
            const isHigh = f.value > 1.0;
            const isLow = f.value < 1.0;
            return (
              <tr key={f.name}>
                <td className="py-2.5 text-slate-700">{f.name}</td>
                <td className="py-2.5 text-slate-500 max-w-[200px] truncate" title={f.category}>{f.category}</td>
                <td className={cn(
                  'py-2.5 text-right font-mono',
                  isHigh ? 'text-amber-600 font-medium' : isLow ? 'text-emerald-600 font-medium' : 'text-slate-500'
                )}>
                  {f.value.toFixed(4)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-200 bg-slate-50">
            <td colSpan={2} className="py-3 px-2 font-bold text-slate-900">Expected Frequency (λ)</td>
            <td className="py-3 px-2 text-right font-mono font-bold text-slate-900 text-lg">
              {breakdown.exp_frequency.toFixed(4)}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="flex justify-end items-center gap-2 text-sm text-slate-600">
        Claim Probability: <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{formatPct(breakdown.claim_probability_pct, 2)}</span>
      </div>
    </div>
  );
}
