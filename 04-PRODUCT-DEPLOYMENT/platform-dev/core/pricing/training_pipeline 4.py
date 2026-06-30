"""
RL Training Pipeline for Micro-Loan Pricing.

Uses Stable-Baselines3 PPO algorithm to train pricing policies.
Supports experiment tracking, model versioning, and evaluation.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
from core.pricing.microloan_env import MicroLoanPricingEnv
from core.pricing.synthetic_data import generate_training_dataset
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import BaseCallback
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.vec_env import DummyVecEnv


class ExperimentTracker(BaseCallback):
    """Tracks training metrics and saves experiment metadata."""

    def __init__(
        self,
        experiment_name: str,
        log_dir: str = "experiments",
        eval_freq: int = 1000,
        verbose: int = 0,
    ):
        super().__init__(verbose)
        self.experiment_name = experiment_name
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)
        self.eval_freq = eval_freq
        self.episode_rewards = []
        self.episode_lengths = []
        self.current_reward = 0.0
        self.current_steps = 0
        self.best_mean_reward = -np.inf
        self.metrics_history = []

    def _on_step(self) -> bool:
        self.current_reward += self.rewards[0]
        self.current_steps += 1

        if self.n_calls % self.eval_freq == 0:
            mean_reward = np.mean(self.episode_rewards[-100:]) if self.episode_rewards else 0
            self.metrics_history.append({
                "step": self.n_calls,
                "mean_reward": float(mean_reward),
                "best_reward": float(self.best_mean_reward),
                "timestamp": datetime.now().isoformat(),
            })

            if mean_reward > self.best_mean_reward:
                self.best_mean_reward = mean_reward
                if self.model is not None:
                    save_path = self.log_dir / f"{self.experiment_name}_best"
                    self.model.save(save_path)

        return True

    def _on_rollout_end(self) -> None:
        if len(self.locals["rewards"]) > 0:
            episode_reward = np.sum(self.locals["rewards"])
            self.episode_rewards.append(float(episode_reward))
            self.episode_lengths.append(int(self.locals["dones"].sum()))

    def save_experiment_metadata(self, metadata: dict[str, Any]) -> str:
        metadata_path = self.log_dir / f"{self.experiment_name}_metadata.json"
        metadata["metrics_history"] = self.metrics_history
        metadata["final_best_reward"] = float(self.best_mean_reward)
        metadata["total_episodes"] = len(self.episode_rewards)
        metadata["completed_at"] = datetime.now().isoformat()

        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)

        return str(metadata_path)


def create_vec_env(
    borrowers_array: np.ndarray | None = None,
    n_envs: int = 4,
    **env_kwargs,
) -> DummyVecEnv:
    def make_env():
        return MicroLoanPricingEnv(
            borrowers=borrowers_array,
            **env_kwargs,
        )

    return DummyVecEnv([make_env for _ in range(n_envs)])


def train_ppo(
    experiment_name: str,
    borrowers_array: np.ndarray | None = None,
    total_timesteps: int = 100000,
    n_envs: int = 4,
    learning_rate: float = 3e-4,
    n_steps: int = 2048,
    batch_size: int = 64,
    n_epochs: int = 10,
    gamma: float = 0.99,
    gae_lambda: float = 0.95,
    clip_range: float = 0.2,
    ent_coef: float = 0.01,
    vf_coef: float = 0.5,
    max_grad_norm: float = 0.5,
    log_dir: str = "experiments",
    eval_freq: int = 5000,
    save_dir: str | None = None,
    verbose: int = 1,
) -> tuple[PPO, ExperimentTracker]:
    print(f"\n{'='*60}")
    print(f"Training PPO: {experiment_name}")
    print(f"{'='*60}")
    print(f"  Timesteps: {total_timesteps:,}")
    print(f"  Environments: {n_envs}")
    print(f"  Learning rate: {learning_rate}")
    print(f"  Gamma: {gamma}")

    vec_env = create_vec_env(borrowers_array, n_envs=n_envs)

    policy_kwargs = dict(
        net_arch=[256, 256, 128],
        activation_fn=np.float32,
    )

    model = PPO(
        policy="MlpPolicy",
        env=vec_env,
        learning_rate=learning_rate,
        n_steps=n_steps,
        batch_size=batch_size,
        n_epochs=n_epochs,
        gamma=gamma,
        gae_lambda=gae_lambda,
        clip_range=clip_range,
        ent_coef=ent_coef,
        vf_coef=vf_coef,
        max_grad_norm=max_grad_norm,
        verbose=verbose,
        tensorboard_log=log_dir,
    )

    tracker = ExperimentTracker(
        experiment_name=experiment_name,
        log_dir=log_dir,
        eval_freq=eval_freq,
    )

    model.learn(total_timesteps=total_timesteps, callback=tracker)

    if save_dir:
        save_path = Path(save_dir)
        save_path.mkdir(parents=True, exist_ok=True)
        model.save(save_path / f"{experiment_name}_final")
        print(f"\nModel saved to {save_path / f'{experiment_name}_final'}")

    metadata = {
        "experiment_name": experiment_name,
        "algorithm": "PPO",
        "total_timesteps": total_timesteps,
        "n_envs": n_envs,
        "learning_rate": learning_rate,
        "n_steps": n_steps,
        "batch_size": batch_size,
        "n_epochs": n_epochs,
        "gamma": gamma,
        "gae_lambda": gae_lambda,
        "clip_range": clip_range,
        "ent_coef": ent_coef,
        "vf_coef": vf_coef,
        "max_grad_norm": max_grad_norm,
        "started_at": datetime.now().isoformat(),
    }

    tracker.save_experiment_metadata(metadata)

    vec_env.close()

    return model, tracker


def evaluate_model(
    model: PPO,
    n_eval_episodes: int = 100,
    borrowers_array: np.ndarray | None = None,
) -> dict[str, float]:
    eval_env = create_vec_env(borrowers_array, n_envs=1)

    mean_reward, std_reward = evaluate_policy(
        model, eval_env, n_eval_episodes=n_eval_episodes
    )

    eval_env.close()

    return {
        "mean_reward": float(mean_reward),
        "std_reward": float(std_reward),
        "n_episodes": n_eval_episodes,
    }


def compare_policies(
    models: dict[str, PPO],
    n_eval_episodes: int = 100,
    borrowers_array: np.ndarray | None = None,
) -> pd.DataFrame:
    import pandas as pd

    results = []
    for name, model in models.items():
        metrics = evaluate_model(model, n_eval_episodes, borrowers_array)
        results.append({
            "model_name": name,
            "mean_reward": metrics["mean_reward"],
            "std_reward": metrics["std_reward"],
            "n_episodes": metrics["n_episodes"],
        })

    return pd.DataFrame(results)


def generate_price_recommendation(
    model: PPO,
    borrower_state: np.ndarray,
    base_rate: float = 0.18,
    base_term: int = 12,
) -> dict[str, Any]:
    state = borrower_state.reshape(1, -1).astype(np.float32)
    action, _ = model.predict(state, deterministic=True)

    rate_adjustment = np.clip(action[0][0], -0.10, 0.10)
    term_adjustment = np.clip(action[0][1], -6, 12)

    recommended_rate = np.clip(base_rate + rate_adjustment, 0.09, 0.36)
    recommended_term = int(np.clip(base_term + term_adjustment, 3, 36))

    return {
        "recommended_rate": round(float(recommended_rate), 4),
        "recommended_term": recommended_term,
        "rate_adjustment": round(float(rate_adjustment), 4),
        "term_adjustment": round(float(term_adjustment), 2),
        "base_rate": base_rate,
        "base_term": base_term,
    }


if __name__ == "__main__":
    print("Generating training data...")
    borrowers_array = generate_training_dataset(n=5000, seed=42)

    print("\nTraining PPO policy...")
    model, tracker = train_ppo(
        experiment_name="baseline_pricing_v1",
        borrowers_array=borrowers_array,
        total_timesteps=50000,
        n_envs=4,
        learning_rate=3e-4,
        log_dir="experiments",
        save_dir="models",
    )

    print("\nEvaluating model...")
    metrics = evaluate_model(model, n_eval_episodes=100, borrowers_array=borrowers_array)
    print(f"Mean reward: {metrics['mean_reward']:.4f} (+/- {metrics['std_reward']:.4f})")

    print("\nSample price recommendation:")
    sample_state = borrowers_array[0]
    recommendation = generate_price_recommendation(model, sample_state)
    print(json.dumps(recommendation, indent=2))
