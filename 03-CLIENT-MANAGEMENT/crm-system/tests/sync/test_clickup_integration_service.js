/**
 * Test suite for ClickUpIntegrationService
 * 
 * These tests validate the integration service functionality
 * for bidirectional synchronization between BizFlow CRM and ClickUp.
 */

const ClickUpIntegrationService = require('../../src/sync/ClickUpIntegrationService');

// Mock the ClickUpClient to avoid actual API calls during testing
jest.mock('../../src/integrations/ClickUpClient');

describe('ClickUpIntegrationService', () => {
  let integrationService;
  let mockClickUpClient;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create instance of the service
    integrationService = new ClickUpIntegrationService('test-api-key');
    
    // Get reference to the mocked client
    mockClickUpClient = integrationService.clickUpClient;
  });

  test('should initialize with API key', () => {
    expect(integrationService.clickUpClient).toBeDefined();
    expect(integrationService.webhookSecret).toBeDefined();
  });

  test('should initialize successfully', async () => {
    // Mock successful connection test
    mockClickUpClient.testConnection.mockResolvedValue({
      success: true,
      user: { user: { username: 'testuser' } }
    });

    const result = await integrationService.initialize();

    expect(result.success).toBe(true);
    expect(mockClickUpClient.testConnection).toHaveBeenCalled();
  });

  test('should fail initialization with connection error', async () => {
    // Mock failed connection test
    mockClickUpClient.testConnection.mockResolvedValue({
      success: false,
      error: 'Connection failed'
    });

    await expect(integrationService.initialize()).rejects.toThrow('Failed to connect to ClickUp API: Connection failed');
  });

  test('should register sync callbacks', () => {
    const mockCallback = jest.fn();
    
    integrationService.registerSyncCallback('task.created', mockCallback);
    
    expect(integrationService.syncCallbacks['task.created']).toContain(mockCallback);
  });

  test('should handle task created webhook', async () => {
    const mockTaskData = {
      id: 'task-123',
      name: 'Client: Test Client'
    };

    const result = await integrationService._handleTaskCreated(mockTaskData);

    expect(result.handled).toBe(true);
    expect(result.taskId).toBe('task-123');
  });

  test('should sync client to ClickUp', async () => {
    const bizFlowClient = {
      id: 'client-123',
      name: 'Test Client',
      email: 'test@example.com'
    };

    const result = await integrationService.syncClientToClickUp(bizFlowClient);

    expect(result.success).toBe(true);
    expect(result.clickUpTaskId).toBe('task-client-123');
  });

  test('should sync project to ClickUp', async () => {
    const bizFlowProject = {
      id: 'project-456',
      name: 'Test Project'
    };

    const result = await integrationService.syncProjectToClickUp(bizFlowProject);

    expect(result.success).toBe(true);
    expect(result.clickUpListId).toBe('list-project-456');
  });

  test('should handle webhook with valid signature', async () => {
    const mockPayload = {
      event: 'task.created',
      data: {
        id: 'task-123',
        name: 'Test Task'
      }
    };

    const result = await integrationService.handleWebhook(mockPayload, 'valid-signature');

    expect(result.success).toBe(true);
    expect(result.eventType).toBe('task.created');
  });

  test('should start and stop listening', () => {
    // Test start listening
    const startResult = integrationService.startListening();
    expect(startResult.listening).toBe(true);
    expect(integrationService.isListening).toBe(true);

    // Test stop listening
    const stopResult = integrationService.stopListening();
    expect(stopResult.listening).toBe(false);
    expect(integrationService.isListening).toBe(false);
  });
});