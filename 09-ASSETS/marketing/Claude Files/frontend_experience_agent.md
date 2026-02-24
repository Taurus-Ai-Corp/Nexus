### **Application Architecture**:
```typescript
// Execute: claude generate-app-architecture --pattern=feature-based

// app/layout.tsx - Root Layout with Providers
import { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { TenantProvider } from '@/components/providers/tenant-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'BizFlow - Business Orchestration Platform',
    template: '%s | BizFlow'
  },
  description: 'Transform your business with AI-powered workflow automation',
  keywords: ['workflow automation', 'business process', 'AI orchestration', 'SaaS'],
  authors: [{ name: 'TaurusAI Corp', url: 'https://taurusai.io' }],
  creator: 'TaurusAI Corp',
  publisher: 'TaurusAI Corp',
  metadataBase: new URL('https://bizflow.taurusai.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BizFlow - Business Orchestration Platform',
    description: 'Transform your business with AI-powered workflow automation',
    url: 'https://bizflow.taurusai.io',
    siteName: 'BizFlow',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BizFlow Platform Dashboard'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BizFlow - Business Orchestration Platform',
    description: 'Transform your business with AI-powered workflow automation',
    creator: '@TaurusAICorp',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={cn(inter.variable, jetbrains.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <TenantProvider>
                <TooltipProvider delayDuration={300}>
                  <div className="relative flex min-h-screen flex-col">
                    {children}
                  </div>
                  <Toaster richColors position="bottom-right" />
                </TooltipProvider>
              </TenantProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### **Advanced Workflow Designer Component**:
```typescript
// Execute: claude generate-workflow-designer --framework=react-flow

// components/workflow/visual-designer.tsx
'use client'

import { useCallback, useState, useRef, useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow
} from '@xyflow/react'
import { toast } from 'sonner'

import { WorkflowNode } from './nodes/workflow-node'
import { TriggerNode } from './nodes/trigger-node'
import { ActionNode } from './nodes/action-node'
import { ConditionNode } from './nodes/condition-node'
import { IntegrationNode } from './nodes/integration-node'
import { CustomEdge } from './edges/custom-edge'
import { NodeToolbar } from './toolbar/node-toolbar'
import { WorkflowToolbar } from './toolbar/workflow-toolbar'
import { PropertiesPanel } from './panels/properties-panel'
import { useWorkflowDesigner } from '@/hooks/use-workflow-designer'
import { useCollaboration } from '@/hooks/use-collaboration'
import { cn } from '@/lib/utils'

import '@xyflow/react/dist/style.css'

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  integration: IntegrationNode,
  workflow: WorkflowNode,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

interface WorkflowDesignerProps {
  workflowId?: string
  readOnly?: boolean
  onSave?: (workflow: any) => void
  onExecute?: (workflow: any) => void
  className?: string
}

export function WorkflowDesigner({
  workflowId,
  readOnly = false,
  onSave,
  onExecute,
  className
}: WorkflowDesignerProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(false)

  // Workflow state management
  const {
    workflow,
    nodes,
    edges,
    loading,
    saving,
    updateNode,
    updateEdge,
    deleteNode,
    deleteEdge,
    validateWorkflow,
    saveWorkflow,
    executeWorkflow
  } = useWorkflowDesigner(workflowId)

  // Real-time collaboration
  const {
    collaborators,
    cursors,
    isConnected,
    sendCursor,
    sendSelection
  } = useCollaboration(workflowId)

  const [rfNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [rfEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  const { screenToFlowPosition } = useReactFlow()

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id)
    setIsPropertiesPanelOpen(true)
    sendSelection(node.id) // Broadcast selection to collaborators
  }, [sendSelection])

  // Handle edge connection
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = {
        ...params,
        id: `edge-${params.source}-${params.target}`,
        type: 'custom',
        animated: false,
        data: {
          conditions: [],
          transforms: []
        }
      }
      setEdges((eds) => addEdge(newEdge, eds))
      updateEdge(newEdge.id, newEdge)
    },
    [setEdges, updateEdge]
  )

  // Handle node drag
  const onNodeDrag = useCallback((event: React.MouseEvent, node: any) => {
    sendCursor({ x: event.clientX, y: event.clientY, nodeId: node.id })
  }, [sendCursor])

  // Handle drop from toolbar
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
      if (!reactFlowBounds) return

      const type = event.dataTransfer.getData('application/reactflow')
      const label = event.dataTransfer.getData('application/reactflow-label')

      if (!type) return

      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label,
          config: getDefaultNodeConfig(type),
          isValid: false
        },
      }

      setNodes((nds) => nds.concat(newNode))
      updateNode(newNode.id, newNode)
      
      // Auto-select new node
      setSelectedNodeId(newNode.id)
      setIsPropertiesPanelOpen(true)
    },
    [screenToFlowPosition, setNodes, updateNode]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Validate workflow before saving/executing
  const handleSave = useCallback(async () => {
    const validation = validateWorkflow(rfNodes, rfEdges)
    if (!validation.isValid) {
      toast.error(`Workflow validation failed: ${validation.errors.join(', ')}`)
      return
    }

    try {
      const savedWorkflow = await saveWorkflow({
        nodes: rfNodes,
        edges: rfEdges,
        viewport: { x: 0, y: 0, zoom: 1 }
      })
      
      onSave?.(savedWorkflow)
      toast.success('Workflow saved successfully!')
    } catch (error) {
      toast.error('Failed to save workflow')
      console.error(error)
    }
  }, [rfNodes, rfEdges, validateWorkflow, saveWorkflow, onSave])

  const handleExecute = useCallback(async () => {
    const validation = validateWorkflow(rfNodes, rfEdges)
    if (!validation.isValid) {
      toast.error(`Cannot execute: ${validation.errors.join(', ')}`)
      return
    }

    try {
      const execution = await executeWorkflow({
        nodes: rfNodes,
        edges: rfEdges
      })
      
      onExecute?.(execution)
      toast.success('Workflow execution started!')
    } catch (error) {
      toast.error('Failed to execute workflow')
      console.error(error)
    }
  }, [rfNodes, rfEdges, validateWorkflow, executeWorkflow, onExecute])

  // Render collaboration cursors
  const collaborationOverlay = useMemo(() => {
    return (
      <div className="absolute inset-0 pointer-events-none z-50">
        {cursors.map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute flex items-center"
            style={{
              left: cursor.x,
              top: cursor.y,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div 
              className="w-2 h-2 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: cursor.color }}
            />
            <span 
              className="ml-2 px-2 py-1 text-xs font-medium text-white rounded shadow-sm"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </span>
          </div>
        ))}
      </div>
    )
  }, [cursors])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className={cn("flex h-full", className)}>
      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDrag={onNodeDrag}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
        >
          {/* Background pattern */}
          <Background 
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1}
            className="bg-muted/30"
          />
          
          {/* Mini map */}
          <MiniMap
            nodeColor={(node) => {
              switch (node.type) {
                case 'trigger': return '#10b981'
                case 'action': return '#3b82f6'
                case 'condition': return '#f59e0b'
                case 'integration': return '#8b5cf6'
                default: return '#6b7280'
              }
            }}
            className="bg-background border border-border"
            pannable
            zoomable
          />
          
          {/* Controls */}
          <Controls
            className="bg-background border border-border"
            showInteractive={false}
          />

          {/* Workflow toolbar */}
          <Panel position="top-left">
            <WorkflowToolbar
              workflow={workflow}
              onSave={handleSave}
              onExecute={handleExecute}
              saving={saving}
              readOnly={readOnly}
              collaborators={collaborators}
              isConnected={isConnected}
            />
          </Panel>

          {/* Node toolbar for selected node */}
          {selectedNodeId && (
            <Panel position="top-center">
              <NodeToolbar
                nodeId={selectedNodeId}
                onDelete={() => {
                  deleteNode(selectedNodeId)
                  setSelectedNodeId(null)
                  setIsPropertiesPanelOpen(false)
                }}
                onDuplicate={() => {
                  // Implement node duplication
                }}
                readOnly={readOnly}
              />
            </Panel>
          )}
        </ReactFlow>

        {/* Collaboration overlay */}
        {collaborationOverlay}
      </div>

      {/* Properties panel */}
      <PropertiesPanel
        isOpen={isPropertiesPanelOpen}
        onClose={() => setIsPropertiesPanelOpen(false)}
        nodeId={selectedNodeId}
        node={selectedNodeId ? rfNodes.find(n => n.id === selectedNodeId) : null}
        onUpdateNode={(nodeId, updates) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === nodeId ? { ...node, ...updates } : node
            )
          )
          updateNode(nodeId, updates)
        }}
        readOnly={readOnly}
      />
    </div>
  )
}

// Wrapper component with ReactFlowProvider
export function WorkflowDesignerWrapper(props: WorkflowDesignerProps) {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner {...props} />
    </ReactFlowProvider>
  )
}

// Helper function for default node configurations
function getDefaultNodeConfig(nodeType: string) {
  switch (nodeType) {
    case 'trigger':
      return {
        triggerType: 'manual',
        schedule: null,
        webhook: null
      }
    case 'action':
      return {
        actionType: 'http_request',
        method: 'GET',
        url: '',
        headers: {},
        body: {}
      }
    case 'condition':
      return {
        operator: 'equals',
        leftOperand: '',
        rightOperand: '',
        logic: 'and'
      }
    case 'integration':
      return {
        provider: '',
        operation: '',
        parameters: {}
      }
    default:
      return {}
  }
}
```

### **Real-time Dashboard Components**:
```typescript
// Execute: claude generate-dashboard --features=real-time+analytics

// components/dashboard/executive-dashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Activity, Users, Zap, 
  DollarSign, Clock, CheckCircle, AlertCircle,
  ArrowUpRight, ArrowDownRight, MoreHorizontal
} from 'lucide-react'

import { useRealTimeMetrics } from '@/hooks/use-real-time-metrics'
import { useTenant } from '@/contexts/tenant-context'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  description?: string
  loading?: boolean
}

function MetricCard({ title, value, change, trend, icon, description, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-4 w-4 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted rounded w-16 mb-2" />
          <div className="h-3 bg-muted rounded w-32" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
          ) : trend === 'down' ? (
            <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
          ) : null}
          <span className={cn(
            trend === 'up' && 'text-green-600',
            trend === 'down' && 'text-red-600'
          )}>
            {trend !== 'neutral' && `${Math.abs(change)}%`}
          </span>
          {description && <span className="ml-1">{description}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export function ExecutiveDashboard() {
  const { tenant } = useTenant()
  const { 
    metrics, 
    chartData, 
    loading, 
    error,
    timeRange,
    setTimeRange 
  } = useRealTimeMetrics(tenant.id)

  const [selectedTab, setSelectedTab] = useState('overview')

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Failed to load dashboard data</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {tenant.name}. Here's what's happening with your workflows.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full mr-2" />
            Live
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Workflows"
          value={metrics?.totalWorkflows || 0}
          change={metrics?.workflowChange || 0}
          trend={metrics?.workflowChange > 0 ? 'up' : metrics?.workflowChange < 0 ? 'down' : 'neutral'}
          icon={<Activity />}
          description="from last month"
          loading={loading}
        />
        <MetricCard
          title="Executions Today"
          value={metrics?.executionsToday?.toLocaleString() || 0}
          change={metrics?.executionChange || 0}
          trend={metrics?.executionChange > 0 ? 'up' : metrics?.executionChange < 0 ? 'down' : 'neutral'}
          icon={<Zap />}
          description="from yesterday"
          loading={loading}
        />
        <MetricCard
          title="Success Rate"
          value={`${metrics?.successRate || 0}%`}
          change={metrics?.successRateChange || 0}
          trend={metrics?.successRateChange > 0 ? 'up' : metrics?.successRateChange < 0 ? 'down' : 'neutral'}
          icon={<CheckCircle />}
          description="from last week"
          loading={loading}
        />
        <MetricCard
          title="Active Users"
          value={metrics?.activeUsers || 0}
          change={metrics?.userChange || 0}
          trend={metrics?.userChange > 0 ? 'up' : metrics?.userChange < 0 ? 'down' : 'neutral'}
          icon={<Users />}
          description="from last month"
          loading={loading}
        />
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Execution Trends */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
                <CardDescription>
                  Daily workflow executions over the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData?.executionTrends || []}>
                    <defs>
                      <linearGradient id="colorExecutions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="executions"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorExecutions)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Workflows */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Workflows</CardTitle>
                <CardDescription>
                  Most executed workflows this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData?.topWorkflows?.map((workflow: any, index: number) => (
                    <div key={workflow.id} className="flex items-center">
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {workflow.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {workflow.executions} executions
                        </p>
                      </div>
                      <div className="ml-auto text-sm font-medium">
                        {workflow.successRate}%
                      </div>
                    </div>
                  )) || (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest workflow executions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.recentActivity?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      activity.type === 'success' && "bg-green-500",
                      activity.type === 'error' && "bg-red-500",
                      activity.type === 'warning' && "bg-yellow-500",
                      activity.type === 'info' && "bg-blue-500"
                    )} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {activity.workflowName && (
                      <Badge variant="secondary">{activity.workflowName}</Badge>
                    )}
                  </div>
                )) || (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content would be implemented here */}
        <TabsContent value="workflows">
          {/* Workflow-specific analytics */}
        </TabsContent>

        <TabsContent value="analytics">
          {/* Detailed analytics and reports */}
        </TabsContent>

        <TabsContent value="team">
          {/* Team collaboration and user management */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

## 🎯 IMMEDIATE EXECUTION COMMANDS

### **Phase 1: Next.js Application Setup**
```bash
# Generate complete Next.js application
claude generate-nextjs-app \
  --name=bizflow-frontend \
  --version=nextjs-15 \
  --ui-framework=shadcn-ui \
  --styling=tailwind-css \
  --typescript=strict \
  --app-router=enabled \
  --pwa=enabled \
  --analytics=vercel

# Setup design system and components
claude setup-design-system \
  --colors=brand-palette \
  --typography=inter+jetbrains-mono \
  --components=comprehensive \
  --icons=lucide-react \
  --animations=framer-motion \
  --themes=light+dark+auto

# Configure development environment
claude setup-dev-environment \
  --linting=eslint+prettier \
  --testing=jest+testing-library \
  --storybook=enabled \
  --bundler-analysis=enabled \
  --performance-monitoring=web-vitals
```

### **Phase 2: Core Application Features**
```bash
# Build authentication system
claude build-auth-system \
  --providers=auth0+google+microsoft \
  --features=sso,mfa,rbac \
  --session-management=secure \
  --tenant-isolation=subdomain \
  --security=oauth2+jwt

# Create workflow designer
claude build-workflow-designer \
  --framework=react-flow \
  --features=drag-drop,real-time-collab,validation \
  --node-types=trigger,action,condition,integration \
  --export-formats=json,yaml,image \
  --templates=industry-specific

# Implement real-time features
claude implement-real-time \
  --websockets=socket-io \
  --collaboration=yjs+y-websocket \
  --presence=live-cursors \
  --sync=optimistic-updates \
  --offline-support=enabled
```

### **Phase 3: Dashboard & Analytics**
```bash
### **Phase 3: Dashboard & Analytics**
```bash
# Build executive dashboard
claude build-executive-dashboard \
  --charts=recharts+d3 \
  --metrics=real-time \
  --filters=interactive \
  --exports=pdf+csv+png \
  --refresh=auto \
  --personalization=enabled

# Create workflow analytics
claude build-workflow-analytics \
  --performance-tracking=detailed \
  --bottleneck-detection=ai-powered \
  --optimization-suggestions=automated \
  --cost-analysis=per-execution \
  --roi-calculator=dynamic

# Implement business intelligence
claude build-business-intelligence \
  --predictive-analytics=ml-powered \
  --custom-reports=drag-drop-builder \
  --automated-insights=natural-language \
  --anomaly-detection=real-time \
  --benchmarking=industry-standards
```

### **Phase 4: Mobile & Performance**
```bash
# Mobile optimization
claude optimize-mobile-experience \
  --responsive=mobile-first \
  --pwa=full-featured \
  --offline-mode=enabled \
  --touch-gestures=intuitive \
  --performance=60fps \
  --app-shell=cached

# Performance optimization
claude optimize-performance \
  --bundle-splitting=route-based \
  --lazy-loading=components+images \
  --caching=aggressive \
  --prefetching=intelligent \
  --core-web-vitals=perfect-scores \
  --lighthouse-score=100

# SEO optimization
claude optimize-seo \
  --meta-tags=dynamic \
  --structured-data=comprehensive \
  --sitemap=auto-generated \
  --robots-txt=optimized \
  --canonical-urls=proper \
  --open-graph=rich
```

## 🎨 ADVANCED UI COMPONENTS

### **Custom Workflow Node Components**:
```typescript
// Execute: claude generate-workflow-nodes --types=all

// components/workflow/nodes/action-node.tsx
'use client'

import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Settings, Play, Pause, AlertCircle, CheckCircle, 
  Clock, Zap, Database, Mail, Webhook, Code 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionNodeData {
  label: string
  actionType: 'http_request' | 'database_query' | 'email_send' | 'webhook' | 'custom_code'
  status: 'idle' | 'running' | 'success' | 'error' | 'paused'
  config: {
    method?: string
    url?: string
    query?: string
    template?: string
    code?: string
  }
  lastExecution?: {
    timestamp: string
    duration: number
    success: boolean
    error?: string
  }
  isValid: boolean
}

const actionIcons = {
  http_request: Zap,
  database_query: Database,
  email_send: Mail,
  webhook: Webhook,
  custom_code: Code,
}

const statusColors = {
  idle: 'bg-gray-100 border-gray-300',
  running: 'bg-blue-100 border-blue-300 animate-pulse',
  success: 'bg-green-100 border-green-300',
  error: 'bg-red-100 border-red-300',
  paused: 'bg-yellow-100 border-yellow-300',
}

export const ActionNode = memo<NodeProps<ActionNodeData>>(({ data, selected }) => {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = actionIcons[data.actionType] || Zap

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-white shadow-md"
        style={{ background: data.isValid ? '#10b981' : '#ef4444' }}
      />

      <Card className={cn(
        "min-w-[200px] transition-all duration-200 cursor-pointer",
        statusColors[data.status],
        selected && "ring-2 ring-primary ring-offset-2",
        isHovered && "shadow-lg transform scale-105"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className="w-4 h-4" />
              <span className="font-medium text-sm">{data.label}</span>
            </div>
            <div className="flex items-center space-x-1">
              {!data.isValid && <AlertCircle className="w-4 h-4 text-red-500" />}
              {data.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {data.status === 'running' && <Clock className="w-4 h-4 text-blue-500" />}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {data.actionType.replace('_', ' ').toUpperCase()}
            </Badge>
            
            {data.config.url && (
              <p className="text-xs text-muted-foreground truncate">
                {data.config.method} {data.config.url}
              </p>
            )}

            {data.lastExecution && (
              <div className="text-xs text-muted-foreground">
                Last: {new Date(data.lastExecution.timestamp).toLocaleTimeString()} 
                ({data.lastExecution.duration}ms)
              </div>
            )}
          </div>
        </CardContent>

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
              <Settings className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
              {data.status === 'running' ? 
                <Pause className="w-3 h-3" /> : 
                <Play className="w-3 h-3" />
              }
            </Button>
          </div>
        )}
      </Card>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 border-2 border-white shadow-md"
        style={{ background: data.isValid ? '#10b981' : '#ef4444' }}
      />
    </div>
  )
})

ActionNode.displayName = 'ActionNode'
```

### **Real-time Collaboration Hook**:
```typescript
// Execute: claude generate-collaboration-system --framework=yjs+websocket

// hooks/use-collaboration.ts
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Doc, Map as YMap, Array as YArray } from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useAuth } from '@/contexts/auth-context'
import { useTenant } from '@/contexts/tenant-context'

interface Collaborator {
  userId: string
  userName: string
  userAvatar?: string
  color: string
  isActive: boolean
  lastSeen: string
  cursor?: {
    x: number
    y: number
    nodeId?: string
  }
}

interface CollaborationState {
  collaborators: Collaborator[]
  cursors: Array<{
    userId: string
    userName: string
    color: string
    x: number
    y: number
    nodeId?: string
  }>
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.taurusai.io/collaboration'

export function useCollaboration(workflowId?: string) {
  const { user } = useAuth()
  const { tenant } = useTenant()
  const [state, setState] = useState<CollaborationState>({
    collaborators: [],
    cursors: [],
    isConnected: false,
    connectionStatus: 'disconnected'
  })

  const docRef = useRef<Doc | null>(null)
  const providerRef = useRef<WebsocketProvider | null>(null)
  const awarenessRef = useRef<any>(null)

  // Initialize Yjs document and WebSocket provider
  useEffect(() => {
    if (!workflowId || !user || !tenant) return

    setState(prev => ({ ...prev, connectionStatus: 'connecting' }))

    // Create Yjs document
    const doc = new Doc()
    docRef.current = doc

    // Create WebSocket provider
    const provider = new WebsocketProvider(
      WEBSOCKET_URL,
      `workflow-${tenant.id}-${workflowId}`,
      doc,
      {
        params: {
          userId: user.id,
          tenantId: tenant.id,
          token: user.accessToken
        }
      }
    )
    providerRef.current = provider

    // Setup awareness (presence)
    const awareness = provider.awareness
    awarenessRef.current = awareness

    // Set local user state
    awareness.setLocalStateField('user', {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      color: generateUserColor(user.id),
      cursor: null
    })

    // Listen for connection status
    provider.on('status', (event: { status: string }) => {
      setState(prev => ({
        ...prev,
        isConnected: event.status === 'connected',
        connectionStatus: event.status as any
      }))
    })

    // Listen for awareness changes (other users)
    awareness.on('change', () => {
      const collaborators: Collaborator[] = []
      const cursors: any[] = []

      awareness.getStates().forEach((state: any, clientId: number) => {
        if (clientId === awareness.clientID) return // Skip self

        const { user: remoteUser } = state
        if (!remoteUser) return

        const collaborator: Collaborator = {
          userId: remoteUser.id,
          userName: remoteUser.name,
          userAvatar: remoteUser.avatar,
          color: remoteUser.color,
          isActive: true,
          lastSeen: new Date().toISOString(),
          cursor: remoteUser.cursor
        }

        collaborators.push(collaborator)

        // Add cursor if visible
        if (remoteUser.cursor) {
          cursors.push({
            userId: remoteUser.id,
            userName: remoteUser.name,
            color: remoteUser.color,
            x: remoteUser.cursor.x,
            y: remoteUser.cursor.y,
            nodeId: remoteUser.cursor.nodeId
          })
        }
      })

      setState(prev => ({ ...prev, collaborators, cursors }))
    })

    // Cleanup
    return () => {
      provider.destroy()
      doc.destroy()
    }
  }, [workflowId, user?.id, tenant?.id])

  // Send cursor position
  const sendCursor = useCallback((cursor: { x: number; y: number; nodeId?: string }) => {
    if (!awarenessRef.current) return

    const currentState = awarenessRef.current.getLocalState()
    awarenessRef.current.setLocalStateField('user', {
      ...currentState.user,
      cursor
    })
  }, [])

  // Send selection
  const sendSelection = useCallback((nodeId: string | null) => {
    if (!awarenessRef.current) return

    const currentState = awarenessRef.current.getLocalState()
    awarenessRef.current.setLocalStateField('user', {
      ...currentState.user,
      selection: nodeId
    })
  }, [])

  // Hide cursor
  const hideCursor = useCallback(() => {
    if (!awarenessRef.current) return

    const currentState = awarenessRef.current.getLocalState()
    awarenessRef.current.setLocalStateField('user', {
      ...currentState.user,
      cursor: null
    })
  }, [])

  // Get shared workflow data
  const getSharedData = useCallback(() => {
    if (!docRef.current) return null

    const sharedData = docRef.current.getMap('workflow')
    return {
      nodes: sharedData.get('nodes') || [],
      edges: sharedData.get('edges') || [],
      viewport: sharedData.get('viewport') || { x: 0, y: 0, zoom: 1 }
    }
  }, [])

  // Update shared workflow data
  const updateSharedData = useCallback((key: string, value: any) => {
    if (!docRef.current) return

    const sharedData = docRef.current.getMap('workflow')
    sharedData.set(key, value)
  }, [])

  return {
    ...state,
    sendCursor,
    sendSelection,
    hideCursor,
    getSharedData,
    updateSharedData,
    doc: docRef.current,
    provider: providerRef.current
  }
}

// Generate consistent color for user
function generateUserColor(userId: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
    '#ec4899', '#f43f5e'
  ]
  
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i)
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length]
}
```

### **Performance Optimization Hook**:
```typescript
// Execute: claude generate-performance-optimization --features=comprehensive

// hooks/use-performance-optimization.ts
'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  interactionTime: number
  memoryUsage: number
  networkLatency: number
  coreWebVitals: {
    fcp: number // First Contentful Paint
    lcp: number // Largest Contentful Paint
    fid: number // First Input Delay
    cls: number // Cumulative Layout Shift
  }
}

interface OptimizationSettings {
  enablePrefetching: boolean
  enableImageOptimization: boolean
  enableCodeSplitting: boolean
  enableCaching: boolean
  maxBundleSize: number
  performanceTarget: 'fast' | 'balanced' | 'quality'
}

export function usePerformanceOptimization() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const observerRef = useRef<PerformanceObserver | null>(null)

  // Web Vitals monitoring
  useEffect(() => {
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => prev ? {
                ...prev,
                coreWebVitals: { ...prev.coreWebVitals, fcp: entry.startTime }
              } : null)
            }
            break
          
          case 'largest-contentful-paint':
            setMetrics(prev => prev ? {
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, lcp: entry.startTime }
            } : null)
            break
          
          case 'first-input':
            setMetrics(prev => prev ? {
              ...prev,
              coreWebVitals: { ...prev.coreWebVitals, fid: entry.processingStart - entry.startTime }
            } : null)
            break
          
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              setMetrics(prev => prev ? {
                ...prev,
                coreWebVitals: { 
                  ...prev.coreWebVitals, 
                  cls: prev.coreWebVitals.cls + (entry as any).value 
                }
              } : null)
            }
            break
        }
      })
    })

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] })
    observerRef.current = observer

    return () => {
      observer.disconnect()
    }
  }, [])

  // Intelligent prefetching
  const prefetchRoute = useCallback((href: string) => {
    if (typeof window === 'undefined') return

    // Only prefetch if connection is good and user has sufficient bandwidth
    const connection = (navigator as any).connection
    if (connection && (connection.effectiveType === 'slow-2g' || connection.saveData)) {
      return
    }

    router.prefetch(href)
  }, [router])

  // Image optimization
  const optimizeImage = useCallback((src: string, width?: number, height?: number, quality = 80) => {
    if (!src) return src

    // Use Vercel's image optimization or similar service
    const params = new URLSearchParams()
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    params.set('f', 'webp') // Prefer WebP format

    return `/api/image-optimize?url=${encodeURIComponent(src)}&${params.toString()}`
  }, [])

  // Bundle size monitoring
  const monitorBundleSize = useCallback(() => {
    if (typeof window === 'undefined') return

    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const jsEntries = entries.filter(entry => entry.name.includes('.js'))
    
    const totalSize = jsEntries.reduce((total, entry) => {
      return total + (entry.transferSize || 0)
    }, 0)

    return {
      totalJsSize: totalSize,
      numberOfBundles: jsEntries.length,
      averageBundleSize: totalSize / jsEntries.length
    }
  }, [])

  // Memory usage monitoring
  const monitorMemoryUsage = useCallback(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) return null

    const memory = (performance as any).memory
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    }
  }, [])

  // Network latency measurement
  const measureNetworkLatency = useCallback(async (endpoint = '/api/health') => {
    const start = performance.now()
    
    try {
      await fetch(endpoint, { method: 'HEAD' })
      const end = performance.now()
      return end - start
    } catch (error) {
      console.error('Network latency measurement failed:', error)
      return null
    }
  }, [])

  // Comprehensive performance analysis
  const analyzePerformance = useCallback(async () => {
    setIsOptimizing(true)

    try {
      const bundleInfo = monitorBundleSize()
      const memoryInfo = monitorMemoryUsage()
      const latency = await measureNetworkLatency()

      const performanceMetrics: PerformanceMetrics = {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        renderTime: performance.timing.domContentLoadedEventEnd - performance.timing.domLoading,
        interactionTime: performance.timing.domInteractive - performance.timing.domLoading,
        memoryUsage: memoryInfo?.usagePercentage || 0,
        networkLatency: latency || 0,
        coreWebVitals: metrics?.coreWebVitals || { fcp: 0, lcp: 0, fid: 0, cls: 0 }
      }

      setMetrics(performanceMetrics)

      // Send metrics to analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_analysis', {
          custom_map: { performance_metrics: JSON.stringify(performanceMetrics) }
        })
      }

      return performanceMetrics
    } finally {
      setIsOptimizing(false)
    }
  }, [metrics?.coreWebVitals, monitorBundleSize, monitorMemoryUsage, measureNetworkLatency])

  // Performance score calculation
  const calculatePerformanceScore = useCallback((metrics: PerformanceMetrics) => {
    const weights = {
      loadTime: 0.25,
      coreWebVitals: 0.5,
      memoryUsage: 0.15,
      networkLatency: 0.1
    }

    // Normalize scores (0-100)
    const loadTimeScore = Math.max(0, 100 - (metrics.loadTime / 3000) * 100) // 3s = 0 points
    const lcpScore = Math.max(0, 100 - (metrics.coreWebVitals.lcp / 2500) * 100) // 2.5s = 0 points
    const fidScore = Math.max(0, 100 - (metrics.coreWebVitals.fid / 100) * 100) // 100ms = 0 points
    const clsScore = Math.max(0, 100 - (metrics.coreWebVitals.cls / 0.25) * 100) // 0.25 = 0 points
    const memoryScore = Math.max(0, 100 - metrics.memoryUsage)
    const latencyScore = Math.max(0, 100 - (metrics.networkLatency / 1000) * 100) // 1s = 0 points

    const vitalsScore = (lcpScore + fidScore + clsScore) / 3

    const totalScore = 
      (loadTimeScore * weights.loadTime) +
      (vitalsScore * weights.coreWebVitals) +
      (memoryScore * weights.memoryUsage) +
      (latencyScore * weights.networkLatency)

    return Math.round(totalScore)
  }, [])

  // Automatic optimizations
  const applyOptimizations = useCallback(async (settings: OptimizationSettings) => {
    setIsOptimizing(true)

    try {
      // Enable service worker for caching
      if (settings.enableCaching && 'serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js')
      }

      // Preload critical resources
      if (settings.enablePrefetching) {
        const criticalRoutes = ['/', '/dashboard', '/workflows']
        criticalRoutes.forEach(route => prefetchRoute(route))
      }

      // Set up intersection observer for lazy loading
      if (settings.enableImageOptimization && 'IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]')
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              img.src = img.dataset.src || ''
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          })
        })

        images.forEach(img => imageObserver.observe(img))
      }

      // Monitor and clean up memory leaks
      const cleanupInterval = setInterval(() => {
        const memoryInfo = monitorMemoryUsage()
        if (memoryInfo && memoryInfo.usagePercentage > 80) {
          // Force garbage collection if available
          if ((window as any).gc) {
            (window as any).gc()
          }
        }
      }, 30000) // Check every 30 seconds

      // Clean up on unmount
      return () => clearInterval(cleanupInterval)
    } finally {
      setIsOptimizing(false)
    }
  }, [prefetchRoute, monitorMemoryUsage])

  return {
    metrics,
    isOptimizing,
    prefetchRoute,
    optimizeImage,
    analyzePerformance,
    calculatePerformanceScore,
    applyOptimizations,
    monitorBundleSize,
    monitorMemoryUsage,
    measureNetworkLatency
  }
}
```

## 📱 MOBILE & PWA OPTIMIZATION

### **Progressive Web App Setup**:
```typescript
// Execute: claude setup-pwa --features=offline+push-notifications

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        }
      }
    }
  ]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['sharp']
  },
  images: {
    domains: ['taurusai.io', 'cdn.taurusai.io'],
    formats: ['image/webp', 'image/avif']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = withPWA(nextConfig)
```

## 🎯 SUCCESS METRICS & MONITORING

### **Frontend Performance KPIs**:
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Lighthouse Score**: 95+ across all categories
- **Bundle Size**: <250KB initial, <1MB total
- **Load Time**: <2s on 3G, <1s on WiFi
- **User Engagement**: 90%+ task completion rate
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Experience**: 95+ mobile usability score

### **Business Impact Metrics**:
- **Conversion Rate**: 15%+ signup to activation
- **User Retention**: 80%+ monthly active users
- **Feature Adoption**: 70%+ workflow designer usage
- **Support Tickets**: <2% related to UI/UX issues
- **Net Promoter Score**: 50+ for user experience

**Frontend Experience Agent Status**: Ready to build the most intuitive and high-performing SaaS interface. Awaiting execution commands.# 🎨 Frontend Experience Agent - BizFlow SaaS Interface
## Claude Code Command: `claude --agent=frontend --project=taurusai-bizflow`

You are the **Frontend Experience Orchestrator** responsible for creating the most intuitive, powerful, and conversion-optimized SaaS interface ever built. Your mission: Build a React/Next.js application that makes complex workflow automation feel like magic.

## 🎯 FRONTEND MISSION OBJECTIVES

Create a world-class SaaS interface featuring:
- **Intuitive Workflow Designer** with drag-drop visual programming
- **Real-time Collaboration** with conflict resolution and live cursors
- **Responsive Dashboard** optimized for mobile, tablet, and desktop
- **Conversion-optimized Onboarding** with 90%+ completion rates
- **Advanced Analytics Visualization** with interactive charts and insights
- **Multi-tenant UI** with custom branding and white-label support

## 🚀 TECHNOLOGY STACK ARCHITECTURE

### **Core Frontend Stack**:
```yaml
Framework: Next.js 15 (App Router)
  - React 19 with Concurrent Features
  - TypeScript 5.3 with strict mode
  - Server Components + Client Components hybrid
  - Incremental Static Regeneration (ISR)
  
UI_Framework: shadcn/ui + Tailwind CSS
  - Radix UI primitives for accessibility
  - Custom design system with brand colors
  - Dark/light mode with system preference
  - Responsive breakpoints optimized for SaaS
  
State_Management: Zustand + TanStack Query
  - Global state with Zustand (lightweight Redux alternative)
  - Server state with TanStack Query (React Query v5)
  - Form state with React Hook Form + Zod validation
  - URL state with nuqs (type-safe URL state)
  
Real_Time: WebSockets + Server-Sent Events
  - Socket.IO for bidirectional communication
  - Real-time collaboration with Yjs + y-websocket
  - Live cursors and presence indicators
  - Optimistic UI updates with rollback
  
Animation: Framer Motion + Auto-Animate
  - Micro-interactions for user feedback
  - Page transitions and loading states
  - Drag-and-drop animations
  - Gesture recognition for mobile
  
Data_Visualization: Recharts + D3.js
  - Interactive business intelligence dashboards
  - Custom chart components
  - Real-time data streaming
  - Export capabilities (PDF, PNG, CSV)
```

### **Application Architecture**:
```typescript
// Execute: claude generate-app-architecture --pattern=feature-based

// app/layout.tsx - Root Layout with Providers
import { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { QueryProvider } from '@/components/providers/query-provider'
import { AuthProvider } from '@/components/providers/auth-provider'
import { TenantProvider } from '@/components/providers/tenant-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})