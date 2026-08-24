import json
import os
import tempfile
from copy import deepcopy
from pathlib import Path

DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent / "runtime_config.json"
TMP_CONFIG_PATH = Path(tempfile.gettempdir()) / "voltvision_runtime_config.json"

DEFAULT_GLOBAL_CONSTANTS = {
    "BASE_FREQUENCY_LAMBDA0": 0.0587,
    "PARTIAL_REPAIR_M_PARTIAL": 5200.00,
    "TOTAL_LOSS_PROB_P_TL": 0.1012,
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
        "2. Level 2 Active ADAS (AEB + LKA Equipped)": 0.7620,
    },
    "BRAND_RELATIVITIES": {
        "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)": 1.0000,
        "2. Asian Mid-Tier (Hyundai, Kia, Mazda)": 1.1664,
        "3. Tech Premium & New Luxury (Tesla, Volvo, Zeekr, XPeng, Lotus)": 1.6167,
        "4. Continental Luxury & Sport (Audi, BMW, Mercedes, Porsche, MINI, smart)": 1.7922,
    },

    "TELEMATICS_RELATIVITIES": {
        "1. Tier 1: Safe Edge EV Driver (Score >= 0.5)": 0.8800,
        "2. Tier 2: Standard Commuter (Opt-Out / Score < 0.5)": 1.0000,
        "3. Tier 3: High-Risk Aggressive (Score < 0.2)": 1.1000,
    },

    "BATTERY_CAPACITY_RELATIVITIES": {
        "1. Standard Pack (<60 kWh)": 1.0000,
        "2. Mid-Size Pack (60-80 kWh)": 1.1000,
        "3. High-Capacity Pack (>80 kWh)": 1.2500,
    },
    "FLOOD_TERRITORY_RELATIVITIES": {
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
        "Putrajaya": 0.9573,
        "Labuan": 0.9573,
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

_memory_config = None


def _deepcopy_default_config():
    return deepcopy(DEFAULT_CONFIG)


def _get_active_path() -> Path:
    # If in serverless (e.g. VERCEL), use TMP_CONFIG_PATH
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        return TMP_CONFIG_PATH
    return DEFAULT_CONFIG_PATH


def _ensure_config_file():
    path = _get_active_path()
    if not path.exists():
        if DEFAULT_CONFIG_PATH.exists() and path != DEFAULT_CONFIG_PATH:
            try:
                path.write_text(DEFAULT_CONFIG_PATH.read_text(encoding="utf-8"), encoding="utf-8")
                return path
            except OSError:
                pass
        try:
            path.write_text(json.dumps(_deepcopy_default_config(), indent=2), encoding="utf-8")
        except OSError:
            pass
    return path


def get_runtime_config():
    global _memory_config
    if _memory_config is not None:
        return deepcopy(_memory_config)

    path = _ensure_config_file()
    config = None
    if path.exists():
        try:
            with path.open("r", encoding="utf-8") as handle:
                config = json.load(handle)
        except (json.JSONDecodeError, OSError):
            config = None

    if config is None and DEFAULT_CONFIG_PATH.exists():
        try:
            with DEFAULT_CONFIG_PATH.open("r", encoding="utf-8") as handle:
                config = json.load(handle)
        except (json.JSONDecodeError, OSError):
            config = None

    merged = _deepcopy_default_config()
    if isinstance(config, dict):
        merged["global_constants"].update(config.get("global_constants", {}))
        for key, value in config.get("factors", {}).items():
            if isinstance(value, dict):
                merged["factors"][key] = value
    _memory_config = deepcopy(merged)
    return merged


def save_runtime_config(config):
    global _memory_config
    validated = _deepcopy_default_config()
    validated["global_constants"].update(config.get("global_constants", {}))
    for factor_name, factor_value in config.get("factors", {}).items():
        if isinstance(factor_value, dict):
            validated["factors"][factor_name] = factor_value

    _memory_config = deepcopy(validated)

    # Try saving to active path, then fallback to /tmp
    path = _get_active_path()
    try:
        path.write_text(json.dumps(validated, indent=2), encoding="utf-8")
    except OSError:
        try:
            TMP_CONFIG_PATH.write_text(json.dumps(validated, indent=2), encoding="utf-8")
        except OSError:
            pass
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
    global _memory_config
    _memory_config = _deepcopy_default_config()
    path = _get_active_path()
    try:
        path.write_text(json.dumps(_memory_config, indent=2), encoding="utf-8")
    except OSError:
        try:
            TMP_CONFIG_PATH.write_text(json.dumps(_memory_config, indent=2), encoding="utf-8")
        except OSError:
            pass
    return _deepcopy_default_config()

