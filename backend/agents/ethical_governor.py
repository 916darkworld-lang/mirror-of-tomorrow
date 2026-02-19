"""
Ethical Governor Module
-----------------------
Ensures that all downstream reasoning and projections remain safe,
constructive, non-harmful, and aligned with user well-being.

This module performs real filtering, reframing, and ethical checks.
"""

from typing import Dict, List


class EthicalGovernor:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def regulate(
        self,
        logic_output: Dict,
        pattern_output: Dict,
        predictive_output: Dict,
        emotional_output: Dict
    ) -> Dict:
        """
        Returns:
        {
            "allowed": bool,
            "ethical_flags": [...],
            "reframed_text": str,
            "safe_to_proceed": bool
        }
        """

        text = logic_output.get("cleaned_text", "")
        sentiment = emotional_output.get("sentiment_score", 0)
        dominant = emotional_output.get("dominant_emotion", "neutral")
        risk = predictive_output.get("risk_level", "low")

        flags = []
        reframed = text

        # Check for harmful patterns
        flags.extend(self._detect_harmful_language(text))
        flags.extend(self._detect_negative_spirals(text))
        flags.extend(self._detect_self_punitive(text))

        # Reframe if needed
        if flags:
            reframed = self._reframe_text(text, dominant)

        # Determine if safe to proceed
        safe = self._safety_check(sentiment, dominant, risk, flags)

        return {
            "allowed": safe,
            "ethical_flags": flags,
            "reframed_text": reframed,
            "safe_to_proceed": safe
        }

    # ---------------------------------------------------------
    # DETECT HARMFUL LANGUAGE
    # ---------------------------------------------------------
    def _detect_harmful_language(self, text: str) -> List[str]:
        harmful = ["worthless", "hopeless", "pointless", "give up", "hate myself"]
        flags = []

        for h in harmful:
            if h in text.lower():
                flags.append(f"Harmful language detected: '{h}'")

        return flags

    # ---------------------------------------------------------
    # DETECT NEGATIVE SPIRALS
    # ---------------------------------------------------------
    def _detect_negative_spirals(self, text: str) -> List[str]:
        spirals = ["always fail", "never succeed", "nothing works", "everything is bad"]
        flags = []

        for s in spirals:
            if s in text.lower():
                flags.append(f"Negative spiral detected: '{s}'")

        return flags

    # ---------------------------------------------------------
    # DETECT SELF-PUNITIVE LANGUAGE
    # ---------------------------------------------------------
    def _detect_self_punitive(self, text: str) -> List[str]:
        punitive = ["my fault", "i ruin everything", "i deserve this"]
        flags = []

        for p in punitive:
            if p in text.lower():
                flags.append(f"Self-punitive language detected: '{p}'")

        return flags

    # ---------------------------------------------------------
    # REFRAME TEXT
    # ---------------------------------------------------------
    def _reframe_text(self, text: str, emotion: str) -> str:
        """
        Reframes harmful or negative statements into constructive,
        future-oriented language.
        """

        replacements = {
            "worthless": "feeling discouraged",
            "hopeless": "facing challenges",
            "give up": "feeling stuck",
            "always fail": "struggling with consistency",
            "never succeed": "working toward progress",
            "i ruin everything": "I’m learning from setbacks"
        }

        reframed = text

        for bad, good in replacements.items():
            reframed = reframed.replace(bad, good)

        # Add a constructive tag
        return f"{reframed} (Reframed for clarity and self-support.)"

    # ---------------------------------------------------------
    # SAFETY CHECK
    # ---------------------------------------------------------
    def _safety_check(self, sentiment, dominant, risk, flags) -> bool:
        """
        Determines whether the system should proceed with future-state
        projection or require additional grounding.
        """

        # High-risk emotional states require caution
        if dominant in ["sadness", "anger", "fear"] and sentiment < 0:
            return False

        # High-risk predictive signals
        if risk == "high":
            return False

        # Harmful language detected
        if flags:
            return False

        return True
