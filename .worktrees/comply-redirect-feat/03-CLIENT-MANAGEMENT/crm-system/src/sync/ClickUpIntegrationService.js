/**
 * ClickUp Integration Service
 * 
 * This service handles real-time synchronization between ClickUp and BizFlow CRM
 * using webhook listeners and bidirectional data sync mechanisms.
 */

const ClickUpClient = require('../integrations/ClickUpClient');
const ClickUpMapper = require('../mapping/ClickUpMapper');

class ClickUpIntegrationService {
  constructor(apiKey = null) {
    this.clickUpClient = new ClickUpClient(apiKey);
    this.webhookSecret = process.env.CLICKUP_WEBHOOK_SECRET || 'default_secret';
    this.syncCallbacks = {};
    this.isListening = false;
  }

  /**
   * Initialize the integration service
   * Sets up webhook listeners and starts sync processes
   */
  async initialize() {
    try {
      console.log('Initializing ClickUp Integration Service...');
      
      // Test API connection
      const connectionResult = await this.clickUpClient.testConnection();
      if (!connectionResult.success) {
        throw new Error(`Failed to connect to ClickUp API: ${connectionResult.error}`);
      }
      
      console.log('✅ ClickUp API connection established');
      return { success: true, message: 'Integration service initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize ClickUp Integration Service:', error.message);
      throw error;
    }
  }

  /**
   * Register a callback for specific sync events
   * @param {string} eventType - Type of event (task.created, task.updated, etc.)
   * @param {Function} callback - Function to call when event occurs
   */
  registerSyncCallback(eventType, callback) {
    if (!this.syncCallbacks[eventType]) {
      this.syncCallbacks[eventType] = [];
    }
    this.syncCallbacks[eventType].push(callback);
  }

  /**
   * Handle incoming webhook from ClickUp
   * @param {Object} payload - Webhook payload from ClickUp
   * @param {string} signature - Webhook signature for validation
   */
  async handleWebhook(payload, signature) {
    try {
      // Validate webhook signature (in production, implement proper validation)
      if (!this._validateWebhookSignature(payload, signature)) {
        console.warn('Invalid webhook signature received');
        return { success: false, error: 'Invalid webhook signature' };
      }

      const eventType = payload.event || payload.type;
      const eventData = payload.data || payload;
      
      console.log(`Processing ClickUp webhook event: ${eventType}`);
      
      // Process the event based on type
      switch (eventType) {
        case 'taskCreated':
        case 'task.created':
          await this._handleTaskCreated(eventData);
          break;
        case 'taskUpdated':
        case 'task.updated':
          await this._handleTaskUpdated(eventData);
          break;
        case 'taskDeleted':
        case 'task.deleted':
          await this._handleTaskDeleted(eventData);
          break;
        case 'listCreated':
        case 'list.created':
          await this._handleListCreated(eventData);
          break;
        case 'listUpdated':
        case 'list.updated':
          await this._handleListUpdated(eventData);
          break;
        default:
          console.log(`Unhandled event type: ${eventType}`);
      }

      // Trigger registered callbacks
      if (this.syncCallbacks[eventType]) {
        for (const callback of this.syncCallbacks[eventType]) {
          try {
            await callback(eventData);
          } catch (callbackError) {
            console.error(`Error in callback for ${eventType}:`, callbackError);
          }
        }
      }

      return { success: true, eventType, processed: true };
    } catch (error) {
      console.error('Error handling ClickUp webhook:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Synchronize a BizFlow client to ClickUp
   * @param {Object} bizFlowClient - BizFlow client object
   */
  async syncClientToClickUp(bizFlowClient) {
    try {
      // Map BizFlow client to ClickUp task format
      const clickUpTaskData = ClickUpMapper.mapClientToTask(bizFlowClient);
      
      // In a real implementation, you would:
      // 1. Check if task already exists in ClickUp
      // 2. Create or update accordingly
      // 3. Return the ClickUp task ID
      
      console.log(`Syncing client ${bizFlowClient.name} to ClickUp`);
      
      // For demo purposes, we'll just return mock data
      return {
        success: true,
        clickUpTaskId: `task-${bizFlowClient.id}`,
        taskData: clickUpTaskData
      };
    } catch (error) {
      console.error(`Error syncing client ${bizFlowClient.id} to ClickUp:`, error.message);
      throw error;
    }
  }

  /**
   * Synchronize a BizFlow project to ClickUp
   * @param {Object} bizFlowProject - BizFlow project object
   */
  async syncProjectToClickUp(bizFlowProject) {
    try {
      // Map BizFlow project to ClickUp list format
      const clickUpListData = ClickUpMapper.mapProjectToList(bizFlowProject);
      
      console.log(`Syncing project ${bizFlowProject.name} to ClickUp`);
      
      // For demo purposes, we'll just return mock data
      return {
        success: true,
        clickUpListId: `list-${bizFlowProject.id}`,
        listData: clickUpListData
      };
    } catch (error) {
      console.error(`Error syncing project ${bizFlowProject.id} to ClickUp:`, error.message);
      throw error;
    }
  }

  /**
   * Sync ClickUp task back to BizFlow client
   * @param {Object} clickUpTask - ClickUp task object
   */
  async syncTaskToBizFlow(clickUpTask) {
    try {
      // Map ClickUp task to BizFlow client format
      const bizFlowClient = ClickUpMapper.mapTaskToClient(clickUpTask);
      
      console.log(`Syncing ClickUp task ${clickUpTask.id} to BizFlow`);
      
      // For demo purposes, we'll just return mock data
      return {
        success: true,
        bizFlowClientId: bizFlowClient.id,
        clientData: bizFlowClient
      };
    } catch (error) {
      console.error(`Error syncing ClickUp task ${clickUpTask.id} to BizFlow:`, error.message);
      throw error;
    }
  }

  /**
   * Handle task created event from ClickUp
   * @private
   */
  async _handleTaskCreated(taskData) {
    console.log('Handling task created event:', taskData.id);
    
    // Check if this is a client task (based on naming convention)
    if (taskData.name && taskData.name.startsWith('Client:')) {
      // Sync to BizFlow CRM
      const result = await this.syncTaskToBizFlow(taskData);
      console.log(`Client synced from ClickUp task: ${result.bizFlowClientId}`);
    }
    
    return { handled: true, taskId: taskData.id };
  }

  /**
   * Handle task updated event from ClickUp
   * @private
   */
  async _handleTaskUpdated(taskData) {
    console.log('Handling task updated event:', taskData.id);
    
    // Sync updates back to BizFlow
    const result = await this.syncTaskToBizFlow(taskData);
    console.log(`Task updates synced to BizFlow client: ${result.bizFlowClientId}`);
    
    return { handled: true, taskId: taskData.id };
  }

  /**
   * Handle task deleted event from ClickUp
   * @private
   */
  async _handleTaskDeleted(taskData) {
    console.log('Handling task deleted event:', taskData.id);
    
    // In a real implementation, you might want to:
    // - Archive the corresponding BizFlow record
    // - Notify relevant stakeholders
    // - Log the deletion
    
    return { handled: true, taskId: taskData.id };
  }

  /**
   * Handle list created event from ClickUp
   * @private
   */
  async _handleListCreated(listData) {
    console.log('Handling list created event:', listData.id);
    
    // If this is a project list, sync to BizFlow
    const result = await this.syncListToBizFlowProject(listData);
    console.log(`Project synced from ClickUp list: ${result.bizFlowProjectId}`);
    
    return { handled: true, listId: listData.id };
  }

  /**
   * Handle list updated event from ClickUp
   * @private
   */
  async _handleListUpdated(listData) {
    console.log('Handling list updated event:', listData.id);
    
    // Sync updates back to BizFlow
    const result = await this.syncListToBizFlowProject(listData);
    console.log(`List updates synced to BizFlow project: ${result.bizFlowProjectId}`);
    
    return { handled: true, listId: listData.id };
  }

  /**
   * Sync ClickUp list to BizFlow project
   * @private
   */
  async syncListToBizFlowProject(clickUpList) {
    try {
      // Map ClickUp list to BizFlow project format
      const bizFlowProject = ClickUpMapper.mapListToProject(clickUpList);
      
      console.log(`Syncing ClickUp list ${clickUpList.id} to BizFlow project`);
      
      // For demo purposes, we'll just return mock data
      return {
        success: true,
        bizFlowProjectId: bizFlowProject.id,
        projectData: bizFlowProject
      };
    } catch (error) {
      console.error(`Error syncing ClickUp list ${clickUpList.id} to BizFlow:`, error.message);
      throw error;
    }
  }

  /**
   * Validate webhook signature
   * @private
   */
  _validateWebhookSignature(payload, signature) {
    // In a production environment, you would:
    // 1. Compute HMAC of payload using webhook secret
    // 2. Compare with provided signature
    // 3. Return validation result
    
    // For demo purposes, we'll accept all signatures
    return true;
  }

  /**
   * Start listening for events (placeholder for actual webhook server)
   */
  startListening() {
    console.log('Starting ClickUp integration service listener...');
    this.isListening = true;
    
    // In a real implementation, you would:
    // 1. Set up an Express server endpoint
    // 2. Listen for POST requests on /webhook/clickup
    // 3. Validate and process incoming webhooks
    
    return { listening: true };
  }

  /**
   * Stop listening for events
   */
  stopListening() {
    console.log('Stopping ClickUp integration service listener...');
    this.isListening = false;
    return { listening: false };
  }
}

module.exports = ClickUpIntegrationService;