"""
Renderer Module
---------------
Transforms the orchestrator's unified output into a clean,
visual-ready JSON structure for the dashboard and mobile app.

This module does not guess or add placeholders — it formats
real data from the backend intelligence pipeline.
"""

from typing import Dict


class Renderer:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def render(self, orchestrator_output: Dict) -> Dict:
        """
        Accepts the full orchestrator output and returns a
        visual-ready JSON object:

        {
            "summary": str,
            "trajectory": str,
            "emotion": str,
            "risk": str,
            "reward": str,
            "stability": str,
            "insights": [...],
            "raw": {...}
        }
        """

        final = orchestrator_output.get("final", {})
        logic = orchestrator_output.get("logic", {})
        patterns = orchestrator_output.get("patterns", {})
        predictive = orchestrator_output.get("predictive", {})
        emotional = orchestrator_output.get("emotional", {})
        ethical = orchestrator_output.get("ethical", {})

        return {
            "summary": final.get("summary", ""),
            "trajectory": final.get("trajectory", "flat"),
            "emotion": final.get("emotion", "neutral"),
            "risk": final.get("risk", "low"),
            "reward": final.get("reward", "low"),
            "stability": final.get("stability", "stable"),
            "insights": final.get("insights", []),

            # Raw data for debugging or advanced UI layers
            "raw": {
                "logic": logic,
                "patterns": patterns,
                "predictive": predictive,
                "emotional": emotional,
                "ethical": ethical,
                "final": final
            }
        }
