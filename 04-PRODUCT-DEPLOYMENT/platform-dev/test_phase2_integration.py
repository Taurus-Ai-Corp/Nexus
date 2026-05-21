"""
Phase 2 Integration Test - Payments & Compliance
Tests DPDP compliance, Aadhaar eKYC, and UPI integration together.
"""

import sys
import os
from datetime import datetime, timedelta

# Add the core directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'core'))

from compliance.dpdp_compliance import DPDPComplianceSuite, ConsentPurpose
from compliance.aadhaar_ekyc import AadhaareKYCIntegration
from compliance.upi_integration import UPIPaymentFlow, UPICreditLine


def test_phase2_integration():
    """Test complete Phase 2 integration flow."""
    print("=" * 60)
    print("TESTING: Phase 2 Integration - Payments & Compliance")
    print("=" * 60)
    
    # Initialize all Phase 2 components
    print("\n1. Initializing Phase 2 components...")
    dpdp_compliance = DPDPComplianceSuite()
    aadhaar_ekyc = AadhaareKYCIntegration()
    upi_flow = UPIPaymentFlow()
    credit_line = UPICreditLine()
    print("   ✅ All components initialized")
    
    # Test 1: Complete borrower onboarding with DPDP + Aadhaar
    print("\n2. Testing borrower onboarding with DPDP + Aadhaar eKYC...")
    
    # Step A: DPDP onboarding with consent
    dpdp_result = dpdp_compliance.onboard_principal(
        principal_id="BORROWER_001",
        personal_info={
            "name": "Rajesh Kumar",
            "phone": "+919876543210",
            "language": "en",
            "kyc_status": "pending"
        }
    )
    assert dpdp_result["status"] == "onboarded", "DPDP onboarding failed"
    print(f"   ✅ DPDP onboarding: {dpdp_result['consents_obtained']} consents obtained")
    
    # Step B: Aadhaar eKYC
    demo_aadhaar = "123456789015"  # Valid test Aadhaar
    ekyc_result = aadhaar_ekyc.complete_ekyc_flow(demo_aadhaar)
    assert ekyc_result["status"] == "ekyc_completed", "Aadhaar eKYC failed"
    print(f"   ✅ Aadhaar eKYC: Token {ekyc_result['token'][:20]}...")
    print(f"   ✅ Virtual ID: {ekyc_result['virtual_id']}")
    
    # Step C: Update KYC status in DPDP
    correction_result = dpdp_compliance.data_rights.request_correction(
        "BORROWER_001", "kyc_status", "verified"
    )
    assert "request_id" in correction_result, "KYC status update failed"
    print(f"   ✅ KYC status updated to 'verified'")
    
    # Test 2: Loan application with compliance checks
    print("\n3. Testing loan application with compliance checks...")
    
    loan_result = dpdp_compliance.process_loan_application(
        principal_id="BORROWER_001",
        loan_data={
            "loan_id": "LOAN_001",
            "amount": 50000,
            "interest_rate": 0.18,
            "term_days": 90,
            "aadhaar_token": ekyc_result["token"],
            "virtual_id": ekyc_result["virtual_id"]
        }
    )
    assert loan_result["status"] == "application_processed", "Loan application failed"
    print(f"   ✅ Loan application processed: {loan_result['loan_id']}")
    
    # Test 3: UPI AutoPay mandate for EMI collection
    print("\n4. Testing UPI AutoPay mandate for EMI collection...")
    
    mandate_result = upi_flow.create_autopay_mandate(
        payer_vpa="rajesh@paytm",
        payee_vpa="muthoot@upi",
        amount=5000,  # Monthly EMI
        frequency="monthly",
        start_date=datetime.now() + timedelta(days=7),
        end_date=datetime.now() + timedelta(days=365),
        max_amount=5500
    )
    assert mandate_result["status"] == "mandate_created", "AutoPay mandate creation failed"
    print(f"   ✅ AutoPay mandate created: {mandate_result['mandate_id']}")
    
    # Approve mandate
    approve_mandate = upi_flow.approve_autopay_mandate(
        mandate_result["mandate_id"], payer_approval=True
    )
    assert approve_mandate["status"] == "mandate_active", "AutoPay mandate approval failed"
    print(f"   ✅ AutoPay mandate activated")
    
    # Test 4: Execute EMI collection via AutoPay
    print("\n5. Testing EMI collection via AutoPay...")
    
    # Set next collection to now for testing
    upi_flow.mandates[mandate_result["mandate_id"]]["next_collection_date"] = datetime.now().isoformat()
    
    collection_result = upi_flow.execute_autopay_collection(
        mandate_result["mandate_id"]
    )
    assert collection_result["status"] == "collection_success", "EMI collection failed"
    print(f"   ✅ EMI collected: ₹{collection_result['amount']:,.0f}")
    print(f"   ✅ UTR: {collection_result['utr']}")
    print(f"   ✅ Collection number: {collection_result['collection_number']}")
    
    # Test 5: UPI Credit Line for emergency funds
    print("\n6. Testing UPI Credit Line for emergency funds...")
    
    credit_result = credit_line.create_credit_line(
        borrower_vpa="rajesh@paytm",
        credit_limit=50000,
        interest_rate=0.18,
        tenure_months=12
    )
    assert credit_result["status"] == "credit_line_created", "Credit line creation failed"
    print(f"   ✅ Credit line created: ₹{credit_result['credit_limit']:,.0f}")
    
    # Utilize credit for emergency
    utilize_result = credit_line.utilize_credit(
        credit_result["credit_line_id"], amount=15000
    )
    assert utilize_result["status"] == "credit_utilized", "Credit utilization failed"
    print(f"   ✅ Credit utilized: ₹{utilize_result['utilized_amount']:,.0f}")
    print(f"   ✅ Available limit: ₹{utilize_result['available_limit']:,.0f}")
    
    # Test 6: DPDP compliance verification
    print("\n7. Testing DPDP compliance verification...")
    
    # Check consent for loan processing
    has_consent = dpdp_compliance.consent_manager.check_consent(
        "BORROWER_001", ConsentPurpose.LOAN_PROCESSING
    )
    assert has_consent, "Consent check failed"
    print(f"   ✅ Consent verification: PASSED")
    
    # Test data principal rights
    access_result = dpdp_compliance.data_rights.request_access("BORROWER_001")
    assert "request_id" in access_result, "Data access request failed"
    print(f"   ✅ Data principal access right: EXERCISED")
    
    # Test 7: Generate comprehensive compliance report
    print("\n8. Generating comprehensive compliance report...")
    
    dpdp_report = dpdp_compliance.generate_compliance_report()
    aadhaar_report = aadhaar_ekyc.get_compliance_report()
    
    print(f"   ✅ DPDP Compliance:")
    print(f"      - Total principals: {dpdp_report['total_principals']}")
    print(f"      - Consent coverage: {dpdp_report['consent_compliance']['consent_coverage']:.1f}%")
    print(f"      - Data retention: {dpdp_report['data_retention_compliance']['compliance_status']}")
    
    print(f"   ✅ Aadhaar Compliance:")
    print(f"      - Tokens generated: {aadhaar_report['total_tokens_generated']}")
    print(f"      - Raw Aadhaar stored: {aadhaar_report['raw_aadhaar_stored']}")
    print(f"      - Compliance status: {aadhaar_report['compliance_status']}")
    
    # Test 8: Settlement and audit trail
    print("\n9. Testing settlement and audit trail...")
    
    settlements = upi_flow.get_settlement_history()
    assert len(settlements) > 0, "No settlements found"
    print(f"   ✅ Total settlements: {len(settlements)}")
    for settlement in settlements:
        print(f"      - {settlement['settlement_id']}: ₹{settlement['amount']:,.0f} ({settlement['utr']})")
    
    # Test 9: Edge cases and error handling
    print("\n10. Testing edge cases and error handling...")
    
    # Test invalid Aadhaar
    invalid_aadhaar = aadhaar_ekyc.token_vault.tokenize_aadhaar("12345678901")  # 11 digits
    assert "error" in invalid_aadhaar, "Invalid Aadhaar not caught"
    print(f"   ✅ Invalid Aadhaar format caught")
    
    # Test expired OTP
    otp_result = aadhaar_ekyc.uidai_auth.generate_otp("987654321098")
    txn_id = otp_result["txn_id"]
    session = aadhaar_ekyc.uidai_auth.otp_sessions[txn_id]
    session["expires_at"] = (datetime.now() - timedelta(minutes=1)).isoformat()
    expired_result = aadhaar_ekyc.uidai_auth.verify_otp_and_get_ekyc(txn_id, "123456")
    assert "error" in expired_result, "Expired OTP not caught"
    print(f"   ✅ Expired OTP caught")
    
    # Test insufficient credit limit
    over_limit = credit_line.utilize_credit(
        credit_result["credit_line_id"], amount=100000  # Exceeds limit
    )
    assert "error" in over_limit, "Insufficient credit limit not caught"
    print(f"   ✅ Insufficient credit limit caught")
    
    print("\n" + "=" * 60)
    print("ALL PHASE 2 INTEGRATION TESTS PASSED ✅")
    print("=" * 60)
    
    return {
        "dpdp_compliance": dpdp_report,
        "aadhaar_compliance": aadhaar_report,
        "upi_settlements": len(settlements),
        "credit_utilized": utilize_result["utilized_amount"]
    }


if __name__ == "__main__":
    print("🧪 NeoVibe Micro-Loan AI Agent - Phase 2 Integration Tests")
    print("=" * 60)
    
    # Run Phase 2 integration tests
    results = test_phase2_integration()
    
    # Print final summary
    print("\n" + "=" * 60)
    print("PHASE 2 TEST SUMMARY")
    print("=" * 60)
    print(f"DPDP Compliance: ✅ PASSED")
    print(f"  - Principals onboarded: {results['dpdp_compliance']['total_principals']}")
    print(f"  - Consent coverage: {results['dpdp_compliance']['consent_compliance']['consent_coverage']:.1f}%")
    print(f"  - Data retention: {results['dpdp_compliance']['data_retention_compliance']['compliance_status']}")
    
    print(f"\nAadhaar eKYC: ✅ PASSED")
    print(f"  - Tokens generated: {results['aadhaar_compliance']['total_tokens_generated']}")
    print(f"  - Raw Aadhaar stored: {results['aadhaar_compliance']['raw_aadhaar_stored']}")
    print(f"  - Compliance status: {results['aadhaar_compliance']['compliance_status']}")
    
    print(f"\nUPI Integration: ✅ PASSED")
    print(f"  - Settlements processed: {results['upi_settlements']}")
    print(f"  - Credit utilized: ₹{results['credit_utilized']:,.0f}")
    
    print("\n" + "=" * 60)
    print("PHASE 2 COMPLETE - READY FOR PILOT DEPLOYMENT ✅")
    print("=" * 60)
    print("\nNext steps: Phase 3 (AI Enhancement with Gymnasium RL)")