'use client';
import { useState } from 'react';
import { QuoteRequest, EVModel } from '@/app/types/quote';
import { Select } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';

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
  const [driverAge, setDriverAge] = useState<number | null>(null);
  const [driverLabel, setDriverLabel] = useState<string | null>(null);
  const [vehicleLabel, setVehicleLabel] = useState<string | null>(null);

  const selectedModel = models.find(m => m.model_name === form.model_name);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = models.find(x => x.model_name === e.target.value);
    if (m) applyEVModel(m);
  };

  const handleICConfirm = () => {
    if (!ic) return;
    setIcStatus('loading');

    const cleaned = ic.trim();

    if (cleaned === '123456789012') {
      setDriverAge(22);
      updateField('age_cat', '1. 18-24 years');
      updateField('ncd_str', '55%');
      setDriverLabel('22 Years Old with High NCD (55%)');
      setIcStatus('success');
      return;
    }

    if (cleaned === '123456789013') {
      setDriverAge(32);
      updateField('age_cat', '3. 31-40 years');
      updateField('ncd_str', '0%');
      setDriverLabel('32 Years Old with Low NCD (0%)');
      setIcStatus('success');
      return;
    }

    // unmatched: fallback default
    setDriverAge(null);
    updateField('age_cat', '3. 31-40 years');
    updateField('ncd_str', '0%');
    setDriverLabel(null);
    setIcStatus('error');
  };

  const handlePlateConfirm = () => {
    if (!plate) return;
    setPlateStatus('loading');

    const cleaned = plate.trim().toUpperCase();

    if (cleaned === 'ABC1234') {
      updateField('state', 'Terengganu');
      updateField('veh_age_cat', '3. 4-6 years');
      updateField('soh_cat', '3. Degraded Health (<70% SoH / High Resistance)');
      setVehicleLabel('Terengganu (High Flood Zone), 4-6 Years Old, Degraded SoH (<70%)');
      setPlateStatus('success');
      return;
    }

    if (cleaned === 'ABC1235') {
      updateField('state', 'Kuala Lumpur');
      updateField('veh_age_cat', '1. 0-1 years');
      updateField('soh_cat', '1. Optimal Health (>85% SoH)');
      setVehicleLabel('Kuala Lumpur (Urban Zone), 0-1 Year Old, Optimal SoH (>85%)');
      setPlateStatus('success');
      return;
    }

    // unmatched fallback
    updateField('state', 'Kuala Lumpur');
    updateField('veh_age_cat', '1. 0-1 years');
    updateField('soh_cat', '1. Optimal Health (>85% SoH)');
    setVehicleLabel(null);
    setPlateStatus('error');
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
          <label className="text-sm font-medium text-slate-700">Driver IC Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 123456789012"
              value={ic}
              onChange={e => setIc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleICConfirm()}
              className="flex-1 h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleICConfirm}
              className="inline-flex items-center px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Confirm
            </button>
          </div>

          {icStatus === 'success' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="text-sm text-emerald-600 font-medium">✓ Driver profile mapped</div>
                {driverAge !== null && <Badge variant="emerald">{driverAge} Years</Badge>}
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Age</div>
                  <div className="font-medium">{driverAge ?? '—'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Age Band</div>
                  <div className="font-medium">{form.age_cat || '—'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">NCD</div>
                  <div className="font-medium">{form.ncd_str || '—'}</div>
                </div>
              </div>
            </div>
          )}

          {icStatus === 'error' && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">Preset not found. Using fallback values.</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Age</div>
                  <div className="font-medium">{driverAge ?? '—'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Age Band</div>
                  <div className="font-medium">{form.age_cat || '3. 31-40 years'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">NCD</div>
                  <div className="font-medium">{form.ncd_str || '0%'}</div>
                </div>
              </div>
            </div>
          )}

          {driverLabel && (
            <div className="mt-2 p-3 bg-emerald-50 rounded border border-emerald-100 text-emerald-900 text-sm font-medium">{driverLabel}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Vehicle Plate Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. ABC1234"
              value={plate}
              onChange={e => setPlate(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handlePlateConfirm()}
              className="flex-1 h-10 rounded-md border border-slate-300 px-3 py-2 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handlePlateConfirm}
              className="inline-flex items-center px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Confirm
            </button>
          </div>

          {plateStatus === 'success' && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-emerald-600 font-medium">✓ Vehicle profile mapped</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">State</div>
                  <div className="font-medium">{form.state || '—'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Vehicle Age</div>
                  <div className="font-medium">{form.veh_age_cat || '—'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">SoH</div>
                  <div className="font-medium">{form.soh_cat || '—'}</div>
                </div>
              </div>
            </div>
          )}

          {plateStatus === 'error' && (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">Fallback used: defaults applied.</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">State</div>
                  <div className="font-medium">{form.state || 'Kuala Lumpur'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">Vehicle Age</div>
                  <div className="font-medium">{form.veh_age_cat || '1. 0-1 years'}</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500">SoH</div>
                  <div className="font-medium">{form.soh_cat || '1. Optimal Health (>85% SoH)'}</div>
                </div>
              </div>
            </div>
          )}

          {vehicleLabel && (
            <div className="mt-2 p-3 bg-emerald-50 rounded border border-emerald-100 text-emerald-900 text-sm font-medium">{vehicleLabel}</div>
          )}
        </div>
      </div>
    </div>
  );
}
