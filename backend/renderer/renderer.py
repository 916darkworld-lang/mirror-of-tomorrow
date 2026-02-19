"""
Mirror of Tomorrow - Renderer
-----------------------------
Takes the orchestrator's raw output and converts it into a clean,
UI‑friendly JSON structure for the dashboard.

Later, this renderer can:
  - add color coding
  - add severity levels
  - add trend arcs
  - add emotion rings
  - add hologram metadata
"""

class Renderer:

    def __init__(self):
        pass

    def render(self, data: dict) -> dict:
        """
        Convert orchestrator output into a frontend‑ready JSON object.
        """

        return {
            "summary": data.get("summary", ""),
            "trajectory": data.get("trajectory", "flat"),
            "emotion": data.get("emotion", "neutral"),
            "risk": data.get("risk", "low"),
            "reward": data.get("reward", "low"),
            "stability": data.get("stability", "stable"),
            "insights": data.get("insights", []),

            # Keep raw data available for debugging or advanced UI features
            "raw": data
        }
