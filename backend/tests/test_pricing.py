from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_valid_payload():
    return {
        "sum_insured": 100000,
        "power_cat": "1. Urban / Commuter (<150 kW)",
        "capacity_cat": "1. Standard Pack (<60 kWh)",
        "clearance_cat": "2. Sedan (Baseline) (128-149mm)",
        "brand_cat": "1. Mass Market / Domestic (BYD, Chery, Proton, GWM, Neta, MG)",
        "adas_cat": "1. Standard / Level 0-1 (No Active AEB)",
        "age_cat": "1. 18-24 years",
        "ncd_str": "0%",
        "veh_age_cat": "1. 0-1 years",
        "state": "Kuala Lumpur",
        "soh_cat": "2. Standard Health (70-85% SoH)",
        "tier_mode": "basic"
    }

def test_full_valid_payload():
    res = client.post("/api/v1/quote", json=get_valid_payload())
    assert res.status_code == 200
    data = res.json()
    assert data["total_payable_premium"] > 0

def test_invalid_sum_insured():
    payload = get_valid_payload()
    payload["sum_insured"] = 10000 # below 50000
    res = client.post("/api/v1/quote", json=payload)
    assert res.status_code == 422

def test_invalid_power_cat():
    payload = get_valid_payload()
    payload["power_cat"] = "Invalid"
    res = client.post("/api/v1/quote", json=payload)
    assert res.status_code == 422

def test_tier1_smart_grid():
    payload = get_valid_payload()
    payload["tier_mode"] = "1"
    payload["smart_grid_enrolled"] = True
    res = client.post("/api/v1/quote", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["packaging"]["smart_grid_discount"] == 0.95

def test_basic_mode_ncd_shield():
    payload = get_valid_payload()
    payload["tier_mode"] = "basic"
    payload["selected_riders"] = ["ncd_shield"]
    res = client.post("/api/v1/quote", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["packaging"]["tier_loading_factor"] == 1.10


def test_admin_config_endpoint_exposes_runtime_settings():
    res = client.get("/api/v1/admin/config")
    assert res.status_code == 200
    data = res.json()
    assert "global_constants" in data
    assert "factors" in data
    assert "POWER_RELATIVITIES" in data["factors"]


def test_admin_config_can_persist_a_factor_update():
    payload = {
        "factors": {
            "DRIVER_AGE_RELATIVITIES": {
                "1. 18-24 years": 2.1891,
                "2. 25-30 years": 1.1942,
                "3. 31-40 years": 1.0000,
                "4. 41-50 years": 1.1591,
                "5. 51-60 years": 1.0543,
                "6. 61-75 years": 1.0306,
                "7. 76+ years": 1.1239
            }
        }
    }
    res = client.post("/api/v1/admin/config/factors/DRIVER_AGE_RELATIVITIES", json=payload["factors"]["DRIVER_AGE_RELATIVITIES"])
    assert res.status_code == 200
    data = res.json()
    assert data["DRIVER_AGE_RELATIVITIES"]["1. 18-24 years"] == 2.1891
