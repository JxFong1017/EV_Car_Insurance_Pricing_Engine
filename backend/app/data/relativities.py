BASE_FREQUENCY_LAMBDA0 = 0.0841
PARTIAL_REPAIR_M_PARTIAL = 4425.00
TOTAL_LOSS_PROB_P_TL = 0.0180
RISK_MARGIN = 0.1500
POLICY_ADMIN_FEE = 50.00
AUDITED_UW_DENOMINATOR = 0.4190

POWER_RELATIVITIES = {
    "1. Urban / Commuter (<150 kW)": 1.1612,
    "2. Mid-Range Performance (150-250 kW)": 1.2880,
    "3. High-Performance AWD (>250 kW)": 1.4232
}

DRIVER_AGE_RELATIVITIES = {
    "1. 18-24 years": 1.0000,
    "2. 25-30 years": 0.5477,
    "3. 31-40 years": 0.4596,
    "4. 41-50 years": 0.5375,
    "5. 51-60 years": 0.4874,
    "6. 61-75 years": 0.4781,
    "7. 76+ years": 0.5255
}

VEHICLE_AGE_RELATIVITIES = {
    "1. 0-1 years": 1.0000,
    "2. 2-3 years": 0.5909,
    "3. 4-6 years": 0.6247,
    "4. 7-10 years": 0.6241,
    "5. 11+ years": 0.5104
}

ADAS_RELATIVITIES = {
    "1. Standard / Level 0-1 (No Active AEB)": 1.0000,
    "2. Level 2 Active ADAS (AEB + LKA Equipped)": 0.8270
}

BRAND_RELATIVITIES = {
    "1. Mass Market / Standard (BYD, Chery, GWM, Neta, MG)": 1.0000,
    "2. Premium / Mid-Tier (Tesla, Hyundai, Smart)": 1.0500,
    "3. Continental Luxury / Sport (Porsche, BMW, Mercedes)": 1.1500
}

BATTERY_CAPACITY_RELATIVITIES = {
    "1. Standard Pack (<60 kWh)": 1.0000,
    "2. Mid-Size Pack (60-80 kWh)": 1.1000,
    "3. High-Capacity Pack (>80 kWh)": 1.2500
}

FLOOD_TERRITORY_RELATIVITIES = {
    "Kuala Lumpur": 0.9600, "Selangor": 1.0200, "Terengganu": 1.2800,
    "Kelantan": 1.3500, "Pahang": 1.2200, "Johor": 1.0800,
    "Penang": 0.9800, "Perak": 1.0400, "Melaka": 0.9700,
    "Negeri Sembilan": 0.9900, "Kedah": 1.0600, "Perlis": 1.0300,
    "Sabah": 1.1200, "Sarawak": 1.1400, "Putrajaya": 0.9500, "Labuan": 0.9600
}

GROUND_CLEARANCE_MULTIPLIERS = {
    "1. Sports Car / Low EV (<140mm)": 1.0500,
    "2. Sedan / Hatchback (140-170mm)": 1.0000,
    "3. Minivan / Crossover (175-190mm)": 0.9600,
    "4. SUV / Off-Roader (>190mm)": 0.8600
}

BATTERY_SOH_RELATIVITIES = {
    "1. Optimal Health (>85% SoH)": 0.9000,
    "2. Standard Health (70-85% SoH)": 1.0000,
    "3. Degraded Health (<70% SoH / High Resistance)": 1.3000
}

STATUTORY_NCD_RATES = {
    "0%": 0.0000, "25%": 0.2500, "30%": 0.3000,
    "38.33%": 0.3833, "45%": 0.4500, "55%": 0.5500
}
