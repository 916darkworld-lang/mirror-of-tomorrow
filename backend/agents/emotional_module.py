"""
Emotional Cognition Module
--------------------------
Performs real emotional analysis on user text using rule-based
sentiment scoring, emotional intensity detection, polarity analysis,
and stress indicators.

This is a fully functional emotional engine with no placeholders.
"""

import re
from typing import Dict, List


class EmotionalModule:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def evaluate(self, logic_output: Dict) -> Dict:
        """
        Accepts LogicModule.process() output and returns:
        {
            "sentiment_score": float,
            "dominant_emotion": str,
            "emotion_intensity": "low" | "medium" | "high",
            "stress_level": "low" | "medium" | "high",
            "emotional_volatility": "stable" | "unstable",
            "emotion_signals": [...]
        }
        """
        text = logic_output.get("cleaned_text", "")
        sentences = logic_output.get("sentences", [])

        sentiment = self._sentiment_score(text)
        dominant = self._dominant_emotion(text)
        intensity = self._emotion_intensity(text)
        stress = self._stress_level(text)
        volatility = self._volatility(sentences)
        signals = self._emotion_signals(sentiment, dominant, intensity, stress, volatility)

        return {
            "sentiment_score": sentiment,
            "dominant_emotion": dominant,
            "emotion_intensity": intensity,
            "stress_level": stress,
            "emotional_volatility": volatility,
            "emotion_signals": signals
        }

    # ---------------------------------------------------------
    # SENTIMENT SCORE
    # ---------------------------------------------------------
    def _sentiment_score(self, text: str) -> float:
        positive = ["happy", "excited", "proud", "grateful", "hopeful", "love"]
        negative = ["sad", "angry", "tired", "anxious", "stressed", "hate", "worried"]

        score = 0

        for w in positive:
            score += text.lower().count(w)

        for w in negative:
            score -= text.lower().count(w)

        return float(score)

    # ---------------------------------------------------------
    # DOMINANT EMOTION
    # ---------------------------------------------------------
    def _dominant_emotion(self, text: str) -> str:
        emotions = {
            "joy": ["happy", "excited", "proud", "love"],
            "sadness": ["sad", "down", "depressed"],
            "anger": ["angry", "mad", "furious"],
            "fear": ["anxious", "worried", "scared"],
            "stress": ["overwhelmed", "stressed", "pressure"]
        }

        counts = {emotion: 0 for emotion in emotions}

        for emotion, words in emotions.items():
            for w in words:
                counts[emotion] += text.lower().count(w)

        dominant = max(counts, key=counts.get)
        return dominant if counts[dominant] > 0 else "neutral"

    # ---------------------------------------------------------
    # EMOTION INTENSITY
    # ---------------------------------------------------------
    def _emotion_intensity(self, text: str) -> str:
        strong_markers = ["very", "extremely", "really", "so", "too"]
        count = sum(text.lower().count(m) for m in strong_markers)

        if count >= 3:
            return "high"
        elif count == 2:
            return "medium"
        else:
            return "low"

    # ---------------------------------------------------------
    # STRESS LEVEL
    # ---------------------------------------------------------
    def _stress_level(self, text: str) -> str:
        stress_words = ["stress", "pressure", "overwhelmed", "tired", "burnout"]
        count = sum(text.lower().count(w) for w in stress_words)

        if count >= 3:
            return "high"
        elif count == 1 or count == 2:
            return "medium"
        else:
            return "low"

    # ---------------------------------------------------------
    # EMOTIONAL VOLATILITY
    # ---------------------------------------------------------
    def _volatility(self, sentences: List[str]) -> str:
        """
        Detects emotional swings between sentences.
        """
        positive = ["happy", "excited", "love", "hope"]
        negative = ["sad", "angry", "hate", "anxious", "stress"]

        swings = 0

        for s in sentences:
            pos = any(w in s.lower() for w in positive)
            neg = any(w in s.lower() for w in negative)
            if pos and neg:
                swings += 1

        return "unstable" if swings >= 1 else "stable"

    # ---------------------------------------------------------
    # EMOTION SIGNALS
    # ---------------------------------------------------------
    def _emotion_signals(self, sentiment, dominant, intensity, stress, volatility) -> List[str]:
        signals = [
            f"Sentiment score: {sentiment}",
            f"Dominant emotion: {dominant}",
            f"Intensity: {intensity}",
            f"Stress level: {stress}",
            f"Volatility: {volatility}"
        ]
        return signals
