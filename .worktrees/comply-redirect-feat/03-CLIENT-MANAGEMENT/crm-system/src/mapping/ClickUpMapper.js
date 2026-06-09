/**
 * Data mapping service for BizFlow to ClickUp entity translation
 * 
 * This module provides functions to map BizFlow CRM entities to ClickUp entities
 * and vice versa, enabling bidirectional synchronization.
 */

class ClickUpMapper {
  /**
   * Map BizFlow client entity to ClickUp task/custom fields
   * @param {Object} bizFlowClient - BizFlow client object
   * @returns {Object} ClickUp task object
   */
  static mapClientToTask(bizFlowClient) {
    return {
      name: `Client: ${bizFlowClient.name}`,
      description: this._generateClientDescription(bizFlowClient),
      status: this._mapClientStatus(bizFlowClient.status),
      custom_fields: [
        {
          id: 'client_id', // This would be the actual custom field ID in ClickUp
          value: bizFlowClient.id
        },
        {
          id: 'client_email',
          value: bizFlowClient.email || ''
        },
        {
          id: 'client_industry',
          value: bizFlowClient.industry || ''
        },
        {
          id: 'client_website',
          value: bizFlowClient.website || ''
        },
        {
          id: 'client_phone',
          value: bizFlowClient.phone || ''
        }
      ]
    };
  }

  /**
   * Map BizFlow project entity to ClickUp project/list
   * @param {Object} bizFlowProject - BizFlow project object
   * @returns {Object} ClickUp list object
   */
  static mapProjectToList(bizFlowProject) {
    return {
      name: `${bizFlowProject.name}`,
      content: this._generateProjectDescription(bizFlowProject),
      custom_fields: [
        {
          id: 'project_id',
          value: bizFlowProject.id
        },
        {
          id: 'project_client_id',
          value: bizFlowProject.clientId || ''
        },
        {
          id: 'project_start_date',
          value: bizFlowProject.startDate || ''
        },
        {
          id: 'project_end_date',
          value: bizFlowProject.endDate || ''
        },
        {
          id: 'project_budget',
          value: bizFlowProject.budget || 0
        }
      ]
    };
  }

  /**
   * Map BizFlow activity to ClickUp comment
   * @param {Object} bizFlowActivity - BizFlow activity object
   * @returns {Object} ClickUp comment object
   */
  static mapActivityToComment(bizFlowActivity) {
    return {
      comment_text: this._generateActivityComment(bizFlowActivity),
      assignee: bizFlowActivity.assigneeId || '',
      created_at: bizFlowActivity.createdAt || new Date().toISOString()
    };
  }

  /**
   * Map BizFlow status update to ClickUp task status
   * @param {string} bizFlowStatus - BizFlow status
   * @returns {string} ClickUp status
   */
  static mapStatusToClickUp(bizFlowStatus) {
    const statusMap = {
      'new': 'to do',
      'in-progress': 'in progress',
      'pending': 'in review',
      'completed': 'complete',
      'cancelled': 'cancelled',
      'on-hold': 'archived'
    };
    
    return statusMap[bizFlowStatus.toLowerCase()] || 'to do';
  }

  /**
   * Map ClickUp task to BizFlow client entity
   * @param {Object} clickUpTask - ClickUp task object
   * @returns {Object} BizFlow client object
   */
  static mapTaskToClient(clickUpTask) {
    // Extract custom field values
    const customFields = {};
    if (clickUpTask.custom_fields) {
      clickUpTask.custom_fields.forEach(field => {
        customFields[field.id] = field.value;
      });
    }
    
    return {
      id: customFields.client_id || clickUpTask.id,
      name: clickUpTask.name.replace('Client: ', ''),
      email: customFields.client_email || '',
      industry: customFields.client_industry || '',
      website: customFields.client_website || '',
      phone: customFields.client_phone || '',
      status: this._mapTaskStatus(clickUpTask.status),
      createdAt: clickUpTask.date_created,
      updatedAt: clickUpTask.date_updated
    };
  }

  /**
   * Map ClickUp list to BizFlow project entity
   * @param {Object} clickUpList - ClickUp list object
   * @returns {Object} BizFlow project object
   */
  static mapListToProject(clickUpList) {
    // Extract custom field values
    const customFields = {};
    if (clickUpList.custom_fields) {
      clickUpList.custom_fields.forEach(field => {
        customFields[field.id] = field.value;
      });
    }
    
    return {
      id: customFields.project_id || clickUpList.id,
      name: clickUpList.name,
      clientId: customFields.project_client_id || '',
      startDate: customFields.project_start_date || '',
      endDate: customFields.project_end_date || '',
      budget: parseFloat(customFields.project_budget) || 0,
      description: clickUpList.content || '',
      createdAt: clickUpList.date_created,
      updatedAt: clickUpList.date_updated
    };
  }

  /**
   * Generate client description for ClickUp task
   * @private
   */
  static _generateClientDescription(client) {
    let description = `# Client Profile: ${client.name}\n\n`;
    
    if (client.description) {
      description += `## Description\n${client.description}\n\n`;
    }
    
    description += `## Contact Information\n`;
    if (client.email) description += `- **Email**: ${client.email}\n`;
    if (client.phone) description += `- **Phone**: ${client.phone}\n`;
    if (client.website) description += `- **Website**: ${client.website}\n`;
    
    if (client.address) {
      description += `\n## Address\n${client.address}\n`;
    }
    
    if (client.notes) {
      description += `\n## Notes\n${client.notes}\n`;
    }
    
    return description;
  }

  /**
   * Generate project description for ClickUp list
   * @private
   */
  static _generateProjectDescription(project) {
    let description = `# Project: ${project.name}\n\n`;
    
    if (project.description) {
      description += `## Description\n${project.description}\n\n`;
    }
    
    description += `## Project Details\n`;
    description += `- **Client**: ${project.clientName || 'Not specified'}\n`;
    description += `- **Start Date**: ${project.startDate || 'Not specified'}\n`;
    description += `- **End Date**: ${project.endDate || 'Not specified'}\n`;
    description += `- **Budget**: $${project.budget || 0}\n`;
    
    return description;
  }

  /**
   * Generate activity comment for ClickUp
   * @private
   */
  static _generateActivityComment(activity) {
    return `${activity.type}: ${activity.description}\n\nPerformed by: ${activity.performedBy || 'Unknown'}\nDate: ${activity.date || new Date().toISOString()}`;
  }

  /**
   * Map BizFlow client status to ClickUp task status
   * @private
   */
  static _mapClientStatus(status) {
    const statusMap = {
      'prospect': 'to do',
      'onboarding': 'in progress',
      'active': 'complete',
      'upsell': 'in review',
      'inactive': 'archived',
      'lost': 'cancelled'
    };
    
    return statusMap[status.toLowerCase()] || 'to do';
  }

  /**
   * Map ClickUp task status to BizFlow client status
   * @private
   */
  static _mapTaskStatus(status) {
    const statusMap = {
      'to do': 'prospect',
      'in progress': 'onboarding',
      'in review': 'upsell',
      'complete': 'active',
      'archived': 'inactive',
      'cancelled': 'lost'
    };
    
    return statusMap[status.toLowerCase()] || 'prospect';
  }
}

module.exports = ClickUpMapper;