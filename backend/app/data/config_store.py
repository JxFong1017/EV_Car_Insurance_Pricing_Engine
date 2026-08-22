import json
from copy import deepcopy
from pathlib import Path

CONFIG_PATH = Path(__file__).resolve().parent / "runtime_config.json"

DEFAULT_GLOBAL_CONSTANTS = {
    "BASE_FREQUENCY_LAMBDA0": 0.0841,
    "PARTIAL_REPAIR_M_PARTIAL": 5200.00,
    "TOTAL_LOSS_PROB_P_TL": 0.0180,
    "RISK_MARGIN": 0.2000,
    "POLICY_ADMIN_FEE": 50.00,
    "AUDITED_UW_DENOMINATOR": 0.4190,
}

DEFAULT_FACTORS = {
    "POWER_RELATIVITIES": {
        "1. Urban / Commuter (<150 kW)": 1.1938,
        "2. Mid-Range Performance (150-250 kW)": 1.2969,
        "3. High-Performance AWD (>250 kW)": 1.3673,
    },
    "DRIVER_AGE_RELATIVITIES": {
        "1. 18-24 years": 2.1891,
        "2. 25-30 years": 1.1942,
        "3. 31-40 years": 1.0000,
        "4. 41-50 years": 1.1591,
        "5. 51-60 years": 1.0543,
        "6. 61-75 years": 1.0306,
        "7. 76+ years": 1.1239,
    },
    "VEHICLE_AGE_RELATIVITIES": {
        "1. 0-1 years": 1.0000,
        "2. 2-3 years": 0.5718,
        "3. 4-6 years": 0.6253,
        "4. 7-10 years": 0.6394,
        "5. 11+ years": 0.5273,
    },
    "ADAS_RELATIVITIES": {
        "1. Standard / Level 0-1 (No Active AEB)": 1.0000,
        "2. Level 2 Active ADAS (AEB + LKA Equipped)": 0.8270,
    },
    "BRAND_RELATIVITIES": {
        "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)": 1.0000,
        "2. Asian Mid-Tier (Hyundai, Kia, Mazda)": 1.1664,
        "3. Tech Premium & New Luxury (Tesla, Volvo, Zeekr, XPeng, Lotus)": 1.6167,
        "4. Continental Luxury & Sport (Audi, BMW, Mercedes, Porsche, MINI, smart)": 1.7922,
    },
    "BATTERY_CAPACITY_RELATIVITIES": {
        "1. Standard Pack (<60 kWh)": 1.0000,
        "2. Mid-Size Pack (60-80 kWh)": 1.1000,
        "3. High-Capacity Pack (>80 kWh)": 1.2500,
    },
    "FLOOD_TERRITORY_RELATIVITIES": {
        "Kuala Lumpur": 0.9600,
        "Selangor": 1.0200,
        "Terengganu": 1.2800,
        "Kelantan": 1.3500,
        "Pahang": 1.2200,
        "Johor": 1.0800,
        "Penang": 0.9800,
        "Perak": 1.0400,
        "Melaka": 0.9700,
        "Negeri Sembilan": 0.9900,
        "Kedah": 1.0600,
        "Perlis": 1.0300,
        "Sabah": 1.1200,
        "Sarawak": 1.1400,
        "Putrajaya": 0.9500,
        "Labuan": 0.9600,
    },
    "GROUND_CLEARANCE_MULTIPLIERS": {
        "1. Sports Car / Ultra-Low EV (<=127mm)": 1.0500,
        "2. Sedan (Baseline) (128-149mm)": 1.0000,
        "3. Minivan / MPV (150-169mm)": 0.9600,
        "4. SUV / Off-Roader (>=170mm)": 0.8600,
    },
    "BATTERY_SOH_RELATIVITIES": {
        "1. Optimal Health (>85% SoH)": 0.9000,
        "2. Standard Health (70-85% SoH)": 1.0000,
        "3. Degraded Health (<70% SoH / High Resistance)": 1.3000,
    },
    "STATUTORY_NCD_RATES": {
        "0%": 0.0000,
        "25%": 0.2500,
        "30%": 0.3000,
        "38.33%": 0.3833,
        "45%": 0.4500,
        "55%": 0.5500,
    },
}

DEFAULT_CONFIG = {
    "global_constants": DEFAULT_GLOBAL_CONSTANTS,
    "factors": DEFAULT_FACTORS,
}


def _deepcopy_default_config():
    return deepcopy(DEFAULT_CONFIG)


def _ensure_config_file():
    if not CONFIG_PATH.exists():
        CONFIG_PATH.write_text(json.dumps(_deepcopy_default_config(), indent=2), encoding="utf-8")
    return CONFIG_PATH


def get_runtime_config():
    path = _ensure_config_file()
    try:
        with path.open("r", encoding="utf-8") as handle:
            config = json.load(handle)
    except json.JSONDecodeError:
        config = _deepcopy_default_config()

    merged = _deepcopy_default_config()
    if isinstance(config, dict):
        merged["global_constants"].update(config.get("global_constants", {}))
        for key, value in config.get("factors", {}).items():
            if isinstance(value, dict):
                merged["factors"][key] = value
    return merged


def save_runtime_config(config):
    validated = _deepcopy_default_config()
    validated["global_constants"].update(config.get("global_constants", {}))
    for factor_name, factor_value in config.get("factors", {}).items():
        if isinstance(factor_value, dict):
            validated["factors"][factor_name] = factor_value
    CONFIG_PATH.write_text(json.dumps(validated, indent=2), encoding="utf-8")
    return validated


def get_global_constant(name, default=None):
    config = get_runtime_config()
    value = config["global_constants"].get(name, default)
    return value if value is not None else default


def set_global_constant(name, value):
    config = get_runtime_config()
    config["global_constants"][name] = value
    save_runtime_config(config)
    return config["global_constants"][name]


def get_factor_dict(name, default=None):
    config = get_runtime_config()
    value = config["factors"].get(name, default)
    if value is None:
        return default or {}
    return value


def set_factor_dict(name, factor_dict):
    config = get_runtime_config()
    config["factors"][name] = factor_dict
    save_runtime_config(config)
    return config["factors"][name]


def reset_runtime_config():
    CONFIG_PATH.write_text(json.dumps(_deepcopy_default_config(), indent=2), encoding="utf-8")
    return _deepcopy_default_config()
