# 🚀 Atlas AI Complete Automation System Setup Guide

## 📋 Overview

This comprehensive automation system provides end-to-end user lifecycle management for Atlas AI, including:

- **User Onboarding & Plan Activation**
- **Real-time Usage Monitoring & Alerts** 
- **Automated Plan Upgrade Flows**
- **Weekly Analytics & Reporting**

---

## 🎯 **SYSTEM ARCHITECTURE**

### **4 Interconnected Workflows:**

1. **🚀 Master User Onboarding** - Initial signup and plan activation
2. **🔍 Usage Monitoring & Alerts** - Hourly limit checking and violations
3. **⬆️ Upgrade Flow Automation** - Plan upgrade processing
4. **📊 Analytics & Reporting** - Weekly business intelligence

---

## ⚙️ **STEP 1: Environment Variables Setup**

Set these variables in your n8n environment (Settings → Environment Variables):

```bash
# Google Sheets Integration
GOOGLE_SERVICE_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----

# Google Sheet IDs
USERS_SHEET_ID=your-users-database-sheet-id
ALERTS_SHEET_ID=your-alerts-sheet-id  
REVENUE_SHEET_ID=your-revenue-tracking-sheet-id

# Atlas AI Backend Integration
ATLAS_AI_API_URL=https://your-backend-api.com
ATLAS_AI_API_KEY=your-api-key-here

# Email Configuration
ADMIN_EMAIL=admin@atlasai.com
```

---

## 📊 **STEP 2: Google Sheets Setup**

Create **3 Google Sheets** with the following structures:

### **Sheet 1: Users Database**
**Columns (Row 1):**
- A: `userId` 
- B: `signupDate`
- C: `firstName`
- D: `lastName` 
- E: `email`
- F: `company`
- G: `selectedPlan`
- H: `monthlyPrice`
- I: `contactLimit`
- J: `trialEndDate`
- K: `accountStatus`
- L: `onboardingStep`
- M: `featuresJson`

### **Sheet 2: Usage Violations**
**Columns (Row 1):**
- A: `timestamp`
- B: `userId`
- C: `userEmail`
- D: `planName`
- E: `violations`
- F: `contactCount`
- G: `contactLimit`
- H: `aiCampaignsUsed`
- I: `aiCampaignLimit`
- J: `teamMembersCount`
- K: `teamMemberLimit`
- L: `severity`
- M: `actionTaken`

### **Sheet 3: Revenue Tracking**
**Columns (Row 1):**
- A: `timestamp`
- B: `userId`
- C: `userEmail`
- D: `previousPlan`
- E: `newPlan`
- F: `previousMRR`
- G: `newMRR`
- H: `mrrIncrease`
- I: `upgradeSource`
- J: `billingCycle`

---

## 🔧 **STEP 3: Import Workflows**

1. **Go to n8n**: https://mika330.app.n8n.cloud/home/workflows
2. **Import Each Workflow**:
   - Copy each workflow from the JSON file
   - Click "Import from URL/File"
   - Paste and import

### **Workflow Import Order:**
1. ✅ **Master User Onboarding** (Primary)
2. ✅ **Usage Monitoring & Alerts** (Monitoring) 
3. ✅ **Upgrade Flow Automation** (Revenue)
4. ✅ **Analytics & Reporting** (Intelligence)

---

## 🌐 **STEP 4: Webhook URLs**

After importing, you'll get these webhook URLs:

```bash
# User Signup
https://mika330.app.n8n.cloud/webhook/atlas-ai-signup

# Plan Upgrades  
https://mika330.app.n8n.cloud/webhook/atlas-ai-upgrade
```

---

## 🔗 **STEP 5: Atlas AI Website Integration**

### **5.1 Signup Form Integration**

Add to your Atlas AI signup form:

```javascript
// After successful signup form submission
const signupData = {
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  company: form.company,
  selectedPlan: form.selectedPlan, // "starter", "professional", "enterprise"
  phone: form.phone,
  industry: form.industry
};

// Send to n8n onboarding webhook
try {
  const response = await fetch('https://mika330.app.n8n.cloud/webhook/atlas-ai-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData)
  });
  
  if (response.ok) {
    // Redirect to success page
    window.location.href = '/signup-success';
  }
} catch (error) {
  console.error('Signup webhook error:', error);
}
```

### **5.2 Upgrade Flow Integration**

Add to your upgrade/billing page:

```javascript
// After successful plan upgrade
const upgradeData = {
  userId: user.id,
  userEmail: user.email,
  userName: `${user.firstName} ${user.lastName}`,
  currentPlan: user.currentPlan,
  newPlan: selectedNewPlan,
  billingCycle: 'monthly', // or 'annual'
  upgradeSource: 'website', // 'admin', 'limit_alert', etc.
  nextBillingDate: calculateNextBilling(),
  accountManagerEmail: getAccountManagerEmail(selectedNewPlan)
};

// Send to n8n upgrade webhook
await fetch('https://mika330.app.n8n.cloud/webhook/atlas-ai-upgrade', {
  method: 'POST', 
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(upgradeData)
});
```

---

## 📈 **STEP 6: Backend API Integration**

Your Atlas AI backend needs these endpoints:

### **6.1 User Usage Endpoint**
```javascript
// GET /api/users/:userId/usage
// Returns current usage data for monitoring
{
  "contactCount": 12500,
  "aiCampaignsThisMonth": 15,
  "teamMemberCount": 5,
  "storageUsed": 2.5, // GB
  "apiCallsThisMonth": 10000,
  "lastActivity": "2025-01-01T12:00:00Z"
}
```

### **6.2 User Creation Webhook Handler**
```javascript
// POST /webhooks/user-created
// Receives new user data from n8n for system setup
app.post('/webhooks/user-created', (req, res) => {
  const { userId, userEmail, planFeatures, planName, trialEndDate } = req.body;
  
  // Create user account in your system
  // Apply plan limitations
  // Setup user workspace
  // Initialize integrations
  
  res.json({ success: true });
});
```

---

## 🔔 **STEP 7: Monitoring Schedule**

### **Automated Schedules:**
- **Usage Monitoring**: Every hour (24/7)
- **Weekly Reports**: Mondays at 9:00 AM
- **Trial Expiry Alerts**: Daily at 10:00 AM
- **Revenue Reports**: Monthly on 1st at 9:00 AM

---

## 🎯 **STEP 8: Feature Enforcement**

### **Plan Limitations Implementation:**

#### **Starter Plan Limits:**
```javascript
const STARTER_LIMITS = {
  contactLimit: 5000,
  aiCampaignsPerMonth: 10,
  teamMembers: 2,
  integrations: 10,
  emailAutomation: 'basic',
  analytics: 'standard',
  support: 'email'
};
```

#### **Professional Plan Limits:**
```javascript
const PROFESSIONAL_LIMITS = {
  contactLimit: 25000,
  aiCampaignsPerMonth: -1, // unlimited
  teamMembers: 10,
  integrations: 50,
  emailAutomation: 'advanced',
  analytics: 'advanced',
  support: 'priority',
  abTesting: true,
  customBranding: true,
  leadScoring: true,
  socialMediaAutomation: true
};
```

#### **Enterprise Plan Features:**
```javascript
const ENTERPRISE_FEATURES = {
  contactLimit: -1, // unlimited
  aiCampaignsPerMonth: -1, // unlimited  
  teamMembers: -1, // unlimited
  integrations: -1, // unlimited + custom
  emailAutomation: 'enterprise',
  analytics: 'predictive',
  support: '24_7_phone',
  apiAccess: true,
  whiteLabel: true,
  customAITraining: true,
  dedicatedAccountManager: true,
  advancedSecurity: true,
  customReporting: true
};
```

---

## 📧 **STEP 9: Email Templates**

The system includes pre-built email templates for:

- ✅ **Welcome Emails** (Plan-specific content)
- ✅ **Usage Violation Alerts** (User notifications)
- ✅ **Admin Alerts** (Limit violations)
- ✅ **Upgrade Confirmations** (Feature activation)
- ✅ **Weekly Analytics Reports** (Business intelligence)

---

## 🧪 **STEP 10: Testing Your System**

### **Test Data for Signup:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@testcompany.com",
  "company": "Test Company Inc",
  "selectedPlan": "professional",
  "phone": "+1-555-123-4567",
  "industry": "Technology"
}
```

### **Test Data for Upgrade:**
```json
{
  "userId": "user_12345",
  "userEmail": "john.smith@testcompany.com",
  "userName": "John Smith",
  "currentPlan": "Starter",
  "newPlan": "Professional",
  "billingCycle": "monthly",
  "upgradeSource": "website"
}
```

---

## 📊 **STEP 11: Monitoring Dashboard**

### **Google Sheets Dashboard URLs:**
- **Users Database**: Track all user accounts and plan details
- **Usage Violations**: Monitor limit violations and actions taken
- **Revenue Tracking**: Analyze upgrade patterns and MRR growth

### **Key Metrics to Watch:**
- 📈 **User Growth Rate**: New signups per week
- 💰 **Monthly Recurring Revenue (MRR)**: Total and per-plan
- ⚠️ **Violation Rate**: Users exceeding plan limits
- 🚀 **Upgrade Conversion**: Plan upgrade percentages
- 📧 **Email Engagement**: Open rates and click-through rates

---

## 🔧 **STEP 12: Advanced Configuration**

### **Customization Options:**

#### **Alert Thresholds:**
```javascript
// Modify in "Check Usage Limits" node
const ALERT_THRESHOLDS = {
  contactWarning: 0.9, // 90% of limit
  contactCritical: 1.0, // 100% of limit
  campaignWarning: 0.8, // 80% of monthly limit
  teamMemberWarning: 1.0 // Exactly at limit
};
```

#### **Email Frequency:**
```javascript
// Modify schedule triggers
const SCHEDULES = {
  usageMonitoring: '0 * * * *', // Every hour
  weeklyReports: '0 9 * * 1',   // Monday 9AM
  monthlyReports: '0 9 1 * *'   // 1st of month 9AM
};
```

---

## 🚀 **STEP 13: Go Live Checklist**

### **Pre-Launch Verification:**
- [ ] All 4 workflows imported and activated
- [ ] Environment variables configured
- [ ] Google Sheets created with correct headers
- [ ] Service account permissions granted
- [ ] Webhook URLs integrated in Atlas AI website
- [ ] Backend API endpoints implemented
- [ ] Email templates customized
- [ ] Test signup and upgrade flows completed
- [ ] Admin notification emails working
- [ ] Weekly reports generating correctly

### **Launch Day:**
- [ ] Activate all workflows in n8n
- [ ] Monitor first few signups in real-time
- [ ] Verify Google Sheets data population
- [ ] Test limit violation alerts
- [ ] Confirm email deliverability
- [ ] Check backend API integration

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**

**1. Google Sheets Permission Errors**
- Ensure service account email has edit access to all sheets
- Verify private key format (include `\n` for line breaks)

**2. Webhook Not Triggering**
- Check webhook URL is correctly configured
- Verify POST method and JSON content-type
- Review n8n execution logs

**3. Email Delivery Issues**
- Check SMTP settings in n8n
- Verify sender domain authentication
- Test with different email providers

**4. API Integration Errors**
- Confirm API endpoints are accessible
- Verify authentication headers
- Check request/response format matching

---

## 🎯 **Success Metrics**

### **Expected Outcomes:**
- **95%+ Automated Onboarding** success rate
- **Real-time Limit Enforcement** with instant alerts
- **30% Upgrade Conversion** improvement through automated nurturing
- **100% Visibility** into user lifecycle and usage patterns
- **Zero Manual Intervention** for standard user management

---

**🚀 Your Atlas AI automation system is now ready for enterprise-scale operations!**

This comprehensive system will handle thousands of users with complete automation, real-time monitoring, and intelligent business insights.
