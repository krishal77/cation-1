import sys
import json
import pickle
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

SERVICE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SERVICE_DIR))

from core.clip_model import load_clip_model
from core.embedding import embed_image
from core.matcher import HeritageMatcher

app = FastAPI(
    title="Culture Guide AI Recognition Microservice",
    description="OpenCLIP ViT-B-32 Heritage Site Recognition API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None
PREPROCESS = None
DEVICE = None
DATABASE = {}
MATCHER = None
HERITAGE_METADATA = {}


def init_service():
    global MODEL, PREPROCESS, DEVICE, DATABASE, MATCHER, HERITAGE_METADATA

    db_path = SERVICE_DIR / "database" / "embeddings.pkl"
    meta_path = SERVICE_DIR / "data" / "heritage.json"

    if meta_path.exists():
        with open(meta_path, "r", encoding="utf-8") as f:
            HERITAGE_METADATA = json.load(f)

    if not db_path.exists():
        print(f"[Warning] Database file not found at {db_path}. Running embedding script...")
        from scripts.create_embeddings import main as run_build
        sys.argv = ["create_embeddings.py"]
        run_build()

    with open(db_path, "rb") as f:
        DATABASE = pickle.load(f)

    MODEL, PREPROCESS, DEVICE = load_clip_model("ViT-B-32", pretrained="openai")
    MATCHER = HeritageMatcher(DATABASE, confidence_threshold=0.60)
    print("AI Service fully initialized!")


@app.on_event("startup")
async def startup_event():
    init_service()


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "openclip-ai-service",
        "loaded_sites": list(DATABASE.keys()) if DATABASE else []
    }


@app.post("/predict")
async def predict(
    image: UploadFile = File(...),
    threshold: Optional[float] = Query(None, description="Custom confidence threshold")
):
    if not image:
        raise HTTPException(status_code=400, detail="No image file provided.")

    try:
        image_bytes = await image.read()
        query_vector = embed_image(MODEL, PREPROCESS, image_bytes, DEVICE)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")

    match_res = MATCHER.match(query_vector, threshold=threshold)

    site_name = match_res["best_match"]
    metadata = None
    if site_name and site_name in HERITAGE_METADATA:
        metadata = HERITAGE_METADATA[site_name]

    return {
        "success": match_res["is_confident"],
        "site_name": site_name,
        "confidence": match_res["confidence"],
        "is_confident": match_res["is_confident"],
        "threshold_used": match_res["threshold_used"],
        "top_candidate": match_res["top_candidate"],
        "all_scores": match_res["all_scores"],
        "metadata": metadata
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

