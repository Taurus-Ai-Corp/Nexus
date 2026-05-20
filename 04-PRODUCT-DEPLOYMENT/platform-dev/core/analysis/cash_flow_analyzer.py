"""
Cash Flow Analysis Module for Micro-Loan Borrowers
Segments borrowers (trader/hotelier/grocer) and analyzes repayment patterns.
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
import json


class CashFlowAnalyzer:
    def __init__(self, data_path: Optional[str] = None):
        """
        Initialize the analyzer with optional data path.
        If data_path is provided, load historical data.
        """
        self.data_path = data_path
        self.borrower_data = None
        self.segment_patterns = {
            'trader': {
                'income_frequency': 'daily',
                'peak_days': ['Saturday', 'Sunday'],  # Weekend markets
                'income_volatility': 'high',
                'expense_patterns': ['inventory', 'stall_rent', 'transport']
            },
            'hotelier': {
                'income_frequency': 'daily',
                'peak_days': ['Friday', 'Saturday'],  # Weekend bookings
                'income_volatility': 'medium',
                'expense_patterns': ['supplies', 'staff', 'utilities', 'maintenance']
            },
            'grocer': {
                'income_frequency': 'daily',
                'peak_days': ['Monday', 'Tuesday'],  # Post-weekend restocking
                'income_volatility': 'low',
                'expense_patterns': ['wholesale_purchase', 'store_rent', 'electricity']
            }
        }
        if data_path:
            self.load_data(data_path)

    def load_data(self, data_path: str) -> None:
        """Load historical borrower data from CSV."""
        self.borrower_data = pd.read_csv(data_path)
        # Ensure date columns are datetime
        date_columns = [col for col in self.borrower_data.columns if 'date' in col.lower()]
        for col in date_columns:
            self.borrower_data[col] = pd.to_datetime(self.borrower_data[col])

    def segment_borrower(self, borrower_info: Dict) -> str:
        """
        Segment a borrower based on their business type.
        Expected keys in borrower_info: 'business_type', 'primary_income_source'
        """
        business_type = borrower_info.get('business_type', '').lower()
        income_source = borrower_info.get('primary_income_source', '').lower()
        combined = f"{business_type} {income_source}"
        
        # Check for hotelier first (more specific)
        if any(keyword in combined for keyword in ['hotel', 'lodging', 'guest', 'inn', 'resort', 'restaurant', 'hospitality']):
            return 'hotelier'
        # Check for grocer
        elif any(keyword in combined for keyword in ['grocery', 'kirana', 'vegetable', 'fruit', 'food store', 'provision']):
            return 'grocer'
        # Default to trader for general retail/trading
        elif any(keyword in combined for keyword in ['trade', 'shop', 'retail', 'market', 'vendor', 'seller']):
            return 'trader'
        else:
            # Default to trader if unknown
            return 'trader'

    def analyze_cash_flow_patterns(self, borrower_id: str) -> Dict:
        """
        Analyze cash flow patterns for a given borrower.
        Returns insights on income frequency, peak days, volatility, and suggested repayment timing.
        """
        if self.borrower_data is None:
            raise ValueError("No data loaded. Call load_data() first.")

        borrower_transactions = self.borrower_data[
            self.borrower_data['borrower_id'] == borrower_id
        ].copy()

        if borrower_transactions.empty:
            return {"error": f"No transaction data found for borrower {borrower_id}"}

        # Ensure we have a date column and amount column
        date_col = [col for col in borrower_transactions.columns if 'date' in col.lower()][0]
        amount_col = [col for col in borrower_transactions.columns if 'amount' in col.lower()][0]
        
        # Convert date column to datetime if it's not already
        borrower_transactions[date_col] = pd.to_datetime(borrower_transactions[date_col], errors='coerce')
        borrower_transactions['day_of_week'] = borrower_transactions[date_col].dt.day_name()
        borrower_transactions['amount'] = pd.to_numeric(borrower_transactions[amount_col], errors='coerce')

        # Calculate daily income (assuming positive amounts are income, negative are expenses)
        income = borrower_transactions[borrower_transactions['amount'] > 0]['amount']
        expenses = borrower_transactions[borrower_transactions['amount'] < 0]['amount'].abs()

        # Income frequency and volatility
        income_days = income.groupby(borrower_transactions[date_col].dt.date).count()
        income_frequency = income_days.mean()  # Average number of income transactions per day
        income_volatility = income.std() / income.mean() if income.mean() > 0 else 0

        # Peak income days
        day_of_week_income = borrower_transactions[borrower_transactions['amount'] > 0].groupby('day_of_week')['amount'].mean()
        peak_income_days = day_of_week_income.nlargest(2).index.tolist()

        # Suggested repayment timing (after peak income days)
        suggested_repayment_days = []
        for day in peak_income_days:
            # Suggest repayment the day after peak income
            current_index = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].index(day)
            next_index = (current_index + 1) % 7
            suggested_repayment_days.append(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][next_index])

        # Remove duplicates while preserving order
        suggested_repayment_days = list(dict.fromkeys(suggested_repayment_days))

        return {
            "borrower_id": borrower_id,
            "income_frequency_per_day": round(income_frequency, 2),
            "income_volatility": round(income_volatility, 2),
            "peak_income_days": peak_income_days,
            "suggested_repayment_days": suggested_repayment_days,
            "average_daily_income": round(income.mean(), 2) if not income.empty else 0,
            "average_daily_expense": round(expenses.mean(), 2) if not expenses.empty else 0,
            "net_daily_cash_flow": round(income.mean() - expenses.mean(), 2) if not income.empty and not expenses.empty else 0
        }

    def generate_repayment_suggestion(self, borrower_id: str, loan_amount: float, loan_term_days: int) -> Dict:
        """
        Generate a repayment schedule suggestion based on cash flow analysis.
        """
        analysis = self.analyze_cash_flow_patterns(borrower_id)
        if "error" in analysis:
            return analysis

        # Simple suggestion: fixed installment after peak income days
        suggested_days = analysis["suggested_repayment_days"]
        if not suggested_days:
            suggested_days = ["Monday"]  # Default

        # Calculate installment amount (simple interest for example)
        # In reality, use amortization or Islamic finance principles if applicable
        monthly_rate = 0.02  # 2% per month (example)
        term_months = loan_term_days / 30
        emi = (loan_amount * monthly_rate * (1 + monthly_rate) ** term_months) / \
              ((1 + monthly_rate) ** term_months - 1) if monthly_rate > 0 else loan_amount / term_months

        # Suggest specific dates for repayment (next occurrences of suggested days)
        start_date = datetime.now()
        repayment_dates = []
        days_added = 0
        while len(repayment_dates) < term_months and days_added < loan_term_days:
            current_date = start_date + timedelta(days=days_added)
            if current_date.strftime("%A") in suggested_days:
                repayment_dates.append(current_date.strftime("%Y-%m-%d"))
            days_added += 1

        return {
            "borrower_id": borrower_id,
            "loan_amount": loan_amount,
            "loan_term_days": loan_term_days,
            "suggested_emi": round(emi, 2),
            "number_of_installments": len(repayment_dates),
            "suggested_repayment_dates": repayment_dates[:min(len(repayment_dates), int(term_months))],
            "analysis_basis": analysis
        }


# Example usage
if __name__ == "__main__":
    # Example with synthetic data
    analyzer = CashFlowAnalyzer()

    # Example borrower info for segmentation
    borrower_info = {
        "business_type": "Kirana Store",
        "primary_income_source": "Grocery Sales"
    }
    segment = analyzer.segment_borrower(borrower_info)
    print(f"Borrower Segment: {segment}")

    # Example analysis (would work with real data)
    # print(analyzer.analyze_cash_flow_patterns("BORROWER_001"))