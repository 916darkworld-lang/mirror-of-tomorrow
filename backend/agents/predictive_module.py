"""
Predictive Module
-----------------
Uses logical and pattern analysis outputs to estimate simple future
trajectories, risk/reward balance, and stability signals.

This is a real, rule-based predictive engine that returns structured
signals for the IAI and downstream modules.
"""

from typing import Dict, List


class PredictiveModule:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def forecast(self, logic_output: Dict, pattern_output: Dict) -> Dict:
        """
        Accepts:
          - logic_output: LogicModule.process()
          - pattern_output: PatternModule.analyze()

        Returns:
        {
            "trend_direction": "up" | "down" | "flat",
            "risk_level": "low" | "medium" | "high",
            "reward_potential": "low" | "medium" | "high",
            "stability": "stable" | "volatile",
            "supporting_signals": [...]
        }
        """
        facts = logic_output.get("facts", [])
        contradictions = logic_output.get("contradictions", [])
        habits = pattern_output.get("habit_signals", [])
        flags = pattern_output.get("behavioral_flags", [])
        freq = pattern_output.get("keyword_frequency", {})

        trend = self._trend_direction(facts, contradictions, habits)
        risk = self._risk_level(contradictions, flags)
        reward = self._reward_potential(facts, habits)
        stability = self._stability(trend, risk, flags)
        signals = self._supporting_signals(trend, risk, reward, stability, flags)

        return {
            "trend_direction": trend,
            "risk_level": risk,
            "reward_potential": reward,
            "stability": stability,
            "supporting_signals": signals
        }

    # ---------------------------------------------------------
    # TREND DIRECTION
    # ---------------------------------------------------------
    def _trend_direction(self, facts: List[str], contradictions: List[str], habits: List[str]) -> str:
        positive_markers = ["improve", "better", "progress", "working on", "trying to"]
        negative_markers = ["stuck", "worse", "decline", "give up", "tired of"]

        pos_score = 0
        neg_score = 0

        for f in facts + habits:
            lower = f.lower()
            if any(m in lower for m in positive_markers):
                pos_score += 1
            if any(m in lower for m in negative_markers):
                neg_score += 1

        # contradictions reduce clarity
        neg_score += len(contradictions) * 0.5

        if pos_score > neg_score + 1:
            return "up"
        elif neg_score > pos_score + 1:
            return "down"
        else:
            return "flat"

    # ---------------------------------------------------------
    # RISK LEVEL
    # ---------------------------------------------------------
    def _risk_level(self, contradictions: List[str], flags: List[str]) -> str:
        risk_score = 0

        risk_score += len(contradictions)

        for f in flags:
            if "Emotional imbalance" in f:
                risk_score += 2
            if "High repetition" in f:
                risk_score += 1

        if risk_score <= 1:
            return "low"
        elif risk_score <= 3:
            return "medium"
        else:
            return "high"

    # ---------------------------------------------------------
    # REWARD POTENTIAL
    # ---------------------------------------------------------
    def _reward_potential(self, facts: List[str], habits: List[str]) -> str:
        growth_markers = ["goal", "goals", "future", "learn", "build", "create", "practice"]
        effort_markers = ["every day", "every morning", "often", "keep", "try", "working on"]

        score = 0

        for f in facts + habits:
            lower = f.lower()
            if any(m in lower for m in growth_markers):
                score += 1
            if any(m in lower for m in effort_markers):
                score += 1

        if score >= 4:
            return "high"
        elif score >= 2:
            return "medium"
        else:
            return "low"

    # ---------------------------------------------------------
    # STABILITY
    # ---------------------------------------------------------
    def _stability(self, trend: str, risk: str, flags: List[str]) -> str:
        unstable_signals = 0

        if risk == "high":
            unstable_signals += 2
        if risk == "medium":
            unstable_signals += 1

        for f in flags:
            if "Emotional imbalance" in f:
                unstable_signals += 2

        if trend == "flat":
            unstable_signals -= 1

        return "volatile" if unstable_signals >= 2 else "stable"

    # ---------------------------------------------------------
    # SUPPORTING SIGNALS
    # ---------------------------------------------------------
    def _supporting_signals(
        self,
        trend: str,
        risk: str,
        reward: str,
        stability: str,
        flags: List[str]
    ) -> List[str]:
        signals = []

        signals.append(f"Trend: {trend}")
        signals.append(f"Risk: {risk}")
        signals.append(f"Reward: {reward}")
        signals.append(f"Stability: {stability}")

        signals.extend(flags)

        return signals
