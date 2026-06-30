#!/usr/bin/env python3
"""
🧠 TAURUS AI CORP. - Neuromorphic Governance Layer
Integrates GCR-Pulse bio-foundry data to dynamically adjust AI autonomy thresholds.
Implements "Biometric-State Dependent Autonomy" for executive command control.
"""

import asyncio
import logging
from dataclasses import dataclass
from datetime import datetime
from enum import Enum

logger = logging.getLogger("NeuromorphicGovernance")
logging.basicConfig(level=logging.INFO)


class AutonomyLevel(Enum):
    FULL_MANUAL = "full_manual"
    HIGH_OVERSIGHT = "high_oversight"
    BALANCED = "balanced"
    HIGH_AUTONOMY = "high_autonomy"
    FULL_AUTONOMY = "full_autonomy"


@dataclass
class CognitiveState:
    gcr_score: float
    autonomy_level: AutonomyLevel
    autonomy_percentage: int
    requires_confirmation: bool
    confirmation_threshold: float
    timestamp: datetime
    recommendation: str


class NeuromorphicGovernor:
    """
    Dynamically adjusts AI system autonomy based on CEO's cognitive coherence.

    GCR Score Interpretation:
    - 0.90-1.00: High Flow State → Full Autonomy (90%+)
    - 0.75-0.89: Optimal → High Autonomy (70-90%)
    - 0.60-0.74: Functional → Balanced (50-70%)
    - 0.40-0.59: Stressed → High Oversight (30-50%)
    - 0.00-0.39: Critical → Full Manual (0-30%)
    """

    THRESHOLDS = {
        "full_autonomy": (0.90, 1.00, 90, AutonomyLevel.FULL_AUTONOMY),
        "high_autonomy": (0.75, 0.89, 70, AutonomyLevel.HIGH_AUTONOMY),
        "balanced": (0.60, 0.74, 50, AutonomyLevel.BALANCED),
        "high_oversight": (0.40, 0.59, 30, AutonomyLevel.HIGH_OVERSIGHT),
        "full_manual": (0.00, 0.39, 10, AutonomyLevel.FULL_MANUAL),
    }

    def __init__(
        self,
        gcr_api_url: str = "https://Taurus-Ai-Corp-gcfd-coherence-tracker.hf.space/api/predict",
    ):
        self.gcr_api_url = gcr_api_url
        self.last_state: CognitiveState | None = None
        self.state_history: list = []

    async def fetch_gcr_score(self, user_id: str = "ceo") -> float:
        """
        Fetch the latest GCR score from the bio-foundry.
        In production, this would connect to a real EEG stream or wearable.
        """
        try:
            import aiohttp

            async with aiohttp.ClientSession() as session:
                payload = {
                    "data": [
                        "Healthy Adult",
                        10,
                        250,
                        1.0,
                        1.5,
                        0.8,
                        42,
                        4.0,
                        8.0,
                        30.0,
                        100.0,
                        None,
                    ]
                }
                async with session.post(
                    self.gcr_api_url, json=payload, timeout=30
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        if data.get("data"):
                            gcr_value = float(data["data"][0])
                            logger.info(f"🧠 GCR Score Fetched: {gcr_value:.3f}")
                            return gcr_value
        except Exception as e:
            logger.warning(f"GCR API unavailable, using cached value: {e}")

        if self.last_state:
            return self.last_state.gcr_score
        return 0.75

    def classify_state(self, gcr_score: float) -> CognitiveState:
        """Classify cognitive state based on GCR score."""
        for level_name, (low, high, autonomy_pct, level) in self.THRESHOLDS.items():
            if low <= gcr_score <= high:
                requires_confirm = autonomy_pct < 70
                confirm_threshold = 1.0 - (autonomy_pct / 100)

                recommendations = {
                    AutonomyLevel.FULL_AUTONOMY: "🟢 CEO in Flow State. AI agents granted full autonomous execution.",
                    AutonomyLevel.HIGH_AUTONOMY: "🟢 Optimal coherence. Agents can proceed with standard oversight.",
                    AutonomyLevel.BALANCED: "🟡 Functional state. Recommend periodic check-ins.",
                    AutonomyLevel.HIGH_OVERSIGHT: "🟠 Elevated stress detected. High-touch confirmation required.",
                    AutonomyLevel.FULL_MANUAL: "🔴 Critical cognitive load. All actions require explicit approval.",
                }

                return CognitiveState(
                    gcr_score=gcr_score,
                    autonomy_level=level,
                    autonomy_percentage=autonomy_pct,
                    requires_confirmation=requires_confirm,
                    confirmation_threshold=confirm_threshold,
                    timestamp=datetime.now(),
                    recommendation=recommendations[level],
                )

        return CognitiveState(
            gcr_score=gcr_score,
            autonomy_level=AutonomyLevel.BALANCED,
            autonomy_percentage=50,
            requires_confirmation=True,
            confirmation_threshold=0.5,
            timestamp=datetime.now(),
            recommendation="🟡 Default balanced mode.",
        )

    async def get_current_state(self, user_id: str = "ceo") -> CognitiveState:
        """Get the current cognitive state and autonomy level."""
        gcr_score = await self.fetch_gcr_score(user_id)
        state = self.classify_state(gcr_score)

        self.last_state = state
        self.state_history.append(
            {
                "timestamp": state.timestamp.isoformat(),
                "gcr_score": state.gcr_score,
                "autonomy_pct": state.autonomy_percentage,
            }
        )

        if len(self.state_history) > 100:
            self.state_history = self.state_history[-100:]

        return state

    def should_require_confirmation(self, action_risk: float = 0.5) -> tuple[bool, str]:
        """
        Determine if an action requires manual confirmation.

        Args:
            action_risk: Risk score of the action (0.0 = safe, 1.0 = critical)

        Returns:
            (requires_confirmation, reason)
        """
        if not self.last_state:
            return True, "No cognitive state available. Defaulting to confirmation."

        state = self.last_state
        effective_threshold = state.confirmation_threshold * (1 + action_risk)

        if action_risk > 0.8:
            return (
                True,
                f"🔴 High-risk action (risk={action_risk:.2f}) always requires confirmation.",
            )

        if state.autonomy_percentage < 50:
            return (
                True,
                f"🟠 Low autonomy mode ({state.autonomy_percentage}%). Confirmation required.",
            )

        if action_risk > state.confirmation_threshold:
            return (
                True,
                f"🟡 Action risk ({action_risk:.2f}) exceeds threshold ({state.confirmation_threshold:.2f}).",
            )

        return (
            False,
            f"🟢 Autonomy granted ({state.autonomy_percentage}%). Action approved.",
        )


if __name__ == "__main__":

    async def test():
        governor = NeuromorphicGovernor()
        state = await governor.get_current_state()

        print(f"\n{'=' * 50}")
        print("🧠 NEUROMORPHIC GOVERNANCE STATE")
        print(f"{'=' * 50}")
        print(f"GCR Score: {state.gcr_score:.3f}")
        print(f"Autonomy Level: {state.autonomy_level.value}")
        print(f"Autonomy: {state.autonomy_percentage}%")
        print(f"Requires Confirmation: {state.requires_confirmation}")
        print(f"Recommendation: {state.recommendation}")
        print(f"{'=' * 50}\n")

        test_risks = [0.2, 0.5, 0.8]
        for risk in test_risks:
            needs_confirm, reason = governor.should_require_confirmation(risk)
            print(f"Risk {risk}: {'CONFIRM' if needs_confirm else 'AUTO'} - {reason}")

    asyncio.run(test())
