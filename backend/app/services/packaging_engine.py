from app.models.schemas import PackagingBreakdown

RIDER_CONFIG = {
    "mobility": {
        "label": "Battery Downtime Mobility Allowance (RM 4,000 limit)",
        "amount": 223.92,
    },
    "ncd_shield": {
        "label": "NCD Shield / 1-Tier Step-Down Protector",
        "amount": 0.0,  # Applied as % loading on base gross
    },
    "cyber": {
        "label": "Cyber Security V2G Protection Rider",
        "amount": 0.0,  # Applied as % loading on base gross
    },
}

TIER_1_ITEMS = [
    {"label": "Portable Charging Cable (RM 5,000 SI)", "cost": "Included in RM 15 Fee", "amount": 0.0},
    {"label": "Public Charging Inconvenience (RM 5,000 SI)", "cost": "Included in RM 15 Fee", "amount": 0.0},
    {"label": "24-Hour Battery Towing (Nearest EV Charger)", "cost": "Included in RM 15 Fee", "amount": 0.0},
]

TIER_2_ITEMS = [
    {"label": "All Tier 1 Public Charging Benefits", "cost": "Included in RM 93 Fee", "amount": 0.0},
    {"label": "EV Home Wall Charger Cover (RM 20,000 SI)", "cost": "Included in RM 93 Fee", "amount": 0.0},
    {"label": "Wall Charger Personal Liability (RM 50,000 SI)", "cost": "Included in RM 93 Fee", "amount": 0.0},
    {"label": "Cleaning Cost Allowance (RM 3,000)", "cost": "Included in RM 93 Fee", "amount": 0.0},
    {"label": "Collateral Home Fire Damage Cover (RM 20,000 SI)", "cost": "Included in RM 93 Fee", "amount": 0.0},
]

TIER_3_ITEMS = [
    {"label": "Loss or Damage to Home Wall Charger (RM 12,000 SI)", "cost": "Included in RM 150 Fee", "amount": 0.0},
    {"label": "Personal Liability due to Home Wall Charger (RM 50,000 SI)", "cost": "Included in RM 150 Fee", "amount": 0.0},
    {"label": "Compassionate Cover for Home Damage (RM 5,000 SI)", "cost": "Included in RM 150 Fee", "amount": 0.0},
    {"label": "Loss or Damage to Portable Electric Charger (RM 2,000 SI)", "cost": "Included in RM 150 Fee", "amount": 0.0},
    {"label": "Compassionate Cover at Public Charging Station (RM 5,000 SI)", "cost": "Included in RM 150 Fee", "amount": 0.0},
    {"label": "24-Hour Towing Assistance (Unlimited Mileage)", "cost": "Included in RM 150 Fee", "amount": 0.0},
]


def calculate_packaging(
    tier_mode: str,
    selected_riders: list[str],
    smart_grid_enrolled: bool,
    base_motor_gross: float,
    sum_insured: float,
) -> PackagingBreakdown:
    tier_loading_factor = 1.0
    smart_grid_discount = 1.0
    final_base_gross = base_motor_gross
    package_premium = 0.0
    rider_items: list[dict] = []

    def apply_ecosystem_addons() -> None:
        nonlocal final_base_gross, package_premium
        if "ncd_shield" in selected_riders:
            final_base_gross *= 1.1000
            rider_items.append({
                "label": RIDER_CONFIG["ncd_shield"]["label"],
                "cost": "+10% Base Motor Surcharge",
                "amount": round(base_motor_gross * 0.10, 2),
            })

        if "cyber" in selected_riders:
            final_base_gross *= 1.1000
            rider_items.append({
                "label": RIDER_CONFIG["cyber"]["label"],
                "cost": "+10% Base Motor Surcharge",
                "amount": round(base_motor_gross * 0.10, 2),
            })

        if "mobility" in selected_riders:
            mobility_premium = RIDER_CONFIG["mobility"]["amount"]
            package_premium += mobility_premium
            rider_items.append({
                "label": RIDER_CONFIG["mobility"]["label"],
                "cost": f"RM {mobility_premium:.2f}",
                "amount": mobility_premium,
            })

    if tier_mode == "1":
        tier_name = "Tier 1: EV Essential (Condo Segment)"
        package_premium = 15.00
        rider_items = list(TIER_1_ITEMS)
        apply_ecosystem_addons()

    elif tier_mode == "2":
        tier_name = "Tier 2: EV Advanced (Landed Segment)"
        package_premium = 93.00
        rider_items = list(TIER_2_ITEMS)
        apply_ecosystem_addons()

    elif tier_mode == "3":
        tier_name = "Tier 3: EV 365 Premium (The Ecosystem Standard)"
        package_premium = 150.00
        rider_items = list(TIER_3_ITEMS)
        apply_ecosystem_addons()

    else:  # basic — standalone riders only
        tier_name = "Basic Comprehensive Cover (Standalone)"
        apply_ecosystem_addons()

    tier_loading_factor = round(final_base_gross / base_motor_gross, 4) if base_motor_gross else 1.0

    return PackagingBreakdown(
        tier_name=tier_name,
        tier_loading_factor=tier_loading_factor,
        smart_grid_discount=smart_grid_discount,
        final_base_gross=final_base_gross,
        package_premium=round(package_premium, 2),
        rider_items=rider_items,
    )
