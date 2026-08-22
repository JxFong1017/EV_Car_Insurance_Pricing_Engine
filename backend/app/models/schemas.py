from pydantic import BaseModel, Field
from typing import Literal

class QuoteRequest(BaseModel):
    sum_insured: float = Field(..., ge=50000, le=2000000)
    power_cat: str = "1. Urban / Commuter (<150 kW)"
    capacity_cat: str = "1. Standard Pack (<60 kWh)"
    clearance_cat: str = "2. Sedan (Baseline) (128-149mm)"
    brand_cat: str = "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)"
    adas_cat: str = "1. Standard / Level 0-1 (No Active AEB)"
    age_cat: str = "3. 31-40 years"
    ncd_str: str = "0%"
    veh_age_cat: str = "1. 0-1 years"
    state: str = "Kuala Lumpur"
    soh_cat: str = "2. Standard Health (70-85% SoH)"
    tier_mode: Literal["1", "2", "3", "basic"] = "basic"
    selected_riders: list[str] = Field(default_factory=list)
    smart_grid_enrolled: bool = False
    model_name: str = "Custom Configuration"

class FrequencyFactor(BaseModel):
    name: str
    value: float
    category: str

class FrequencyBreakdown(BaseModel):
    base_lambda: float
    factors: list[FrequencyFactor]
    exp_frequency: float
    claim_probability_pct: float

class SeverityBreakdown(BaseModel):
    partial_loss_component: float
    total_loss_component: float
    base_severity_mixture: float
    battery_multiplier: float
    flood_multiplier: float
    territory_relativity: float
    clearance_multiplier: float
    soh_multiplier: float
    exp_severity: float

class PackagingBreakdown(BaseModel):
    tier_name: str
    tier_loading_factor: float
    smart_grid_discount: float
    final_base_gross: float
    package_premium: float
    rider_items: list[dict]

class QuoteResponse(BaseModel):
    model_name: str
    sum_insured: float
    frequency: FrequencyBreakdown
    severity: SeverityBreakdown
    pure_premium: float
    risk_margin_loading: float
    policy_admin_fee: float
    uw_denominator: float
    unadjusted_gross: float
    ncd_rate: float
    ncd_discount_amount: float
    base_motor_gross: float
    packaging: PackagingBreakdown
    total_payable_premium: float
