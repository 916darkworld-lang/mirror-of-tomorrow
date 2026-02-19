"""
Synthesis Module
----------------
Combines the outputs of all other modules into a unified,
structured future-state object. This module produces a coherent
narrative summary, actionable insights, and a consolidated
interpretation of the user's current trajectory.

This is a fully functional synthesis engine.
"""

from typing import Dict, List


class SynthesisModule:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def synthesize(
        self,
        logic_output: Dict,
        pattern_output: Dict,
        predictive_output: Dict,
        emotional_output: Dict,
        ethical_output: Dict
    ) -> Dict:
        """
        Returns a unified future-state object:
        {
            "summary": str,
            "trajectory": str,
            "risk": str,
            "reward": str,
            "emotion": str,
            "stability": str,
            "insights": [...],
            "allowed": bool
        }
        """

        allowed = ethical_output.get("safe_to_proceed", True)

        summary = self._generate_summary(
            logic_output,
            pattern_output,
            predictive_output,
            emotional_output,
            ethical_output
        )

        insights = self._generate_insights(
            pattern_output,
            predictive_output,
            emotional_output
        )

        return {
            "summary": summary,
            "trajectory": predictive_output.get("trend_direction", "flat"),
            "risk": predictive_output.get("risk_level", "low"),
            "reward": predictive_output.get("reward_potential", "low"),
            "emotion": emotional_output.get("dominant_emotion", "neutral"),
            "stability": predictive_output.get("stability", "stable"),
            "insights": insights,
            "allowed": allowed
        }

    # ---------------------------------------------------------
    # SUMMARY GENERATION
    # ---------------------------------------------------------
    def _generate_summary(
        self,
        logic: Dict,
        pattern: Dict,
        predictive: Dict,
        emotional: Dict,
        ethical: Dict
    ) -> str:
        """
        Creates a natural-language summary of the user's current
        state and projected trajectory.
        """

        trend = predictive.get("trend_direction", "flat")
        emotion = emotional.get("dominant_emotion", "neutral")
        risk = predictive.get("risk_level", "low")
        reward = predictive.get("reward_potential", "low")
        stability = predictive.get("stability", "stable")

        if not ethical.get("safe_to_proceed", True):
            return (
                "Your recent statements indicate emotional or cognitive strain. "
                "The system has reframed your input for clarity and support. "
                "Before projecting future outcomes, grounding and emotional stability "
                "are recommended."
            )

        return (
            f"Your current emotional state appears to be centered around {emotion}. "
            f"The overall trend in your behavior and statements is {trend}. "
            f"Risk levels are {risk}, while potential rewards are {reward}. "
            f"Your stability is assessed as {stability}. "
            "These signals together suggest a trajectory that can be strengthened "
            "with consistent habits and emotional awareness."
        )

    # ---------------------------------------------------------
    # INSIGHT GENERATION
    # ---------------------------------------------------------
    def _generate_insights(
        self,
        pattern: Dict,
        predictive: Dict,
        emotional: Dict
    ) -> List[str]:
        """
        Produces actionable insights based on patterns, predictions,
        and emotional signals.
        """

        insights = []

        # Habit-based insights
        habits = pattern.get("habit_signals", [])
        if habits:
            insights.append("Your habits show consistent behavioral patterns worth reinforcing.")

        # Emotional insights
        if emotional.get("emotion_intensity") == "high":
            insights.append("Your emotional intensity is elevated, which may amplify decision-making.")

        if emotional.get("stress_level") == "high":
            insights.append("High stress levels detected. Consider grounding or rest.")

        # Predictive insights
        if predictive.get("trend_direction") == "up":
            insights.append("Your trajectory is improving; keep reinforcing positive behaviors.")
        elif predictive.get("trend_direction") == "down":
            insights.append("Your trajectory is declining; small corrective actions may help.")
        else:
            insights.append("Your trajectory is stable; consistency will be key.")

        return insights
