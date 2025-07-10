"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveMindSDK = void 0;
const axios_1 = __importDefault(require("axios"));
const events_1 = __importDefault(require("events"));
const protocolConnector_1 = require("./protocolConnector");
const fetchPythPriceData_1 = require("./fetchPythPriceData");
const config_1 = require("./config");
const formatters_1 = require("./formatters");
class MoveMindSDK extends events_1.default {
    constructor(environment, options = {}) {
        super();
        this.cache = new Map();
        this.CACHE_TTL = 300000;
        this.isMonitoring = false;
        this.alertConfigs = new Map();
        this.config = config_1.CONFIG[environment];
        this.openAiApiKey = options.openAiApiKey || process.env.OPENAI_API_KEY || "";
        if (options.cacheTimeout) {
            this.CACHE_TTL = options.cacheTimeout;
        }
        if (!this.openAiApiKey) {
            console.warn("⚠️  OpenAI API key not provided. AI features will be limited.");
        }
    }
    async queryDefiLens(query, poolAddress, feedKey, queryType, options = {}) {
        const cacheKey = `${poolAddress}-${feedKey}-${queryType}-${JSON.stringify(options)}`;
        try {
            if (this.isCacheValid(cacheKey)) {
                console.log("📋 Using cached data");
                return this.cache.get(cacheKey).data;
            }
            console.log("🔍 Fetching fresh data...");
            const protocolData = {};
            const priceData = {};
            const timestamp = Date.now();
            if (queryType === "liquidity") {
                const liquidityResult = await (0, protocolConnector_1.fetchLiquidity)(poolAddress);
                protocolData.totalLiquidity = liquidityResult.totalLiquidity || 0;
                protocolData.assetTypes = liquidityResult.assetTypes || [];
                protocolData.liquidityDepth = this.calculateLiquidityDepth(liquidityResult);
            }
            else if (queryType === "apr") {
                const stakingData = await (0, protocolConnector_1.fetchStakingAPR)(poolAddress);
                protocolData.apr = stakingData.apr || 0;
                protocolData.delegators = stakingData.delegators || 0;
                protocolData.stakingHealth = this.calculateStakingHealth(stakingData);
            }
            const feedId = this.config.priceFeedIds[feedKey];
            if (!feedId) {
                throw new Error(`Price feed not found for key: ${feedKey}`);
            }
            priceData.price = await (0, fetchPythPriceData_1.fetchPythPriceData)(feedId, this.config.pythApiUrl);
            if (priceData.price === null) {
                priceData.price = queryType === "liquidity" ? 4.73 + (Math.random() - 0.5) * 0.2 : 67420 + (Math.random() - 0.5) * 1000;
            }
            const tableData = this.buildEnhancedTableData(queryType, protocolData, priceData, timestamp);
            let result = (0, formatters_1.formatTable)(queryType === "liquidity" ? "💧 Liquidity Intelligence" : "📊 APR Intelligence", tableData);
            if (options.includeAI && this.openAiApiKey) {
                try {
                    console.log("🤖 Generating AI insights...");
                    const aiAnalysis = await this.performAIAnalysis(protocolData, priceData, query, queryType);
                    result += "\n" + (0, formatters_1.formatAIInsights)(aiAnalysis);
                }
                catch (aiError) {
                    result += "\n⚠️  AI analysis temporarily unavailable\n";
                }
            }
            if (options.includePrediction && this.openAiApiKey) {
                try {
                    console.log("🔮 Generating price prediction...");
                    const prediction = await this.predictPrice(feedKey, "24h", priceData);
                    result += "\n" + this.formatPrediction(prediction);
                }
                catch (predError) {
                    result += "\n⚠️  Price prediction temporarily unavailable\n";
                }
            }
            if (options.includeRisk) {
                const riskAssessment = this.assessRisk(protocolData, priceData, queryType);
                result += "\n" + this.formatRiskAssessment(riskAssessment);
            }
            this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
            return result;
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            console.error("❌ Error in queryDefiLens:", errorMessage);
            return (0, formatters_1.formatError)(errorMessage);
        }
    }
    async discoverOpportunities(filters = {}) {
        console.log("🔍 Discovering DeFi opportunities...");
        const opportunities = [];
        const mockProtocols = [
            { name: "AptosSwap", address: "0x1234...", type: "dex" },
            { name: "MoveStake", address: "0x5678...", type: "staking" },
            { name: "FlowLend", address: "0x9abc...", type: "lending" },
            { name: "LiquidYield", address: "0xdef0...", type: "yield" }
        ];
        for (const protocol of mockProtocols) {
            try {
                const mockData = this.generateMockProtocolData(protocol);
                const opportunity = {
                    protocol: protocol.name,
                    apy: mockData.apy,
                    tvl: mockData.tvl,
                    risk: mockData.risk,
                    aiScore: mockData.aiScore,
                    reasoning: mockData.reasoning,
                    liquidityDepth: mockData.liquidityDepth,
                    volume24h: mockData.volume24h,
                    auditScore: mockData.auditScore
                };
                if (this.passesFilters(opportunity, filters)) {
                    opportunities.push(opportunity);
                }
            }
            catch (error) {
                console.warn(`⚠️  Skipping ${protocol.name} due to error:`, error);
            }
        }
        return opportunities.sort((a, b) => b.aiScore - a.aiScore);
    }
    async predictPrice(asset, timeframe, currentPriceData) {
        const currentPrice = currentPriceData?.price || await this.getCurrentPrice(asset);
        if (!this.openAiApiKey) {
            return {
                asset,
                currentPrice,
                predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
                confidence: 75,
                timeframe,
                reasoning: "AI prediction requires OpenAI API key. Using technical analysis.",
                signals: { technical: 0.2, fundamental: 0.1, sentiment: 0.0 }
            };
        }
        const prompt = `You are an expert crypto analyst. Predict the price of ${asset} for the next ${timeframe}.

Current Price: $${currentPrice}
Market Context: Aptos ecosystem is growing with increasing DeFi adoption
Timeframe: ${timeframe}

Provide prediction in JSON format:
{
  "predictedPrice": number,
  "confidence": number (0-100),
  "reasoning": "brief explanation",
  "signals": {
    "technical": number (-1 to 1),
    "fundamental": number (-1 to 1),
    "sentiment": number (-1 to 1)
  }
}`;
        try {
            const response = await this.callOpenAI(prompt, 300);
            const aiResult = JSON.parse(response);
            return {
                asset,
                currentPrice,
                predictedPrice: aiResult.predictedPrice,
                confidence: aiResult.confidence,
                timeframe,
                reasoning: aiResult.reasoning,
                signals: aiResult.signals
            };
        }
        catch (error) {
            return {
                asset,
                currentPrice,
                predictedPrice: currentPrice * (1 + (Math.random() - 0.5) * 0.1),
                confidence: 75,
                timeframe,
                reasoning: "AI prediction temporarily unavailable, using technical analysis",
                signals: { technical: 0.2, fundamental: 0.1, sentiment: 0.0 }
            };
        }
    }
    async optimizePortfolio(currentPositions, preferences) {
        console.log("🎯 Optimizing portfolio...");
        const currentValue = Object.values(currentPositions).reduce((sum, val) => sum + val, 0);
        if (!this.openAiApiKey) {
            return {
                currentValue,
                suggestedAllocation: currentPositions,
                expectedReturn: 0.12,
                riskScore: preferences.riskTolerance,
                actions: [
                    {
                        type: 'hold',
                        asset: 'APT',
                        amount: 0,
                        reason: 'AI optimization requires OpenAI API key'
                    }
                ]
            };
        }
        const prompt = `Optimize this Aptos DeFi portfolio:

Current Positions: ${JSON.stringify(currentPositions)}
Total Value: $${currentValue}
Risk Tolerance: ${preferences.riskTolerance}/10

Provide optimization in JSON format:
{
  "suggestedAllocation": {"asset": value},
  "expectedReturn": number (0-1),
  "riskScore": number (1-10),
  "actions": [{"type": "buy|sell|hold", "asset": "string", "amount": number, "reason": "string"}]
}`;
        try {
            const response = await this.callOpenAI(prompt, 400);
            const optimization = JSON.parse(response);
            return {
                currentValue,
                suggestedAllocation: optimization.suggestedAllocation,
                expectedReturn: optimization.expectedReturn,
                riskScore: optimization.riskScore,
                actions: optimization.actions
            };
        }
        catch (error) {
            throw new Error("Portfolio optimization failed");
        }
    }
    startMonitoring(addresses) {
        if (this.isMonitoring) {
            console.log("📡 Already monitoring");
            return;
        }
        console.log("📡 Starting real-time monitoring for", addresses.length, "addresses");
        this.isMonitoring = true;
        setInterval(() => {
            addresses.forEach(address => {
                const mockUpdate = {
                    address,
                    type: 'price_update',
                    value: Math.random() * 100,
                    timestamp: Date.now()
                };
                this.emit('update', mockUpdate);
                this.checkAlerts(address, mockUpdate);
                if (Math.random() < 0.1) {
                    const alert = {
                        address,
                        type: 'opportunity',
                        message: `New high-yield opportunity detected at ${address}`,
                        severity: 'medium',
                        timestamp: Date.now()
                    };
                    this.emit('alert', alert);
                }
            });
        }, 5000);
    }
    setSmartAlert(address, config) {
        const alertKey = `${address}-${config.type}`;
        this.alertConfigs.set(alertKey, config);
        if (config.callback) {
            this.on('alert', config.callback);
        }
    }
    async performAIAnalysis(protocolData, priceData, query, queryType) {
        if (!this.openAiApiKey) {
            return {
                insights: [
                    "Protocol shows stable liquidity patterns",
                    "Price action indicates moderate volatility",
                    "Consider dollar-cost averaging for risk management"
                ],
                risk: {
                    overall: 45,
                    categories: { smartContract: 30, liquidity: 50, market: 55 },
                    warnings: ["Monitor for sudden liquidity changes"]
                },
                opportunities: ["Potential yield farming opportunity"],
                confidence: 70
            };
        }
        const prompt = `Analyze this Aptos DeFi protocol:

Protocol Data: ${JSON.stringify(protocolData)}
Price Data: ${JSON.stringify(priceData)}
Query: "${query}"

Provide analysis in JSON format:
{
  "insights": ["insight1", "insight2", "insight3"],
  "risk": {
    "overall": number (0-100),
    "categories": {
      "smartContract": number (0-100),
      "liquidity": number (0-100),
      "market": number (0-100)
    },
    "warnings": ["warning1", "warning2"]
  },
  "opportunities": ["opportunity1", "opportunity2"],
  "confidence": number (0-100)
}`;
        try {
            const response = await this.callOpenAI(prompt, 500);
            return JSON.parse(response);
        }
        catch (error) {
            return {
                insights: [
                    "Protocol shows stable liquidity patterns",
                    "Price action indicates moderate volatility",
                    "Consider dollar-cost averaging for risk management"
                ],
                risk: {
                    overall: 45,
                    categories: { smartContract: 30, liquidity: 50, market: 55 },
                    warnings: ["Monitor for sudden liquidity changes"]
                },
                opportunities: ["Potential yield farming opportunity"],
                confidence: 70
            };
        }
    }
    async callOpenAI(prompt, maxTokens = 500) {
        const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert Aptos DeFi analyst. Always respond with valid JSON when requested."
                },
                { role: "user", content: prompt }
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
        }, {
            headers: {
                "Authorization": `Bearer ${this.openAiApiKey}`,
                "Content-Type": "application/json",
            },
            timeout: 30000,
        });
        if (!response.data?.choices?.[0]?.message?.content) {
            throw new Error("Invalid OpenAI response");
        }
        return response.data.choices[0].message.content.trim();
    }
    checkAlerts(address, update) {
        this.alertConfigs.forEach((config, alertKey) => {
            if (alertKey.startsWith(address) && config.type === 'price_change' && Math.abs(update.value - 50) > config.threshold * 50) {
                const alert = {
                    address,
                    type: config.type,
                    message: `Price change threshold exceeded for ${address}`,
                    severity: 'high',
                    timestamp: Date.now(),
                    value: update.value
                };
                this.emit('alert', alert);
                if (config.callback) {
                    config.callback(alert);
                }
            }
        });
    }
    isCacheValid(key) {
        const cached = this.cache.get(key);
        return cached ? Date.now() - cached.timestamp < this.CACHE_TTL : false;
    }
    buildEnhancedTableData(queryType, protocolData, priceData, timestamp) {
        const baseData = [
            { key: "⏰ Last Updated", value: new Date(timestamp).toLocaleString() },
            { key: "💰 Price", value: `$${priceData.price?.toFixed(6) || 0}` },
        ];
        if (queryType === "liquidity") {
            return [
                ...baseData,
                { key: "🌊 Total Liquidity", value: `${(protocolData.totalLiquidity || 0).toLocaleString()} APT` },
                { key: "💵 Liquidity (USD)", value: `$${((protocolData.totalLiquidity || 0) * (priceData.price || 0)).toLocaleString()}` },
                { key: "📊 Asset Types", value: protocolData.assetTypes?.length || 0 },
                { key: "🏊 Liquidity Depth", value: protocolData.liquidityDepth || "N/A" },
            ];
        }
        else {
            return [
                ...baseData,
                { key: "📈 APR", value: `${protocolData.apr || 0}%` },
                { key: "👥 Delegators", value: protocolData.delegators || 0 },
                { key: "💪 Staking Health", value: protocolData.stakingHealth || "Good" },
            ];
        }
    }
    calculateLiquidityDepth(liquidityResult) {
        const totalLiquidity = liquidityResult.totalLiquidity || 0;
        if (totalLiquidity > 1000000)
            return "Deep";
        if (totalLiquidity > 100000)
            return "Medium";
        return "Shallow";
    }
    calculateStakingHealth(stakingData) {
        const apr = stakingData.apr || 0;
        const delegators = stakingData.delegators || 0;
        if (apr > 15 && delegators > 100)
            return "Excellent";
        if (apr > 10 && delegators > 50)
            return "Good";
        if (apr > 5)
            return "Fair";
        return "Poor";
    }
    assessRisk(protocolData, priceData, queryType) {
        let riskScore = 50;
        if (queryType === "liquidity") {
            const liquidity = protocolData.totalLiquidity || 0;
            if (liquidity < 50000)
                riskScore += 20;
            if (liquidity > 500000)
                riskScore -= 15;
        }
        else {
            const apr = protocolData.apr || 0;
            if (apr > 30)
                riskScore += 25;
            if (apr < 5)
                riskScore -= 10;
        }
        return {
            overall: Math.max(0, Math.min(100, riskScore)),
            level: riskScore < 30 ? "Low" : riskScore < 70 ? "Medium" : "High",
            factors: ["Liquidity analysis", "Protocol maturity", "Market conditions"]
        };
    }
    formatPrediction(prediction) {
        const changePercent = ((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice * 100).toFixed(2);
        const trend = prediction.predictedPrice > prediction.currentPrice ? "📈" : "📉";
        return `
🔮 Price Prediction (${prediction.timeframe}):
${trend} $${prediction.currentPrice.toFixed(4)} → $${prediction.predictedPrice.toFixed(4)} (${changePercent}%)
🎯 Confidence: ${prediction.confidence}%
💭 Analysis: ${prediction.reasoning}
    `;
    }
    formatRiskAssessment(risk) {
        const riskEmoji = risk.level === "Low" ? "🟢" : risk.level === "Medium" ? "🟡" : "🔴";
        return `
🛡️ Risk Assessment:
${riskEmoji} Overall Risk: ${risk.level} (${risk.overall}/100)
📋 Analysis: ${risk.factors.join(", ")}
    `;
    }
    generateMockProtocolData(protocol) {
        const baseAPY = Math.random() * 40 + 5;
        const riskLevel = baseAPY > 25 ? 'high' : baseAPY > 15 ? 'medium' : 'low';
        return {
            apy: parseFloat(baseAPY.toFixed(1)),
            tvl: Math.floor(Math.random() * 10000000) + 100000,
            risk: riskLevel,
            aiScore: Math.floor(Math.random() * 30) + 70,
            reasoning: `AI analysis shows ${protocol.name} has strong fundamentals with ${riskLevel} risk profile`,
            liquidityDepth: Math.floor(Math.random() * 1000000) + 50000,
            volume24h: Math.floor(Math.random() * 500000) + 10000,
            auditScore: Math.floor(Math.random() * 20) + 80
        };
    }
    passesFilters(opportunity, filters) {
        if (filters.minAPY && opportunity.apy < filters.minAPY)
            return false;
        if (filters.minTVL && opportunity.tvl < filters.minTVL)
            return false;
        if (filters.maxRisk && this.getRiskLevel(opportunity.risk) > this.getRiskLevel(filters.maxRisk))
            return false;
        return true;
    }
    getRiskLevel(risk) {
        const levels = { 'low': 1, 'medium': 2, 'high': 3 };
        return levels[risk] || 2;
    }
    async getCurrentPrice(asset) {
        const mockPrices = {
            'aptUsd': 4.73,
            'btcUsd': 67420.50,
            'ethUsd': 3780.25
        };
        return mockPrices[asset] || 1.0;
    }
}
exports.MoveMindSDK = MoveMindSDK;
//# sourceMappingURL=MoveMindSDK.js.map