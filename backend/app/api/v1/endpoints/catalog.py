from fastapi import APIRouter, HTTPException
from app.data.catalogs import MALAYSIA_EV_CATALOG, IC_PRESETS, PLATE_PRESETS
from app.data.relativities import (
    POWER_RELATIVITIES, BATTERY_CAPACITY_RELATIVITIES, GROUND_CLEARANCE_MULTIPLIERS,
    BRAND_RELATIVITIES, ADAS_RELATIVITIES, DRIVER_AGE_RELATIVITIES, STATUTORY_NCD_RATES,
    VEHICLE_AGE_RELATIVITIES, FLOOD_TERRITORY_RELATIVITIES, BATTERY_SOH_RELATIVITIES,
    TELEMATICS_RELATIVITIES
)

router = APIRouter()

@router.get("/catalog/models")
def get_models():
    return [{"model_name": k, **v} for k, v in MALAYSIA_EV_CATALOG.items()]

@router.get("/catalog/ic/{ic_number}")
def get_ic(ic_number: str):
    if ic_number in IC_PRESETS:
        return {"found": True, "data": IC_PRESETS[ic_number]}
    return {"found": False, "defaults": {
        "age": 32, "age_cat": "3. 31-40 years",
        "ncd_str": "0%", "label": "Default: 31-40 years, 0% NCD"
    }}

@router.get("/catalog/plate/{plate}")
def get_plate(plate: str):
    plate_upper = plate.upper()
    if plate_upper in PLATE_PRESETS:
        return {"found": True, "data": PLATE_PRESETS[plate_upper]}
    return {"found": False, "defaults": {
        "state": "Kuala Lumpur", "veh_age_cat": "1. 0-1 years",
        "soh_cat": "1. Optimal Health (>85% SoH)",
        "label": "Default: Kuala Lumpur, 0-1 Year, Optimal SoH"
    }}

@router.get("/catalog/options")
def get_options():
    return {
        "power_cats": list(POWER_RELATIVITIES.keys()),
        "capacity_cats": list(BATTERY_CAPACITY_RELATIVITIES.keys()),
        "clearance_cats": list(GROUND_CLEARANCE_MULTIPLIERS.keys()),
        "brand_cats": list(BRAND_RELATIVITIES.keys()),
        "adas_cats": list(ADAS_RELATIVITIES.keys()),
        "age_cats": list(DRIVER_AGE_RELATIVITIES.keys()),
        "ncd_rates": list(STATUTORY_NCD_RATES.keys()),
        "veh_age_cats": list(VEHICLE_AGE_RELATIVITIES.keys()),
        "states": list(FLOOD_TERRITORY_RELATIVITIES.keys()),
        "soh_cats": list(BATTERY_SOH_RELATIVITIES.keys()),
        "telematics_cats": list(TELEMATICS_RELATIVITIES.keys())
    }
