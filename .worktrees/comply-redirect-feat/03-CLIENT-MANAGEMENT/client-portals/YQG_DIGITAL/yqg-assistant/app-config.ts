export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  audioVisualizerType?: 'bar' | 'wave' | 'grid' | 'radial' | 'aura';
  audioVisualizerColor?: `#${string}`;
  audioVisualizerColorDark?: `#${string}`;
  audioVisualizerColorShift?: number;
  audioVisualizerBarCount?: number;
  audioVisualizerGridRowCount?: number;
  audioVisualizerGridColumnCount?: number;
  audioVisualizerRadialBarCount?: number;
  audioVisualizerRadialRadius?: number;
  audioVisualizerWaveLineWidth?: number;

  // agent dispatch configuration
  agentName?: string;

  // LiveKit Cloud Sandbox configuration
  sandboxId?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'YQG Digital',
  pageTitle: 'YQG AI Assistant — Your Agency Co-pilot, Always On',
  pageDescription:
    'A voice-first AI assistant built for YQG Digital by TAURUS AI. Draft proposals, run live SEO research, scan competitors, and turn voice memos into structured briefs — under two seconds, hands-free.',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/yqg-mark.svg',
  logoDark: '/yqg-mark-dark.svg',
  accent: '#b88a3d',
  accentDark: '#d9b377',
  startButtonText: 'Talk to your YQG Assistant',

  // Audio visualization — warm gold, matches the TAURUS AI intro PDF brand system
  audioVisualizerType: 'aura',
  audioVisualizerColor: '#b88a3d',
  audioVisualizerColorDark: '#d9b377',
  audioVisualizerColorShift: 0.3,

  // agent dispatch — routes to the YQG-specific worker on the backend
  agentName: process.env.AGENT_NAME ?? 'yqg-agent',

  // LiveKit Cloud Sandbox configuration
  sandboxId: undefined,
};
