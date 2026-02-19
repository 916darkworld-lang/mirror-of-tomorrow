"""
Mirror of Tomorrow - Backend Router
-----------------------------------
This module acts as the entry point for the intelligence system.

It:
  - receives user input
  - sends it to the orchestrator
  - formats the orchestrator's output
  - returns a clean, stable JSON structure for the frontend
"""

from iai.orchestrator import Orchestrator
from iai.response_formatter import ResponseFormatter


class Router:

    def __init__(self):
        self.orchestrator = Orchestrator()
        self.formatter = ResponseFormatter()

    def handle_request(self, text: str) -> dict:
        """
        Process a user request through the entire intelligence pipeline.
        """

        # 1. Run the orchestrator
        raw_output = self.orchestrator.process(text)

        # 2. Format the output for the frontend
        formatted = self.formatter.format(raw_output)

        return formatted
