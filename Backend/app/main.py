from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import fullpipeline_api

app = FastAPI()

# --- ✅ Enable CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(fullpipeline_api.router, prefix="/fullpipeline")
