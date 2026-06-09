import { EventConfig, Handlers } from 'motia'
import { z } from 'zod'

// Real-time Data Streaming Step - Powers live dashboard updates
export const config: EventConfig = {
  type: 'event',
  name: 'StreamRealtimeData',
  description: 'Streams real-time data to connected dashboard clients',
  subscribes: ['analytics.business.updated', 'agent.data.collected', 'performance.metrics.updated', 'system.health.updated'],
  emits: ['realtime.data.streamed', 'dashboard.update.ready'],
  input: z.object({
    clientId: z.string().optional(),
    dataType: z.enum(['business', 'agents', 'performance', 'system']).optional(),
    broadcast: z.boolean().default(true)
  }),
  flows: ['realtime-streaming', 'dashboard-updates', 'live-monitoring']
}

export const handler: Handlers['StreamRealtimeData'] = async (input, { emit, logger, state, streams }) => {
  try {
    logger.info('Starting real-time data streaming', { input })
    
    // Get latest data from state
    const businessData = await state.get('analytics', 'business')
    const agentData = await state.get('agents', 'performance')
    const systemData = await state.get('system', 'health')
    
    // Create real-time update payload
    const realtimeUpdate = {
      timestamp: new Date().toISOString(),
      data: {
        business: businessData,
        agents: agentData,
        system: systemData
      },
      metadata: {
        source: 'realtime-stream',
        version: '1.0.0',
        clientId: input.clientId || 'broadcast'
      }
    }
    
    // Stream to connected clients
    if (input.broadcast) {
      // Broadcast to all connected clients
      await streams['dashboard-updates'].set('global', realtimeUpdate.timestamp, realtimeUpdate)
    } else if (input.clientId) {
      // Stream to specific client
      await streams['dashboard-updates'].set(input.clientId, realtimeUpdate.timestamp, realtimeUpdate)
    }
    
    // Emit events for dashboard updates
    await emit({
      topic: 'realtime.data.streamed',
      data: {
        clientCount: input.broadcast ? 'all' : 1,
        dataSize: JSON.stringify(realtimeUpdate).length,
        timestamp: realtimeUpdate.timestamp
      }
    })
    
    await emit({
      topic: 'dashboard.update.ready',
      data: realtimeUpdate
    })
    
    logger.info('Real-time data streamed successfully', {
      clientId: input.clientId || 'broadcast',
      dataSize: JSON.stringify(realtimeUpdate).length
    })
    
  } catch (error) {
    logger.error('Real-time data streaming failed', { error: error.message })
    await emit({
      topic: 'realtime.streaming.failed',
      data: {
        error: error.message,
        timestamp: new Date().toISOString()
      }
    })
  }
}

