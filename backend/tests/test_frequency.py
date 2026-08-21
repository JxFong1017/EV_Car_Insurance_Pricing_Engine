import pytest
from app.services.frequency_engine import calculate_frequency
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

def test_base_case(base_quote):
    res = calculate_frequency(base_quote)
    expected = 0.0841 * 1.1612 * 1.0 * 1.0 * 1.0 * 1.0
    assert abs(res.exp_frequency - expected) < 1e-6

def test_power_categories(base_quote):
    base_quote.power_cat = "2. Mid-Range Performance (150-250 kW)"
    res = calculate_frequency(base_quote)
    expected = 0.0841 * 1.2880 * 1.0 * 1.0 * 1.0 * 1.0
    assert abs(res.exp_frequency - expected) < 1e-6

    base_quote.power_cat = "3. High-Performance AWD (>250 kW)"
    res = calculate_frequency(base_quote)
    expected = 0.0841 * 1.4232 * 1.0 * 1.0 * 1.0 * 1.0
    assert abs(res.exp_frequency - expected) < 1e-6

def test_adas_discount(base_quote):
    base_res = calculate_frequency(base_quote)
    base_quote.adas_cat = "2. Level 2 Active ADAS (AEB + LKA Equipped)"
    adas_res = calculate_frequency(base_quote)
    
    assert abs(adas_res.exp_frequency - (base_res.exp_frequency * 0.8270)) < 1e-6
