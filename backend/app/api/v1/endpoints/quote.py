from fastapi import APIRouter
from app.models.schemas import QuoteRequest, QuoteResponse
from app.services.pricing_orchestrator import calculate_quote

router = APIRouter()

@router.post("/quote", response_model=QuoteResponse)
def create_quote(request: QuoteRequest):
    return calculate_quote(request)
