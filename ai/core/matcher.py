from typing import Dict, List, Tuple, Any, Optional
import torch


def compute_cosine_similarity(a: torch.Tensor, b: torch.Tensor) -> float:
    if a.dim() == 1:
        a = a.unsqueeze(0)
    if b.dim() == 1:
        b = b.unsqueeze(0)

    if a.device != b.device:
        b = b.to(a.device)

    similarity = (a @ b.T).item()
    return float(similarity)


class HeritageMatcher:

    def __init__(
        self,
        database: Dict[str, torch.Tensor],
        confidence_threshold: float = 0.60
    ):
        if not database:
            raise ValueError("Database cannot be empty for HeritageMatcher.")

        self.database = database
        self.confidence_threshold = confidence_threshold

    def match(
        self,
        query_vector: torch.Tensor,
        threshold: Optional[float] = None
    ) -> Dict[str, Any]:
        eff_threshold = threshold if threshold is not None else self.confidence_threshold

        scores: Dict[str, float] = {}
        for site_name, site_vector in self.database.items():
            sim = compute_cosine_similarity(query_vector, site_vector)
            scores[site_name] = sim

        ranked_scores: List[Tuple[str, float]] = sorted(
            scores.items(),
            key=lambda item: item[1],
            reverse=True
        )

        top_site, top_score = ranked_scores[0]
        is_confident = top_score >= eff_threshold

        return {
            "best_match": top_site if is_confident else None,
            "top_candidate": top_site,
            "confidence": top_score,
            "is_confident": is_confident,
            "threshold_used": eff_threshold,
            "all_scores": ranked_scores
        }

