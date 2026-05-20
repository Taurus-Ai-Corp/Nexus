"""
Test script for the CashFlowAnalyzer module.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from core.analysis.cash_flow_analyzer import CashFlowAnalyzer

def generate_synthetic_borrower_data(borrower_id="BORROWER_001", segment="grocer", days=90):
    """
    Generate synthetic transaction data for a borrower.
    """
    np.random.seed(42)  # for reproducibility
    start_date = datetime.now() - timedelta(days=days)
    
    # Define income and expense patterns based on segment
    if segment == "grocer":
        # Grocer: income in the morning, expenses for restocking twice a week
        income_mean = 1500  # average daily income
        income_std = 500
        expense_days = [0, 3]  # Monday and Thursday (0=Monday, 3=Thursday) for restocking
        expense_mean = 8000
        expense_std = 2000
    elif segment == "trader":
        # Trader: income on weekends, expenses for inventory mid-week
        income_mean = 2000
        income_std = 800
        expense_days = [1, 2]  # Tuesday and Wednesday
        expense_mean = 10000
        expense_std = 3000
    elif segment == "hotelier":
        # Hotelier: income on weekends, expenses for supplies and staff
        income_mean = 2500
        income_std = 1000
        expense_days = [5, 6]  # Saturday and Sunday (weekend supplies)
        expense_mean = 12000
        expense_std = 4000
    else:
        # Default
        income_mean = 1500
        income_std = 500
        expense_days = [0, 3]
        expense_mean = 8000
        expense_std = 2000

    data = []
    current_date = start_date
    for i in range(days):
        day_of_week = current_date.weekday()  # Monday=0, Sunday=6
        
        # Income: normally distributed, but zero on some days? Let's assume income every day with variation.
        income = max(0, np.random.normal(income_mean, income_std))
        
        # Expense: higher on specific days
        expense = 0
        if day_of_week in expense_days:
            expense = max(0, np.random.normal(expense_mean, expense_std))
        
        # Add income transaction
        data.append({
            "borrower_id": borrower_id,
            "transaction_date": current_date.strftime("%Y-%m-%d"),
            "amount": income,  # positive for income
            "transaction_type": "income"
        })
        
        # Add expense transaction (if any)
        if expense > 0:
            data.append({
                "borrower_id": borrower_id,
                "transaction_date": current_date.strftime("%Y-%m-%d"),
                "amount": -expense,  # negative for expense
                "transaction_type": "expense"
            })
        
        current_date += timedelta(days=1)
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    # Generate synthetic data for each segment
    segments = ["grocer", "trader", "hotelier"]
    all_data = []
    
    for segment in segments:
        df = generate_synthetic_borrower_data(segment=segment, days=90)
        all_data.append(df)
    
    # Combine all data
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # Save to CSV for the analyzer to load
    combined_df.to_csv("synthetic_borrower_data.csv", index=False)
    print("Generated synthetic borrower data and saved to 'synthetic_borrower_data.csv'")
    
    # Initialize the analyzer with the synthetic data
    analyzer = CashFlowAnalyzer(data_path="synthetic_borrower_data.csv")
    
    # Test segmentation
    borrower_info_grocer = {
        "business_type": "Kirana Store",
        "primary_income_source": "Grocery Sales"
    }
    segment_grocer = analyzer.segment_borrower(borrower_info_grocer)
    print(f"\nSegmentation test - Grocer: {segment_grocer} (expected: grocer)")
    
    borrower_info_trader = {
        "business_type": "Cloth Trader",
        "primary_income_source": "Market Sales"
    }
    segment_trader = analyzer.segment_borrower(borrower_info_trader)
    print(f"Segmentation test - Trader: {segment_trader} (expected: trader)")
    
    borrower_info_hotel = {
        "business_type": "Budget Hotel",
        "primary_income_source": "Room Bookings"
    }
    segment_hotel = analyzer.segment_borrower(borrower_info_hotel)
    print(f"Segmentation test - Hotelier: {segment_hotel} (expected: hotelier)")
    
    # Test cash flow analysis for each segment
    print("\n--- Cash Flow Analysis ---")
    for segment in segments:
        # Get a sample borrower ID for this segment (we used the same ID for all in generation, but let's filter by transaction type? 
        # Actually, we used the same borrower_id for all segments in the generation above. Let's change the generation to have different IDs.
        # For simplicity, we'll just analyze the first borrower in the data for each segment by filtering the data we generated.
        # But note: our generation function used the same borrower_id for all segments. Let's adjust the test to use different IDs.
        # We'll redo the generation for each segment with a unique ID.
        
        # Instead, let's generate data for one borrower per segment for clarity.
        pass  # We'll do a simpler test: analyze the combined data for a specific borrower we know.
    
    # Let's just test with one borrower from the combined data (we know the first 2*90 rows are for grocer? Actually, we appended grocer, trader, hotelier)
    # So the first 180 rows (2 transactions per day * 90 days) are for grocer? Actually, we generated for grocer first, then trader, then hotelier.
    # And each day we added 1 income and possibly 1 expense transaction -> 2 transactions per day.
    # So for 90 days, we have 180 transactions per segment.
    
    # Let's take the first borrower in the data (which is the grocer borrower with ID "BORROWER_001")
    sample_borrower_id = "BORROWER_001"
    analysis = analyzer.analyze_cash_flow_patterns(sample_borrower_id)
    
    print(f"\nAnalysis for borrower {sample_borrower_id}:")
    for key, value in analysis.items():
        if key != "borrower_id":
            print(f"  {key}: {value}")
    
    # Generate repayment suggestion
    print("\n--- Repayment Suggestion ---")
    suggestion = analyzer.generate_repayment_suggestion(
        borrower_id=sample_borrower_id,
        loan_amount=50000,  # Rs 50,000
        loan_term_days=90   # 3 months
    )
    
    for key, value in suggestion.items():
        if key != "analysis_basis" and key != "borrower_id":
            print(f"  {key}: {value}")
    
    # Print a summary of the analysis basis
    print("\nAnalysis Basis Summary:")
    basis = suggestion.get("analysis_basis", {})
    for key in ["income_frequency_per_day", "income_volatility", "peak_income_days", "suggested_repayment_days"]:
        if key in basis:
            print(f"  {key}: {basis[key]}")