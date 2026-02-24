#!/usr/bin/env python3
"""
MCP Business Integration Examples
Practical examples of using MCP connectors for business automation
"""

import os
import json
from datetime import datetime, timedelta
from mcp_business_integrator import MCPBusinessIntegrator

def example_email_management():
    """Example: Automated email management workflow"""
    print("📧 Email Management Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom email management request
    request = """
    Please help me manage my emails:
    1. Check my Gmail for emails from clients in the last 24 hours
    2. Categorize them by urgency (High, Medium, Low)
    3. For high priority emails, create calendar reminders for follow-up
    4. Draft responses for medium priority emails
    5. Archive low priority emails
    """
    
    connectors = ["gmail", "calendar"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ Email management completed successfully!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Email management failed: {result.get('error', 'Unknown error')}")
    
    return result

def example_document_collaboration():
    """Example: Document collaboration workflow"""
    print("\n📄 Document Collaboration Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom document collaboration request
    request = """
    Help me with document collaboration:
    1. Create a new project proposal document in Google Drive
    2. Set up proper sharing permissions for the team
    3. Schedule a review meeting for next Tuesday at 2 PM
    4. Send email invitations to team members
    5. Create a project folder structure
    """
    
    connectors = ["drive", "calendar", "gmail"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ Document collaboration setup completed!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Document collaboration failed: {result.get('error', 'Unknown error')}")
    
    return result

def example_team_communication():
    """Example: Team communication workflow"""
    print("\n👥 Team Communication Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom team communication request
    request = """
    Help me with team communication:
    1. Send a team update via Microsoft Teams about project progress
    2. Schedule a weekly standup meeting for every Monday at 9 AM
    3. Create a shared document for meeting notes
    4. Send calendar invites to all team members
    5. Set up automated reminders for project deadlines
    """
    
    connectors = ["teams", "calendar", "outlook_email"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ Team communication setup completed!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Team communication failed: {result.get('error', 'Unknown error')}")
    
    return result

def example_enterprise_workflow():
    """Example: Enterprise workflow automation"""
    print("\n🏢 Enterprise Workflow Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom enterprise workflow request
    request = """
    Help me with enterprise workflow:
    1. Create a quarterly business report in SharePoint
    2. Schedule a board meeting in Outlook Calendar for next Friday
    3. Send the report to all board members via Outlook Email
    4. Create a follow-up action items document
    5. Set up automated reminders for quarterly reviews
    """
    
    connectors = ["sharepoint", "outlook_calendar", "outlook_email"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ Enterprise workflow completed!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Enterprise workflow failed: {result.get('error', 'Unknown error')}")
    
    return result

def example_file_management():
    """Example: Cross-platform file management"""
    print("\n📁 File Management Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom file management request
    request = """
    Help me with file management:
    1. Organize files in both Dropbox and Google Drive
    2. Create a master index of all important documents
    3. Set up automated backups between platforms
    4. Create a shared folder for team collaboration
    5. Send a summary of file organization to the team
    """
    
    connectors = ["dropbox", "drive", "gmail"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ File management completed!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ File management failed: {result.get('error', 'Unknown error')}")
    
    return result

def example_custom_workflow():
    """Example: Custom business workflow"""
    print("\n🔧 Custom Workflow Example")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    
    # Custom business request
    request = """
    I need help with a client onboarding process:
    1. Create a new client folder in Google Drive
    2. Set up a welcome email template in Gmail
    3. Schedule a kickoff meeting for next week
    4. Create a project timeline document
    5. Send initial project information to the client
    6. Set up recurring check-in meetings
    """
    
    connectors = ["drive", "gmail", "calendar"]
    result = integrator.process_business_request(request, connectors)
    
    if result['success']:
        print("✅ Custom workflow completed!")
        print(f"Tools used: {result.get('tools_used', 'N/A')}")
    else:
        print(f"❌ Custom workflow failed: {result.get('error', 'Unknown error')}")
    
    return result

def test_all_connectors():
    """Test all available connectors"""
    print("\n🧪 Testing All Connectors")
    print("-" * 40)
    
    integrator = MCPBusinessIntegrator()
    connectors = integrator.get_available_connectors()
    
    results = []
    for connector_name in connectors.keys():
        print(f"Testing {connector_name}...")
        result = integrator.test_connector(connector_name)
        results.append({
            "connector": connector_name,
            "success": result.get('success', False),
            "error": result.get('error', None)
        })
        
        if result.get('success'):
            print(f"  ✅ {connector_name} - Working")
        else:
            print(f"  ❌ {connector_name} - {result.get('error', 'Unknown error')}")
    
    return results

def generate_comprehensive_report():
    """Generate a comprehensive business report"""
    print("\n📊 Generating Comprehensive Business Report")
    print("-" * 50)
    
    integrator = MCPBusinessIntegrator()
    
    # Execute multiple workflows
    workflows = [
        ("email_management", example_email_management()),
        ("document_collaboration", example_document_collaboration()),
        ("team_communication", example_team_communication()),
        ("enterprise_workflow", example_enterprise_workflow()),
        ("file_management", example_file_management()),
        ("custom_workflow", example_custom_workflow())
    ]
    
    # Generate report
    report = integrator.generate_business_report([result for _, result in workflows])
    
    # Save report
    report_file = f"mcp_business_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
    with open(report_file, 'w') as f:
        f.write(report)
    
    print(f"📄 Report saved to: {report_file}")
    print("\n" + "="*50)
    print(report)
    
    return report

def main():
    """Main function to run all examples"""
    print("🚀 MCP Business Integration Examples")
    print("=" * 50)
    print("This script demonstrates various MCP connector workflows")
    print("for TAURUS AI CORP business automation.\n")
    
    # Check if OAuth tokens are configured
    required_tokens = [
        "GOOGLE_OAUTH_TOKEN",
        "MICROSOFT_OAUTH_TOKEN", 
        "DROPBOX_OAUTH_TOKEN"
    ]
    
    missing_tokens = []
    for token in required_tokens:
        if not os.getenv(token):
            missing_tokens.append(token)
    
    if missing_tokens:
        print("⚠️  WARNING: Missing OAuth tokens:")
        for token in missing_tokens:
            print(f"   - {token}")
        print("\nSome examples may not work without proper OAuth configuration.")
        print("Please set up OAuth tokens in your master.env file.\n")
    
    # Run examples
    try:
        # Test connectors first
        connector_results = test_all_connectors()
        
        # Run workflow examples
        print("\n🔄 Running Workflow Examples...")
        example_email_management()
        example_document_collaboration()
        example_team_communication()
        example_enterprise_workflow()
        example_file_management()
        example_custom_workflow()
        
        # Generate comprehensive report
        generate_comprehensive_report()
        
        print("\n🎉 All examples completed successfully!")
        print("Check the generated report for detailed results.")
        
    except Exception as e:
        print(f"\n❌ Error running examples: {str(e)}")
        print("Please check your configuration and try again.")

if __name__ == "__main__":
    main()
