from app.data.config_store import get_runtime_config

BASE_FREQUENCY_LAMBDA0 = 0.0587
PARTIAL_REPAIR_M_PARTIAL = 5200.00
TOTAL_LOSS_PROB_P_TL = 0.1012
RISK_MARGIN = 0.2000
POLICY_ADMIN_FEE = 50.00
AUDITED_UW_DENOMINATOR = 0.4190

POWER_RELATIVITIES = {
    "1. Urban / Commuter (<150 kW)": 1.1938,
    "2. Mid-Range Performance (150-250 kW)": 1.2969,
    "3. High-Performance AWD (>250 kW)": 1.3673,
}

DRIVER_AGE_RELATIVITIES = {
    "1. 18-24 years": 2.1891,
    "2. 25-30 years": 1.1942,
    "3. 31-40 years": 1.0000,
    "4. 41-50 years": 1.1591,
    "5. 51-60 years": 1.0543,
    "6. 61-75 years": 1.0306,
    "7. 76+ years": 1.1239,
}

VEHICLE_AGE_RELATIVITIES = {
    "1. 0-1 years": 1.0000,
    "2. 2-3 years": 0.5718,
    "3. 4-6 years": 0.6253,
    "4. 7-10 years": 0.6394,
    "5. 11+ years": 0.5273,
}

ADAS_RELATIVITIES = {
    "1. Standard / Level 0-1 (No Active AEB)": 1.0000,
    "2. Level 2 Active ADAS (AEB + LKA Equipped)": 0.8270,
}

BRAND_RELATIVITIES = {
    "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)": 1.0000,
    "2. Asian Mid-Tier (Hyundai, Kia, Mazda)": 1.1664,
    "3. Tech Premium & New Luxury (Tesla, Volvo, Zeekr, XPeng, Lotus)": 1.6167,
    "4. Continental Luxury & Sport (Audi, BMW, Mercedes, Porsche, MINI, smart)": 1.7922,
}

BATTERY_CAPACITY_RELATIVITIES = {
    "1. Standard Pack (<60 kWh)": 1.0000,
    "2. Mid-Size Pack (60-80 kWh)": 1.1000,
    "3. High-Capacity Pack (>80 kWh)": 1.2500,
}

FLOOD_TERRITORY_RELATIVITIES = {
    "Pahang": 1.1589,
    "Terengganu": 1.1303,
    "Johor": 1.1033,
    "Kelantan": 1.1033,
    "Sabah": 1.0435,
    "Sarawak": 0.9963,
    "Kedah": 0.9753,
    "Melaka": 0.9698,
    "Negeri Sembilan": 0.9651,
    "Selangor": 0.9651,
    "Kuala Lumpur": 0.9573,
    "Penang": 0.9573,
    "Perlis": 0.9634,
    "Perak": 1.0400,
    "Putrajaya": 0.9500,
    "Labuan": 0.9600,
}

GROUND_CLEARANCE_MULTIPLIERS = {
    "1. Sports Car / Ultra-Low EV (<=127mm)": 1.0458,
    "2. Sedan (Baseline) (128-149mm)": 1.0000,
    "3. Minivan / MPV (150-169mm)": 0.9620,
    "4. SUV / Off-Roader (>=170mm)": 0.8591,
}

BATTERY_SOH_RELATIVITIES = {
    "1. Optimal Health (>85% SoH)": 0.9000,
    "2. Base (70-85% SoH)": 1.0000,
    "3. Degraded (<70% SoH)": 1.3000,
}

STATUTORY_NCD_RATES = {
    "0%": 0.0000,
    "25%": 0.2500,
    "30%": 0.3000,
    "38.33%": 0.3833,
    "45%": 0.4500,
    "55%": 0.5500,
}

LEGACY_ALIASES = {
    "BRAND_RELATIVITIES": {
        "1. Mass Market / Standard (BYD, Chery, GWM, Neta, MG)": "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)",
        "2. Premium / Mid-Tier (Tesla, Hyundai, Smart)": "2. Asian Mid-Tier (Hyundai, Kia, Mazda)",
        "3. Continental Luxury / Sport (Porsche, BMW, Mercedes)": "4. Continental Luxury & Sport (Audi, BMW, Mercedes, Porsche, MINI, smart)",
    },
    "GROUND_CLEARANCE_MULTIPLIERS": {
        "1. Sports Car / Low EV (<140mm)": "1. Sports Car / Ultra-Low EV (<=127mm)",
        "2. Sedan / Hatchback (140-170mm)": "2. Sedan (Baseline) (128-149mm)",
        "3. Minivan / Crossover (175-190mm)": "3. Minivan / MPV (150-169mm)",
        "4. SUV / Off-Roader (>190mm)": "4. SUV / Off-Roader (>=170mm)",
    },
}


def refresh_runtime_overrides():
    config = get_runtime_config()
    for key, value in config["global_constants"].items():
        globals()[key] = value
    for key, value in config["factors"].items():
        globals()[key] = value


def get_factor_value(factor_name, key):
    mapping = globals().get(factor_name, {})
    if isinstance(mapping, dict) and key in mapping:
        return mapping[key]

    alias_map = LEGACY_ALIASES.get(factor_name, {})
    if key in alias_map:
        canonical = alias_map[key]
        if canonical in mapping:
            return mapping[canonical]

    raise KeyError(f"Unknown {factor_name} key: {key}")


refresh_runtime_overrides()
