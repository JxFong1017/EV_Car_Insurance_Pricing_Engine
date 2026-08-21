from fastapi import APIRouter
from app.api.v1.endpoints import quote, catalog

api_router = APIRouter()
api_router.include_router(quote.router, prefix="")
api_router.include_router(catalog.router, prefix="")
