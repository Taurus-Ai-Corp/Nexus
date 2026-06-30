"""
Micro-loan Pricing Gymnasium Environment
Based on research findings showing active experimentation with Gymnasium 
prototypes for RL agent micro-loan pricing (like mifos-x-ai-sentiment-analysis-module)
"""

try:
    import gymnasium as gym
    from gymnasium import spaces
except ImportError:
    # Fallback for older gym versions
    import gym
    from gym import spaces


import numpy as np
import pandas as pd


class MicroLoanPricingEnv(gym.Env):
    """
    Gymnasium environment for optimizing micro-loan pricing strategies
    using reinforcement learning.
    
    State: Borrower characteristics + loan status + payment history
    Action: Interest rate adjustment + term length modification
    Reward: Weighted combination of repayment likelihood and portfolio yield
    """

    def __init__(self, borrower_data: pd.DataFrame = None):
        super(MicroLoanPricingEnv, self).__init__()

        # Initialize with synthetic or real borrower data
        if borrower_data is None:
            self.borrower_data = self._generate_synthetic_borrowers(1000)
        else:
            self.borrower_data = borrower_data

        self.current_borrower_idx = 0
        self.max_steps = len(self.borrower_data)
        self.current_step = 0

        # Define action space: [interest_rate_change, term_length_change]
        # interest_rate_change: -0.05 to +0.05 (±5 percentage points)
        # term_length_change: -2 to +2 months
        self.action_space = spaces.Box(
            low=np.array([-0.05, -2]),
            high=np.array([0.05, 2]),
            dtype=np.float32
        )

        # Define observation space
        # [loan_amount, income, expense_ratio, payment_history_score,
        #  current_rate, remaining_term, economic_indicator]
        self.observation_space = spaces.Box(
            low=np.array([0, 0, 0, 0, 0.01, 0, 0]),
            high=np.array([100000, 10000, 1, 1, 0.5, 36, 1]),
            dtype=np.float32
        )

        # Initialize state
        self.state = None
        self.reset()

    def _generate_synthetic_borrowers(self, n: int) -> pd.DataFrame:
        """Generate synthetic borrower data for testing"""
        np.random.seed(42)

        data = {
            'borrower_id': range(n),
            'loan_amount': np.random.lognormal(9, 0.5, n),  # ~₹8,000-50,000
            'monthly_income': np.random.lognormal(8, 0.4, n),  # ~₹15,000-80,000
            'expense_ratio': np.random.beta(2, 5, n),  # 0-1, typically 0.3-0.7
            'base_repayment_prob': np.random.beta(3, 2, n),  # Base repayment likelihood
            'segment': np.random.choice(['trader', 'hotelier', 'grocer'], n),
        }

        df = pd.DataFrame(data)

        # Add loan terms
        df['interest_rate'] = np.random.uniform(0.15, 0.35, n)  # 15-35% APR
        df['loan_term_months'] = np.random.choice([6, 12, 18, 24], n)

        return df

    def _get_observation(self) -> np.ndarray:
        """Get current state observation"""
        borrower = self.borrower_data.iloc[self.current_borrower_idx]

        # Normalize features to [0,1] range for neural network stability
        obs = np.array([
            min(borrower['loan_amount'] / 100000, 1.0),  # Normalized loan amount
            min(borrower['monthly_income'] / 10000, 1.0),  # Normalized income
            borrower['expense_ratio'],  # Already 0-1
            borrower['base_repayment_prob'],  # Already 0-1
            borrower['interest_rate'] / 0.5,  # Normalized rate (max 50%)
            borrower['loan_term_months'] / 36,  # Normalized term (max 36 months)
            0.5  # Placeholder economic indicator (would be real data in production)
        ], dtype=np.float32)

        return obs

    def reset(self, seed: int | None = None, options: dict | None = None) -> tuple[np.ndarray, dict]:
        """Reset environment to initial state"""
        super().reset(seed=seed)

        # Reset to first borrower or random if specified
        if options and 'borrower_idx' in options:
            self.current_borrower_idx = options['borrower_idx']
        else:
            self.current_borrower_idx = np.random.randint(0, len(self.borrower_data))

        self.current_step = 0
        self.state = self._get_observation()

        return self.state, {}

    def step(self, action: np.ndarray) -> tuple[np.ndarray, float, bool, bool, dict]:
        """
        Execute one time step in the environment
        
        Args:
            action: [interest_rate_change, term_length_change]
            
        Returns:
            observation, reward, terminated, truncated, info
        """
        # Apply action to modify loan terms
        rate_change, term_change = action

        borrower = self.borrower_data.iloc[self.current_borrower_idx]

        # Calculate new terms (with bounds)
        new_rate = np.clip(
            borrower['interest_rate'] + rate_change,
            0.05, 0.5  # 5% to 50% APR bounds
        )

        new_term = int(np.clip(
            borrower['loan_term_months'] + term_change,
            1, 36  # 1 to 36 month bounds
        ))

        # Calculate reward based on expected outcome
        reward = self._calculate_reward(new_rate, new_term, borrower)

        # Move to next borrower
        self.current_borrower_idx = (self.current_borrower_idx + 1) % len(self.borrower_data)
        self.current_step += 1

        # Check if episode is done
        terminated = self.current_step >= self.max_steps
        truncated = False  # No time limit truncation in this implementation

        # Get next state
        if not terminated:
            self.state = self._get_observation()
        else:
            self.state = np.zeros(self.observation_space.shape, dtype=np.float32)

        # Info dictionary for debugging
        info = {
            'borrower_id': borrower['borrower_id'],
            'segment': borrower['segment'],
            'original_rate': borrower['interest_rate'],
            'new_rate': new_rate,
            'original_term': borrower['loan_term_months'],
            'new_term': new_term,
            'rate_change': rate_change,
            'term_change': term_change
        }

        return self.state, reward, terminated, truncated, info

    def _calculate_reward(self, new_rate: float, new_term: int, borrower: pd.Series) -> float:
        """
        Calculate reward based on loan pricing decision
        
        Reward combines:
        1. Probability of repayment (higher is better)
        2. Expected yield (interest earned)
        3. Risk adjustment (penalty for excessive risk)
        """
        # Base repayment probability from borrower characteristics
        base_prob = borrower['base_repayment_prob']

        # Adjust probability based on rate changes (higher rates decrease repayment likelihood)
        rate_sensitivity = 0.3  # How much rate affects repayment probability
        rate_effect = -rate_sensitivity * (new_rate - borrower['interest_rate']) / 0.1

        # Adjust probability based on term changes (longer terms slightly decrease likelihood)
        term_sensitivity = 0.05
        term_effect = -term_sensitivity * (new_term - borrower['loan_term_months']) / 6

        # Calculate adjusted repayment probability
        repayment_prob = np.clip(base_prob + rate_effect + term_effect, 0.01, 0.99)

        # Calculate expected monthly payment
        monthly_rate = new_rate / 12
        if monthly_rate > 0:
            payment = borrower['loan_amount'] * (monthly_rate * (1 + monthly_rate)**new_term) / \
                     ((1 + monthly_rate)**new_term - 1)
        else:
            payment = borrower['loan_amount'] / new_term

        # Calculate expected yield (interest earned)
        total_paid = payment * new_term
        interest_earned = total_paid - borrower['loan_amount']
        yield_rate = interest_earned / borrower['loan_amount'] if borrower['loan_amount'] > 0 else 0

        # Risk adjustment: penalize very low repayment probability
        risk_penalty = max(0, (0.3 - repayment_prob) * 2) if repayment_prob < 0.3 else 0

        # Combined reward: weighted sum of repayment probability and yield, minus risk
        reward = (0.6 * repayment_prob) + (0.4 * min(yield_rate, 1.0)) - risk_penalty

        # Normalize reward to approximately [-1, 1] range
        reward = np.clip((reward - 0.5) * 2, -1, 1)

        return reward

    def render(self, mode='human'):
        """Render the environment (for debugging)"""
        if self.current_step > 0 and self.current_step <= len(self.borrower_data):
            borrower = self.borrower_data.iloc[(self.current_borrower_idx - 1) % len(self.borrower_data)]
            print(f"Step: {self.current_step}")
            print(f"Borrower: {borrower['borrower_id']} ({borrower['segment']})")
            print(f"Loan Amount: ₹{borrower['loan_amount']:.0f}")
            print(f"Income: ₹{borrower['monthly_income']:.0f}")
            print(f"Expense Ratio: {borrower['expense_ratio']:.2f}")
            print(f"Base Repayment Prob: {borrower['base_repayment_prob']:.2f}")
        else:
            print("Environment not initialized or episode complete")


# Example usage and testing
if __name__ == "__main__":
    # Create environment
    env = MicroLoanPricingEnv()

    # Test reset
    obs, info = env.reset()
    print(f"Initial observation shape: {obs.shape}")
    print(f"Initial observation: {obs}")

    # Test a few steps
    total_reward = 0
    steps_taken = 0
    for i in range(5):
        action = env.action_space.sample()  # Random action
        obs, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        steps_taken = i + 1
        print(f"Step {steps_taken}: Reward = {reward:.3f}, Total = {total_reward:.3f}")
        if terminated:
            break

    print(f"Finished after {steps_taken} steps with total reward: {total_reward:.3f}")
