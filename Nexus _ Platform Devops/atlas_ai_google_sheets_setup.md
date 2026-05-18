# 📊 ATLAS AI GOOGLE SHEETS MONITORING DASHBOARD SETUP

## 🎯 OVERVIEW
This document provides the complete Google Sheets infrastructure for monitoring and logging the Atlas AI automation system.

---

## 📋 REQUIRED GOOGLE SHEETS (3 Sheets)

### **SHEET 1: USER DATABASE & ACTIVITY TRACKING**
**Sheet Name:** `Atlas AI Users Database`  
**Purpose:** Primary user management and activity tracking

#### **COLUMN STRUCTURE (Row 1 Headers):**
| Column | Header | Data Type | Description |
|--------|--------|-----------|-------------|
| A | `timestamp` | DateTime | Signup/update timestamp |
| B | `userId` | String | Unique user identifier |
| C | `firstName` | String | User's first name |
| D | `lastName` | String | User's last name |
| E | `email` | String | User's email address |
| F | `company` | String | User's company name |
| G | `selectedPlan` | String | Current plan (Starter/Professional/Enterprise) |
| H | `monthlyPrice` | Number | Current monthly subscription price |
| I | `contactLimit` | Number | Plan contact limit (-1 = unlimited) |
| J | `contactCount` | Number | Current number of contacts |
| K | `aiCampaignsLimit` | Number | Monthly AI campaign limit (-1 = unlimited) |
| L | `aiCampaignsUsed` | Number | AI campaigns used this month |
| M | `teamMembersLimit` | Number | Team member limit (-1 = unlimited) |
| N | `teamMembersCount` | Number | Current team member count |
| O | `trialEndDate` | DateTime | Trial expiration date |
| P | `accountStatus` | String | trial/active/suspended/cancelled |
| Q | `signupDate` | DateTime | Original signup date |
| R | `lastActivityDate` | DateTime | Last user activity |
| S | `supportLevel` | String | email/priority/24_7_phone |
| T | `features` | String | JSON string of enabled features |
| U | `totalRevenue` | Number | Total revenue from this user |
| V | `notes` | String | Admin notes and comments |

#### **SAMPLE DATA ROW:**
```
2025-06-01 05:43:49 | user_1735123456_abc123 | John | Smith | john@company.com | Acme Corp | Professional | 149 | 25000 | 15000 | -1 | 8 | 10 | 3 | 2025-06-15 05:43:49 | trial | 2025-06-01 05:43:49 | 2025-06-01 08:30:00 | priority | {"abTesting":true,"customBranding":true} | 0 | New signup - high potential
```

---

### **SHEET 2: USAGE VIOLATIONS & ALERTS**
**Sheet Name:** `Usage Violations & Alerts`  
**Purpose:** Track limit violations and admin alerts

#### **COLUMN STRUCTURE (Row 1 Headers):**
| Column | Header | Data Type | Description |
|--------|--------|-----------|-------------|
| A | `alertTimestamp` | DateTime | When alert was triggered |
| B | `userId` | String | User who violated limits |
| C | `userEmail` | String | User's email address |
| D | `userName` | String | User's full name |
| E | `planName` | String | User's current plan |
| F | `violationType` | String | contact/campaign/team_member |
| G | `limitExceeded` | String | Specific limit that was exceeded |
| H | `currentUsage` | Number | Current usage amount |
| I | `planLimit` | Number | Plan's allowed limit |
| J | `overageAmount` | Number | Amount over the limit |
| K | `overagePercentage` | Number | Percentage over limit |
| L | `severity` | String | LOW/MEDIUM/HIGH/CRITICAL |
| M | `adminNotified` | Boolean | TRUE/FALSE |
| N | `userNotified` | Boolean | TRUE/FALSE |
| O | `actionTaken` | String | Description of action taken |
| P | `resolvedDate` | DateTime | When issue was resolved |
| Q | `upgradeOffered` | Boolean | TRUE/FALSE |
| R | `upgradeAccepted` | Boolean | TRUE/FALSE |
| S | `notes` | String | Additional notes |

#### **SAMPLE DATA ROW:**
```
2025-06-01 10:15:30 | user_1735123456_abc123 | john@company.com | John Smith | Professional | contact | Contact limit exceeded | 27500 | 25000 | 2500 | 10 | HIGH | TRUE | TRUE | Upgrade email sent | | TRUE | FALSE | User approaching Enterprise needs
```

---

### **SHEET 3: REVENUE TRACKING & ANALYTICS**
**Sheet Name:** `Revenue Tracking & Analytics`  
**Purpose:** Monitor financial metrics and plan changes

#### **COLUMN STRUCTURE (Row 1 Headers):**
| Column | Header | Data Type | Description |
|--------|--------|-----------|-------------|
| A | `timestamp` | DateTime | Transaction/change timestamp |
| B | `userId` | String | User identifier |
| C | `userEmail` | String | User's email address |
| D | `transactionType` | String | signup/upgrade/downgrade/cancellation |
| E | `previousPlan` | String | Previous plan (if applicable) |
| F | `newPlan` | String | New plan |
| G | `previousMRR` | Number | Previous monthly recurring revenue |
| H | `newMRR` | Number | New monthly recurring revenue |
| I | `mrrChange` | Number | Change in MRR (+ or -) |
| J | `billingCycle` | String | monthly/annual |
| K | `paymentStatus` | String | pending/completed/failed |
| L | `upgradeSource` | String | website/email/admin/limit_alert |
| M | `churnRisk` | String | LOW/MEDIUM/HIGH |
| N | `ltv` | Number | Lifetime value estimate |
| O | `acquisitionCost` | Number | Customer acquisition cost |
| P | `profitMargin` | Number | Estimated profit margin |
| Q | `notes` | String | Transaction notes |

#### **SAMPLE DATA ROW:**
```
2025-06-01 14:20:00 | user_1735123456_abc123 | john@company.com | upgrade | Starter | Professional | 49 | 149 | 100 | monthly | completed | limit_alert | LOW | 1788 | 45 | 70 | Upgraded due to contact limit
```

---

## 🔧 GOOGLE SHEETS SETUP INSTRUCTIONS

### **STEP 1: CREATE THE SHEETS**
1. **Go to Google Sheets**: https://sheets.google.com
2. **Create 3 new spreadsheets** with the names above
3. **Add the column headers** exactly as specified (Row 1)
4. **Format columns** appropriately (dates, numbers, text)

### **STEP 2: CONFIGURE PERMISSIONS**
1. **Create Google Service Account**:
   - Go to Google Cloud Console
   - Create new project: "Atlas AI Automation"
   - Enable Google Sheets API
   - Create service account
   - Download JSON key file

2. **Share Sheets with Service Account**:
   - Copy service account email from JSON file
   - Share each sheet with this email (Editor permissions)
   - Copy each sheet ID from the URL

### **STEP 3: FORMATTING & VALIDATION**
1. **Data Validation Rules**:
   - `selectedPlan`: Dropdown (Starter, Professional, Enterprise)
   - `accountStatus`: Dropdown (trial, active, suspended, cancelled)
   - `severity`: Dropdown (LOW, MEDIUM, HIGH, CRITICAL)
   - `transactionType`: Dropdown (signup, upgrade, downgrade, cancellation)

2. **Conditional Formatting**:
   - **Violation Severity**: 
     - HIGH/CRITICAL = Red background
     - MEDIUM = Yellow background
     - LOW = Green background
   - **Account Status**:
     - trial = Blue background
     - active = Green background
     - suspended/cancelled = Red background

3. **Charts & Analytics**:
   - **Sheet 1**: User growth chart by signup date
   - **Sheet 2**: Violations by severity pie chart
   - **Sheet 3**: MRR growth trend line

---

## 📊 DASHBOARD FORMULAS

### **KEY METRICS CALCULATIONS (Add to Sheet 1)**

#### **SUMMARY SECTION (Columns X-Z):**
```
X1: Total Users
X2: =COUNTA(B:B)-1

Y1: Active Users  
Y2: =COUNTIF(P:P,"active")

Z1: Trial Users
Z2: =COUNTIF(P:P,"trial")

AA1: Total MRR
AA2: =SUMIF(P:P,"active",H:H)

AB1: Avg Revenue Per User
AB2: =AA2/Y2

AC1: Violations This Week
AC2: =COUNTIFS('Usage Violations & Alerts'!A:A,">="&TODAY()-7,'Usage Violations & Alerts'!A:A,"<="&TODAY())
```

### **PLAN DISTRIBUTION:**
```
AD1: Starter Users
AD2: =COUNTIFS(G:G,"Starter",P:P,"active")

AE1: Professional Users  
AE2: =COUNTIFS(G:G,"Professional",P:P,"active")

AF1: Enterprise Users
AF2: =COUNTIFS(G:G,"Enterprise",P:P,"active")
```

---

## 🚨 ALERT TRIGGERS & AUTOMATION

### **GOOGLE SHEETS SCRIPT TRIGGERS**
Create Google Apps Script for:

1. **Real-time Violation Detection**:
   ```javascript
   function checkLimitViolations() {
     // Check if contactCount > contactLimit
     // Trigger email alerts
     // Update violation sheet
   }
   ```

2. **Daily Summary Email**:
   ```javascript
   function sendDailySummary() {
     // Calculate key metrics
     // Send email to admin
   }
   ```

3. **Trial Expiry Alerts**:
   ```javascript
   function checkTrialExpiry() {
     // Find trials expiring in 3 days
     // Send reminder emails
   }
   ```

---

## 📈 ANALYTICS & REPORTING

### **WEEKLY REPORTS (Auto-generated)**
- **User Growth**: New signups, plan distribution
- **Revenue Metrics**: MRR growth, upgrade conversion
- **Usage Patterns**: Violation trends, support requests
- **Churn Analysis**: Cancellations and risk factors

### **MONTHLY REPORTS**
- **Business Intelligence**: Comprehensive metrics
- **Plan Performance**: Feature usage by tier
- **Support Analytics**: Resolution times and satisfaction
- **Growth Projections**: Forecast and recommendations

---

## 🔗 INTEGRATION ENDPOINTS

### **n8n WEBHOOK TARGETS**
1. **User Creation**: Append to Users Database sheet
2. **Usage Updates**: Update current usage columns
3. **Violations**: Log to Violations sheet + trigger alerts
4. **Revenue Events**: Track in Revenue sheet

### **API ENDPOINTS FOR ATLAS AI BACKEND**
1. **GET /api/sheets/user/{userId}**: Retrieve user data
2. **POST /api/sheets/usage/{userId}**: Update usage metrics
3. **GET /api/sheets/analytics**: Get dashboard metrics
4. **POST /api/sheets/alert**: Trigger manual alert

---

## ✅ SETUP COMPLETION CHECKLIST

- [ ] **Google Sheets Created**: 3 sheets with proper headers
- [ ] **Service Account Configured**: JSON key downloaded
- [ ] **Permissions Set**: Service account has editor access
- [ ] **Sheet IDs Captured**: URLs copied for n8n integration
- [ ] **Formulas Added**: Summary calculations working
- [ ] **Formatting Applied**: Conditional formatting and validation
- [ ] **Charts Created**: Visual analytics dashboards
- [ ] **Scripts Deployed**: Automation triggers active

---

**NEXT STEP**: Once Google Sheets are setup, we'll integrate them with the n8n workflows for real-time data population and monitoring.

**Estimated Setup Time**: 2-3 hours  
**Priority**: HIGH (Required for all workflows)
