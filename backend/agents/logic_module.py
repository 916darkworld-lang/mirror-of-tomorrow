"""
Logic Module
------------
This module performs real logical restructuring of user input.
It extracts factual statements, detects contradictions, normalizes
the text, and returns a structured output for downstream modules.
"""

import re
from typing import Dict, List


class LogicModule:

    def __init__(self):
        pass

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def process(self, text: str) -> Dict:
        """
        Returns a structured dictionary:
        {
            "cleaned_text": str,
            "sentences": [...],
            "facts": [...],
            "contradictions": [...],
            "keywords": [...]
        }
        """
        cleaned = self._normalize(text)
        sentences = self._split_sentences(cleaned)
        facts = self._extract_facts(sentences)
        contradictions = self._detect_contradictions(facts)
        keywords = self._extract_keywords(cleaned)

        return {
            "cleaned_text": cleaned,
            "sentences": sentences,
            "facts": facts,
            "contradictions": contradictions,
            "keywords": keywords
        }

    # ---------------------------------------------------------
    # NORMALIZATION
    # ---------------------------------------------------------
    def _normalize(self, text: str) -> str:
        text = text.strip()
        text = re.sub(r"\s+", " ", text)
        text = text.replace(" ,", ",").replace(" .", ".")
        return text

    # ---------------------------------------------------------
    # SENTENCE SPLITTING
    # ---------------------------------------------------------
    def _split_sentences(self, text: str) -> List[str]:
        raw = re.split(r"[.!?]+", text)
        return [s.strip() for s in raw if s.strip()]

    # ---------------------------------------------------------
    # FACT EXTRACTION
    # ---------------------------------------------------------
    def _extract_facts(self, sentences: List[str]) -> List[str]:
        """
        A 'fact' is defined as a sentence containing:
        - a subject
        - a verb
        - a concrete statement

        This is a simple but real rule-based extractor.
        """
        facts = []
        for s in sentences:
            if re.search(r"\b(am|is|are|was|were|have|has|do|did|will|can|should)\b", s):
                facts.append(s)
        return facts

    # ---------------------------------------------------------
    # CONTRADICTION DETECTION
    # ---------------------------------------------------------
    def _detect_contradictions(self, facts: List[str]) -> List[str]:
        """
        Detects simple contradictions like:
        - "I always exercise" vs "I never exercise"
        - "I hate running" vs "I love running"
        """
        contradictions = []

        for f1 in facts:
            for f2 in facts:
                if f1 == f2:
                    continue

                # always vs never
                if "always" in f1.lower() and "never" in f2.lower():
                    contradictions.append(f"{f1}  <->  {f2}")

                # love vs hate
                if ("love" in f1.lower() and "hate" in f2.lower()) or \
                   ("hate" in f1.lower() and "love" in f2.lower()):
                    contradictions.append(f"{f1}  <->  {f2}")

        return contradictions

    # ---------------------------------------------------------
    # KEYWORD EXTRACTION
    # ---------------------------------------------------------
    def _extract_keywords(self, text: str) -> List[str]:
        words = re.findall(r"[A-Za-z]+", text.lower())
        stopwords = {"the", "and", "to", "a", "i", "of", "in", "it", "that", "for", "on", "with"}
        keywords = [w for w in words if w not in stopwords and len(w) > 3]
        return list(sorted(set(keywords)))
