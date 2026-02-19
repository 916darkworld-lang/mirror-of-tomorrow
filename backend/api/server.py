"""
Mirror of Tomorrow - Backend API
--------------------------------
Exposes the IAI Orchestrator + Renderer as a simple HTTP API.

Endpoint:
  POST /analyze
  Body: { "text": "..." }

Response:
  {
    "summary": ...,
    "trajectory": ...,
    "emotion": ...,
    "risk": ...,
    "reward": ...,
    "stability": ...,
    "insights": [...],
    "raw": {...}
  }
"""

from typing import Dict

from fastapi import FastAPI
from pydantic import BaseModel

from backend.iai.orchestrator import IAIOrchestrator
from backend.renderer.renderer import Renderer


app = FastAPI(title="Mirror of Tomorrow API")

orchestrator = IAIOrchestrator()
renderer = Renderer()


class AnalyzeRequest(BaseModel):
    text: str


@app.post("/analyze")
def analyze(request: AnalyzeRequest) -> Dict:
    """
    Runs the full pipeline and returns a visual-ready JSON object.
    """
    text = request.text.strip()

    if not text:
        return {
            "error": "Text is required.",
            "summary": "",
            "trajectory": "flat",
            "emotion": "neutral",
            "risk": "low",
            "reward": "low",
            "stability": "stable",
            "insights": [],
            "raw": {}
        }

    # Run orchestrator
    pipeline_output = orchestrator.run(text)

    # Render visual JSON
    rendered = renderer.render(pipeline_output)

    return rendered
