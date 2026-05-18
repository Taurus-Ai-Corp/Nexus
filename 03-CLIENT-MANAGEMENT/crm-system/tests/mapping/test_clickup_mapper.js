/**
 * Test suite for ClickUpMapper
 * 
 * These tests validate the data mapping functionality between
 * BizFlow CRM entities and ClickUp entities.
 */

const ClickUpMapper = require('../../src/mapping/ClickUpMapper');

describe('ClickUpMapper', () => {
  describe('mapClientToTask', () => {
    test('should map BizFlow client to ClickUp task', () => {
      const bizFlowClient = {
        id: 'client-123',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        industry: 'Technology',
        website: 'https://acme.com',
        phone: '+1-555-123-4567',
        status: 'active',
        description: 'A leading technology company'
      };

      const clickUpTask = ClickUpMapper.mapClientToTask(bizFlowClient);

      expect(clickUpTask.name).toBe('Client: Acme Corporation');
      expect(clickUpTask.status).toBe('complete'); // mapped from 'active'
      expect(clickUpTask.custom_fields).toHaveLength(5);
      expect(clickUpTask.custom_fields[0]).toEqual({
        id: 'client_id',
        value: 'client-123'
      });
    });

    test('should handle minimal client data', () => {
      const bizFlowClient = {
        id: 'client-456',
        name: 'Minimal Client'
      };

      const clickUpTask = ClickUpMapper.mapClientToTask(bizFlowClient);

      expect(clickUpTask.name).toBe('Client: Minimal Client');
      expect(clickUpTask.custom_fields[0].value).toBe('client-456');
    });
  });

  describe('mapProjectToList', () => {
    test('should map BizFlow project to ClickUp list', () => {
      const bizFlowProject = {
        id: 'project-789',
        name: 'Website Redesign',
        clientId: 'client-123',
        startDate: '2025-01-01',
        endDate: '2025-03-31',
        budget: 50000,
        description: 'Complete redesign of corporate website'
      };

      const clickUpList = ClickUpMapper.mapProjectToList(bizFlowProject);

      expect(clickUpList.name).toBe('Website Redesign');
      expect(clickUpList.custom_fields).toHaveLength(5);
      expect(clickUpList.custom_fields[0]).toEqual({
        id: 'project_id',
        value: 'project-789'
      });
    });
  });

  describe('mapActivityToComment', () => {
    test('should map BizFlow activity to ClickUp comment', () => {
      const bizFlowActivity = {
        type: 'Meeting',
        description: 'Initial project kickoff meeting',
        performedBy: 'John Doe',
        date: '2025-01-15T10:00:00Z'
      };

      const clickUpComment = ClickUpMapper.mapActivityToComment(bizFlowActivity);

      expect(clickUpComment.comment_text).toContain('Meeting: Initial project kickoff meeting');
      expect(clickUpComment.comment_text).toContain('Performed by: John Doe');
    });
  });

  describe('mapStatusToClickUp', () => {
    test('should map BizFlow statuses to ClickUp statuses', () => {
      expect(ClickUpMapper.mapStatusToClickUp('new')).toBe('to do');
      expect(ClickUpMapper.mapStatusToClickUp('in-progress')).toBe('in progress');
      expect(ClickUpMapper.mapStatusToClickUp('completed')).toBe('complete');
      expect(ClickUpMapper.mapStatusToClickUp('unknown')).toBe('to do'); // default
    });
  });

  describe('mapTaskToClient', () => {
    test('should map ClickUp task to BizFlow client', () => {
      const clickUpTask = {
        id: 'task-123',
        name: 'Client: Acme Corporation',
        status: 'complete',
        date_created: '2025-01-01T00:00:00Z',
        date_updated: '2025-01-15T00:00:00Z',
        custom_fields: [
          { id: 'client_id', value: 'client-123' },
          { id: 'client_email', value: 'contact@acme.com' },
          { id: 'client_industry', value: 'Technology' }
        ]
      };

      const bizFlowClient = ClickUpMapper.mapTaskToClient(clickUpTask);

      expect(bizFlowClient.id).toBe('client-123');
      expect(bizFlowClient.name).toBe('Acme Corporation');
      expect(bizFlowClient.status).toBe('active'); // mapped from 'complete'
      expect(bizFlowClient.email).toBe('contact@acme.com');
    });
  });

  describe('mapListToProject', () => {
    test('should map ClickUp list to BizFlow project', () => {
      const clickUpList = {
        id: 'list-789',
        name: 'Website Redesign',
        content: 'Complete redesign of corporate website',
        date_created: '2025-01-01T00:00:00Z',
        date_updated: '2025-01-15T00:00:00Z',
        custom_fields: [
          { id: 'project_id', value: 'project-789' },
          { id: 'project_client_id', value: 'client-123' },
          { id: 'project_budget', value: '50000' }
        ]
      };

      const bizFlowProject = ClickUpMapper.mapListToProject(clickUpList);

      expect(bizFlowProject.id).toBe('project-789');
      expect(bizFlowProject.name).toBe('Website Redesign');
      expect(bizFlowProject.clientId).toBe('client-123');
      expect(bizFlowProject.budget).toBe(50000);
    });
  });
});