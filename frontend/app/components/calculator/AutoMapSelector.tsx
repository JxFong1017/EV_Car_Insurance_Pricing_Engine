'use client';
import { useState } from 'react';
import { QuoteRequest, EVModel } from '@/app/types/quote';
import { Select } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { fetchICPreset, fetchPlatePreset } from '@/app/lib/api-client';

interface Props {
  form: QuoteRequest;
  models: EVModel[];
  applyEVModel: (m: EVModel) => void;
  updateField: <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => void;
}

export function AutoMapSelector({ form, models, applyEVModel, updateField }: Props) {
  const [ic, setIc] = useState('');
  const [plate, setPlate] = useState('');
  const [icStatus, setIcStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [plateStatus, setPlateStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const selectedModel = models.find(m => m.model_name === form.model_name);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = models.find(x => x.model_name === e.target.value);
    if (m) applyEVModel(m);
  };

  const handleICBlur = async () => {
    if (!ic) return;
    setIcStatus('loading');
    try {
      const res = await fetchICPreset(ic);
      if (res.found && res.data) {
        updateField('age_cat', res.data.age_cat);
        updateField('ncd_str', res.data.ncd_str);
        setIcStatus('success');
      } else {
        setIcStatus('error');
      }
    } catch {
      setIcStatus('error');
    }
  };

  const handlePlateBlur = async () => {
    if (!plate) return;
    setPlateStatus('loading');
    try {
      const res = await fetchPlatePreset(plate);
      if (res.found && res.data) {
        updateField('state', res.data.state);
        updateField('veh_age_cat', res.data.veh_age_cat);
        updateField('soh_cat', res.data.soh_cat);
        setPlateStatus('success');
      } else {
        setPlateStatus('error');
      }
    } catch {
      setPlateStatus('error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">IC Number</label>
          <input
            type="text"
            placeholder="e.g. 123456789012"
            value={ic}
            onChange={e => setIc(e.target.value)}
            onBlur={handleICBlur}
            onKeyDown={e => e.key === 'Enter' && handleICBlur()}
            className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          />
          {icStatus === 'success' && <div className="text-sm text-emerald-600 font-medium">✓ Driver profile mapped</div>}
          {icStatus === 'error' && <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">Preset not found. Try 900101-14-1234 or 850202-10-5678.</div>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Plate Number</label>
          <input
            type="text"
            placeholder="e.g. ABC1234"
            value={plate}
            onChange={e => setPlate(e.target.value.toUpperCase())}
            onBlur={handlePlateBlur}
            onKeyDown={e => e.key === 'Enter' && handlePlateBlur()}
            className="flex h-10 w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          />
          {plateStatus === 'success' && <div className="text-sm text-emerald-600 font-medium">✓ Vehicle profile mapped</div>}
          {plateStatus === 'error' && <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">Preset not found. Try BND1234 or JQK999.</div>}
        </div>
      </div>
    </div>
  );
}
