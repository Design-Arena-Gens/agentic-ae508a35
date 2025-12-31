export type ClientPersonality =
  | 'curious'
  | 'hesitant'
  | 'quick-tempered'
  | 'skeptical'
  | 'highly-engaged';

export type InteractionType = 'comment' | 'dm' | 'story-reply';

export type ConversionStage =
  | 'awareness'
  | 'interest'
  | 'consideration'
  | 'intent'
  | 'purchase';

export interface Client {
  id: string;
  username: string;
  name?: string;
  personality: ClientPersonality;
  stage: ConversionStage;
  interests: string[];
  lastInteraction: Date;
  totalInteractions: number;
  linkClicks: number;
  responseRate: number;
  conversionProbability: number;
  createdAt: Date;
}

export interface Interaction {
  id: string;
  clientId: string;
  type: InteractionType;
  content: string;
  response?: string;
  timestamp: Date;
  linkSent?: boolean;
  linkClicked?: boolean;
  converted?: boolean;
}

export interface ResponseStrategy {
  personality: ClientPersonality;
  triggers: string[];
  tone: string;
  approach: string;
  examples: string[];
}

export interface AnalyticsData {
  totalClients: number;
  activeConversations: number;
  conversionRate: number;
  linkClickRate: number;
  averageResponseTime: number;
  dailyInteractions: number;
  revenueGenerated: number;
}

export interface GeneratedResponse {
  message: string;
  strategy: string;
  triggers: string[];
  followUpAction?: string;
  riskLevel: 'low' | 'medium' | 'high';
}
