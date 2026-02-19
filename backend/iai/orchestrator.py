"""
IAI Orchestrator
----------------
Coordinates all backend agent modules into a single processing pipeline.
This is the core engine that the frontend and renderer will call.

Pipeline:
1. Logic Module
2. Pattern Module
3. Predictive Module
4. Emotional Module
5. Ethical Governor
6. Synthesis Module
"""

from typing import Dict

from backend.agents.logic_module import LogicModule
from backend.agents.pattern_module import PatternModule
from backend.agents.predictive_module import PredictiveModule
from backend.agents.emotional_module import EmotionalModule
from backend.agents.ethical_governor import EthicalGovernor
from backend.agents.synthesis_module import SynthesisModule


class IAIOrchestrator:

    def __init__(self):
        self.logic = LogicModule()
        self.patterns = PatternModule()
        self.predictive = PredictiveModule()
        self.emotions = EmotionalModule()
        self.ethics = EthicalGovernor()
        self.synthesis = SynthesisModule()

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def run(self, text: str) -> Dict:
        """
        Runs the full pipeline and returns a unified future-state object.
        """

        # 1. Logic
        logic_out = self.logic.process(text)

        # 2. Patterns
        pattern_out = self.patterns.analyze(logic_out)

        # 3. Predictive
        predictive_out = self.predictive.forecast(logic_out, pattern_out)

        # 4. Emotional
        emotional_out = self.emotions.evaluate(logic_out)

        # 5. Ethical Governor
        ethical_out = self.ethics.regulate(
            logic_out,
            pattern_out,
            predictive_out,
            emotional_out
        )

        # 6. Synthesis
        final = self.synthesis.synthesize(
            logic_out,
            pattern_out,
            predictive_out,
            emotional_out,
            ethical_out
        )

        return {
            "logic": logic_out,
            "patterns": pattern_out,
            "predictive": predictive_out,
            "emotional": emotional_out,
            "ethical": ethical_out,
            "final": final
        }
