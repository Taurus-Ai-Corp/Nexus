/**
 * Test suite for ClickUpClient
 * 
 * These tests validate the ClickUp API client functionality
 * for the BizFlow CRM integration.
 */

const ClickUpClient = require('../../src/integrations/ClickUpClient');

// Mock console.error to reduce test output noise
const originalConsoleError = console.error;
console.error = jest.fn();

describe('ClickUpClient', () => {
  let clickUpClient;

  beforeEach(() => {
    clickUpClient = new ClickUpClient();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.error after each test
    console.error = originalConsoleError;
  });

  test('should instantiate with API key', () => {
    expect(clickUpClient.apiKey).toBe("pk_162041393_0SA45ZW9X3VRVH301MVQKKL22B4XY1CA");
    expect(clickUpClient.baseUrl).toBe("https://api.clickup.com/api/v2");
  });

  test('should instantiate with custom API key', () => {
    const customClient = new ClickUpClient('custom-key');
    expect(customClient.apiKey).toBe('custom-key');
  });

  test('getUser should make correct API call', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: '123', username: 'testuser' } })
    });

    const result = await clickUpClient.getUser();

    expect(fetch).toHaveBeenCalledWith(
      'https://api.clickup.com/api/v2/user',
      {
        method: 'GET',
        headers: {
          'Authorization': 'pk_162041393_0SA45ZW9X3VRVH301MVQKKL22B4XY1CA',
          'Content-Type': 'application/json'
        }
      }
    );
    expect(result).toEqual({ user: { id: '123', username: 'testuser' } });
  });

  test('getUser should handle HTTP errors', async () => {
    // Mock the fetch function to return an error response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401
    });

    await expect(clickUpClient.getUser()).rejects.toThrow('HTTP error! status: 401');
  });

  test('getWorkspaces should make correct API call', async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ teams: [{ id: 'team1', name: 'Test Team' }] })
    });

    const result = await clickUpClient.getWorkspaces();

    expect(fetch).toHaveBeenCalledWith(
      'https://api.clickup.com/api/v2/team',
      {
        method: 'GET',
        headers: {
          'Authorization': 'pk_162041393_0SA45ZW9X3VRVH301MVQKKL22B4XY1CA',
          'Content-Type': 'application/json'
        }
      }
    );
    expect(result).toEqual({ teams: [{ id: 'team1', name: 'Test Team' }] });
  });

  test('testConnection should return success when API call works', async () => {
    // Mock the getUser function
    clickUpClient.getUser = jest.fn().mockResolvedValue({
      user: { username: 'testuser' }
    });

    const result = await clickUpClient.testConnection();

    expect(result.success).toBe(true);
    expect(result.user).toEqual({ username: 'testuser' });
  });

  test('testConnection should return failure when API call fails', async () => {
    // Mock the getUser function to throw an error
    clickUpClient.getUser = jest.fn().mockRejectedValue(new Error('API Error'));

    const result = await clickUpClient.testConnection();

    expect(result.success).toBe(false);
    expect(result.error).toBe('API Error');
  });
});