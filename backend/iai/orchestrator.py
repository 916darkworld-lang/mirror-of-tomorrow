"""
Mirror of Tomorrow - Orchestrator
---------------------------------
Coordinates all intelligence engines and produces a unified
intelligence state for the renderer and frontend.

This is the central brain that:
  - runs emotional, predictive, pattern, cognitive, ethical, context,
    memory, insight, fusion, meta, and synthesis engines
  - merges their outputs
  - produces a final intelligence package
"""

from .emotional_engine import EmotionalEngine
from .predictive_engine import PredictiveEngine
from .pattern_engine import PatternEngine
from .ethical_engine import EthicalEngine
from .cognitive_engine import CognitiveEngine
from .context_engine import ContextEngine
from .memory_engine import MemoryEngine
from .insight_engine import InsightEngine
from .signal_fusion_engine import SignalFusionEngine
from .meta_engine import MetaEngine
from .synthesis_engine import SynthesisEngine
from .final_output_engine import FinalOutputEngine


class Orchestrator:

    def __init__(self):
        # Instantiate all engines
        self.emotional = EmotionalEngine()
        self.predictive = PredictiveEngine()
        self.pattern = PatternEngine()
        self.ethical = EthicalEngine()
        self.cognitive = CognitiveEngine()
        self.context = ContextEngine()
        self.memory = MemoryEngine()
        self.insight = InsightEngine()
        self.fusion = SignalFusionEngine()
        self.meta = MetaEngine()
        self.synthesis = SynthesisEngine()
        self.final_output = FinalOutputEngine()

    def process(self, text: str) -> dict:
        """
        Run all engines and produce a unified intelligence state.
        """

        # 1. Run base engines
        emotional = self.emotional.analyze(text)
        predictive = self.predictive.predict(text)
        pattern = self.pattern.detect(text)
        cognitive = self.cognitive.evaluate(text)
        context = self.context.interpret(text)
        memory = self.memory.recall(text)

        # 2. Combine raw signals
        combined = {
            "emotional": emotional,
            "predictive": predictive,
            "pattern": pattern,
            "cognitive": cognitive,
            "context": context,
            "memory": memory
        }

        # 3. Meta-level evaluation
        meta = self.meta.evaluate(combined)
        combined["meta"] = meta

        # 4. Insight generation
        insights = self.insight.generate(combined)
        combined["insights"] = insights.get("insights", [])
        combined["summary"] = insights.get("summary", "")

        # 5. Ethical evaluation
        ethical = self.ethical.evaluate(combined)
        combined["ethical"] = ethical

        # 6. Fuse signals
        fused = self.fusion.fuse(combined)

        # 7. Synthesize final intelligence
        synthesized = self.synthesis.synthesize(fused)

        # 8. Build final output
        final_output = self.final_output.build(synthesized)

        return final_output
