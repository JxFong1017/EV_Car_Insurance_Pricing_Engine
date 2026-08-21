from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("⚡ VoltVision EV Pricing Engine starting up...")
    yield
    logger.info("VoltVision shutting down.")


app = FastAPI(
    title="VoltVision EV Pricing Engine API",
    version="1.0.0",
    description="Poisson-Gamma GLM actuarial pricing engine for Malaysian electric vehicles.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "VoltVision EV Pricing Engine", "version": "1.0.0"}
