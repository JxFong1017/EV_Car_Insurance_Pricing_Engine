from fastapi import HTTPException
from app.models.schemas import QuoteRequest, SeverityBreakdown
from app.data.relativities import (
    PARTIAL_REPAIR_M_PARTIAL,
    TOTAL_LOSS_PROB_P_TL,
    BATTERY_CAPACITY_RELATIVITIES,
    FLOOD_TERRITORY_RELATIVITIES,
    GROUND_CLEARANCE_MULTIPLIERS,
    BATTERY_SOH_RELATIVITIES
)

def get_relativity(rel_dict, key, category_name):
    if key not in rel_dict:
        raise HTTPException(status_code=422, detail=f"Invalid {category_name}: {key}")
    return rel_dict[key]

def calculate_severity(inputs: QuoteRequest) -> SeverityBreakdown:
    partial_loss = PARTIAL_REPAIR_M_PARTIAL
    total_loss = inputs.sum_insured * TOTAL_LOSS_PROB_P_TL
    base_severity = partial_loss + total_loss
    
    battery_mult = get_relativity(BATTERY_CAPACITY_RELATIVITIES, inputs.capacity_cat, "capacity_cat")
    territory_rel = get_relativity(FLOOD_TERRITORY_RELATIVITIES, inputs.state, "state")
    clearance_mult = get_relativity(GROUND_CLEARANCE_MULTIPLIERS, inputs.clearance_cat, "clearance_cat")
    flood_mult = territory_rel * clearance_mult
    soh_mult = get_relativity(BATTERY_SOH_RELATIVITIES, inputs.soh_cat, "soh_cat")
    
    exp_severity = base_severity * battery_mult * flood_mult * soh_mult
    
    return SeverityBreakdown(
        partial_loss_component=partial_loss,
        total_loss_component=total_loss,
        base_severity_mixture=base_severity,
        battery_multiplier=battery_mult,
        flood_multiplier=flood_mult,
        territory_relativity=territory_rel,
        clearance_multiplier=clearance_mult,
        soh_multiplier=soh_mult,
        exp_severity=exp_severity
    )
