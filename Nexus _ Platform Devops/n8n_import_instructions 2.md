# 🚀 n8n Import Instructions - Atlas AI Automation System

## 📥 **Quick Import Guide**

### **STEP 1: Access Your n8n Dashboard**
1. Go to: https://mika330.app.n8n.cloud/home/workflows
2. Ensure you're logged in to your account

### **STEP 2: Import Method**
Since the workflows are complex, you'll need to import them individually:

#### **Method A: Import Each Workflow Separately**

1. **Click "Add workflow" (+)** in the top right
2. **Click the menu (⋮)** in the top right of the empty workflow
3. **Select "Import"**
4. **Choose "From Text"**
5. **Copy and paste** one of the workflow JSON blocks below

---

## 📋 **WORKFLOW 1: Master User Onboarding**

**Import this first** - This is your primary signup processing workflow:

```json
{
  "meta": {
    "instanceId": "atlas-ai-onboarding-master"
  },
  "name": "🚀 Atlas AI - Master User Onboarding",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "atlas-ai-signup",
        "options": {
          "noResponseBody": false
        }
      },
      "id": "signup-webhook",
      "name": "User Signup Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "atlas-ai-signup"
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "userId",
              "name": "userId",
              "value": "={{ 'user_' + $now.toString() + '_' + Math.random().toString(36).substr(2, 9) }}",
              "type": "string"
            },
            {
              "id": "signupDate",
              "name": "signupDate",
              "value": "={{ $now }}",
              "type": "string"
            },
            {
              "id": "trialEndDate",
              "name": "trialEndDate",
              "value": "={{ DateTime.now().plus({days: 14}).toISO() }}",
              "type": "string"
            },
            {
              "id": "accountStatus",
              "name": "accountStatus",
              "value": "trial",
              "type": "string"
            }
          ]
        }
      },
      "id": "initialize-user",
      "name": "Initialize User Account",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true
          },
          "conditions": [
            {
              "leftValue": "={{ $json.selectedPlan }}",
              "rightValue": "starter",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ]
        }
      },
      "id": "starter-branch",
      "name": "Starter Plan",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 200]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true
          },
          "conditions": [
            {
              "leftValue": "={{ $json.selectedPlan }}",
              "rightValue": "professional",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ]
        }
      },
      "id": "professional-branch",
      "name": "Professional Plan",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "conditions": {
          "options": {
            "caseSensitive": true
          },
          "conditions": [
            {
              "leftValue": "={{ $json.selectedPlan }}",
              "rightValue": "enterprise",
              "operator": {
                "type": "string",
                "operation": "equals"
              }
            }
          ]
        }
      },
      "id": "enterprise-branch",
      "name": "Enterprise Plan",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2,
      "position": [680, 400]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "planFeatures",
              "name": "planFeatures",
              "value": {
                "contactLimit": 5000,
                "emailAutomation": "basic",
                "aiCampaignsPerMonth": 10,
                "analyticsLevel": "standard",
                "supportLevel": "email",
                "teamMembers": 2,
                "integrations": {
                  "type": "basic",
                  "count": 10
                },
                "mobileAppAccess": true
              },
              "type": "object"
            },
            {
              "id": "planName",
              "name": "planName",
              "value": "Starter",
              "type": "string"
            },
            {
              "id": "monthlyPrice",
              "name": "monthlyPrice",
              "value": 49,
              "type": "number"
            }
          ]
        }
      },
      "id": "starter-features",
      "name": "Configure Starter Features",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [900, 140]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "planFeatures",
              "name": "planFeatures",
              "value": {
                "contactLimit": 25000,
                "emailAutomation": "advanced",
                "aiCampaignsPerMonth": -1,
                "analyticsLevel": "advanced",
                "supportLevel": "priority",
                "teamMembers": 10,
                "integrations": {
                  "type": "premium",
                  "count": 50
                },
                "abTesting": true,
                "customBranding": true,
                "leadScoring": true,
                "socialMediaAutomation": true
              },
              "type": "object"
            },
            {
              "id": "planName",
              "name": "planName",
              "value": "Professional",
              "type": "string"
            },
            {
              "id": "monthlyPrice",
              "name": "monthlyPrice",
              "value": 149,
              "type": "number"
            }
          ]
        }
      },
      "id": "professional-features",
      "name": "Configure Professional Features",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [900, 240]
    },
    {
      "parameters": {
        "assignments": {
          "assignments": [
            {
              "id": "planFeatures",
              "name": "planFeatures",
              "value": {
                "contactLimit": -1,
                "emailAutomation": "enterprise",
                "aiCampaignsPerMonth": -1,
                "analyticsLevel": "predictive",
                "supportLevel": "24_7_phone",
                "teamMembers": -1,
                "integrations": {
                  "type": "custom",
                  "count": -1
                },
                "apiAccess": true,
                "whiteLabel": true,
                "customAITraining": true,
                "dedicatedAccountManager": true,
                "advancedSecurity": true,
                "customReporting": true
              },
              "type": "object"
            },
            {
              "id": "planName",
              "name": "planName",
              "value": "Enterprise",
              "type": "string"
            },
            {
              "id": "monthlyPrice",
              "name": "monthlyPrice",
              "value": 449,
              "type": "number"
            }
          ]
        }
      },
      "id": "enterprise-features",
      "name": "Configure Enterprise Features",
      "type": "n8n-nodes-base.set",
      "typeVersion": 3.3,
      "position": [900, 340]
    },
    {
      "parameters": {
        "sendTo": "={{ $('User Signup Webhook').item.json.email }}",
        "subject": "🚀 Welcome to Atlas AI - Account Setup Instructions",
        "message": "=**Welcome to Atlas AI!**\n\nHi {{ $('User Signup Webhook').item.json.firstName }},\n\nThank you for signing up for Atlas AI! Your **{{ $json.planName }} Plan** account has been created.\n\n**Your Plan Features:**\n{{ $json.planFeatures.contactLimit === -1 ? '✅ Unlimited contacts' : '✅ Up to ' + $json.planFeatures.contactLimit.toLocaleString() + ' contacts' }}\n✅ {{ $json.planFeatures.emailAutomation }} email automation\n{{ $json.planFeatures.aiCampaignsPerMonth === -1 ? '✅ Unlimited AI campaigns' : '✅ ' + $json.planFeatures.aiCampaignsPerMonth + ' AI campaigns per month' }}\n✅ {{ $json.planFeatures.analyticsLevel }} analytics dashboard\n{{ $json.planFeatures.teamMembers === -1 ? '✅ Unlimited team members' : '✅ Up to ' + $json.planFeatures.teamMembers + ' team members' }}\n✅ Mobile app access\n{{ $json.planFeatures.abTesting ? '✅ A/B testing suite' : '' }}\n{{ $json.planFeatures.customBranding ? '✅ Custom branding' : '' }}\n{{ $json.planFeatures.leadScoring ? '✅ Lead scoring' : '' }}\n{{ $json.planFeatures.socialMediaAutomation ? '✅ Social media automation' : '' }}\n{{ $json.planFeatures.apiAccess ? '✅ API access' : '' }}\n{{ $json.planFeatures.whiteLabel ? '✅ White-label solutions' : '' }}\n{{ $json.planFeatures.customAITraining ? '✅ Custom AI model training' : '' }}\n{{ $json.planFeatures.dedicatedAccountManager ? '✅ Dedicated account manager' : '' }}\n\n**Trial Period:** 14 days (ends {{ DateTime.fromISO($json.trialEndDate).toFormat('MMMM dd, yyyy') }})\n\n**Next Steps:**\n1. Complete your account setup\n2. Import your contacts\n3. Create your first campaign\n\n**Need Help?**\n{{ $json.planFeatures.supportLevel === 'email' ? '📧 Email: support@atlasai.com' : '' }}\n{{ $json.planFeatures.supportLevel === 'priority' ? '📧 Priority Support: priority@atlasai.com' : '' }}\n{{ $json.planFeatures.supportLevel === '24_7_phone' ? '📞 24/7 Phone: +1 (555) 123-4567' : '' }}\n\nWelcome to the future of AI-powered marketing!\n\nThe Atlas AI Team",
        "options": {
          "replyTo": "noreply@atlasai.com"
        }
      },
      "id": "send-welcome-email",
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2.1,
      "position": [1120, 240]
    }
  ],
  "connections": {
    "User Signup Webhook": {
      "main": [
        [
          {
            "node": "Initialize User Account",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Initialize User Account": {
      "main": [
        [
          {
            "node": "Starter Plan",
            "type": "main",
            "index": 0
          },
          {
            "node": "Professional Plan",
            "type": "main",
            "index": 0
          },
          {
            "node": "Enterprise Plan",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Starter Plan": {
      "main": [
        [
          {
            "node": "Configure Starter Features",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Professional Plan": {
      "main": [
        [
          {
            "node": "Configure Professional Features",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Enterprise Plan": {
      "main": [
        [
          {
            "node": "Configure Enterprise Features",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Configure Starter Features": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Configure Professional Features": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Configure Enterprise Features": {
      "main": [
        [
          {
            "node": "Send Welcome Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {},
  "settings": {
    "executionOrder": "v1"
  },
  "staticData": null,
  "tags": [],
  "triggerCount": 1,
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "versionId": "1"
}
```

---

## ⚙️ **AFTER IMPORTING WORKFLOW 1:**

1. **Save the workflow** (Ctrl+S)
2. **Note the webhook URL** that appears (something like: `https://mika330.app.n8n.cloud/webhook/atlas-ai-signup`)
3. **Configure environment variables** before activating
4. **Activate the workflow** (toggle in top right)

---

## 🧪 **TEST WORKFLOW 1:**

**Send this test data** to your webhook URL:

```bash
curl -X POST https://mika330.app.n8n.cloud/webhook/atlas-ai-signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith", 
    "email": "john@testcompany.com",
    "company": "Test Company",
    "selectedPlan": "professional"
  }'
```

**Expected Result:** Welcome email should be sent to john@testcompany.com

---

## 📌 **NEXT STEPS:**

1. **Import the remaining 3 workflows** using the same process
2. **Set up Google Sheets** with the required columns
3. **Configure environment variables**
4. **Test each workflow individually**
5. **Integrate with your Atlas AI website**

---

## 🔗 **Integration with Your Atlas AI Signup:**

Add this to your signup form JavaScript:

```javascript
// After form validation succeeds
const signupData = {
  firstName: document.getElementById('firstName').value,
  lastName: document.getElementById('lastName').value,
  email: document.getElementById('email').value,
  company: document.getElementById('company').value,
  selectedPlan: document.querySelector('input[name="plan"]:checked').value
};

fetch('https://mika330.app.n8n.cloud/webhook/atlas-ai-signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(signupData)
})
.then(response => response.json())
.then(data => {
  // Redirect to success page
  window.location.href = '/signup-success';
})
.catch(error => {
  console.error('Error:', error);
  alert('Signup failed. Please try again.');
});
```

---

## 📞 **Need Help?**

If you encounter any issues during import:

1. **Check the n8n logs** in the execution history
2. **Verify JSON format** is valid (no syntax errors)
3. **Ensure you have permission** to create webhooks
4. **Try importing nodes individually** if the full workflow fails

**Ready to proceed with the remaining workflows?** Let me know when Workflow 1 is working and I'll provide the next ones!
