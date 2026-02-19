from typing import Dict, List, Any
from dataclasses import dataclass
import difflib


@dataclass
class GapInsight:
    source: str
    insight: str
    similarity_score: float


class IAISynthesis:
    """
    Inner Artificial Intelligence (IAI)
    -----------------------------------
    This engine performs the Synthesis Logic described in the
    Mirror of Tomorrow architecture.

    It takes the 5-model council responses and produces:
      - Consensus (Logical Intersection)
      - Clusters (Major Opinion)
      - Logical Gaps (Unique insights)
      - Expert Alignment (Retained Lessons)
    """

    def __init__(self, retained_memory):
        """
        retained_memory must provide:
            - get_retained_lessons() -> List[str]
        """
        self.memory = retained_memory

    # ---------------------------------------------------------
    # PUBLIC ENTRY POINT
    # ---------------------------------------------------------
    def find_the_gap(self, perspectives: Dict[str, str]) -> Dict[str, Any]:
        """
        perspectives: { model_name: response_text }

        Returns a structured JSON-like dict:
        {
            "consensus": str,
            "major_opinion": [model_names],
            "clusters": [[model_names]],
            "logical_gaps": [...],
            "expert_alignment": {...}
        }
        """
        responses = list(perspectives.values())

        # 1. Consensus summary
        consensus_summary = self._summarize_consensus(responses)

        # 2. Clustering (Major Opinion)
        clusters, major_opinion = self._cluster_responses(perspectives)

        # 3. Logical Gaps (Unique insights)
        gaps = self._find_unique_insights(perspectives, responses)

        # 4. Expert Alignment (Retained Lessons)
        alignment_status = self._check_expert_alignment(consensus_summary)

        return {
            "consensus": consensus_summary,
            "major_opinion": major_opinion,
            "clusters": clusters,
            "logical_gaps": [g.__dict__ for g in gaps],
            "expert_alignment": alignment_status,
        }

    # ---------------------------------------------------------
    # INTERNAL LOGIC
    # ---------------------------------------------------------

    def _cluster_responses(self, perspectives: Dict[str, str]):
        """
        Groups similar responses using rough text similarity.
        In production, replace with embeddings + LanceDB.
        """
        model_names = list(perspectives.keys())
        texts = list(perspectives.values())

        clusters = []
        used = set()

        for i, base in enumerate(texts):
            if i in used:
                continue

            cluster = [model_names[i]]
            used.add(i)

            for j, other in enumerate(texts):
                if j in used:
                    continue

                sim = self._similarity(base, other)
                if sim > 0.70:  # similarity threshold
                    cluster.append(model_names[j])
                    used.add(j)

            clusters.append(cluster)

        # Major opinion = largest cluster
        major_opinion = max(clusters, key=len) if clusters else []
        return clusters, major_opinion

    def _find_unique_insights(
        self, perspectives: Dict[str, str], all_responses: List[str]
    ) -> List[GapInsight]:
        """
        Detects outlier ideas — the "Gap".
        """
        gaps: List[GapInsight] = []

        for name, text in perspectives.items():
            others = " ".join([r for r in all_responses if r != text])
            sim = self._similarity(text, others)

            if sim < 0.40:  # outlier threshold
                gaps.append(
                    GapInsight(
                        source=name,
                        insight=text[:240] + ("..." if len(text) > 240 else ""),
                        similarity_score=sim,
                    )
                )

        return gaps

    def _check_expert_alignment(self, consensus_summary: str) -> Dict[str, Any]:
        """
        Compares consensus against retained lessons.
        """
        lessons = self.memory.get_retained_lessons()

        if not lessons:
            return {
                "status": "unknown",
                "notes": "No retained lessons available.",
                "similarity": 0.0,
                "closest_lesson": None,
            }

        best_sim = 0.0
        best_lesson = None

        for lesson in lessons:
            sim = self._similarity(consensus_summary, lesson)
            if sim > best_sim:
                best_sim = sim
                best_lesson = lesson

        return {
            "status": "aligned" if best_sim > 0.75 else "divergent",
            "similarity": best_sim,
            "closest_lesson": best_lesson,
        }

    def _summarize_consensus(self, texts: List[str]) -> str:
        """
        Placeholder for LLM-based summarization.
        Replace with your local LLM call.
        """
        return "The primary agreement across models centers on shared themes and overlapping logic."

    def _similarity(self, a: str, b: str) -> float:
        """
        Basic text similarity using difflib.
        Replace with embeddings for production.
        """
        return difflib.SequenceMatcher(None, a, b).ratio()
