"""
Data Integration Layer for Micro-Loan Platform
Handles CSV import/export, API endpoints, and data validation.
"""

import pandas as pd
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path
import os


class DataIntegrationLayer:
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.borrowers_file = self.data_dir / "borrowers.csv"
        self.transactions_file = self.data_dir / "transactions.csv"
        self.loan_portfolio_file = self.data_dir / "loan_portfolio.csv"
        
    def load_borrower_data(self, file_path: str) -> pd.DataFrame:
        """
        Load borrower data from CSV file.
        Expected columns: borrower_id, name, segment, phone, language, kyc_status
        """
        df = pd.read_csv(file_path)
        self._validate_borrower_schema(df)
        return df
    
    def load_transaction_data(self, file_path: str) -> pd.DataFrame:
        """
        Load transaction data from CSV file.
        Expected columns: transaction_id, borrower_id, date, amount, type, status
        """
        df = pd.read_csv(file_path)
        self._validate_transaction_schema(df)
        return df
    
    def load_loan_portfolio(self, file_path: str) -> pd.DataFrame:
        """
        Load loan portfolio data from CSV file.
        Expected columns: loan_id, borrower_id, amount, interest_rate, term_days, 
                         start_date, due_date, status, payments_made, payments_total
        """
        df = pd.read_csv(file_path)
        self._validate_loan_schema(df)
        return df
    
    def export_borrower_data(self, df: pd.DataFrame, file_path: Optional[str] = None) -> str:
        """Export borrower data to CSV."""
        output_path = file_path or str(self.borrowers_file)
        df.to_csv(output_path, index=False)
        return output_path
    
    def export_transaction_data(self, df: pd.DataFrame, file_path: Optional[str] = None) -> str:
        """Export transaction data to CSV."""
        output_path = file_path or str(self.transactions_file)
        df.to_csv(output_path, index=False)
        return output_path
    
    def export_loan_portfolio(self, df: pd.DataFrame, file_path: Optional[str] = None) -> str:
        """Export loan portfolio data to CSV."""
        output_path = file_path or str(self.loan_portfolio_file)
        df.to_csv(output_path, index=False)
        return output_path
    
    def generate_sample_data(self, num_borrowers: int = 100) -> Dict[str, pd.DataFrame]:
        """Generate sample data for testing."""
        import numpy as np
        np.random.seed(42)
        
        # Generate borrowers
        segments = ['trader', 'hotelier', 'grocer']
        languages = ['en', 'hi', 'mr', 'ta', 'te']
        
        borrowers_data = {
            'borrower_id': [f"BORR_{i:04d}" for i in range(1, num_borrowers + 1)],
            'name': [f"Borrower {i}" for i in range(1, num_borrowers + 1)],
            'segment': np.random.choice(segments, num_borrowers),
            'phone': [f"+91{np.random.randint(7000000000, 9999999999)}" for _ in range(num_borrowers)],
            'language': np.random.choice(languages, num_borrowers),
            'kyc_status': np.random.choice(['verified', 'pending', 'rejected'], num_borrowers, p=[0.8, 0.15, 0.05])
        }
        borrowers_df = pd.DataFrame(borrowers_data)
        
        # Generate loan portfolio
        loans_data = {
            'loan_id': [f"LOAN_{i:05d}" for i in range(1, num_borrowers + 1)],
            'borrower_id': borrowers_data['borrower_id'],
            'amount': np.random.lognormal(9, 0.5, num_borrowers).astype(int),  # ₹10k-50k range
            'interest_rate': np.random.uniform(0.12, 0.24, num_borrowers).round(3),
            'term_days': np.random.choice([30, 60, 90, 180], num_borrowers),
            'start_date': pd.date_range('2026-01-01', periods=num_borrowers, freq='D'),
            'due_date': pd.date_range('2026-02-01', periods=num_borrowers, freq='D'),
            'status': np.random.choice(['active', 'paid', 'overdue', 'defaulted'], num_borrowers, p=[0.6, 0.25, 0.1, 0.05]),
            'payments_made': np.random.randint(0, 5, num_borrowers),
            'payments_total': np.random.randint(3, 6, num_borrowers)
        }
        loans_df = pd.DataFrame(loans_data)
        
        # Generate transactions
        transactions_data = []
        txn_id = 1
        for _, loan in loans_df.iterrows():
            # Generate some transactions for each loan
            num_txns = np.random.randint(1, 8)
            for _ in range(num_txns):
                transactions_data.append({
                    'transaction_id': f"TXN_{txn_id:06d}",
                    'borrower_id': loan['borrower_id'],
                    'date': pd.Timestamp(loan['start_date']) + pd.Timedelta(days=np.random.randint(0, loan['term_days'])),
                    'amount': np.random.choice([-1, 1]) * np.random.randint(500, 5000),  # Positive for income, negative for expense
                    'type': np.random.choice(['disbursement', 'repayment', 'fee', 'interest']),
                    'status': np.random.choice(['completed', 'pending', 'failed'], p=[0.85, 0.1, 0.05])
                })
                txn_id += 1
        
        transactions_df = pd.DataFrame(transactions_data)
        
        return {
            'borrowers': borrowers_df,
            'loans': loans_df,
            'transactions': transactions_df
        }
    
    def _validate_borrower_schema(self, df: pd.DataFrame) -> None:
        """Validate borrower data schema."""
        required_columns = ['borrower_id', 'name', 'segment', 'phone', 'language', 'kyc_status']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")
        
        # Validate segment values
        valid_segments = ['trader', 'hotelier', 'grocer']
        invalid_segments = df[~df['segment'].isin(valid_segments)]['segment'].unique()
        if len(invalid_segments) > 0:
            raise ValueError(f"Invalid segment values: {invalid_segments}")
    
    def _validate_transaction_schema(self, df: pd.DataFrame) -> None:
        """Validate transaction data schema."""
        required_columns = ['transaction_id', 'borrower_id', 'date', 'amount', 'type', 'status']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")
    
    def _validate_loan_schema(self, df: pd.DataFrame) -> None:
        """Validate loan portfolio schema."""
        required_columns = ['loan_id', 'borrower_id', 'amount', 'interest_rate', 'term_days', 
                           'start_date', 'due_date', 'status', 'payments_made', 'payments_total']
        missing = [col for col in required_columns if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")
    
    def get_portfolio_summary(self) -> Dict[str, Any]:
        """Get a summary of the loan portfolio."""
        if not self.loan_portfolio_file.exists():
            return {"error": "No loan portfolio data found"}
        
        loans_df = pd.read_csv(self.loan_portfolio_file)
        
        summary = {
            'total_loans': len(loans_df),
            'total_amount': loans_df['amount'].sum(),
            'active_loans': len(loans_df[loans_df['status'] == 'active']),
            'overdue_loans': len(loans_df[loans_df['status'] == 'overdue']),
            'defaulted_loans': len(loans_df[loans_df['status'] == 'defaulted']),
            'average_interest_rate': loans_df['interest_rate'].mean(),
            'average_term_days': loans_df['term_days'].mean(),
            'collection_efficiency': self._calculate_collection_efficiency(loans_df)
        }
        
        return summary
    
    def _calculate_collection_efficiency(self, loans_df: pd.DataFrame) -> float:
        """Calculate collection efficiency percentage."""
        if len(loans_df) == 0:
            return 0.0
        
        # Simple calculation: (payments_made / payments_total) * 100
        efficiency = (loans_df['payments_made'].sum() / loans_df['payments_total'].sum()) * 100
        return round(efficiency, 2)


# Example usage
if __name__ == "__main__":
    integration = DataIntegrationLayer()
    
    # Generate sample data
    print("Generating sample data...")
    sample_data = integration.generate_sample_data(num_borrowers=50)
    
    # Export data
    borrowers_path = integration.export_borrower_data(sample_data['borrowers'])
    loans_path = integration.export_loan_portfolio(sample_data['loans'])
    transactions_path = integration.export_transaction_data(sample_data['transactions'])
    
    print(f"Exported borrowers to: {borrowers_path}")
    print(f"Exported loans to: {loans_path}")
    print(f"Exported transactions to: {transactions_path}")
    
    # Get portfolio summary
    summary = integration.get_portfolio_summary()
    print("\nPortfolio Summary:")
    for key, value in summary.items():
        print(f"  {key}: {value}")
    
    # Load and validate data
    print("\nLoading and validating data...")
    borrowers = integration.load_borrower_data(borrowers_path)
    loans = integration.load_loan_portfolio(loans_path)
    transactions = integration.load_transaction_data(transactions_path)
    
    print(f"Loaded {len(borrowers)} borrowers")
    print(f"Loaded {len(loans)} loans")
    print(f"Loaded {len(transactions)} transactions")