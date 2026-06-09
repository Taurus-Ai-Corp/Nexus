/**
 * Simple test script to verify ClickUp API connection
 * 
 * This script tests the basic connectivity to the ClickUp API
 * using the provided API key.
 */

const ClickUpClient = require('./03-CLIENT-MANAGEMENT/crm-system/src/integrations/ClickUpClient');

async function testClickUpConnection() {
  console.log('Testing ClickUp API connection...');
  
  const clickUpClient = new ClickUpClient();
  
  try {
    // Test connection
    const result = await clickUpClient.testConnection();
    
    if (result.success) {
      console.log('✅ Connection successful!');
      console.log(`👤 Authenticated user: ${result.user.user.username}`);
      console.log(`🆔 User ID: ${result.user.user.id}`);
      
      // Get workspaces as well
      console.log('\nFetching workspaces...');
      const workspaces = await clickUpClient.getWorkspaces();
      console.log(`🏢 Found ${workspaces.teams.length} workspace(s)`);
      
      workspaces.teams.forEach(team => {
        console.log(`  - ${team.name} (ID: ${team.id})`);
      });
      
      return true;
    } else {
      console.log('❌ Connection failed!');
      console.log(`Error: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Connection test failed with exception:');
    console.log(error.message);
    return false;
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testClickUpConnection().then(success => {
    if (success) {
      console.log('\n🎉 ClickUp integration is ready!');
    } else {
      console.log('\n💥 ClickUp integration needs attention!');
      process.exit(1);
    }
  });
}

module.exports = testClickUpConnection;