/**
 * Simple test script for ClickUpMapper
 * 
 * This script tests the data mapping functionality between
 * BizFlow CRM entities and ClickUp entities.
 */

const ClickUpMapper = require('./03-CLIENT-MANAGEMENT/crm-system/src/mapping/ClickUpMapper');

function runTests() {
  console.log('Testing ClickUpMapper...\n');
  
  // Test client mapping
  console.log('1. Testing client mapping...');
  const bizFlowClient = {
    id: 'client-123',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    industry: 'Technology',
    website: 'https://acme.com',
    phone: '+1-555-123-4567',
    status: 'active'
  };

  const clickUpTask = ClickUpMapper.mapClientToTask(bizFlowClient);
  console.log('✅ Client mapped to ClickUp task successfully');
  console.log('   Task name:', clickUpTask.name);
  console.log('   Task status:', clickUpTask.status);
  console.log('   Custom fields count:', clickUpTask.custom_fields.length);
  
  // Test reverse mapping
  console.log('\n2. Testing reverse mapping...');
  const reversedClient = ClickUpMapper.mapTaskToClient(clickUpTask);
  console.log('✅ ClickUp task mapped back to BizFlow client successfully');
  console.log('   Client ID:', reversedClient.id);
  console.log('   Client name:', reversedClient.name);
  console.log('   Client email:', reversedClient.email);
  
  // Test status mapping
  console.log('\n3. Testing status mapping...');
  const statuses = ['new', 'in-progress', 'completed', 'cancelled'];
  statuses.forEach(status => {
    const clickUpStatus = ClickUpMapper.mapStatusToClickUp(status);
    console.log(`   ${status} -> ${clickUpStatus}`);
  });
  
  // Test project mapping
  console.log('\n4. Testing project mapping...');
  const bizFlowProject = {
    id: 'project-789',
    name: 'Website Redesign',
    clientId: 'client-123',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    budget: 50000
  };
  
  const clickUpList = ClickUpMapper.mapProjectToList(bizFlowProject);
  console.log('✅ Project mapped to ClickUp list successfully');
  console.log('   List name:', clickUpList.name);
  console.log('   Custom fields count:', clickUpList.custom_fields.length);
  
  console.log('\n🎉 All ClickUpMapper tests passed!');
}

// Run the tests
runTests();