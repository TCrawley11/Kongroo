import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.generate import router as generate_router
from app.routes.rooms import router as rooms_router
from app.routes.ws import router as ws_router

app = FastAPI(title="Kongroo Image Generation API")

frontend_url = os.environ.get("FRONTEND_URL", "*")
origins = ["*"] if frontend_url == "*" else [o.strip() for o in frontend_url.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router, prefix="/api")
app.include_router(rooms_router, prefix="/api")
app.include_router(ws_router)
