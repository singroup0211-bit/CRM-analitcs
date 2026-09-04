export interface CriticalSignal {
  type: 'danger' | 'warning' | 'success';
  title: string;
  description: string;
  financialImpact: string; // e.g. "-$320,000 Risk" or "+$180,000 Potensial"
  impactType: 'loss' | 'gain' | 'neutral';
}

export interface FunnelStage {
  stageName: string;
  dealsCount: number;
  totalValue: number;
  conversionRate: number; // percentage
  avgDaysInStage: number;
  bottleneckDetected: boolean;
  bottleneckNote?: string;
  financialLossEstimate?: string;
}

export interface LostDealReason {
  reason: string;
  count: number;
  totalLostValue: number;
  percentage: number;
  rootCause: string;
  mitigation: string;
}

export interface RepPerformance {
  repName: string;
  role: string;
  activitiesCount: number; // calls + meetings
  dealsClosedWon: number;
  totalRevenueWon: number;
  winRate: number;
  quotaAttainment: number; // percentage
  status: 'Top Performer' | 'Balanced High' | 'High Activity/Low Win' | 'At-Risk';
  financialGap: string;
}

export interface HighRiskDeal {
  clientName: string;
  dealValue: number;
  stage: string;
  riskFactor: string;
  churnProbability: number; // percentage
  financialRisk: string;
  recommendedAction: string;
  assignedRep: string;
}

export interface ExpansionPotential {
  segment: string;
  type: 'Cross-sell' | 'Up-sell';
  potentialValue: string;
  targetAccountsCount: number;
  actionStrategy: string;
}

export interface TacticalStep {
  id: string;
  timeframe: '7-gün' | '30-gün';
  stepNumber: number;
  actionTitle: string;
  detail: string;
  ownerRole: string;
  financialImpact: string;
  completed?: boolean;
}

export interface ExecutiveReportData {
  generatedAt: string;
  companyOrDatasetName: string;
  
  // Section 1: Executive Snapshot
  executiveSnapshot: {
    totalPipelineValue: number;
    weightedPipelineValue: number;
    leadToWinRate: number; // percentage
    avgSalesCycleDays: number;
    totalDealsCount: number;
    wonDealsCount: number;
    currency: string;
    criticalSignals: CriticalSignal[];
  };

  // Section 2: Funnel Velocity & Bottlenecks
  funnelVelocity: {
    stages: FunnelStage[];
    lostDealReasons: LostDealReason[];
    summaryInsight: string;
    totalLostValue: number;
  };

  // Section 3: Sales Team Performance Matrix
  teamPerformance: {
    reps: RepPerformance[];
    topPerformersNote: string;
    atRiskNote: string;
    activityVsOutcomeInsight: string;
  };

  // Section 4: Churn & Expansion Risk
  churnAndRetention: {
    highRiskDeals: HighRiskDeal[];
    expansionPotentials: ExpansionPotential[];
    totalAtRiskValue: number;
    totalExpansionOpportunity: number;
  };

  // Section 5: Actionable Playbook
  actionablePlaybook: {
    sevenDaySteps: TacticalStep[];
    thirtyDayStrategy: TacticalStep[];
  };

  // Raw Markdown formatted version for direct export/reading
  markdownReport: string;
}

export interface PresetDataset {
  id: string;
  title: string;
  industry: string;
  description: string;
  sampleSummary: string;
  rawData: string;
}
