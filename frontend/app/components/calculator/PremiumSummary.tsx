'use client';
import { QuoteResponse } from '@/app/types/quote';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import { formatRM } from '@/app/lib/utils';
import { AlertCircle } from 'lucide-react';

interface Props {
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  onSubmit: () => void;
  onReset: () => void;
}

export function PremiumSummary({ quote, loading, error, onSubmit, onReset }: Props) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl pb-4">
        <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Premium Summary</CardTitle>
        <div className="mt-2 min-h-[4rem] flex items-end">
          {loading ? (
            <Skeleton className="h-12 w-48" />
          ) : quote ? (
            <div className="animate-slide-up">
              <span className="text-4xl font-extrabold text-emerald-600">
                {formatRM(quote.total_payable_premium)}
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-slate-300">RM 0.00</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center text-slate-600">
            <span>Base Motor Gross</span>
            <span className="font-medium text-slate-900">
              {quote ? formatRM(quote.base_motor_gross) : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Tier / Rider Costs</span>
            <span className="font-medium text-slate-900">
              {quote ? formatRM(quote.packaging.package_premium) : '-'}
            </span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center font-semibold text-slate-900">
            <span>Total Payable</span>
            <span>{quote ? formatRM(quote.total_payable_premium) : '-'}</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Button className="w-full text-base h-12" size="lg" onClick={onSubmit} isLoading={loading}>
            Calculate Premium →
          </Button>
          {(quote || error) && (
            <Button variant="ghost" className="w-full" onClick={onReset} disabled={loading}>
              Reset Quote
            </Button>
          )}
        </div>

        <p className="text-xs text-center text-slate-400 font-medium">
          Actuarial estimate only. Subject to underwriting acceptance.
        </p>
      </CardContent>
    </Card>
  );
}
