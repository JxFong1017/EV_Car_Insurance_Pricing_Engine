from app.models.schemas import PackagingBreakdown

AUDITED_UW_DENOMINATOR = 0.4190

RIDER_CONFIG = {
    "wall_charger": {
        "label": "Home Wall Charger Physical Damage (RM 10,000 SI)",
        "amount": 0.00338 * 10000,
    },
    "cable": {
        "label": "Portable Charging Cable Theft Cover (RM 1,000 SI)",
        "amount": 0.1500 * 1000,
    },
    "mobility": {
        "label": "Battery Downtime Mobility Allowance (RM 4,000 limit)",
        "amount": (0.0358 * 4000) / AUDITED_UW_DENOMINATOR,
    },
    "flood": {
        "label": "Flood Relief Cash Inconvenience Allowance (RM 2,000 SI)",
        "amount": (0.0089 * 2000) / AUDITED_UW_DENOMINATOR,
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
    {"label": "Portable Cable Theft Cover (RM 1,000 SI)", "cost": "Included in RM 95 Flat Fee", "amount": 0.0},
    {"label": "Public Charger Third-Party Liability (RM 50,000 SI)", "cost": "Included in RM 95 Flat Fee", "amount": 0.0},
    {"label": "24-Hour Battery Towing (Unlimited Distance)", "cost": "Included in RM 95 Flat Fee", "amount": 0.0},
]

TIER_2_ITEMS = [
    {"label": "All Tier 1 Public Charging Protections", "cost": "Included in RM 150 Flat Fee", "amount": 0.0},
    {"label": "Home Wall Charger Physical Damage (RM 10,000 SI)", "cost": "Included in RM 150 Flat Fee", "amount": 0.0},
    {"label": "Wall Charger Personal Liability (RM 50,000 SI)", "cost": "Included in RM 150 Flat Fee", "amount": 0.0},
    {"label": "Collateral Home Fire Damage Cover (RM 20,000 SI)", "cost": "Included in RM 150 Flat Fee", "amount": 0.0},
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

    mobility_premium = round((0.0358 * 4000) / AUDITED_UW_DENOMINATOR, 2)

    if tier_mode == "1":
        tier_name = "Tier 1: EV Essential (Condo Segment)"
        package_premium = 95.00
        rider_items = list(TIER_1_ITEMS)
        if smart_grid_enrolled:
            smart_grid_discount = 0.95
            final_base_gross = base_motor_gross * smart_grid_discount
            rider_items.append({
                "label": "Smart Grid Off-Peak Program Credit",
                "cost": "-5% Base Premium Discount",
                "amount": -(base_motor_gross * 0.05),
            })

    elif tier_mode == "2":
        tier_name = "Tier 2: EV Advanced (Landed Segment)"
        package_premium = 150.00
        rider_items = list(TIER_2_ITEMS)

    elif tier_mode == "3":
        tier_name = "Tier 3: EV Pluss (Comprehensive Ecosystem)"
        tier_loading_factor = 1.10
        final_base_gross = base_motor_gross * tier_loading_factor
        package_premium = mobility_premium
        rider_items = [
            {"label": "All Tier 2 Landed Benefits", "cost": "Included", "amount": 0.0},
            {"label": "NCD Shield / 1-Tier Step-Down Protector", "cost": "Included (+10% Base Loading)", "amount": 0.0},
            {"label": "Cyber Security V2G Protection", "cost": "Included (+10% Base Loading)", "amount": 0.0},
            {"label": f"Battery Downtime Mobility Allowance (RM 4,000 limit)", "cost": f"RM {mobility_premium:.2f}", "amount": mobility_premium},
            {"label": "High-Voltage Cable Pest/Rodent Damage (RM 30,000 SI)", "cost": "Included", "amount": 0.0},
            {"label": "EV Tire Hazard & Puncture Clause (>3mm tread)", "cost": "Included", "amount": 0.0},
        ]

    else:  # basic — standalone riders only
        tier_name = "Basic Comprehensive Cover (Standalone)"
        pct_loading = 0.0
        for rider_id in selected_riders:
            if rider_id in ["ncd_shield", "cyber"]:
                pct_loading += 0.10
                cfg = RIDER_CONFIG[rider_id]
                rider_items.append({
                    "label": cfg["label"],
                    "cost": "+10% Base Motor Surcharge",
                    "amount": base_motor_gross * 0.10,
                })
            elif rider_id in RIDER_CONFIG:
                cfg = RIDER_CONFIG[rider_id]
                amount = round(cfg["amount"], 2)
                rider_items.append({
                    "label": cfg["label"],
                    "cost": f"RM {amount:.2f}",
                    "amount": amount,
                })
                package_premium += amount

        if pct_loading > 0:
            tier_loading_factor = 1.0 + pct_loading
            final_base_gross = base_motor_gross * tier_loading_factor

    return PackagingBreakdown(
        tier_name=tier_name,
        tier_loading_factor=tier_loading_factor,
        smart_grid_discount=smart_grid_discount,
        final_base_gross=final_base_gross,
        package_premium=round(package_premium, 2),
        rider_items=rider_items,
    )
