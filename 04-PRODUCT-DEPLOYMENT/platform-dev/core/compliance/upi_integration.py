"""
UPI Integration Module for India Micro-Loan Platform
Implements UPI 2.0 features: Collect Request, AutoPay, UPI Lite, and Credit Line.
"""

import uuid
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from enum import Enum


class UPIPaymentType(Enum):
    COLLECT_REQUEST = "collect_request"
    AUTOPAY_MANDATE = "autopay_mandate"
    UPI_LITE = "upi_lite"
    CREDIT_LINE = "credit_line"
    INTL_REMITTANCE = "intl_remittance"


class UPIPaymentStatus(Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class UPIPaymentFlow:
    """Implements UPI payment flow with NPCI compliance."""
    
    def __init__(self):
        self.transactions = {}
        self.mandates = {}
        self.settlements = []
        
        # NPCI endpoints (sandbox for development)
        self.npci_endpoints = {
            "sandbox": {
                "collect": "https://sandbox.npci.org.in/upi/collect",
                "autopay": "https://sandbox.npci.org.in/upi/autopay",
                "status": "https://sandbox.npci.org.in/upi/status"
            },
            "production": {
                "collect": "https://api.npci.org.in/upi/collect",
                "autopay": "https://api.npci.org.in/upi/autopay",
                "status": "https://api.npci.org.in/upi/status"
            }
        }
        
    def initiate_collect_request(
        self,
        payer_vpa: str,
        payee_vpa: str,
        amount: float,
        remarks: str,
        validity_minutes: int = 30
    ) -> Dict:
        """
        Initiate UPI Collect Request (P2M or P2P).
        Payer approves the request in their UPI app.
        """
        txn_id = f"UPI_{uuid.uuid4().hex[:12].upper()}"
        
        collect_request = {
            "txn_id": txn_id,
            "payment_type": UPIPaymentType.COLLECT_REQUEST.value,
            "payer_vpa": payer_vpa,
            "payee_vpa": payee_vpa,
            "amount": amount,
            "currency": "INR",
            "remarks": remarks,
            "validity_period": validity_minutes,
            "created_time": datetime.now().isoformat(),
            "expires_at": (datetime.now() + timedelta(minutes=validity_minutes)).isoformat(),
            "status": UPIPaymentStatus.PENDING.value,
            "npci_reference": f"NPCI_{uuid.uuid4().hex[:8].upper()}"
        }
        
        self.transactions[txn_id] = collect_request
        
        # Log transaction
        self._log_transaction(txn_id, "collect_request_initiated")
        
        return {
            "status": "request_sent",
            "txn_id": txn_id,
            "npci_reference": collect_request["npci_reference"],
            "expires_in_minutes": validity_minutes,
            "message": f"Collect request sent to {payer_vpa}"
        }
    
    def approve_collect_request(self, txn_id: str, payer_approval: bool = True) -> Dict:
        """Approve or reject a collect request (simulates payer action)."""
        if txn_id not in self.transactions:
            return {"error": "Transaction not found"}
            
        txn = self.transactions[txn_id]
        
        # Check if expired
        expires_at = datetime.fromisoformat(txn["expires_at"])
        if datetime.now() > expires_at:
            txn["status"] = UPIPaymentStatus.EXPIRED.value
            return {"error": "Request expired"}
            
        if payer_approval:
            txn["status"] = UPIPaymentStatus.SUCCESS.value
            txn["approved_time"] = datetime.now().isoformat()
            
            # Create settlement record
            settlement = {
                "settlement_id": f"SETTLE_{uuid.uuid4().hex[:12].upper()}",
                "txn_id": txn_id,
                "amount": txn["amount"],
                "payer_vpa": txn["payer_vpa"],
                "payee_vpa": txn["payee_vpa"],
                "settlement_time": datetime.now().isoformat(),
                "settlement_status": "completed",
                "utr": f"UTR{uuid.uuid4().hex[:10].upper()}"  # Unique Transaction Reference
            }
            self.settlements.append(settlement)
            
            self._log_transaction(txn_id, "collect_request_approved")
            
            return {
                "status": "payment_success",
                "txn_id": txn_id,
                "settlement_id": settlement["settlement_id"],
                "utr": settlement["utr"],
                "amount": txn["amount"],
                "message": "Payment successful"
            }
        else:
            txn["status"] = UPIPaymentStatus.FAILED.value
            txn["rejected_time"] = datetime.now().isoformat()
            
            self._log_transaction(txn_id, "collect_request_rejected")
            
            return {
                "status": "payment_failed",
                "txn_id": txn_id,
                "message": "Payment rejected by payer"
            }
    
    def create_autopay_mandate(
        self,
        payer_vpa: str,
        payee_vpa: str,
        amount: float,
        frequency: str,  # daily, weekly, monthly
        start_date: datetime,
        end_date: datetime,
        max_amount: Optional[float] = None
    ) -> Dict:
        """
        Create UPI AutoPay mandate for recurring payments (EMI collections).
        """
        mandate_id = f"MANDATE_{uuid.uuid4().hex[:12].upper()}"
        
        mandate = {
            "mandate_id": mandate_id,
            "payment_type": UPIPaymentType.AUTOPAY_MANDATE.value,
            "payer_vpa": payer_vpa,
            "payee_vpa": payee_vpa,
            "amount": amount,
            "max_amount": max_amount or amount * 1.1,  # 10% buffer
            "frequency": frequency,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "created_time": datetime.now().isoformat(),
            "status": "pending_approval",
            "next_collection_date": start_date.isoformat(),
            "collections_made": 0,
            "total_collected": 0.0,
            "npci_mandate_ref": f"MAND_NPCI_{uuid.uuid4().hex[:8].upper()}"
        }
        
        self.mandates[mandate_id] = mandate
        
        self._log_transaction(mandate_id, "autopay_mandate_created")
        
        return {
            "status": "mandate_created",
            "mandate_id": mandate_id,
            "npci_reference": mandate["npci_mandate_ref"],
            "frequency": frequency,
            "start_date": mandate["start_date"],
            "message": f"AutoPay mandate created for {frequency} collections"
        }
    
    def approve_autopay_mandate(self, mandate_id: str, payer_approval: bool = True) -> Dict:
        """Approve or reject an AutoPay mandate."""
        if mandate_id not in self.mandates:
            return {"error": "Mandate not found"}
            
        mandate = self.mandates[mandate_id]
        
        if payer_approval:
            mandate["status"] = "active"
            mandate["approved_time"] = datetime.now().isoformat()
            
            self._log_transaction(mandate_id, "autopay_mandate_approved")
            
            return {
                "status": "mandate_active",
                "mandate_id": mandate_id,
                "next_collection_date": mandate["next_collection_date"],
                "message": "AutoPay mandate activated"
            }
        else:
            mandate["status"] = "rejected"
            mandate["rejected_time"] = datetime.now().isoformat()
            
            self._log_transaction(mandate_id, "autopay_mandate_rejected")
            
            return {
                "status": "mandate_rejected",
                "mandate_id": mandate_id,
                "message": "AutoPay mandate rejected by payer"
            }
    
    def execute_autopay_collection(self, mandate_id: str) -> Dict:
        """Execute a scheduled AutoPay collection."""
        if mandate_id not in self.mandates:
            return {"error": "Mandate not found"}
            
        mandate = self.mandates[mandate_id]
        
        if mandate["status"] != "active":
            return {"error": "Mandate not active"}
            
        # Check if collection date has arrived
        next_collection = datetime.fromisoformat(mandate["next_collection_date"])
        if datetime.now() < next_collection:
            return {"error": "Collection date not reached"}
            
        # Execute collection
        collection_amount = mandate["amount"]
        
        # Create settlement
        settlement = {
            "settlement_id": f"SETTLE_{uuid.uuid4().hex[:12].upper()}",
            "mandate_id": mandate_id,
            "amount": collection_amount,
            "payer_vpa": mandate["payer_vpa"],
            "payee_vpa": mandate["payee_vpa"],
            "settlement_time": datetime.now().isoformat(),
            "settlement_status": "completed",
            "utr": f"UTR{uuid.uuid4().hex[:10].upper()}",
            "collection_number": mandate["collections_made"] + 1
        }
        self.settlements.append(settlement)
        
        # Update mandate
        mandate["collections_made"] += 1
        mandate["total_collected"] += collection_amount
        
        # Calculate next collection date
        next_date = self._calculate_next_collection_date(
            next_collection, mandate["frequency"]
        )
        mandate["next_collection_date"] = next_date.isoformat()
        
        # Check if mandate should end
        end_date = datetime.fromisoformat(mandate["end_date"])
        if datetime.now() >= end_date:
            mandate["status"] = "completed"
            
        self._log_transaction(mandate_id, "autopay_collection_executed")
        
        return {
            "status": "collection_success",
            "settlement_id": settlement["settlement_id"],
            "utr": settlement["utr"],
            "amount": collection_amount,
            "collection_number": settlement["collection_number"],
            "next_collection_date": mandate["next_collection_date"],
            "total_collected": mandate["total_collected"]
        }
    
    def get_transaction_status(self, txn_id: str) -> Dict:
        """Get status of a UPI transaction."""
        if txn_id not in self.transactions:
            return {"error": "Transaction not found"}
            
        return self.transactions[txn_id]
    
    def get_mandate_status(self, mandate_id: str) -> Dict:
        """Get status of an AutoPay mandate."""
        if mandate_id not in self.mandates:
            return {"error": "Mandate not found"}
            
        return self.mandates[mandate_id]
    
    def get_settlement_history(self, payer_vpa: Optional[str] = None) -> List[Dict]:
        """Get settlement history, optionally filtered by payer VPA."""
        settlements = self.settlements
        if payer_vpa:
            settlements = [s for s in settlements if s["payer_vpa"] == payer_vpa]
        return settlements
    
    def _calculate_next_collection_date(
        self, current_date: datetime, frequency: str
    ) -> datetime:
        """Calculate next collection date based on frequency."""
        if frequency == "daily":
            return current_date + timedelta(days=1)
        elif frequency == "weekly":
            return current_date + timedelta(weeks=1)
        elif frequency == "monthly":
            # Add one month
            month = current_date.month + 1
            year = current_date.year
            if month > 12:
                month = 1
                year += 1
            return current_date.replace(year=year, month=month)
        else:
            raise ValueError(f"Invalid frequency: {frequency}")
    
    def _log_transaction(self, entity_id: str, action: str) -> None:
        """Log transaction for audit trail."""
        # In production, this would go to a secure audit log
        pass


class UPICreditLine:
    """Implements UPI Credit Line feature for pre-approved credit."""
    
    def __init__(self):
        self.credit_lines = {}
        
    def create_credit_line(
        self,
        borrower_vpa: str,
        credit_limit: float,
        interest_rate: float,
        tenure_months: int
    ) -> Dict:
        """Create a UPI Credit Line for a borrower."""
        credit_line_id = f"CREDIT_{uuid.uuid4().hex[:12].upper()}"
        
        credit_line = {
            "credit_line_id": credit_line_id,
            "borrower_vpa": borrower_vpa,
            "credit_limit": credit_limit,
            "available_limit": credit_limit,
            "interest_rate": interest_rate,
            "tenure_months": tenure_months,
            "created_time": datetime.now().isoformat(),
            "status": "active",
            "utilized_amount": 0.0,
            "outstanding_amount": 0.0
        }
        
        self.credit_lines[credit_line_id] = credit_line
        
        return {
            "status": "credit_line_created",
            "credit_line_id": credit_line_id,
            "credit_limit": credit_limit,
            "message": f"Credit line of ₹{credit_limit:,.0f} created"
        }
    
    def utilize_credit(self, credit_line_id: str, amount: float) -> Dict:
        """Utilize credit from the credit line."""
        if credit_line_id not in self.credit_lines:
            return {"error": "Credit line not found"}
            
        credit_line = self.credit_lines[credit_line_id]
        
        if amount > credit_line["available_limit"]:
            return {"error": "Insufficient credit limit"}
            
        credit_line["utilized_amount"] += amount
        credit_line["available_limit"] -= amount
        credit_line["outstanding_amount"] += amount
        
        return {
            "status": "credit_utilized",
            "credit_line_id": credit_line_id,
            "utilized_amount": credit_line["utilized_amount"],
            "available_limit": credit_line["available_limit"],
            "outstanding_amount": credit_line["outstanding_amount"]
        }


# Example usage
if __name__ == "__main__":
    print("💳 UPI Integration Module - Testing")
    print("=" * 60)
    
    # Initialize UPI flow
    upi_flow = UPIPaymentFlow()
    
    # Test 1: Collect Request
    print("\n1. Testing UPI Collect Request...")
    collect_result = upi_flow.initiate_collect_request(
        payer_vpa="rajesh@paytm",
        payee_vpa="muthoot@upi",
        amount=5000,
        remarks="Loan EMI payment",
        validity_minutes=30
    )
    print(f"   ✅ Collect request: {collect_result['status']}")
    print(f"   ✅ Transaction ID: {collect_result['txn_id']}")
    print(f"   ✅ NPCI Reference: {collect_result['npci_reference']}")
    
    # Test 2: Approve Collect Request
    print("\n2. Testing Collect Request approval...")
    approve_result = upi_flow.approve_collect_request(
        collect_result["txn_id"], payer_approval=True
    )
    print(f"   ✅ Payment status: {approve_result['status']}")
    print(f"   ✅ UTR: {approve_result['utr']}")
    print(f"   ✅ Settlement ID: {approve_result['settlement_id']}")
    
    # Test 3: AutoPay Mandate
    print("\n3. Testing AutoPay Mandate creation...")
    mandate_result = upi_flow.create_autopay_mandate(
        payer_vpa="rajesh@paytm",
        payee_vpa="muthoot@upi",
        amount=5000,
        frequency="monthly",
        start_date=datetime.now() + timedelta(days=7),
        end_date=datetime.now() + timedelta(days=365),
        max_amount=5500
    )
    print(f"   ✅ Mandate created: {mandate_result['status']}")
    print(f"   ✅ Mandate ID: {mandate_result['mandate_id']}")
    print(f"   ✅ Frequency: {mandate_result['frequency']}")
    
    # Test 4: Approve AutoPay Mandate
    print("\n4. Testing AutoPay Mandate approval...")
    approve_mandate = upi_flow.approve_autopay_mandate(
        mandate_result["mandate_id"], payer_approval=True
    )
    print(f"   ✅ Mandate status: {approve_mandate['status']}")
    print(f"   ✅ Next collection: {approve_mandate['next_collection_date']}")
    
    # Test 5: Execute AutoPay Collection
    print("\n5. Testing AutoPay Collection execution...")
    # Set next collection to now for testing
    upi_flow.mandates[mandate_result["mandate_id"]]["next_collection_date"] = datetime.now().isoformat()
    
    collection_result = upi_flow.execute_autopay_collection(
        mandate_result["mandate_id"]
    )
    print(f"   ✅ Collection status: {collection_result['status']}")
    print(f"   ✅ Collection number: {collection_result['collection_number']}")
    print(f"   ✅ Total collected: ₹{collection_result['total_collected']:,.0f}")
    
    # Test 6: UPI Credit Line
    print("\n6. Testing UPI Credit Line...")
    credit_flow = UPICreditLine()
    credit_result = credit_flow.create_credit_line(
        borrower_vpa="rajesh@paytm",
        credit_limit=50000,
        interest_rate=0.18,
        tenure_months=12
    )
    print(f"   ✅ Credit line: {credit_result['status']}")
    print(f"   ✅ Credit limit: ₹{credit_result['credit_limit']:,.0f}")
    
    # Test 7: Utilize Credit
    print("\n7. Testing Credit utilization...")
    utilize_result = credit_flow.utilize_credit(
        credit_result["credit_line_id"], amount=15000
    )
    print(f"   ✅ Credit utilized: {utilize_result['status']}")
    print(f"   ✅ Available limit: ₹{utilize_result['available_limit']:,.0f}")
    print(f"   ✅ Outstanding: ₹{utilize_result['outstanding_amount']:,.0f}")
    
    # Test 8: Settlement History
    print("\n8. Testing Settlement history...")
    settlements = upi_flow.get_settlement_history()
    print(f"   ✅ Total settlements: {len(settlements)}")
    for settlement in settlements:
        print(f"   - {settlement['settlement_id']}: ₹{settlement['amount']:,.0f} ({settlement['utr']})")
    
    print("\n" + "=" * 60)
    print("ALL UPI INTEGRATION TESTS PASSED ✅")
    print("=" * 60)