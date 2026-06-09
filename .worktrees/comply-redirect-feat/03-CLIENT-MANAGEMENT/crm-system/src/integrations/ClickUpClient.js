/**
 * ClickUp API Client for BizFlow CRM Integration
 * 
 * This module provides methods to interact with the ClickUp API v2
 * for bidirectional synchronization between BizFlow CRM and ClickUp.
 */

// In a real implementation, this would come from environment variables
// const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
const CLICKUP_API_KEY = "pk_162041393_0SA45ZW9X3VRVH301MVQKKL22B4XY1CA"; // Provided for development
const BASE_URL = "https://api.clickup.com/api/v2";

class ClickUpClient {
  constructor(apiKey = null) {
    this.apiKey = apiKey || CLICKUP_API_KEY;
    this.baseUrl = BASE_URL;
  }

  /**
   * Get authenticated user information
   * Used to test API connection and authentication
   */
  async getUser() {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get workspaces available to the authenticated user
   */
  async getWorkspaces() {
    try {
      const response = await fetch(`${this.baseUrl}/team`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      throw error;
    }
  }

  /**
   * Get lists in a specific folder
   * @param {string} folderId - The folder ID to get lists from
   */
  async getLists(folderId) {
    try {
      const response = await fetch(`${this.baseUrl}/folder/${folderId}/list`, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching lists for folder ${folderId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task in ClickUp
   * @param {string} listId - The list ID to create the task in
   * @param {Object} taskData - The task data to create
   */
  async createTask(listId, taskData) {
    try {
      const response = await fetch(`${this.baseUrl}/list/${listId}/task`, {
        method: 'POST',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task in ClickUp
   * @param {string} taskId - The task ID to update
   * @param {Object} taskData - The task data to update
   */
  async updateTask(taskId, taskData) {
    try {
      const response = await fetch(`${this.baseUrl}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Get tasks from a specific list
   * @param {string} listId - The list ID to get tasks from
   * @param {Object} options - Optional query parameters
   */
  async getTasks(listId, options = {}) {
    try {
      const queryParams = new URLSearchParams(options).toString();
      const url = queryParams 
        ? `${this.baseUrl}/list/${listId}/task?${queryParams}`
        : `${this.baseUrl}/list/${listId}/task`;
        
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tasks for list ${listId}:`, error);
      throw error;
    }
  }

  /**
   * Test the API connection
   */
  async testConnection() {
    try {
      const user = await this.getUser();
      console.log('ClickUp API connection successful!');
      console.log(`Authenticated user: ${user.user.username}`);
      return { success: true, user };
    } catch (error) {
      console.error('ClickUp API connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = ClickUpClient;