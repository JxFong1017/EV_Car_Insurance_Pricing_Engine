# ⚡ VoltVision — EV Commercial Insurance Pricing Engine

A production-ready, full-stack actuarial web application for Malaysian electric vehicle commercial motor insurance pricing, built on a **Poisson-Gamma GLM** framework compliant with ASOP 12, CAS standards, and MFRS 17.

---

## Architecture

```
EV_Car_Insurance_Pricing_Engine/
├── backend/     FastAPI (Python 3.11+) — Actuarial GLM services
└── frontend/    Next.js 14 App Router — Interactive 3-mode calculator
```

---

## Quick Start

### 1. Backend (FastAPI)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --port 8000

# Run tests
python -m pytest tests/ -v
```

API available at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs  
Health check: http://localhost:8000/health

### 2. Frontend (Next.js 14)

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev
```

App available at: http://localhost:3000

---

## API Reference

### `POST /api/v1/quote`

Calculate a commercial motor insurance premium.

**Request Body:**
```json
{
  "sum_insured": 150000,
  "power_cat": "2. Mid-Range Performance (150-250 kW)",
  "capacity_cat": "2. Mid-Size Pack (60-80 kWh)",
  "clearance_cat": "2. Sedan / Hatchback (140-170mm)",
  "brand_cat": "2. Premium / Mid-Tier (Tesla, Hyundai, Smart)",
  "adas_cat": "2. Level 2 Active ADAS (AEB + LKA Equipped)",
  "age_cat": "3. 31-40 years",
  "ncd_str": "25%",
  "veh_age_cat": "1. 0-1 years",
  "state": "Kuala Lumpur",
  "soh_cat": "1. Optimal Health (>85% SoH)",
  "tier_mode": "2",
  "selected_riders": [],
  "smart_grid_enrolled": false,
  "model_name": "Tesla Model Y (Standard RWD)"
}
```

**`tier_mode` values:** `"1"` (Tier 1 Condo), `"2"` (Tier 2 Landed), `"3"` (Tier 3 Pluss), `"basic"` (Standalone riders)

**`selected_riders` options (basic mode only):**  
`wall_charger`, `cable`, `mobility`, `flood`, `ncd_shield`, `cyber`

---

### `GET /api/v1/catalog/models`
Returns all 12 Malaysian EV models with auto-mapped GLM categories.

### `GET /api/v1/catalog/ic/{ic_number}`
IC preset lookup. Try: `123456789012`, `123456789013`

### `GET /api/v1/catalog/plate/{plate}`
Plate preset lookup. Try: `ABC1234`, `ABC1235`

### `GET /api/v1/catalog/options`
All dropdown option lists for the frontend.

---

## Actuarial Methodology

| Component | Model | Key Driver |
|-----------|-------|------------|
| Claim Frequency | Poisson GLM | Motor output (kW) — instant torque acceleration hazard |
| Claim Severity | Gamma GLM (2-component mixture) | Battery capacity (kWh) — thermal runaway & replacement cost |
| Territory Loading | Flood Postcode Index | State-level flood relativity × Ground clearance depth factor |
| SoH Adjustment | Battery Health Factor | Degraded battery degradation surcharge |

**Key Constants:**
- Base Frequency λ₀: `0.0841` (10% local credibility + 90% global BAJ 2025)
- Partial Repair Cost: `RM 4,425.00` (ISM RM 3,526 + 25.5% EV inflation)
- Total Loss Probability: `1.80%`
- Risk Margin: `+15.0%` (Parameter uncertainty loading)
- UW Denominator: `0.4190` (MFRS 17 premium-weighted competitor baseline)

---

## Commercial Product Tiers

| Tier | Target | Cost | Key Benefits |
|------|--------|------|--------------|
| Basic | Comprehensive only | No add-on | Base motor coverage |
| Tier 1 | Condo Dwellers | RM 95 flat | Cable theft, Public charger TPL, 24hr towing |
| Tier 2 | Landed Homeowners | RM 150 flat | All Tier 1 + Wall charger cover, Liability, Fire |
| Tier 3 | EV Pluss | +10% base + mobility | Full ecosystem incl. NCD Shield, Cyber V2G, Pest cover |

**Smart Grid:** Tier 1 only — 5% base premium discount for off-peak charging enrollment.

---

## Environment Variables

**Backend** (`backend/.env`):
```
APP_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## License

Internal actuarial tool. Not for public distribution.
