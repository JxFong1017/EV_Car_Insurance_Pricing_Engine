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
from app.data.config_store import get_runtime_config

def get_relativity(rel_dict, key, category_name):
    if key not in rel_dict:
        # Fallback to legacy aliases if needed, or raise
        from app.data.relativities import LEGACY_ALIASES
        alias_map = LEGACY_ALIASES.get(category_name, {})
        if key in alias_map and alias_map[key] in rel_dict:
            return rel_dict[alias_map[key]]
        raise HTTPException(status_code=422, detail=f"Invalid {category_name}: {key}")
    return rel_dict[key]

def calculate_severity(inputs: QuoteRequest) -> SeverityBreakdown:
    config = get_runtime_config()
    
    partial_loss = config["global_constants"].get("PARTIAL_REPAIR_M_PARTIAL", 5200.00)
    total_loss_prob = config["global_constants"].get("TOTAL_LOSS_PROB_P_TL", 0.1012)
    
    total_loss = inputs.sum_insured * total_loss_prob
    base_severity = partial_loss + total_loss
    
    battery_mult = get_relativity(config["factors"].get("BATTERY_CAPACITY_RELATIVITIES", {}), inputs.capacity_cat, "BATTERY_CAPACITY_RELATIVITIES")
    territory_rel = get_relativity(config["factors"].get("FLOOD_TERRITORY_RELATIVITIES", {}), inputs.state, "FLOOD_TERRITORY_RELATIVITIES")
    clearance_mult = get_relativity(config["factors"].get("GROUND_CLEARANCE_MULTIPLIERS", {}), inputs.clearance_cat, "GROUND_CLEARANCE_MULTIPLIERS")
    flood_mult = territory_rel * clearance_mult
    soh_mult = get_relativity(config["factors"].get("BATTERY_SOH_RELATIVITIES", {}), inputs.soh_cat, "BATTERY_SOH_RELATIVITIES")
    
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
