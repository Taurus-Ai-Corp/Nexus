import json
import os
from typing import Any

import ollama
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="India NBFC Micro-loan Repayment AI Agent")

class LoanItem(BaseModel):
    customer_id: str
    loan_id: str
    due_date: str  # YYYY-MM-DD
    amount: float
    historical_payments: list[dict[str, Any]]  # List of {date: str, amount: float, status: str}
    business_type: str  # e.g., "hotel", "grocery", "trader"
    last_payment_date: str  # YYYY-MM-DD
    days_overdue: int  # negative if not overdue

class AssessmentRequest(BaseModel):
    portfolio: list[LoanItem]

class Recommendation(BaseModel):
    loan_id: str
    action: str  # "SMS_REMINDER", "WHATSAPP_NUDGE", "CALL_REQUEST", "NO_ACTION"
    message_template: str
    confidence: float  # 0.0 to 1.0

class AssessmentResponse(BaseModel):
    recommendations: list[Recommendation]
    summary: dict[str, Any]

# Fallback rule-based engine if Ollama is not available
def rule_based_recommendation(loan: LoanItem) -> Recommendation:
    # Simple logic: if overdue > 7 days, call; if overdue > 3 days, WhatsApp; else SMS if due in 2 days
    if loan.days_overdue > 7:
        action = "CALL_REQUEST"
        message = f"URGENT: Your loan {loan.loan_id} is {loan.days_overdue} days overdue. Please contact us immediately to avoid penalties."
        confidence = 0.9
    elif loan.days_overdue > 3:
        action = "WHATSAPP_NUDGE"
        message = f"Reminder: Loan {loan.loan_id} is {loan.days_overdue} days overdue. Please arrange payment to avoid further action."
        confidence = 0.8
    elif loan.days_overdue > 0:
        action = "SMS_REMINDER"
        message = f"Your loan {loan.loan_id} is {loan.days_overdue} days overdue. Please make a payment today."
        confidence = 0.7
    elif (loan.due_date - str(date.today())).days <= 2:  # due in 2 days or less
        action = "SMS_REMINDER"
        message = f"Reminder: Your loan {loan.loan_id} is due on {loan.due_date}. Please ensure sufficient funds."
        confidence = 0.6
    else:
        action = "NO_ACTION"
        message = f"No action required for loan {loan.loan_id} at this time."
        confidence = 0.5
    return Recommendation(loan_id=loan.loan_id, action=action, message_template=message, confidence=confidence)

# Ollama-based recommendation (if Ollama is available)
def ollama_recommendation(loan: LoanItem) -> Recommendation:
    try:
        prompt = f"""
        You are an AI agent helping an NBFC manage micro-loan repayments.
        Based on the following loan details, recommend the best course of action:
        - Customer ID: {loan.customer_id}
        - Loan ID: {loan.loan_id}
        - Due Date: {loan.due_date}
        - Loan Amount: {loan.amount}
        - Business Type: {loan.business_type}
        - Last Payment Date: {loan.last_payment_date}
        - Days Overdue: {loan.days_overdue}
        - Historical Payments: {json.dumps(loan.historical_payments)}

        Possible actions:
        1. SMS_REMINDER: Send a simple SMS reminder
        2. WHATSAPP_NUDGE: Send a WhatsApp message (more engaging)
        3. CALL_REQUEST: Request a phone call to discuss repayment
        4. NO_ACTION: No action needed

        Consider:
        - If overdue > 7 days, likely CALL_REQUEST
        - If overdue between 3-7 days, likely WHATSAPP_NUDGE
        - If overdue 1-3 days or due soon, likely SMS_REMINDER
        - If not overdue and due far in future, NO_ACTION
        - Also consider business type and payment history.

        Respond in JSON format with:
        {{
          "action": "one of the four actions",
          "message_template": "a short message to send to the customer",
          "confidence": a float between 0 and 1 indicating your confidence
        }}
        """
        # Use Ollama to generate the recommendation
        response = ollama.generate(
            model='qwen3-coder:latest',
            prompt=prompt,
            format='json'
        )
        # Parse the response
        result = json.loads(response['response'])
        return Recommendation(
            loan_id=loan.loan_id,
            action=result.get('action', 'NO_ACTION'),
            message_template=result.get('message_template', 'No message'),
            confidence=float(result.get('confidence', 0.5))
        )
    except Exception as e:
        # Fall back to rule-based if Ollama fails
        print(f"Ollama error: {e}. Falling back to rule-based.")
        return rule_based_recommendation(loan)

@app.post("/assess", response_model=AssessmentResponse)
async def assess_portfolio(request: AssessmentRequest):
    if not request.portfolio:
        raise HTTPException(status_code=400, detail="Portfolio cannot be empty")

    recommendations = []
    for loan in request.portfolio:
        # Try Ollama first, fall back to rule-based
        rec = ollama_recommendation(loan)
        recommendations.append(rec)

    # Summary statistics
    actions = [r.action for r in recommendations]
    summary = {
        "total_loans": len(recommendations),
        "sms_reminders": actions.count("SMS_REMINDER"),
        "whatsapp_nudges": actions.count("WHATSAPP_NUDGE"),
        "call_requests": actions.count("CALL_REQUEST"),
        "no_action": actions.count("NO_ACTION"),
        "avg_confidence": sum(r.confidence for r in recommendations) / len(recommendations)
    }

    return AssessmentResponse(recommendations=recommendations, summary=summary)

@app.get("/health")
async def health_check():
    # Check if Ollama is available
    try:
        ollama.list()  # This will throw if Ollama is not reachable
        ollama_status = "available"
    except Exception as e:
        ollama_status = f"unavailable: {str(e)}"

    return {
        "status": "OK",
        "service": "India NBFC Micro-loan Repayment AI Agent",
        "ollama_status": ollama_status,
        "timestamp": os.popen('date -Iseconds').read().strip()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
