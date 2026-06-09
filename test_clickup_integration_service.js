/**
 * Simple test script for ClickUpIntegrationService
 * 
 * This script tests the integration service functionality
 * for bidirectional synchronization between Nexus CRM and ClickUp.
 */

const ClickUpIntegrationService = require('./03-CLIENT-MANAGEMENT/crm-system/src/sync/ClickUpIntegrationService');

async function testIntegrationService() {
  console.log('Testing ClickUpIntegrationService...\n');
  
  try {
    // Create instance of the service
    const integrationService = new ClickUpIntegrationService();
    
    // Test initialization
    console.log('1. Testing service initialization...');
    const initResult = await integrationService.initialize();
    console.log('✅ Service initialized successfully');
    console.log('   Message:', initResult.message);
    
    // Test client sync
    console.log('\n2. Testing client synchronization...');
    const nexusClient = {
      id: 'client-123',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      status: 'active'
    };
    
    const clientSyncResult = await integrationService.syncClientToClickUp(nexusClient);
    console.log('✅ Client synced to ClickUp successfully');
    console.log('   ClickUp Task ID:', clientSyncResult.clickUpTaskId);
    
    // Test project sync
    console.log('\n3. Testing project synchronization...');
    const nexusProject = {
      id: 'project-456',
      name: 'Website Redesign',
      clientId: 'client-123',
      budget: 50000
    };
    
    const projectSyncResult = await integrationService.syncProjectToClickUp(nexusProject);
    console.log('✅ Project synced to ClickUp successfully');
    console.log('   ClickUp List ID:', projectSyncResult.clickUpListId);
    
    // Test webhook handling
    console.log('\n4. Testing webhook handling...');
    const mockWebhookPayload = {
      event: 'task.created',
      data: {
        id: 'task-789',
        name: 'Client: Test Client',
        status: 'to do'
      }
    };
    
    const webhookResult = await integrationService.handleWebhook(mockWebhookPayload, 'test-signature');
    console.log('✅ Webhook handled successfully');
    console.log('   Event type:', webhookResult.eventType);
    console.log('   Processed:', webhookResult.processed);
    
    // Test callback registration
    console.log('\n5. Testing callback registration...');
    const mockCallback = (data) => {
      console.log('   Callback triggered with data:', data.id);
    };
    
    integrationService.registerSyncCallback('task.created', mockCallback);
    console.log('✅ Callback registered successfully');
    
    // Test starting listener
    console.log('\n6. Testing listener functionality...');
    const listenerResult = integrationService.startListening();
    console.log('✅ Listener started successfully');
    console.log('   Listening:', listenerResult.listening);
    
    console.log('\n🎉 All ClickUpIntegrationService tests passed!');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    process.exit(1);
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  testIntegrationService();
}

module.exports = testIntegrationService;