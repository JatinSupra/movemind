"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveMindCLI = void 0;
exports.runCLI = runCLI;
const commander_1 = require("commander");
const MoveMindSDK_1 = require("../MoveMindSDK");
const formatters_1 = require("../formatters");
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs"));
class MoveMindCLI {
    constructor() {
        this.program = new commander_1.Command();
        this.setupCommands();
    }
    async init() {
        const config = this.loadConfig();
        this.sdk = new MoveMindSDK_1.MoveMindSDK(config.environment, {
            openAiApiKey: config.openAiApiKey,
            enableRealTime: true
        });
        this.sdk.on('alert', (alert) => {
            console.log((0, formatters_1.formatAlert)(alert));
        });
        this.sdk.on('update', (update) => {
            if (config.verbose) {
                console.log(`📡 ${update.address}: ${update.type} = ${update.value}`);
            }
        });
    }
    setupCommands() {
        this.program
            .name('movemind')
            .description('🚀 MoveMind AI - Aptos DeFi Intelligence Platform')
            .version('1.0.0');
        this.program
            .command('discover')
            .description('🔍 Discover DeFi opportunities')
            .option('--min-apy <number>', 'Minimum APY percentage', '0')
            .option('--max-risk <level>', 'Maximum risk level (low|medium|high)', 'high')
            .option('--min-tvl <amount>', 'Minimum TVL in USD', '0')
            .option('--protocols <list>', 'Comma-separated list of protocols')
            .option('--ai', 'Include AI analysis')
            .action(async (options) => {
            await this.discoverCommand(options);
        });
        this.program
            .command('predict')
            .description('🔮 Predict asset prices')
            .argument('<asset>', 'Asset to predict (APT, BTC, etc.)')
            .argument('[timeframe]', 'Prediction timeframe', '24h')
            .option('--confidence', 'Show confidence breakdown')
            .action(async (asset, timeframe, options) => {
            await this.predictCommand(asset, timeframe, options);
        });
        this.program
            .command('optimize')
            .description('💼 Optimize portfolio allocation')
            .argument('<portfolio>', 'Portfolio file (JSON) or inline JSON')
            .option('--risk-tolerance <level>', 'Risk tolerance 1-10', '5')
            .option('--target-return <percent>', 'Target return percentage')
            .action(async (portfolio, options) => {
            await this.optimizeCommand(portfolio, options);
        });
        this.program
            .command('monitor')
            .description('📡 Start real-time monitoring')
            .argument('<addresses...>', 'Addresses to monitor')
            .option('--alerts', 'Enable smart alerts')
            .action(async (addresses, options) => {
            await this.monitorCommand(addresses, options);
        });
        this.program
            .command('analyze')
            .description('🤖 Get AI analysis')
            .argument('<query>', 'Your analysis question')
            .option('--pool <address>', 'Specific pool address')
            .option('--type <type>', 'Analysis type (liquidity|apr)', 'liquidity')
            .action(async (query, options) => {
            await this.analyzeCommand(query, options);
        });
        this.program
            .command('demo')
            .description('🎮 Run interactive demo')
            .option('--full', 'Run full feature demo')
            .action(async (options) => {
            await this.demoCommand(options);
        });
        this.program
            .command('help')
            .description('📚 Show detailed help')
            .action(() => {
            console.log((0, formatters_1.formatHelp)());
        });
    }
    async run(argv) {
        try {
            await this.init();
            await this.program.parseAsync(argv);
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Unknown error'));
            process.exit(1);
        }
    }
    async discoverCommand(options) {
        console.log((0, formatters_1.formatLoading)("Discovering DeFi opportunities"));
        try {
            const filters = {
                minAPY: parseFloat(options.minApy),
                maxRisk: options.maxRisk,
                minTVL: parseFloat(options.minTvl),
                protocols: options.protocols ? options.protocols.split(',') : undefined
            };
            const opportunities = await this.sdk.discoverOpportunities(filters);
            if (opportunities.length === 0) {
                console.log((0, formatters_1.formatWarning)("No opportunities found matching your criteria"));
                return;
            }
            console.log((0, formatters_1.formatOpportunities)(opportunities));
            if (options.ai && opportunities.length > 0) {
                console.log((0, formatters_1.formatLoading)("Getting AI insights for top opportunity"));
                const topOpp = opportunities[0];
                const analysis = await this.sdk.queryDefiLens(`Should I invest in ${topOpp.protocol}?`, 'mock-address', 'aptUsd', 'liquidity', { includeAI: true });
                console.log(analysis);
            }
            console.log((0, formatters_1.formatSuccess)(`Found ${opportunities.length} opportunities`));
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Discovery failed'));
        }
    }
    async predictCommand(asset, timeframe, options) {
        console.log((0, formatters_1.formatLoading)(`Predicting ${asset} price for ${timeframe}`));
        try {
            const predictions = await this.sdk.predictPrice(asset, timeframe);
            console.log((0, formatters_1.formatPredictions)([predictions]));
            if (options.confidence) {
                console.log(chalk_1.default.bold.blue("🎯 CONFIDENCE BREAKDOWN:"));
                console.log(chalk_1.default.white(`   Technical Analysis: ${(predictions.signals.technical * 100).toFixed(1)}%`));
                console.log(chalk_1.default.white(`   Fundamental Analysis: ${(predictions.signals.fundamental * 100).toFixed(1)}%`));
                console.log(chalk_1.default.white(`   Market Sentiment: ${(predictions.signals.sentiment * 100).toFixed(1)}%`));
            }
            console.log((0, formatters_1.formatSuccess)("Prediction completed"));
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Prediction failed'));
        }
    }
    async optimizeCommand(portfolio, options) {
        console.log((0, formatters_1.formatLoading)("Optimizing portfolio"));
        try {
            let portfolioData;
            if (fs.existsSync(portfolio)) {
                const fileContent = fs.readFileSync(portfolio, 'utf8');
                portfolioData = JSON.parse(fileContent);
            }
            else {
                portfolioData = JSON.parse(portfolio);
            }
            const preferences = {
                riskTolerance: parseInt(options.riskTolerance),
                targetReturn: options.targetReturn ? parseFloat(options.targetReturn) / 100 : undefined
            };
            const optimization = await this.sdk.optimizePortfolio(portfolioData, preferences);
            console.log((0, formatters_1.formatPortfolioOptimization)(optimization));
            console.log((0, formatters_1.formatSuccess)("Portfolio optimization completed"));
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Optimization failed'));
        }
    }
    async monitorCommand(addresses, options) {
        console.log((0, formatters_1.formatLoading)(`Starting monitoring for ${addresses.length} addresses`));
        try {
            this.sdk.startMonitoring(addresses);
            if (options.alerts) {
                addresses.forEach(address => {
                    this.sdk.setSmartAlert(address, {
                        type: 'price_change',
                        threshold: 0.05,
                        callback: (alert) => {
                            console.log((0, formatters_1.formatAlert)(alert));
                        }
                    });
                });
            }
            console.log((0, formatters_1.formatSuccess)("Monitoring started"));
            console.log(chalk_1.default.yellow("Press Ctrl+C to stop monitoring\n"));
            process.stdin.resume();
            process.on('SIGINT', () => {
                console.log((0, formatters_1.formatSuccess)("Monitoring stopped"));
                process.exit(0);
            });
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Monitoring failed'));
        }
    }
    async analyzeCommand(query, options) {
        console.log((0, formatters_1.formatLoading)("Getting AI analysis"));
        try {
            const poolAddress = options.pool || 'mock-pool-address';
            const analysisType = options.type;
            const result = await this.sdk.queryDefiLens(query, poolAddress, 'aptUsd', analysisType, {
                includeAI: true,
                includePrediction: true,
                includeRisk: true
            });
            console.log(result);
            console.log((0, formatters_1.formatSuccess)("Analysis completed"));
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Analysis failed'));
        }
    }
    async demoCommand(options) {
        console.log(chalk_1.default.bold.magenta("\n🎮 Welcome to MoveMind AI Demo!\n"));
        try {
            if (options.full) {
                await this.runFullDemo();
            }
            else {
                await this.runQuickDemo();
            }
        }
        catch (error) {
            console.error((0, formatters_1.formatError)(error instanceof Error ? error.message : 'Demo failed'));
        }
    }
    async runQuickDemo() {
        console.log(chalk_1.default.bold.blue("🚀 Quick Demo - Discovering Opportunities\n"));
        console.log((0, formatters_1.formatLoading)("Discovering opportunities"));
        const opportunities = await this.sdk.discoverOpportunities({ minAPY: 15 });
        console.log((0, formatters_1.formatOpportunities)(opportunities.slice(0, 3)));
        console.log((0, formatters_1.formatLoading)("Predicting APT price"));
        const prediction = await this.sdk.predictPrice('aptUsd', '24h');
        console.log((0, formatters_1.formatPredictions)([prediction]));
        console.log((0, formatters_1.formatSuccess)("Quick demo completed! Use --full for complete demo"));
    }
    async runFullDemo() {
        console.log(chalk_1.default.bold.blue("🚀 Full Demo - All Features\n"));
        console.log(chalk_1.default.bold.yellow("1️⃣  OPPORTUNITY DISCOVERY"));
        console.log((0, formatters_1.formatLoading)("Searching for high-yield opportunities"));
        const opportunities = await this.sdk.discoverOpportunities({ minAPY: 20 });
        console.log((0, formatters_1.formatOpportunities)(opportunities));
        console.log(chalk_1.default.bold.yellow("2️⃣  PRICE PREDICTIONS"));
        console.log((0, formatters_1.formatLoading)("Predicting asset prices"));
        const predictions = await Promise.all([
            this.sdk.predictPrice('aptUsd', '24h'),
            this.sdk.predictPrice('btcUsd', '24h')
        ]);
        console.log((0, formatters_1.formatPredictions)(predictions));
        console.log(chalk_1.default.bold.yellow("3️⃣  PORTFOLIO OPTIMIZATION"));
        console.log((0, formatters_1.formatLoading)("Optimizing sample portfolio"));
        const mockPortfolio = { 'APT': 10000, 'BTC': 5000 };
        const optimization = await this.sdk.optimizePortfolio(mockPortfolio, { riskTolerance: 7 });
        console.log((0, formatters_1.formatPortfolioOptimization)(optimization));
        console.log(chalk_1.default.bold.yellow("4️⃣  AI ANALYSIS"));
        console.log((0, formatters_1.formatLoading)("Getting AI insights"));
        const analysis = await this.sdk.queryDefiLens("What are the best DeFi strategies for maximizing returns?", 'demo-pool', 'aptUsd', 'liquidity', { includeAI: true, includePrediction: true, includeRisk: true });
        console.log(analysis);
        console.log(chalk_1.default.bold.yellow("5️⃣  REAL-TIME MONITORING (5 seconds)"));
        console.log((0, formatters_1.formatLoading)("Starting monitoring demo"));
        this.sdk.startMonitoring(['demo-address-1', 'demo-address-2']);
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log((0, formatters_1.formatSuccess)("Full demo completed! 🎉"));
        console.log(chalk_1.default.cyan("Ready to revolutionize DeFi with AI? 🚀"));
    }
    loadConfig() {
        return {
            environment: (process.env.MOVEMIND_ENVIRONMENT || 'testnet'),
            openAiApiKey: process.env.OPENAI_API_KEY || '',
            verbose: false
        };
    }
}
exports.MoveMindCLI = MoveMindCLI;
async function runCLI() {
    const cli = new MoveMindCLI();
    await cli.run(process.argv);
}
if (require.main === module) {
    runCLI().catch(error => {
        console.error((0, formatters_1.formatError)(error.message));
        process.exit(1);
    });
}
//# sourceMappingURL=MoveMindCLI.js.map