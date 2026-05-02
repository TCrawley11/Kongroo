import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.generate import router as generate_router
from app.routes.rooms import router as rooms_router
from app.routes.ws import router as ws_router

app = FastAPI(title="Kongroo Image Generation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "*")],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(generate_router, prefix="/api")
app.include_router(rooms_router, prefix="/api")
app.include_router(ws_router)
