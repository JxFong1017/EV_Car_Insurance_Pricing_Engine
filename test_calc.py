import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from app.models.schemas import QuoteRequest
from app.services.pricing_orchestrator import calculate_quote

inputs = QuoteRequest(
    model_name="Tesla Model 3 (Performance AWD)",
    power_cat="3. High-Performance AWD (>250 kW)",
    capacity_cat="2. Mid-Size Pack (60-80 kWh)",
    clearance_cat="2. Sedan (Baseline) (128-149mm)",
    brand_cat="3. Tech Premium & New Luxury (Tesla, Volvo, Zeekr, XPeng, Lotus)",
    adas_cat="2. Level 2 Active ADAS (AEB + LKA Equipped)",
    sum_insured=232000.0,
    age_cat="2. 25-30 years",
    ncd_str="0%",
    telematics_cat="1. Tier 1: Safe Edge EV Driver (Score >= 0.5)",
    veh_age_cat="1. 0-1 years",
    state="Selangor",
    soh_cat="1. Optimal Health (>85% SoH)",
    tier_mode="1",
    selected_riders=["Tier 1: EV Essential (High-rise / Condo residents)"],
    smart_grid_enrolled=False
)

res = calculate_quote(inputs)

print(f"Step 1 (Freq): {res.frequency.exp_frequency:.6f}")
print(f"Step 2 (Sev): {res.severity.exp_severity:.2f}")
print(f"Step 3 (Pure): {res.pure_premium:.2f}")
print(f"Step 3 (Gross): {res.base_motor_gross:.2f}")
print(f"Step 4 (Total): {res.total_payable_premium:.2f}")
