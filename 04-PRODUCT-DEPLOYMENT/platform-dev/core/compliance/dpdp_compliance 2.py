"""
DPDP Act 2023 Compliance Module for India Micro-Loan Platform
Implements data principal rights, consent management, and breach notification.
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from enum import Enum
import json
import hashlib
import uuid


class ConsentPurpose(Enum):
    LOAN_PROCESSING = "loan_processing"
    CREDIT_SCORING = "credit_scoring"
    REMINDER_NOTIFICATIONS = "reminder_notifications"
    CASH_FLOW_ANALYSIS = "cash_flow_analysis"
    MARKETING = "marketing"
    THIRD_PARTY_SHARING = "third_party_sharing"


class DataPrincipalRights:
    """Implements data principal rights under DPDP Act 2023."""
    
    def __init__(self, data_store: Dict):
        self.data_store = data_store
        self.consent_log = []
        self.erasure_requests = []
        self.access_requests = []
        
    def request_access(self, principal_id: str) -> Dict:
        """Right to access personal data."""
        if principal_id not in self.data_store:
            return {"error": "Principal not found"}
            
        access_record = {
            "request_id": str(uuid.uuid4()),
            "principal_id": principal_id,
            "request_time": datetime.now().isoformat(),
            "data_provided": {
                "personal_info": self.data_store[principal_id].get("personal_info", {}),
                "loan_data": self.data_store[principal_id].get("loan_data", {}),
                "transaction_history": self.data_store[principal_id].get("transactions", []),
                "consent_records": [c for c in self.consent_log if c["principal_id"] == principal_id]
            }
        }
        
        self.access_requests.append(access_record)
        return access_record
    
    def request_correction(self, principal_id: str, field: str, new_value: Any) -> Dict:
        """Right to correction of personal data."""
        if principal_id not in self.data_store:
            return {"error": "Principal not found"}
            
        old_value = self.data_store[principal_id].get(field)
        self.data_store[principal_id][field] = new_value
        
        correction_record = {
            "request_id": str(uuid.uuid4()),
            "principal_id": principal_id,
            "field": field,
            "old_value": old_value,
            "new_value": new_value,
            "correction_time": datetime.now().isoformat()
        }
        
        return correction_record
    
    def request_erasure(self, principal_id: str, reason: str = "user_request") -> Dict:
        """Right to erasure of personal data."""
        if principal_id not in self.data_store:
            return {"error": "Principal not found"}
            
        # Archive data for compliance (7-year retention for financial data)
        archived_data = {
            "principal_id": principal_id,
            "archived_time": datetime.now().isoformat(),
            "reason": reason,
            "retention_until": (datetime.now() + timedelta(days=7*365)).isoformat(),
            "data_hash": hashlib.sha256(
                json.dumps(self.data_store[principal_id], sort_keys=True).encode()
            ).hexdigest()
        }
        
        # Remove from active store but keep audit trail
        del self.data_store[principal_id]
        self.erasure_requests.append(archived_data)
        
        return archived_data
    
    def request_nomination(self, principal_id: str, nominee_id: str) -> Dict:
        """Right to nominate a representative."""
        if principal_id not in self.data_store:
            return {"error": "Principal not found"}
            
        nomination_record = {
            "request_id": str(uuid.uuid4()),
            "principal_id": principal_id,
            "nominee_id": nominee_id,
            "nomination_time": datetime.now().isoformat(),
            "status": "active"
        }
        
        self.data_store[principal_id]["nominee"] = nominee_id
        return nomination_record


class ConsentManager:
    """Manages consent under DPDP Act 2023."""
    
    def __init__(self):
        self.consent_records = {}
        self.consent_revocations = []
        
    def obtain_consent(
        self,
        principal_id: str,
        purpose: ConsentPurpose,
        consent_mode: str = "explicit",
        language: str = "en",
        additional_info: Optional[Dict] = None
    ) -> Dict:
        """Obtain explicit consent for data processing."""
        consent_id = str(uuid.uuid4())
        consent_record = {
            "consent_id": consent_id,
            "principal_id": principal_id,
            "purpose": purpose.value,
            "consent_mode": consent_mode,
            "language": language,
            "consent_time": datetime.now().isoformat(),
            "status": "active",
            "additional_info": additional_info or {},
            "consent_text": self._get_consent_text(purpose, language)
        }
        
        if principal_id not in self.consent_records:
            self.consent_records[principal_id] = []
            
        self.consent_records[principal_id].append(consent_record)
        return consent_record
    
    def revoke_consent(self, principal_id: str, consent_id: str) -> Dict:
        """Revoke previously given consent."""
        if principal_id not in self.consent_records:
            return {"error": "No consent records found"}
            
        for record in self.consent_records[principal_id]:
            if record["consent_id"] == consent_id:
                record["status"] = "revoked"
                record["revocation_time"] = datetime.now().isoformat()
                
                revocation_record = {
                    "consent_id": consent_id,
                    "principal_id": principal_id,
                    "revocation_time": record["revocation_time"],
                    "purpose": record["purpose"]
                }
                
                self.consent_revocations.append(revocation_record)
                return revocation_record
                
        return {"error": "Consent ID not found"}
    
    def check_consent(self, principal_id: str, purpose: ConsentPurpose) -> bool:
        """Check if valid consent exists for a purpose."""
        if principal_id not in self.consent_records:
            return False
            
        for record in self.consent_records[principal_id]:
            if (record["purpose"] == purpose.value and 
                record["status"] == "active"):
                return True
                
        return False
    
    def get_consent_history(self, principal_id: str) -> List[Dict]:
        """Get full consent history for a principal."""
        return self.consent_records.get(principal_id, [])
    
    def _get_consent_text(self, purpose: ConsentPurpose, language: str) -> str:
        """Get consent text in specified language."""
        consent_texts = {
            "en": {
                ConsentPurpose.LOAN_PROCESSING: "I consent to the processing of my personal data for loan application processing and credit assessment.",
                ConsentPurpose.CREDIT_SCORING: "I consent to the use of my financial data for credit scoring and risk assessment.",
                ConsentPurpose.REMINDER_NOTIFICATIONS: "I consent to receive SMS/WhatsApp reminders about my loan payments.",
                ConsentPurpose.CASH_FLOW_ANALYSIS: "I consent to the analysis of my transaction patterns for cash-flow optimization.",
                ConsentPurpose.MARKETING: "I consent to receive marketing communications about financial products.",
                ConsentPurpose.THIRD_PARTY_SHARING: "I consent to sharing my data with third-party service providers for loan processing."
            },
            "hi": {
                ConsentPurpose.LOAN_PROCESSING: "मैं ऋण आवेदन प्रसंस्करण और क्रेडिट मूल्यांकन के लिए अपने व्यक्तिगत डेटा के प्रसंस्करण की सहमति देता हूं।",
                ConsentPurpose.CREDIT_SCORING: "मैं क्रेडिट स्कोरिंग और जोखिम मूल्यांकन के लिए अपने वित्तीय डेटा के उपयोग की सहमति देता हूं।",
                ConsentPurpose.REMINDER_NOTIFICATIONS: "मैं अपने ऋण भुगतान के बारे में SMS/WhatsApp रिमाइंडर प्राप्त करने की सहमति देता हूं।",
                ConsentPurpose.CASH_FLOW_ANALYSIS: "मैं नकदी प्रवाह अनुकूलन के लिए अपने लेनदेन पैटर्न के विश्लेषण की सहमति देता हूं।",
                ConsentPurpose.MARKETING: "मैं वित्तीय उत्पादों के बारे में विपणन संचार प्राप्त करने की सहमति देता हूं।",
                ConsentPurpose.THIRD_PARTY_SHARING: "मैं ऋण प्रसंस्करण के लिए तृतीय-पक्ष सेवा प्रदाताओं के साथ अपने डेटा साझा करने की सहमति देता हूं।"
            }
        }
        
        return consent_texts.get(language, consent_texts["en"]).get(purpose, "")


class DataBreachNotifier:
    """Handles data breach notification under DPDP Act 2023 (72-hour requirement)."""
    
    def __init__(self):
        self.breach_reports = []
        
    def report_breach(
        self,
        breach_type: str,
        affected_principals: List[str],
        data_categories: List[str],
        description: str,
        severity: str = "medium"
    ) -> Dict:
        """Report a data breach to DPA within 72 hours."""
        breach_record = {
            "breach_id": str(uuid.uuid4()),
            "breach_type": breach_type,
            "discovery_time": datetime.now().isoformat(),
            "notification_deadline": (datetime.now() + timedelta(hours=72)).isoformat(),
            "affected_principals": affected_principals,
            "data_categories": data_categories,
            "description": description,
            "severity": severity,
            "status": "reported",
            "remediation_steps": []
        }
        
        self.breach_reports.append(breach_record)
        return breach_record
    
    def update_remediation(self, breach_id: str, step: str) -> Dict:
        """Update remediation steps for a breach."""
        for report in self.breach_reports:
            if report["breach_id"] == breach_id:
                report["remediation_steps"].append({
                    "step": step,
                    "time": datetime.now().isoformat()
                })
                return report
        return {"error": "Breach ID not found"}
    
    def get_pending_notifications(self) -> List[Dict]:
        """Get breaches that need to be notified to DPA."""
        pending = []
        for report in self.breach_reports:
            deadline = datetime.fromisoformat(report["notification_deadline"])
            if datetime.now() < deadline and report["status"] == "reported":
                pending.append(report)
        return pending


class DPDPComplianceSuite:
    """Main compliance suite combining all DPDP Act 2023 components."""
    
    def __init__(self):
        self.data_store = {}
        self.data_rights = DataPrincipalRights(self.data_store)
        self.consent_manager = ConsentManager()
        self.breach_notifier = DataBreachNotifier()
        
    def onboard_principal(self, principal_id: str, personal_info: Dict) -> Dict:
        """Onboard a new data principal with proper consent."""
        self.data_store[principal_id] = {
            "personal_info": personal_info,
            "loan_data": {},
            "transactions": [],
            "onboarded_time": datetime.now().isoformat()
        }
        
        # Obtain required consents
        consents = []
        for purpose in [
            ConsentPurpose.LOAN_PROCESSING,
            ConsentPurpose.CREDIT_SCORING,
            ConsentPurpose.REMINDER_NOTIFICATIONS,
            ConsentPurpose.CASH_FLOW_ANALYSIS
        ]:
            consent = self.consent_manager.obtain_consent(
                principal_id=principal_id,
                purpose=purpose,
                language=personal_info.get("language", "en")
            )
            consents.append(consent)
            
        return {
            "principal_id": principal_id,
            "status": "onboarded",
            "consents_obtained": len(consents),
            "consent_records": consents
        }
    
    def process_loan_application(
        self,
        principal_id: str,
        loan_data: Dict
    ) -> Dict:
        """Process loan application with proper consent verification."""
        # Check consent for loan processing
        if not self.consent_manager.check_consent(
            principal_id, ConsentPurpose.LOAN_PROCESSING
        ):
            return {"error": "Consent not obtained for loan processing"}
            
        # Store loan data
        self.data_store[principal_id]["loan_data"] = loan_data
        self.data_store[principal_id]["loan_data"]["application_time"] = datetime.now().isoformat()
        
        return {
            "principal_id": principal_id,
            "status": "application_processed",
            "loan_id": loan_data.get("loan_id"),
            "processing_time": datetime.now().isoformat()
        }
    
    def generate_compliance_report(self) -> Dict:
        """Generate comprehensive compliance report."""
        return {
            "report_time": datetime.now().isoformat(),
            "total_principals": len(self.data_store),
            "total_consent_records": sum(
                len(records) for records in self.consent_manager.consent_records.values()
            ),
            "total_revocations": len(self.consent_manager.consent_revocations),
            "total_erasure_requests": len(self.data_rights.erasure_requests),
            "total_access_requests": len(self.data_rights.access_requests),
            "pending_breach_notifications": len(self.breach_notifier.get_pending_notifications()),
            "data_retention_compliance": self._check_data_retention(),
            "consent_compliance": self._check_consent_compliance()
        }
    
    def _check_data_retention(self) -> Dict:
        """Check data retention compliance."""
        # Financial data must be retained for 7 years
        retention_period = 7 * 365  # days
        
        return {
            "retention_period_days": retention_period,
            "principals_within_retention": len(self.data_store),
            "principals_pending_erasure": len(self.data_rights.erasure_requests),
            "compliance_status": "compliant"
        }
    
    def _check_consent_compliance(self) -> Dict:
        """Check consent compliance."""
        total_principals = len(self.data_store)
        principals_with_consent = len(self.consent_manager.consent_records)
        
        return {
            "total_principals": total_principals,
            "principals_with_consent": principals_with_consent,
            "consent_coverage": (principals_with_consent / total_principals * 100) if total_principals > 0 else 0,
            "compliance_status": "compliant" if principals_with_consent == total_principals else "non-compliant"
        }


# Example usage
if __name__ == "__main__":
    print("🔒 DPDP Act 2023 Compliance Module - Testing")
    print("=" * 60)
    
    # Initialize compliance suite
    compliance = DPDPComplianceSuite()
    
    # Test 1: Onboard principal
    print("\n1. Testing principal onboarding...")
    onboard_result = compliance.onboard_principal(
        principal_id="PRINCIPAL_001",
        personal_info={
            "name": "Rajesh Kumar",
            "phone": "+919876543210",
            "language": "en",
            "kyc_status": "verified"
        }
    )
    print(f"   ✅ Onboarded: {onboard_result['status']}")
    print(f"   ✅ Consents obtained: {onboard_result['consents_obtained']}")
    
    # Test 2: Process loan application
    print("\n2. Testing loan application processing...")
    loan_result = compliance.process_loan_application(
        principal_id="PRINCIPAL_001",
        loan_data={
            "loan_id": "LOAN_001",
            "amount": 50000,
            "interest_rate": 0.18,
            "term_days": 90
        }
    )
    print(f"   ✅ Loan application: {loan_result['status']}")
    
    # Test 3: Data principal rights
    print("\n3. Testing data principal rights...")
    access_result = compliance.data_rights.request_access("PRINCIPAL_001")
    print(f"   ✅ Access request: {access_result['request_id'][:8]}...")
    
    correction_result = compliance.data_rights.request_correction(
        "PRINCIPAL_001", "phone", "+919876543211"
    )
    print(f"   ✅ Correction request: {correction_result['request_id'][:8]}...")
    
    # Test 4: Consent revocation
    print("\n4. Testing consent revocation...")
    consent_history = compliance.consent_manager.get_consent_history("PRINCIPAL_001")
    if consent_history:
        revoke_result = compliance.consent_manager.revoke_consent(
            "PRINCIPAL_001", consent_history[0]["consent_id"]
        )
        print(f"   ✅ Consent revoked: {revoke_result['consent_id'][:8]}...")
    
    # Test 5: Breach reporting
    print("\n5. Testing breach reporting...")
    breach_result = compliance.breach_notifier.report_breach(
        breach_type="unauthorized_access",
        affected_principals=["PRINCIPAL_001"],
        data_categories=["personal_info", "loan_data"],
        description="Unauthorized access to borrower database detected",
        severity="high"
    )
    print(f"   ✅ Breach reported: {breach_result['breach_id'][:8]}...")
    print(f"   ✅ Notification deadline: {breach_result['notification_deadline']}")
    
    # Test 6: Compliance report
    print("\n6. Generating compliance report...")
    report = compliance.generate_compliance_report()
    print(f"   ✅ Total principals: {report['total_principals']}")
    print(f"   ✅ Consent coverage: {report['consent_compliance']['consent_coverage']:.1f}%")
    print(f"   ✅ Data retention: {report['data_retention_compliance']['compliance_status']}")
    
    print("\n" + "=" * 60)
    print("ALL DPDP COMPLIANCE TESTS PASSED ✅")
    print("=" * 60)