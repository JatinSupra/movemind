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
exports.runQuickDemo = runQuickDemo;
const MoveMindSDK_1 = require("../src/MoveMindSDK");
const formatters_1 = require("../src/formatters");
const chalk_1 = __importDefault(require("chalk"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function runQuickDemo() {
    console.log(chalk_1.default.bold.magenta('\n🚀 MoveMind AI - Complete Feature Demo\n'));
    console.log(chalk_1.default.bold.blue('===============================================\n'));
    console.log((0, formatters_1.formatLoading)('Initializing MoveMind AI SDK'));
    const sdk = new MoveMindSDK_1.MoveMindSDK('testnet', {
        openAiApiKey: process.env.OPENAI_API_KEY,
        enableRealTime: true
    });
    console.log((0, formatters_1.formatSuccess)('SDK initialized successfully!'));
    try {
        console.log(chalk_1.default.bold.yellow('\n1️⃣  ENHANCED ORIGINAL FEATURES'));
        console.log('='.repeat(50));
        console.log((0, formatters_1.formatLoading)('Testing enhanced liquidity query'));
        const liquidityResult = await sdk.queryDefiLens("What's the current liquidity situation?", "0x1::demo_pool", "aptUsd", "liquidity", { includeRisk: true });
        console.log(liquidityResult);
        console.log(chalk_1.default.bold.yellow('\n2️⃣  AI-POWERED OPPORTUNITY DISCOVERY'));
        console.log('='.repeat(50));
        console.log((0, formatters_1.formatLoading)('Discovering DeFi opportunities with AI scoring'));
        const opportunities = await sdk.discoverOpportunities({
            minAPY: 15,
            maxRisk: 'medium',
            minTVL: 100000
        });
        console.log((0, formatters_1.formatOpportunities)(opportunities));
        console.log((0, formatters_1.formatSuccess)(`Discovered ${opportunities.length} high-quality opportunities!`));
        console.log(chalk_1.default.bold.yellow('\n3️⃣  AI PRICE PREDICTIONS'));
        console.log('='.repeat(50));
        if (process.env.OPENAI_API_KEY) {
            console.log((0, formatters_1.formatLoading)('Generating AI-powered price predictions'));
            const predictions = await Promise.all([
                sdk.predictPrice('aptUsd', '24h'),
                sdk.predictPrice('btcUsd', '24h')
            ]);
            console.log((0, formatters_1.formatPredictions)(predictions));
            console.log((0, formatters_1.formatSuccess)('AI predictions generated successfully!'));
        }
        else {
            console.log(chalk_1.default.yellow('⚠️  Price predictions require OpenAI API key'));
            console.log(chalk_1.default.cyan('💡 Set OPENAI_API_KEY in your .env file to enable AI features'));
        }
        console.log(chalk_1.default.bold.yellow('\n4️⃣  PORTFOLIO OPTIMIZATION'));
        console.log('='.repeat(50));
        if (process.env.OPENAI_API_KEY) {
            console.log((0, formatters_1.formatLoading)('Optimizing sample portfolio with AI'));
            const portfolioOptimization = await sdk.optimizePortfolio({
                'APT': 10000,
                'BTC': 5000,
                'ETH': 3000
            }, {
                riskTolerance: 7,
                targetReturn: 0.15
            });
            console.log(chalk_1.default.bold.blue('\n💼 PORTFOLIO OPTIMIZATION RESULTS:'));
            console.log(chalk_1.default.white(`Current Value: $${portfolioOptimization.currentValue.toLocaleString()}`));
            console.log(chalk_1.default.green(`Expected Return: ${(portfolioOptimization.expectedReturn * 100).toFixed(1)}%`));
            console.log(chalk_1.default.blue(`Risk Score: ${portfolioOptimization.riskScore}/10`));
            if (portfolioOptimization.actions.length > 0) {
                console.log(chalk_1.default.bold.cyan('\n🎬 RECOMMENDED ACTIONS:'));
                portfolioOptimization.actions.forEach((action, index) => {
                    const actionColor = action.type === 'buy' ? 'green' : action.type === 'sell' ? 'red' : 'yellow';
                    console.log(chalk_1.default[actionColor](`   ${index + 1}. ${action.type.toUpperCase()} ${action.amount} ${action.asset}`));
                    console.log(chalk_1.default.gray(`      ${action.reason}`));
                });
            }
            console.log((0, formatters_1.formatSuccess)('Portfolio optimization completed!'));
        }
        else {
            console.log(chalk_1.default.yellow('⚠️  Portfolio optimization requires OpenAI API key'));
        }
        console.log(chalk_1.default.bold.yellow('\n5️⃣  REAL-TIME MONITORING DEMO'));
        console.log('='.repeat(50));
        console.log((0, formatters_1.formatLoading)('Starting real-time monitoring (5 seconds demo)'));
        let updateCount = 0;
        let alertCount = 0;
        sdk.on('update', (update) => {
            updateCount++;
            if (updateCount <= 3) {
                console.log(chalk_1.default.cyan(`📊 Update ${updateCount}: ${update.address} - ${update.type}: ${update.value.toFixed(2)}`));
            }
        });
        sdk.on('alert', (alert) => {
            alertCount++;
            console.log(chalk_1.default.red(`🚨 Alert ${alertCount}: ${alert.message}`));
        });
        sdk.startMonitoring([
            '0x1::pool_1',
            '0x1::pool_2',
            '0x1::pool_3'
        ]);
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log((0, formatters_1.formatSuccess)(`Monitoring demo completed! Received ${updateCount} updates and ${alertCount} alerts`));
        console.log(chalk_1.default.bold.magenta('\n🎉 DEMO COMPLETED SUCCESSFULLY!'));
        console.log('='.repeat(50));
        console.log(chalk_1.default.bold.green('✅ Features Demonstrated:'));
        console.log(chalk_1.default.white('   • Enhanced liquidity and APR analysis'));
        console.log(chalk_1.default.white('   • AI-powered opportunity discovery'));
        console.log(chalk_1.default.white('   • Intelligent price predictions'));
        console.log(chalk_1.default.white('   • Portfolio optimization recommendations'));
        console.log(chalk_1.default.white('   • Real-time monitoring and alerts'));
        console.log(chalk_1.default.bold.blue('\n🚀 MoveMind AI is ready for production!'));
        if (!process.env.OPENAI_API_KEY) {
            console.log(chalk_1.default.bold.yellow('\n💡 Pro Tip: Add your OpenAI API key to unlock full AI capabilities!'));
            console.log(chalk_1.default.cyan('   Set OPENAI_API_KEY in your .env file'));
        }
        console.log(chalk_1.default.bold.magenta('\n🏆 Ready to win that hackathon! 🎊\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n❌ Demo encountered an error:'));
        console.error(chalk_1.default.red(error instanceof Error ? error.message : 'Unknown error'));
        console.log(chalk_1.default.yellow('\n💡 This is normal during development. The SDK includes proper error handling.'));
    }
}
if (require.main === module) {
    runQuickDemo().then(() => {
        console.log(chalk_1.default.green('\n✅ Demo script completed!'));
        process.exit(0);
    }).catch(error => {
        console.error(chalk_1.default.red('\n❌ Demo script failed:'), error);
        process.exit(1);
    });
}
//# sourceMappingURL=quick-demo.js.map