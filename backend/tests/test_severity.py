import pytest
from app.services.severity_engine import calculate_severity
from app.models.schemas import QuoteRequest

@pytest.fixture
def base_quote():
    return QuoteRequest(
        sum_insured=100000,
        power_cat="1. Urban / Commuter (<150 kW)",
        capacity_cat="1. Standard Pack (<60 kWh)",
        clearance_cat="2. Sedan / Hatchback (140-170mm)",
        brand_cat="1. Mass Market / Standard (BYD, Chery, GWM, Neta, MG)",
        adas_cat="1. Standard / Level 0-1 (No Active AEB)",
        age_cat="1. 18-24 years",
        ncd_str="0%",
        veh_age_cat="1. 0-1 years",
        state="Kuala Lumpur",
        soh_cat="2. Standard Health (70-85% SoH)",
        tier_mode="basic"
    )

def test_partial_loss_component(base_quote):
    res = calculate_severity(base_quote)
    assert res.partial_loss_component == 4425.0

def test_total_loss_scales(base_quote):
    res1 = calculate_severity(base_quote)
    assert res1.total_loss_component == 100000 * 0.0180
    
    base_quote.sum_insured = 200000
    res2 = calculate_severity(base_quote)
    assert res2.total_loss_component == 200000 * 0.0180

def test_battery_multiplier(base_quote):
    res1 = calculate_severity(base_quote)
    assert res1.battery_multiplier == 1.0
    
    base_quote.capacity_cat = "2. Mid-Size Pack (60-80 kWh)"
    res2 = calculate_severity(base_quote)
    assert res2.battery_multiplier == 1.10
    
    base_quote.capacity_cat = "3. High-Capacity Pack (>80 kWh)"
    res3 = calculate_severity(base_quote)
    assert res3.battery_multiplier == 1.25

def test_flood_territory(base_quote):
    base_quote.state = "Terengganu"
    res = calculate_severity(base_quote)
    assert res.territory_relativity == 1.28
    
    base_quote.state = "Kuala Lumpur"
    res = calculate_severity(base_quote)
    assert res.territory_relativity == 0.96
