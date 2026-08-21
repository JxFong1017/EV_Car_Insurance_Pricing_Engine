import urllib.request
import json

def test_health():
    req = urllib.request.Request("http://localhost:8000/health")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert data["status"] == "ok", f"Health check failed: {data}"
    print(f"[PASS] /health -> {data}")

def test_catalog_options():
    req = urllib.request.Request("http://localhost:8000/api/v1/catalog/options")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert "power_cats" in data
    assert len(data["states"]) == 16
    print(f"[PASS] /catalog/options -> {len(data)} keys, {len(data['states'])} states")

def test_catalog_models():
    req = urllib.request.Request("http://localhost:8000/api/v1/catalog/models")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert len(data) == 12
    print(f"[PASS] /catalog/models -> {len(data)} models")

def test_ic_preset_found():
    req = urllib.request.Request("http://localhost:8000/api/v1/catalog/ic/123456789012")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert data["found"] == True
    assert data["data"]["ncd_str"] == "55%"
    print(f"[PASS] /catalog/ic/123456789012 -> found=True, NCD=55%")

def test_ic_preset_not_found():
    req = urllib.request.Request("http://localhost:8000/api/v1/catalog/ic/UNKNOWN999")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert data["found"] == False
    print(f"[PASS] /catalog/ic/UNKNOWN999 -> found=False (fallback returned)")

def test_plate_preset():
    req = urllib.request.Request("http://localhost:8000/api/v1/catalog/plate/ABC1234")
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
    assert data["found"] == True
    assert data["data"]["state"] == "Terengganu"
    print(f"[PASS] /catalog/plate/ABC1234 -> found=True, state=Terengganu")

def test_full_quote():
    payload = json.dumps({
        "sum_insured": 189000,
        "power_cat": "2. Mid-Range Performance (150-250 kW)",
        "capacity_cat": "2. Mid-Size Pack (60-80 kWh)",
        "clearance_cat": "2. Sedan / Hatchback (140-170mm)",
        "brand_cat": "2. Premium / Mid-Tier (Tesla, Hyundai, Smart)",
        "adas_cat": "2. Level 2 Active ADAS (AEB + LKA Equipped)",
        "age_cat": "3. 31-40 years",
        "ncd_str": "0%",
        "veh_age_cat": "1. 0-1 years",
        "state": "Kuala Lumpur",
        "soh_cat": "1. Optimal Health (>85% SoH)",
        "tier_mode": "2",
        "selected_riders": [],
        "smart_grid_enrolled": False,
        "model_name": "Tesla Model 3 (Standard RWD)"
    }).encode()
    req = urllib.request.Request(
        "http://localhost:8000/api/v1/quote",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())

    freq = data["frequency"]["exp_frequency"]
    sev = data["severity"]["exp_severity"]
    total = data["total_payable_premium"]
    tier = data["packaging"]["tier_name"]

    assert total > 0
    assert freq > 0
    assert sev > 0
    print(f"\n{'='*55}")
    print(f"  SMOKE TEST: Tesla Model 3 (Standard RWD) — Tier 2")
    print(f"{'='*55}")
    print(f"  Expected Frequency  : {freq:.6f}  ({freq*100:.3f}% claim prob)")
    print(f"  Expected Severity   : RM {sev:,.2f}")
    print(f"  Pure Premium        : RM {data['pure_premium']:,.2f}")
    print(f"  Base Motor Gross    : RM {data['base_motor_gross']:,.2f}")
    print(f"  Tier                : {tier}")
    print(f"  Package Premium     : RM {data['packaging']['package_premium']:,.2f}")
    print(f"  TOTAL PAYABLE       : RM {total:,.2f}")
    print(f"{'='*55}")
    print("[PASS] Full quote endpoint returned valid response.")

if __name__ == "__main__":
    tests = [
        test_health,
        test_catalog_options,
        test_catalog_models,
        test_ic_preset_found,
        test_ic_preset_not_found,
        test_plate_preset,
        test_full_quote,
    ]
    passed = 0
    for t in tests:
        try:
            t()
            passed += 1
        except Exception as e:
            print(f"[FAIL] {t.__name__}: {e}")

    print(f"\n{passed}/{len(tests)} smoke tests passed.")
