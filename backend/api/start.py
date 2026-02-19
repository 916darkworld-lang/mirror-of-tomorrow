"""
Mirror of Tomorrow - API Launcher
---------------------------------
This file starts the FastAPI server that exposes the
orchestrator + renderer pipeline.

Run with:
    uvicorn backend.api.start:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from backend.api.server import app as api_app

# This wraps the API so uvicorn can run it cleanly
app = FastAPI(title="Mirror of Tomorrow")

# Mount the API routes
app.mount("/", api_app)
