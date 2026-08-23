'use client';
import { QuoteRequest, EVModel, CatalogOptions } from '@/app/types/quote';
import { Select } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';

interface Props {
  form: QuoteRequest;
  models: EVModel[];
  options: CatalogOptions | null;
  applyEVModel: (m: EVModel) => void;
  updateField: <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => void;
}

export function HybridSelector({ form, models, options, applyEVModel, updateField }: Props) {
  const selectedModel = models.find(m => m.model_name === form.model_name);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = models.find(x => x.model_name === e.target.value);
    if (m) applyEVModel(m);
  };

  if (!options) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4 border-b pb-6">
        <Select label="Select EV Model" value={form.model_name} onChange={handleModelChange}>
          <option value="Custom Configuration" disabled>Select a model...</option>
          {models.map(m => <option key={m.model_name} value={m.model_name}>{m.model_name}</option>)}
        </Select>
        {selectedModel && (
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <Badge variant="slate">{selectedModel.power_kw} kW</Badge>
            <Badge variant="slate">{selectedModel.capacity_kwh} kWh</Badge>
            <Badge variant="slate">{selectedModel.clearance_mm}mm Clearance</Badge>
            <Badge variant="emerald">{selectedModel.brand_cat.split(' ')[0]}</Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label htmlFor="sum_insured_hybrid" className="text-sm font-medium text-slate-700">Sum Insured (RM)</label>
          <input
            id="sum_insured_hybrid"
            type="number"
            min={50000}
            max={2000000}
            step={1000}
            value={form.sum_insured}
            onChange={(e) => updateField('sum_insured', Number(e.target.value))}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          />
        </div>
        <Select label="Driver Age Band" value={form.age_cat} onChange={e => updateField('age_cat', e.target.value)}>
          {options.age_cats.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Statutory NCD %" value={form.ncd_str} onChange={e => updateField('ncd_str', e.target.value)}>
          {options.ncd_rates.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Vehicle Age Band" value={form.veh_age_cat} onChange={e => updateField('veh_age_cat', e.target.value)}>
          {options.veh_age_cats.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Malaysian Territory/State" value={form.state} onChange={e => updateField('state', e.target.value)}>
          {options.states.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Battery State of Health" value={form.soh_cat} onChange={e => updateField('soh_cat', e.target.value)} className="md:col-span-2">
          {options.soh_cats.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
      </div>
    </div>
  );
}
