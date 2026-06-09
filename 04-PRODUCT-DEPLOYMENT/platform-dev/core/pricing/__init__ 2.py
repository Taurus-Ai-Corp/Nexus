"""
Micro-Loan Pricing Module.

Gymnasium RL environment and training pipeline for dynamic pricing optimization.
"""

from core.pricing.microloan_env import MicroLoanPricingEnv
from core.pricing.synthetic_data import (
    generate_borrowers,
    borrowers_to_env_array,
    generate_training_dataset,
    SEGMENT_PROFILES,
    ECONOMIC_SCENARIOS,
)
from core.pricing.training_pipeline import (
    train_ppo,
    evaluate_model,
    generate_price_recommendation,
    ExperimentTracker,
)

__all__ = [
    "MicroLoanPricingEnv",
    "generate_borrowers",
    "borrowers_to_env_array",
    "generate_training_dataset",
    "SEGMENT_PROFILES",
    "ECONOMIC_SCENARIOS",
    "train_ppo",
    "evaluate_model",
    "generate_price_recommendation",
    "ExperimentTracker",
]
