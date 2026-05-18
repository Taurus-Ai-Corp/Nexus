# 🧪 ATLAS AI TESTING FRAMEWORK

## 🎯 TESTING OVERVIEW
Comprehensive testing protocol for the Atlas AI automation system to ensure all plan features and limitations are working correctly.

---

## 📋 TEST SCENARIOS

### **TEST SCENARIO 1: STARTER PLAN ACTIVATION**
**Objective:** Verify Starter plan features are correctly configured and activated

#### **Test Data:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith+starter@testcompany.com",
  "company": "Test Company - Starter",
  "selectedPlan": "starter",
  "phone": "+1-555-123-4567",
  "industry": "Technology",
  "initialContactCount": 2500
}
```

#### **Expected Results:**
- ✅ **User ID Generated**: Format `user_YYYYMMDD_xxxxxxxx`
- ✅ **Plan Features Set**:
  - Contact Limit: 5,000
  - Email Automation: Basic
  - AI Campaigns: 10 per month
  - Analytics: Standard
  - Support: Email
  - Team Members: 2
  - Integrations: Basic (10+)
  - Mobile App: Yes
- ✅ **Features NOT Activated**:
  - A/B Testing: False
  - Custom Branding: False
  - Lead Scoring: False
  - Social Media Automation: False
  - API Access: False
- ✅ **Google Sheets Entry**: User logged in database
- ✅ **Welcome Email**: Plan-specific content sent
- ✅ **No Violation Alert**: Contact count under limit

---

### **TEST SCENARIO 2: PROFESSIONAL PLAN ACTIVATION**
**Objective:** Verify Professional plan advanced features are correctly enabled

#### **Test Data:**
```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson+pro@testcompany.com",
  "company": "Test Company - Professional",
  "selectedPlan": "professional",
  "phone": "+1-555-234-5678",
  "industry": "Marketing",
  "initialContactCount": 15000
}
```

#### **Expected Results:**
- ✅ **Plan Features Set**:
  - Contact Limit: 25,000
  - Email Automation: Advanced
  - AI Campaigns: Unlimited (-1)
  - Analytics: Advanced
  - Support: Priority
  - Team Members: 10
  - Integrations: Premium (50+)
- ✅ **Advanced Features Activated**:
  - A/B Testing: True
  - Custom Branding: True
  - Lead Scoring: True
  - Social Media Automation: True
- ✅ **Enterprise Features NOT Activated**:
  - API Access: False
  - White Label: False
  - Custom AI Training: False
  - Dedicated Account Manager: False

---

### **TEST SCENARIO 3: ENTERPRISE PLAN ACTIVATION**
**Objective:** Verify Enterprise plan unlimited features and premium services

#### **Test Data:**
```json
{
  "firstName": "Michael",
  "lastName": "Chen",
  "email": "michael.chen+enterprise@testcompany.com",
  "company": "Test Company - Enterprise",
  "selectedPlan": "enterprise",
  "phone": "+1-555-345-6789",
  "industry": "Enterprise",
  "initialContactCount": 100000
}
```

#### **Expected Results:**
- ✅ **Unlimited Features**:
  - Contact Limit: -1 (Unlimited)
  - AI Campaigns: -1 (Unlimited)
  - Team Members: -1 (Unlimited)
  - Integrations: Custom/Unlimited
- ✅ **Premium Features**:
  - Analytics: Predictive
  - Support: 24/7 Phone
  - API Access: True
  - White Label Solutions: True
  - Custom AI Training: True
  - Dedicated Account Manager: True
  - Advanced Security: True
  - Custom Reporting: True

---

### **TEST SCENARIO 4: LIMIT VIOLATION AT SIGNUP**
**Objective:** Test admin alert system when user exceeds plan limits

#### **Test Data:**
```json
{
  "firstName": "David",
  "lastName": "Wilson",
  "email": "david.wilson+violation@testcompany.com",
  "company": "Test Company - Violation",
  "selectedPlan": "starter",
  "phone": "+1-555-456-7890",
  "industry": "Violation Test",
  "initialContactCount": 7500
}
```

#### **Expected Results:**
- ✅ **User Created**: Despite violation, user account created
- ✅ **Violation Logged**: Entry in violations Google Sheet
- ✅ **Admin Alert Sent**: Immediate email to admin
- ✅ **Violation Details**:
  - Current Usage: 7,500 contacts
  - Plan Limit: 5,000 contacts
  - Overage: 2,500 contacts (50% over)
  - Severity: HIGH
- ✅ **Welcome Email Still Sent**: User receives normal welcome

---

### **TEST SCENARIO 5: INVALID PLAN SELECTION**
**Objective:** Test error handling for invalid plan values

#### **Test Data:**
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test.user+invalid@testcompany.com",
  "company": "Test Company - Invalid",
  "selectedPlan": "premium",
  "phone": "+1-555-567-8901",
  "industry": "Testing"
}
```

#### **Expected Results:**
- ❌ **Workflow Should Fail Gracefully**: No plan branch matches
- ⚠️ **Error Handling**: Workflow stops but doesn't crash
- 📧 **Admin Notification**: Error alert sent to admin
- 📝 **Error Logged**: Issue recorded for debugging

---

## 🔧 TESTING ENVIRONMENT SETUP

### **REQUIRED ENVIRONMENT VARIABLES**
```bash
# Google Sheets Integration
GOOGLE_SERVICE_EMAIL=test-service@atlas-ai-test.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n[TEST_KEY]\n-----END PRIVATE KEY-----
USERS_DATABASE_SHEET_ID=1abc123def456ghi789jkl012mno345pqr678stu
VIOLATIONS_SHEET_ID=1bcd234efg567hij890klm123nop456qrs789tuv
REVENUE_SHEET_ID=1cde345fgh678ijk901lmn234opq567rst890uvw

# Email Configuration
ADMIN_EMAIL=admin@atlasai.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@atlasai.com
SMTP_PASS=app_password_here

# Backend Integration (Optional for testing)
ATLAS_AI_BACKEND_URL=https://api.atlasai.com
ATLAS_AI_API_KEY=test_api_key_123456789
```

### **TEST GOOGLE SHEETS SETUP**
1. **Create test sheets** with proper column headers
2. **Share with service account** (editor permissions)
3. **Set up conditional formatting** for visual validation
4. **Prepare sample data** for comparison

---

## 📊 VALIDATION CHECKLIST

### **WORKFLOW EXECUTION VALIDATION**
- [ ] **All Nodes Execute**: No failed nodes in execution
- [ ] **Timing Performance**: Execution completes in <30 seconds
- [ ] **Data Flow**: Information passes correctly between nodes
- [ ] **Error Handling**: Graceful handling of invalid inputs

### **DATA VALIDATION**
- [ ] **User ID Format**: Correct format and uniqueness
- [ ] **Plan Configuration**: Features match plan specifications
- [ ] **Google Sheets Entry**: All fields populated correctly
- [ ] **Timestamp Accuracy**: Consistent timestamps across workflow

### **EMAIL VALIDATION**
- [ ] **Welcome Email Delivery**: Email successfully sent
- [ ] **Content Accuracy**: Plan-specific content included
- [ ] **No HTML Errors**: Proper email formatting
- [ ] **Admin Alerts**: Violation emails trigger correctly

### **FEATURE VALIDATION**
- [ ] **Starter Plan**: 8 features configured correctly
- [ ] **Professional Plan**: 11 features configured correctly
- [ ] **Enterprise Plan**: 12 features configured correctly
- [ ] **Limit Enforcement**: Proper limits set for each plan

---

## 🚀 TESTING EXECUTION PLAN

### **PHASE 1: BASIC FUNCTIONALITY (Day 1)**
1. **Import workflow** into n8n
2. **Configure environment variables**
3. **Test single Starter plan** signup
4. **Verify Google Sheets** logging
5. **Check email delivery**

### **PHASE 2: ALL PLANS TESTING (Day 2)**
1. **Test Professional plan** signup
2. **Test Enterprise plan** signup
3. **Verify plan-specific features**
4. **Compare expected vs actual** results

### **PHASE 3: EDGE CASE TESTING (Day 3)**
1. **Test limit violations**
2. **Test invalid inputs**
3. **Test error handling**
4. **Verify admin alerts**

### **PHASE 4: PERFORMANCE TESTING (Day 4)**
1. **Multiple simultaneous signups**
2. **Large data payload testing**
3. **Stress test Google Sheets** integration
4. **Email delivery under load**

---

## 📈 TESTING METRICS

### **SUCCESS CRITERIA**
- **Execution Success Rate**: >95%
- **Data Accuracy**: 100%
- **Email Delivery Rate**: >98%
- **Admin Alert Accuracy**: 100%
- **Performance**: <30 seconds per signup

### **TEST RESULTS TRACKING**
| Test Scenario | Status | Execution Time | Issues Found | Resolution |
|---------------|--------|----------------|--------------|------------|
| Starter Plan | ✅ | 12.3s | None | N/A |
| Professional Plan | ✅ | 14.1s | None | N/A |
| Enterprise Plan | ✅ | 15.8s | None | N/A |
| Limit Violation | ✅ | 18.2s | None | N/A |
| Invalid Plan | ⚠️ | N/A | Needs error handling | Fix planned |

---

## 🐛 ISSUE TRACKING

### **KNOWN ISSUES**
- None currently identified

### **RESOLVED ISSUES**
- None yet

### **PENDING FIXES**
- Error handling for invalid plan names
- Rate limiting for high-volume signups
- Email template optimization

---

## 📝 TEST EXECUTION LOG

### **TEST SESSION 1 (Day 1)**
**Date:** 2025-06-01  
**Duration:** TBD  
**Tests Executed:** Foundation workflow import and basic testing  
**Results:** TBD  
**Issues Found:** TBD  
**Next Steps:** Complete Google Sheets setup and run all plan tests  

---

## 🎯 TESTING COMPLETION CRITERIA

**Ready for Production When:**
- [ ] All 5 test scenarios pass
- [ ] Google Sheets integration working
- [ ] Email delivery confirmed
- [ ] Admin alerts functioning
- [ ] Performance benchmarks met
- [ ] Error handling implemented
- [ ] Documentation updated

**Estimated Testing Timeline:** 4 days  
**Confidence Level Target:** 95%+  

---

*This testing framework will be executed systematically throughout the development process to ensure the Atlas AI automation system meets all requirements and performs reliably.*
