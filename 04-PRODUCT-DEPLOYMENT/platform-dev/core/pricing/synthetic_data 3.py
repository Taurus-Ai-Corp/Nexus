"""
Synthetic Borrower Data Generator for RL Training.

Generates realistic borrower profiles across segments with configurable
economic conditions, repayment behaviors, and demographic distributions.
"""


import numpy as np
import pandas as pd

SEGMENT_PROFILES = {
    "street_vendor": {
        "weight": 0.25,
        "income_range": (8000, 25000),
        "loan_range": (5000, 50000),
        "credit_score_range": (0.3, 0.7),
        "repayment_base": 0.72,
        "seasonal_variance": 0.3,
        "term_preference": (3, 9),
    },
    "small_retailer": {
        "weight": 0.22,
        "income_range": (15000, 50000),
        "loan_range": (20000, 150000),
        "credit_score_range": (0.4, 0.8),
        "repayment_base": 0.78,
        "seasonal_variance": 0.15,
        "term_preference": (6, 18),
    },
    "service_provider": {
        "weight": 0.20,
        "income_range": (20000, 80000),
        "loan_range": (30000, 200000),
        "credit_score_range": (0.5, 0.85),
        "repayment_base": 0.82,
        "seasonal_variance": 0.1,
        "term_preference": (12, 24),
    },
    "agricultural_worker": {
        "weight": 0.18,
        "income_range": (6000, 20000),
        "loan_range": (10000, 80000),
        "credit_score_range": (0.25, 0.65),
        "repayment_base": 0.65,
        "seasonal_variance": 0.4,
        "term_preference": (6, 12),
    },
    "gig_worker": {
        "weight": 0.15,
        "income_range": (12000, 40000),
        "loan_range": (10000, 100000),
        "credit_score_range": (0.35, 0.75),
        "repayment_base": 0.70,
        "seasonal_variance": 0.25,
        "term_preference": (3, 12),
    },
}

ECONOMIC_SCENARIOS = {
    "stable_growth": {"gdp_growth": 0.06, "inflation": 0.05, "unemployment": 0.06},
    "recession": {"gdp_growth": -0.02, "inflation": 0.08, "unemployment": 0.12},
    "high_growth": {"gdp_growth": 0.08, "inflation": 0.04, "unemployment": 0.04},
    "stagflation": {"gdp_growth": 0.01, "inflation": 0.10, "unemployment": 0.09},
}


def generate_borrowers(
    n: int = 1000,
    seed: int | None = None,
    economic_scenario: str = "stable_growth",
    include_history: bool = True,
) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    segments = list(SEGMENT_PROFILES.keys())
    weights = [SEGMENT_PROFILES[s]["weight"] for s in segments]
    borrower_segments = rng.choice(segments, size=n, p=weights)

    eco = ECONOMIC_SCENARIOS.get(economic_scenario, ECONOMIC_SCENARIOS["stable_growth"])
    economic_factor = 1.0 + eco["gdp_growth"] - eco["inflation"] * 0.5 - eco["unemployment"] * 2.0
    economic_factor = np.clip(economic_factor, 0.7, 1.3)

    records = []
    for i, seg in enumerate(borrower_segments):
        profile = SEGMENT_PROFILES[seg]

        monthly_income = rng.uniform(*profile["income_range"]) * economic_factor
        loan_amount = rng.uniform(*profile["loan_range"])
        credit_score = rng.uniform(*profile["credit_score_range"])

        base_repayment = profile["repayment_base"]
        seasonal = rng.normal(0, profile["seasonal_variance"])
        income_ratio = np.clip(loan_amount / (monthly_income * 12), 0, 2)
        repayment_rate = np.clip(
            base_repayment + seasonal * 0.1 - income_ratio * 0.15 + (credit_score - 0.5) * 0.2,
            0.1,
            0.98,
        )

        preferred_term_min, preferred_term_max = profile["term_preference"]
        loan_term = int(rng.uniform(preferred_term_min, preferred_term_max))

        age = int(rng.integers(22, 65))
        dependents = int(rng.integers(0, 5))
        years_in_business = max(0, int(rng.normal(5, 3)))
        has_bank_account = rng.random() > 0.15
        has_upi = rng.random() > 0.25
        previous_loans = int(rng.integers(0, 8))
        previous_defaults = int(rng.integers(0, max(1, previous_loans // 3)))

        region_choices = ["north", "south", "east", "west", "central"]
        region = rng.choice(region_choices)

        record = {
            "borrower_id": f"BL{i:06d}",
            "segment": seg,
            "monthly_income": round(monthly_income, 2),
            "loan_amount": round(loan_amount, 2),
            "loan_term_months": loan_term,
            "credit_score": round(credit_score, 4),
            "repayment_rate": round(repayment_rate, 4),
            "age": age,
            "dependents": dependents,
            "years_in_business": years_in_business,
            "has_bank_account": has_bank_account,
            "has_upi": has_upi,
            "previous_loans": previous_loans,
            "previous_defaults": previous_defaults,
            "region": region,
            "economic_factor": round(economic_factor, 4),
        }

        if include_history:
            payment_history = []
            for month in range(loan_term):
                base_prob = repayment_rate
                seasonal_month = np.sin(2 * np.pi * month / 12) * profile["seasonal_variance"] * 0.1
                paid = rng.random() < (base_prob + seasonal_month)
                payment_history.append(1 if paid else 0)

            record["payment_history"] = payment_history
            record["on_time_payments"] = sum(payment_history)
            record["late_payments"] = loan_term - sum(payment_history)

        records.append(record)

    df = pd.DataFrame(records)
    return df


def borrowers_to_env_array(df: pd.DataFrame) -> np.ndarray:
    from core.pricing.microloan_env import MicroLoanPricingEnv

    n = len(df)
    state_dim = MicroLoanPricingEnv.STATE_DIM
    states = np.zeros((n, state_dim), dtype=np.float32)

    segment_map = {seg: idx for idx, seg in enumerate(SEGMENT_PROFILES.keys())}

    for i, (_, row) in enumerate(df.iterrows()):
        states[i, 0] = np.clip(row["credit_score"] * 2 - 1, -1, 1)
        income_norm = np.clip(row["monthly_income"] / 50000, 0, 1)
        states[i, 1] = income_norm * 2 - 1
        loan_norm = np.clip(row["loan_amount"] / 200000, 0, 1)
        states[i, 2] = loan_norm * 2 - 1
        states[i, 3] = np.clip(row["repayment_rate"] * 2 - 1, -1, 1)
        years_norm = np.clip(row["years_in_business"] / 15, 0, 1)
        states[i, 4] = years_norm * 2 - 1

        seg_idx = segment_map.get(row["segment"], 0)
        states[i, 5 + seg_idx] = 1.0

        states[i, 10] = np.clip(row["economic_factor"] * 2 - 2, -1, 1)
        states[i, 11] = 0.0
        states[i, 12] = 0.0

    return states


def generate_training_dataset(
    n: int = 5000,
    seed: int = 42,
    output_path: str | None = None,
) -> np.ndarray:
    df = generate_borrowers(n=n, seed=seed, include_history=True)
    env_array = borrowers_to_env_array(df)

    if output_path:
        df.to_csv(output_path, index=False)
        print(f"Saved {n} borrower profiles to {output_path}")

    return env_array


if __name__ == "__main__":
    print("Generating synthetic borrower dataset...")
    env_array = generate_training_dataset(
        n=5000,
        seed=42,
        output_path="data/training_borrowers.csv",
    )
    print(f"Environment array shape: {env_array.shape}")
    print(f"Sample state: {env_array[0]}")
