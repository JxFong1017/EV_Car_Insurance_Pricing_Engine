from fastapi import HTTPException
from app.models.schemas import QuoteRequest, FrequencyBreakdown, FrequencyFactor
from app.data.relativities import (
    BASE_FREQUENCY_LAMBDA0,
    POWER_RELATIVITIES,
    DRIVER_AGE_RELATIVITIES,
    VEHICLE_AGE_RELATIVITIES,
    ADAS_RELATIVITIES,
    BRAND_RELATIVITIES
)

def get_relativity(rel_dict, key, category_name):
    if key not in rel_dict:
        raise HTTPException(status_code=422, detail=f"Invalid {category_name}: {key}")
    return rel_dict[key]

def calculate_frequency(inputs: QuoteRequest) -> FrequencyBreakdown:
    factors = []
    
    power_val = get_relativity(POWER_RELATIVITIES, inputs.power_cat, "power_cat")
    factors.append(FrequencyFactor(name="Power Relativity", value=power_val, category=inputs.power_cat))
    
    driver_age_val = get_relativity(DRIVER_AGE_RELATIVITIES, inputs.age_cat, "age_cat")
    factors.append(FrequencyFactor(name="Driver Age Relativity", value=driver_age_val, category=inputs.age_cat))
    
    veh_age_val = get_relativity(VEHICLE_AGE_RELATIVITIES, inputs.veh_age_cat, "veh_age_cat")
    factors.append(FrequencyFactor(name="Vehicle Age Relativity", value=veh_age_val, category=inputs.veh_age_cat))
    
    adas_val = get_relativity(ADAS_RELATIVITIES, inputs.adas_cat, "adas_cat")
    factors.append(FrequencyFactor(name="ADAS Relativity", value=adas_val, category=inputs.adas_cat))
    
    brand_val = get_relativity(BRAND_RELATIVITIES, inputs.brand_cat, "brand_cat")
    factors.append(FrequencyFactor(name="Brand Relativity", value=brand_val, category=inputs.brand_cat))
    
    exp_freq = BASE_FREQUENCY_LAMBDA0 * power_val * driver_age_val * veh_age_val * adas_val * brand_val
    claim_prob_pct = exp_freq * 100.0
    
    return FrequencyBreakdown(
        base_lambda=BASE_FREQUENCY_LAMBDA0,
        factors=factors,
        exp_frequency=exp_freq,
        claim_probability_pct=claim_prob_pct
    )
