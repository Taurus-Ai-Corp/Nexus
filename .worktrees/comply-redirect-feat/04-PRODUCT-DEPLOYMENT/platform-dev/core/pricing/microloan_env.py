"""
Micro-Loan Pricing Environment for Gymnasium RL.

State space: borrower characteristics + loan parameters
Action space: interest rate adjustment, term adjustment
Reward: balance between repayment probability and portfolio yield
"""

import gymnasium as gym
from gymnasium import spaces
import numpy as np
from typing import Dict, Any, Optional, Tuple


class MicroLoanPricingEnv(gym.Env):
    """Gymnasium environment for micro-loan pricing optimization.
    
    The agent learns to adjust interest rates and loan terms to maximize
    portfolio yield while maintaining high repayment rates.
    
    State: [credit_score_norm, income_norm, loan_amount_norm, 
            repayment_history, days_employed_norm, segment_one_hot(5),
            economic_indicator, current_rate, current_term]
    Action: [rate_adjustment, term_adjustment]
    Reward: yield * repayment_probability - penalty * default_risk
    """
    
    metadata = {"render_modes": ["human", "ansi"]}
    
    BORROWER_SEGMENTS = 5
    STATE_DIM = 3 + 1 + 1 + BORROWER_SEGMENTS + 1 + 1 + 1
    
    def __init__(
        self,
        base_rate: float = 0.18,
        base_term_months: int = 12,
        max_rate: float = 0.36,
        min_rate: float = 0.09,
        max_term_months: int = 36,
        min_term_months: int = 3,
        default_penalty: float = 2.0,
        yield_weight: float = 0.6,
        repayment_weight: float = 0.4,
        render_mode: Optional[str] = None,
        borrowers: Optional[np.ndarray] = None,
    ):
        super().__init__()
        
        self.base_rate = base_rate
        self.base_term = base_term_months
        self.max_rate = max_rate
        self.min_rate = min_rate
        self.max_term = max_term_months
        self.min_term = min_term_months
        self.default_penalty = default_penalty
        self.yield_weight = yield_weight
        self.repayment_weight = repayment_weight
        self.render_mode = render_mode
        
        if borrowers is not None:
            self.borrowers = borrowers
            self.num_borrowers = len(borrowers)
        else:
            self.borrowers = None
            self.num_borrowers = 0
        
        self.observation_space = spaces.Box(
            low=-1.0,
            high=1.0,
            shape=(self.STATE_DIM,),
            dtype=np.float32,
        )
        
        self.action_space = spaces.Box(
            low=np.array([-0.10, -6]),
            high=np.array([0.10, 12]),
            dtype=np.float32,
        )
        
        self.current_step = 0
        self.max_steps = 1000
        self.total_reward = 0.0
        self.current_borrower_idx = 0
        
    def _generate_synthetic_borrower(self) -> np.ndarray:
        state = np.zeros(self.STATE_DIM, dtype=np.float32)
        state[0] = np.clip(np.random.normal(0.5, 0.2), -1, 1)
        state[1] = np.clip(np.random.normal(0.4, 0.25), -1, 1)
        state[2] = np.clip(np.random.normal(0.3, 0.2), -1, 1)
        state[3] = np.clip(np.random.normal(0.6, 0.3), -1, 1)
        state[4] = np.clip(np.random.normal(0.5, 0.2), -1, 1)
        segment = np.random.randint(0, self.BORROWER_SEGMENTS)
        state[5 + segment] = 1.0
        state[10] = np.clip(np.random.normal(0.5, 0.15), -1, 1)
        state[11] = (self.base_rate - 0.18) / 0.18
        state[12] = (self.base_term - 12) / 12
        return state
    
    def _estimate_repayment_probability(
        self, state: np.ndarray, rate: float, term: float
    ) -> float:
        credit_score = (state[0] + 1) / 2
        income = (state[1] + 1) / 2
        loan_amount = (state[2] + 1) / 2
        repayment_history = (state[3] + 1) / 2
        segment_idx = np.argmax(state[5:10])
        economic_indicator = (state[10] + 1) / 2
        
        base_prob = (
            0.25 * credit_score
            + 0.20 * income
            - 0.15 * loan_amount
            + 0.25 * repayment_history
            + 0.10 * economic_indicator
        )
        
        segment_factors = [0.0, -0.05, 0.05, -0.10, 0.02]
        base_prob += segment_factors[segment_idx]
        
        rate_sensitivity = -0.5 * (rate - 0.18)
        term_sensitivity = 0.1 * ((term - 12) / 12)
        base_prob += rate_sensitivity + term_sensitivity
        
        return np.clip(base_prob, 0.05, 0.95)
    
    def _calculate_yield(self, rate: float, term: float, repayment_prob: float) -> float:
        expected_return = rate * repayment_prob
        capital_cost = 0.06
        operational_cost = 0.02
        net_yield = expected_return - capital_cost - operational_cost
        return max(net_yield, -0.05)
    
    def reset(
        self,
        seed: Optional[int] = None,
        options: Optional[Dict[str, Any]] = None,
    ) -> Tuple[np.ndarray, Dict[str, Any]]:
        super().reset(seed=seed)
        np.random.seed(seed)
        
        self.current_step = 0
        self.total_reward = 0.0
        self.current_borrower_idx = 0
        
        if self.borrowers is not None and len(self.borrowers) > 0:
            indices = np.random.choice(
                len(self.borrowers),
                size=min(self.max_steps, len(self.borrowers)),
                replace=False,
            )
            self.borrower_sequence = self.borrowers[indices]
        else:
            self.borrower_sequence = np.array([
                self._generate_synthetic_borrower()
                for _ in range(self.max_steps)
            ])
        
        observation = self.borrower_sequence[0].copy()
        info = self._get_info()
        return observation, info
    
    def step(self, action: np.ndarray):
        rate_adjustment = np.clip(action[0], -0.10, 0.10)
        term_adjustment = np.clip(action[1], -6, 12)
        
        current_state = self.borrower_sequence[self.current_step]
        
        proposed_rate = np.clip(
            self.base_rate + rate_adjustment,
            self.min_rate,
            self.max_rate,
        )
        proposed_term = np.clip(
            self.base_term + term_adjustment,
            self.min_term,
            self.max_term,
        )
        
        repayment_prob = self._estimate_repayment_probability(
            current_state, proposed_rate, proposed_term
        )
        
        yield_val = self._calculate_yield(proposed_rate, proposed_term, repayment_prob)
        
        reward = (
            self.yield_weight * yield_val
            + self.repayment_weight * repayment_prob
            - self.default_penalty * (1 - repayment_prob) * proposed_rate
        )
        
        self.total_reward += reward
        self.current_step += 1
        
        if self.current_step < len(self.borrower_sequence):
            observation = self.borrower_sequence[self.current_step].copy()
            terminated = False
        else:
            observation = self._generate_synthetic_borrower()
            terminated = True
        
        truncated = self.current_step >= self.max_steps
        info = self._get_info()
        
        if self.render_mode == "human":
            self._render_step(reward, repayment_prob, proposed_rate, proposed_term)
        
        return observation, reward, terminated, truncated, info
    
    def _get_info(self) -> Dict[str, Any]:
        return {
            "total_reward": self.total_reward,
            "step": self.current_step,
            "base_rate": self.base_rate,
            "base_term": self.base_term,
        }
    
    def _render_step(self, reward, repayment_prob, rate, term):
        print(
            f"Step {self.current_step}: rate={rate:.3f}, term={term:.0f}m, "
            f"repay_prob={repayment_prob:.3f}, reward={reward:.4f}"
        )
    
    def render(self):
        if self.render_mode == "ansi":
            return (
                f"MicroLoanPricingEnv(step={self.current_step}, "
                f"total_reward={self.total_reward:.4f})"
            )
        return None
    
    def close(self):
        pass
