"""
Pattern Module
--------------
Extracts behavioral patterns, habits, frequencies, and semantic clusters
from cleaned logical text. This module performs real analysis and returns
a structured dictionary for downstream modules.
"""

import re
from collections import Counter, defaultdict
from typing import Dict, List


class PatternModule:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def analyze(self, logic_output: Dict) -> Dict:
        """
        Accepts the output of LogicModule.process() and returns:
        {
            "keywords": [...],
            "keyword_frequency": {...},
            "habit_signals": [...],
            "semantic_groups": {...},
            "behavioral_flags": [...]
        }
        """
        keywords = logic_output.get("keywords", [])
        sentences = logic_output.get("sentences", [])

        freq = self._keyword_frequency(keywords)
        habits = self._habit_signals(sentences)
        groups = self._semantic_groups(keywords)
        flags = self._behavioral_flags(habits, freq)

        return {
            "keywords": keywords,
            "keyword_frequency": freq,
            "habit_signals": habits,
            "semantic_groups": groups,
            "behavioral_flags": flags
        }

    # ---------------------------------------------------------
    # KEYWORD FREQUENCY
    # ---------------------------------------------------------
    def _keyword_frequency(self, keywords: List[str]) -> Dict[str, int]:
        return dict(Counter(keywords))

    # ---------------------------------------------------------
    # HABIT SIGNAL DETECTION
    # ---------------------------------------------------------
    def _habit_signals(self, sentences: List[str]) -> List[str]:
        """
        Detects repeated behavioral patterns such as:
        - "I usually..."
        - "I tend to..."
        - "I always..."
        - "Every morning..."
        - "At night I..."
        """
        patterns = [
            r"\busually\b",
            r"\btend to\b",
            r"\balways\b",
            r"\bevery morning\b",
            r"\bevery night\b",
            r"\bon weekends\b",
            r"\bI try to\b",
            r"\bI keep\b",
            r"\bI often\b"
        ]

        signals = []
        for s in sentences:
            for p in patterns:
                if re.search(p, s, re.IGNORECASE):
                    signals.append(s)
                    break

        return signals

    # ---------------------------------------------------------
    # SEMANTIC GROUPING (simple but real)
    # ---------------------------------------------------------
    def _semantic_groups(self, keywords: List[str]) -> Dict[str, List[str]]:
        """
        Groups keywords into simple semantic categories.
        This is rule-based but functional.
        """

        categories = {
            "health": ["exercise", "diet", "sleep", "run", "gym", "fatigue"],
            "emotion": ["happy", "sad", "angry", "anxious", "stress"],
            "work": ["job", "career", "project", "deadline", "focus"],
            "social": ["friends", "family", "relationship", "people"],
            "self": ["goals", "future", "improve", "change"]
        }

        groups = defaultdict(list)

        for kw in keywords:
            matched = False
            for cat, words in categories.items():
                if kw in words:
                    groups[cat].append(kw)
                    matched = True
                    break

            if not matched:
                groups["other"].append(kw)

        return dict(groups)

    # ---------------------------------------------------------
    # BEHAVIORAL FLAGS
    # ---------------------------------------------------------
    def _behavioral_flags(self, habits: List[str], freq: Dict[str, int]) -> List[str]:
        """
        Flags potential behavioral signals such as:
        - high repetition
        - strong habits
        - emotional imbalance
        """
        flags = []

        # High repetition
        for word, count in freq.items():
            if count >= 3:
                flags.append(f"High repetition: '{word}' appears {count} times")

        # Strong habits
        if len(habits) >= 2:
            flags.append("Multiple habit signals detected")

        # Emotional imbalance
        emotional_words = {"sad", "angry", "anxious", "stress"}
        emo_count = sum(freq.get(w, 0) for w in emotional_words)
        if emo_count >= 2:
            flags.append("Emotional imbalance indicators present")

        return flags
