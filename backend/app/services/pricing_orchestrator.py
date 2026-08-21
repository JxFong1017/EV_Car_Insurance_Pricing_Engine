from fastapi import HTTPException
from app.models.schemas import QuoteRequest, QuoteResponse
from app.services.frequency_engine import calculate_frequency
from app.services.severity_engine import calculate_severity
from app.services.packaging_engine import calculate_packaging
from app.data.relativities import RISK_MARGIN, POLICY_ADMIN_FEE, AUDITED_UW_DENOMINATOR, STATUTORY_NCD_RATES

def calculate_quote(inputs: QuoteRequest) -> QuoteResponse:
    if inputs.ncd_str not in STATUTORY_NCD_RATES:
        raise HTTPException(status_code=422, detail=f"Invalid ncd_str: {inputs.ncd_str}")
    
    freq_bd = calculate_frequency(inputs)
    sev_bd = calculate_severity(inputs)
    
    pure_premium = freq_bd.exp_frequency * sev_bd.exp_severity
    unadjusted_gross = ((pure_premium * (1 + RISK_MARGIN)) + POLICY_ADMIN_FEE) / AUDITED_UW_DENOMINATOR
    
    ncd_rate = STATUTORY_NCD_RATES[inputs.ncd_str]
    ncd_discount_amount = unadjusted_gross * ncd_rate
    base_motor_gross = unadjusted_gross * (1 - ncd_rate)
    
    packaging = calculate_packaging(
        inputs.tier_mode, 
        inputs.selected_riders, 
        inputs.smart_grid_enrolled, 
        base_motor_gross, 
        inputs.sum_insured
    )
    
    total_payable_premium = packaging.final_base_gross + packaging.package_premium
    
    return QuoteResponse(
        model_name=inputs.model_name,
        sum_insured=inputs.sum_insured,
        frequency=freq_bd,
        severity=sev_bd,
        pure_premium=pure_premium,
        risk_margin_loading=RISK_MARGIN,
        policy_admin_fee=POLICY_ADMIN_FEE,
        uw_denominator=AUDITED_UW_DENOMINATOR,
        unadjusted_gross=unadjusted_gross,
        ncd_rate=ncd_rate,
        ncd_discount_amount=ncd_discount_amount,
        base_motor_gross=base_motor_gross,
        packaging=packaging,
        total_payable_premium=total_payable_premium
    )
