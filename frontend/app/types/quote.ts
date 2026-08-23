export type TierMode = '1' | '2' | '3' | 'basic';

export type RiderId = 'mobility' | 'ncd_shield' | 'cyber';

export interface QuoteRequest {
  sum_insured: number;
  power_cat: string;
  capacity_cat: string;
  clearance_cat: string;
  brand_cat: string;
  adas_cat: string;
  age_cat: string;
  ncd_str: string;
  veh_age_cat: string;
  state: string;
  soh_cat: string;
  telematics_cat: string;
  tier_mode: TierMode;
  selected_riders: RiderId[];
  smart_grid_enrolled: boolean;
  model_name: string;
}

export interface FrequencyFactor {
  name: string;
  value: number;
  category: string;
}

export interface FrequencyBreakdown {
  base_lambda: number;
  factors: FrequencyFactor[];
  exp_frequency: number;
  claim_probability_pct: number;
}

export interface SeverityBreakdown {
  partial_loss_component: number;
  total_loss_component: number;
  base_severity_mixture: number;
  battery_multiplier: number;
  flood_multiplier: number;
  territory_relativity: number;
  clearance_multiplier: number;
  soh_multiplier: number;
  exp_severity: number;
}

export interface RiderItem {
  label: string;
  cost: string;
  amount: number;
}

export interface PackagingBreakdown {
  tier_name: string;
  tier_loading_factor: number;
  smart_grid_discount: number;
  final_base_gross: number;
  package_premium: number;
  rider_items: RiderItem[];
}

export interface QuoteResponse {
  model_name: string;
  sum_insured: number;
  frequency: FrequencyBreakdown;
  severity: SeverityBreakdown;
  pure_premium: number;
  risk_margin_loading: number;
  policy_admin_fee: number;
  uw_denominator: number;
  unadjusted_gross: number;
  ncd_rate: number;
  ncd_discount_amount: number;
  base_motor_gross: number;
  packaging: PackagingBreakdown;
  total_payable_premium: number;
}

export interface EVModel {
  model_name: string;
  power_kw: number;
  capacity_kwh: number;
  clearance_mm: number;
  default_si: number;
  power_cat: string;
  capacity_cat: string;
  clearance_cat: string;
  brand_cat: string;
  adas_cat: string;
}

export interface CatalogOptions {
  power_cats: string[];
  capacity_cats: string[];
  clearance_cats: string[];
  brand_cats: string[];
  adas_cats: string[];
  age_cats: string[];
  ncd_rates: string[];
  veh_age_cats: string[];
  states: string[];
  soh_cats: string[];
  telematics_cats: string[];
}

export interface AdminConfig {
  global_constants: Record<string, number>;
  factors: Record<string, Record<string, number>>;
}
