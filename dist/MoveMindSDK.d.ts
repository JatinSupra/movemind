import EventEmitter from "events";
export interface AIAnalysisResult {
    insights: string[];
    risk: {
        overall: number;
        categories: {
            smartContract: number;
            liquidity: number;
            market: number;
        };
        warnings: string[];
    };
    opportunities: string[];
    confidence: number;
}
export interface OpportunityData {
    protocol: string;
    apy: number;
    tvl: number;
    risk: 'low' | 'medium' | 'high';
    aiScore: number;
    reasoning: string;
    liquidityDepth: number;
    volume24h: number;
    auditScore: number;
}
export interface PredictionResult {
    asset: string;
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    timeframe: string;
    reasoning: string;
    signals: {
        technical: number;
        fundamental: number;
        sentiment: number;
    };
}
export interface PortfolioOptimization {
    currentValue: number;
    suggestedAllocation: Record<string, number>;
    expectedReturn: number;
    riskScore: number;
    actions: Array<{
        type: 'buy' | 'sell' | 'hold';
        asset: string;
        amount: number;
        reason: string;
    }>;
}
export interface AlertConfig {
    type: 'price_change' | 'liquidity_drop' | 'volume_spike' | 'risk_increase';
    threshold: number;
    callback?: (alert: AlertData) => void;
}
export interface AlertData {
    address: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: number;
    value?: number;
}
export interface UpdateData {
    address: string;
    type: string;
    value: number;
    timestamp: number;
}
export declare class MoveMindSDK extends EventEmitter {
    private config;
    private openAiApiKey;
    private cache;
    private readonly CACHE_TTL;
    private isMonitoring;
    private alertConfigs;
    constructor(environment: "testnet" | "mainnet", options?: {
        openAiApiKey?: string;
        enableRealTime?: boolean;
        cacheTimeout?: number;
    });
    queryDefiLens(query: string, poolAddress: string, feedKey: string, queryType: "liquidity" | "apr", options?: {
        includeAI?: boolean;
        includePrediction?: boolean;
        includeRisk?: boolean;
    }): Promise<string>;
    discoverOpportunities(filters?: {
        minAPY?: number;
        maxRisk?: 'low' | 'medium' | 'high';
        minTVL?: number;
        protocols?: string[];
    }): Promise<OpportunityData[]>;
    predictPrice(asset: string, timeframe: string, currentPriceData?: any): Promise<PredictionResult>;
    optimizePortfolio(currentPositions: Record<string, number>, preferences: {
        riskTolerance: number;
        targetReturn?: number;
    }): Promise<PortfolioOptimization>;
    startMonitoring(addresses: string[]): void;
    setSmartAlert(address: string, config: AlertConfig): void;
    private performAIAnalysis;
    private callOpenAI;
    private checkAlerts;
    private isCacheValid;
    private buildEnhancedTableData;
    private calculateLiquidityDepth;
    private calculateStakingHealth;
    private assessRisk;
    private formatPrediction;
    private formatRiskAssessment;
    private generateMockProtocolData;
    private passesFilters;
    private getRiskLevel;
    private getCurrentPrice;
}
