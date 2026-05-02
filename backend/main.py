import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.generate import router as generate_router
from app.routes.rooms import router as rooms_router
from app.routes.ws import router as ws_router

app = FastAPI(title="Kongroo Image Generation API")

frontend_url = os.environ.get("FRONTEND_URL", "*").strip()

if frontend_url == "*":
    cors_kwargs = {"allow_origin_regex": ".*"}
elif frontend_url.startswith("regex:"):
    cors_kwargs = {"allow_origin_regex": frontend_url[len("regex:"):]}
else:
    origins = [o.strip().rstrip("/") for o in frontend_url.split(",") if o.strip()]
    cors_kwargs = {"allow_origins": origins}

app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    **cors_kwargs,
)

app.include_router(generate_router, prefix="/api")
app.include_router(rooms_router, prefix="/api")
app.include_router(ws_router)
