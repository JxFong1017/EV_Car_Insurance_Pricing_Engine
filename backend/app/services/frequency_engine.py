import math
from fastapi import HTTPException
from app.models.schemas import QuoteRequest, FrequencyBreakdown, FrequencyFactor
from app.data.relativities import BASE_FREQUENCY_LAMBDA0, get_factor_value
from app.data.config_store import get_runtime_config


def get_relativity(rel_dict, key, category_name):
    if key not in rel_dict:
        alias_map = {
            "GROUND_CLEARANCE_MULTIPLIERS": {
                "2. Sedan / Hatchback (140-170mm)": "2. Sedan (Baseline) (128-149mm)",
                "1. Sports Car / Low EV (<140mm)": "1. Sports Car / Ultra-Low EV (<=127mm)",
            },
            "BRAND_RELATIVITIES": {
                "1. Mass Market / Standard (BYD, Chery, GWM, Neta, MG)": "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)",
                "2. Premium / Mid-Tier (Tesla, Hyundai, Smart)": "2. Asian Mid-Tier (Hyundai, Kia, Mazda)",
            },
        }
        candidate = alias_map.get(category_name, {}).get(key)
        if candidate is not None and candidate in rel_dict:
            return rel_dict[candidate]
        raise HTTPException(status_code=422, detail=f"Invalid {category_name}: {key}")
    return rel_dict[key]


def calculate_frequency(inputs: QuoteRequest) -> FrequencyBreakdown:
    config = get_runtime_config()
    active_factors = [
        ("POWER_RELATIVITIES", inputs.power_cat, "power_cat"),
        ("DRIVER_AGE_RELATIVITIES", inputs.age_cat, "age_cat"),
        ("VEHICLE_AGE_RELATIVITIES", inputs.veh_age_cat, "veh_age_cat"),
        ("ADAS_RELATIVITIES", inputs.adas_cat, "adas_cat"),
        ("BRAND_RELATIVITIES", inputs.brand_cat, "brand_cat"),
    ]

    factors = []
    multiplier_values = [BASE_FREQUENCY_LAMBDA0]

    for factor_name, category_key, label in active_factors:
        rel_dict = config["factors"].get(factor_name, {})
        try:
            value = get_relativity(rel_dict, category_key, factor_name)
        except HTTPException:
            if factor_name in config["factors"]:
                raise
            raise HTTPException(status_code=422, detail=f"Invalid {label}: {category_key}")
        factors.append(FrequencyFactor(name=factor_name.replace("_RELATIVITIES", "").replace("_", " ").title(), value=value, category=category_key))
        multiplier_values.append(value)

    exp_freq = math.prod(multiplier_values)
    claim_prob_pct = exp_freq * 100.0

    return FrequencyBreakdown(
        base_lambda=BASE_FREQUENCY_LAMBDA0,
        factors=factors,
        exp_frequency=exp_freq,
        claim_probability_pct=claim_prob_pct,
    )
