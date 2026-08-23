'use client';
import { QuoteRequest, CatalogOptions } from '@/app/types/quote';
import { Select } from '@/app/components/ui/select';
import { Skeleton } from '@/app/components/ui/skeleton';

interface Props {
  form: QuoteRequest;
  updateField: <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => void;
  options: CatalogOptions | null;
}

export function ManualFactorForm({ form, updateField, options }: Props) {
  if (!options) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Vehicle Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="sum_insured" className="text-sm font-medium text-slate-700">Sum Insured (RM)</label>
            <input
              id="sum_insured"
              type="number"
              min={50000}
              max={2000000}
              step={1000}
              value={form.sum_insured}
              onChange={(e) => updateField('sum_insured', Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            />
          </div>
          <Select label="Power Category" value={form.power_cat} onChange={e => updateField('power_cat', e.target.value)}>
            {options.power_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Battery Capacity" value={form.capacity_cat} onChange={e => updateField('capacity_cat', e.target.value)}>
            {options.capacity_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Ground Clearance" value={form.clearance_cat} onChange={e => updateField('clearance_cat', e.target.value)}>
            {options.clearance_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Brand Segment" value={form.brand_cat} onChange={e => updateField('brand_cat', e.target.value)}>
            {options.brand_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="ADAS Safety Level" value={form.adas_cat} onChange={e => updateField('adas_cat', e.target.value)}>
            {options.adas_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Driver Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Driver Age Band" value={form.age_cat} onChange={e => updateField('age_cat', e.target.value)}>
            {options.age_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Statutory NCD %" value={form.ncd_str} onChange={e => updateField('ncd_str', e.target.value)}>
            {options.ncd_rates.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Driving Score (Telematics)" value={form.telematics_cat} onChange={e => updateField('telematics_cat', e.target.value)} className="md:col-span-2">
            {options.telematics_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Risk Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Vehicle Age Band" value={form.veh_age_cat} onChange={e => updateField('veh_age_cat', e.target.value)}>
            {options.veh_age_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Malaysian Territory/State" value={form.state} onChange={e => updateField('state', e.target.value)}>
            {options.states.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
          <Select label="Battery State of Health" value={form.soh_cat} onChange={e => updateField('soh_cat', e.target.value)}>
            {options.soh_cats.map(o => <option key={o} value={o}>{o}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}
