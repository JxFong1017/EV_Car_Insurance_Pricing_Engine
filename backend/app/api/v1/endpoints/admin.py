from fastapi import APIRouter, HTTPException
from app.data.config_store import get_runtime_config, save_runtime_config, set_factor_dict, set_global_constant

router = APIRouter()


@router.get("/config")
def get_admin_config():
    return get_runtime_config()


@router.post("/config/global")
def save_global_constants(payload: dict):
    for key, value in payload.items():
        set_global_constant(key, value)
    return get_runtime_config()


@router.post("/config/factors/{factor_name}")
def save_factor(factor_name: str, payload: dict):
    if not isinstance(payload, dict):
        raise HTTPException(status_code=400, detail="Factor payload must be a dictionary of category -> multiplier")
    set_factor_dict(factor_name, payload)
    return {factor_name: payload}


@router.get("/config/factors/{factor_name}")
def get_factor(factor_name: str):
    config = get_runtime_config()
    if factor_name not in config["factors"]:
        raise HTTPException(status_code=404, detail=f"Factor '{factor_name}' not found")
    return {factor_name: config["factors"][factor_name]}
