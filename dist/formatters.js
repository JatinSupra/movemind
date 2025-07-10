"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTable = formatTable;
exports.formatError = formatError;
exports.formatAIInsights = formatAIInsights;
exports.formatOpportunities = formatOpportunities;
exports.formatPredictions = formatPredictions;
exports.formatPortfolioOptimization = formatPortfolioOptimization;
exports.formatAlert = formatAlert;
exports.formatSuccess = formatSuccess;
exports.formatLoading = formatLoading;
exports.formatWarning = formatWarning;
exports.formatHelp = formatHelp;
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
function formatTable(title, data) {
    const table = new cli_table3_1.default({
        head: [chalk_1.default.bold("📊 Metric"), chalk_1.default.bold("💎 Value")],
        colWidths: [30, 60],
        style: { head: ['cyan'], border: ['gray'] }
    });
    data.forEach((item) => {
        table.push([chalk_1.default.white(item.key), chalk_1.default.green(item.value.toString())]);
    });
    return chalk_1.default.bold.cyan(`\n🚀 ================= ${title} =================`) + "\n" +
        table.toString() + "\n" +
        chalk_1.default.bold.cyan("🚀 =====================================================\n");
}
function formatError(message) {
    return chalk_1.default.red(`\n❌ ERROR: ${message}\n`) +
        chalk_1.default.yellow(`💡 TIP: Check your API keys and network connection\n`);
}
function formatAIInsights(analysis) {
    let output = chalk_1.default.bold.blue("\n🤖 ================= AI ANALYSIS =================\n");
    if (analysis.insights && analysis.insights.length > 0) {
        output += chalk_1.default.bold.green("💡 KEY INSIGHTS:\n");
        analysis.insights.forEach((insight, index) => {
            output += chalk_1.default.white(`   ${index + 1}. ${insight}\n`);
        });
        output += "\n";
    }
    if (analysis.risk) {
        const riskColor = analysis.risk.overall < 30 ? 'green' :
            analysis.risk.overall < 70 ? 'yellow' : 'red';
        output += chalk_1.default.bold.blue("🛡️  RISK ASSESSMENT:\n");
        output += chalk_1.default[riskColor](`   Overall Risk: ${analysis.risk.overall}/100\n`);
        if (analysis.risk.warnings && analysis.risk.warnings.length > 0) {
            output += chalk_1.default.red("   ⚠️  Warnings:\n");
            analysis.risk.warnings.forEach((warning) => {
                output += chalk_1.default.red(`     • ${warning}\n`);
            });
        }
        output += "\n";
    }
    if (analysis.opportunities && analysis.opportunities.length > 0) {
        output += chalk_1.default.bold.green("🎯 OPPORTUNITIES:\n");
        analysis.opportunities.forEach((opportunity, index) => {
            output += chalk_1.default.green(`   ${index + 1}. ${opportunity}\n`);
        });
        output += "\n";
    }
    if (analysis.confidence) {
        const confidenceColor = analysis.confidence > 80 ? 'green' :
            analysis.confidence > 60 ? 'yellow' : 'red';
        output += chalk_1.default[confidenceColor](`🎯 AI Confidence: ${analysis.confidence}%\n`);
    }
    output += chalk_1.default.bold.blue("🤖 ===================================================\n");
    return output;
}
function formatOpportunities(opportunities) {
    if (opportunities.length === 0) {
        return chalk_1.default.yellow("\n🔍 No opportunities found matching your criteria.\n");
    }
    let output = chalk_1.default.bold.green(`\n🎯 ================= DISCOVERED ${opportunities.length} OPPORTUNITIES =================\n`);
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.bold("🏛️  Protocol"),
            chalk_1.default.bold("📈 APY"),
            chalk_1.default.bold("💰 TVL"),
            chalk_1.default.bold("⚡ Risk"),
            chalk_1.default.bold("🤖 AI Score")
        ],
        colWidths: [15, 10, 15, 10, 12],
        style: { head: ['cyan'], border: ['gray'] }
    });
    opportunities.forEach((opp) => {
        const riskColor = opp.risk === 'low' ? 'green' :
            opp.risk === 'medium' ? 'yellow' : 'red';
        const scoreColor = opp.aiScore > 85 ? 'green' :
            opp.aiScore > 70 ? 'yellow' : 'red';
        table.push([
            chalk_1.default.white(opp.protocol),
            chalk_1.default.green(`${opp.apy}%`),
            chalk_1.default.cyan(`$${(opp.tvl / 1000000).toFixed(1)}M`),
            chalk_1.default[riskColor](opp.risk.toUpperCase()),
            chalk_1.default[scoreColor](`${opp.aiScore}/100`)
        ]);
    });
    output += table.toString();
    output += chalk_1.default.bold.green("\n🎯 ====================================================\n");
    const topOpp = opportunities[0];
    output += chalk_1.default.bold.blue("🏆 TOP RECOMMENDATION:\n");
    output += chalk_1.default.white(`   ${topOpp.protocol} - ${topOpp.reasoning}\n\n`);
    return output;
}
function formatPredictions(predictions) {
    if (predictions.length === 0) {
        return chalk_1.default.yellow("\n🔮 No predictions available.\n");
    }
    let output = chalk_1.default.bold.magenta(`\n🔮 ================= PRICE PREDICTIONS =================\n`);
    predictions.forEach((pred) => {
        const changePercent = ((pred.predictedPrice - pred.currentPrice) / pred.currentPrice * 100);
        const trend = changePercent > 0 ? "📈" : "📉";
        const changeColor = changePercent > 0 ? 'green' : 'red';
        output += chalk_1.default.bold.white(`${trend} ${pred.asset.toUpperCase()} (${pred.timeframe}):\n`);
        output += chalk_1.default.gray(`   Current: $${pred.currentPrice.toFixed(4)}\n`);
        output += chalk_1.default.white(`   Predicted: $${pred.predictedPrice.toFixed(4)} `);
        output += chalk_1.default[changeColor](`(${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)\n`);
        output += chalk_1.default.blue(`   Confidence: ${pred.confidence}%\n`);
        output += chalk_1.default.gray(`   Reasoning: ${pred.reasoning}\n\n`);
    });
    output += chalk_1.default.bold.magenta("🔮 =====================================================\n");
    return output;
}
function formatPortfolioOptimization(optimization) {
    let output = chalk_1.default.bold.blue("\n💼 ================= PORTFOLIO OPTIMIZATION =================\n");
    output += chalk_1.default.bold.white("📊 CURRENT PORTFOLIO:\n");
    output += chalk_1.default.gray(`   Total Value: $${optimization.currentValue.toLocaleString()}\n\n`);
    output += chalk_1.default.bold.green("🎯 OPTIMIZED ALLOCATION:\n");
    Object.entries(optimization.suggestedAllocation).forEach(([asset, value]) => {
        const percentage = (value / optimization.currentValue * 100).toFixed(1);
        output += chalk_1.default.white(`   ${asset}: $${value.toLocaleString()} (${percentage}%)\n`);
    });
    output += chalk_1.default.bold.yellow(`\n📈 Expected Return: ${(optimization.expectedReturn * 100).toFixed(1)}%\n`);
    output += chalk_1.default.bold.blue(`🛡️  Risk Score: ${optimization.riskScore}/10\n\n`);
    if (optimization.actions && optimization.actions.length > 0) {
        output += chalk_1.default.bold.cyan("🎬 RECOMMENDED ACTIONS:\n");
        optimization.actions.forEach((action, index) => {
            const actionColor = action.type === 'buy' ? 'green' :
                action.type === 'sell' ? 'red' : 'yellow';
            output += chalk_1.default[actionColor](`   ${index + 1}. ${action.type.toUpperCase()} ${action.amount} ${action.asset}\n`);
            output += chalk_1.default.gray(`      Reason: ${action.reason}\n`);
        });
    }
    output += chalk_1.default.bold.blue("\n💼 =========================================================\n");
    return output;
}
function formatAlert(alert) {
    const severityEmoji = {
        low: "🔵", medium: "🟡", high: "🔴", critical: "🚨"
    };
    const emoji = severityEmoji[alert.severity] || "📢";
    return chalk_1.default.bold.yellow(`${emoji} ALERT: ${alert.message}\n`) +
        chalk_1.default.gray(`   Address: ${alert.address}\n`) +
        chalk_1.default.gray(`   Time: ${new Date(alert.timestamp || Date.now()).toLocaleString()}\n`);
}
function formatSuccess(message) {
    return chalk_1.default.green(`✅ ${message}\n`);
}
function formatLoading(message) {
    return chalk_1.default.blue(`⏳ ${message}...`);
}
function formatWarning(message) {
    return chalk_1.default.yellow(`⚠️  WARNING: ${message}\n`);
}
function formatHelp() {
    return chalk_1.default.bold.cyan(`
🚀 MoveMind AI - Aptos DeFi Intelligence Platform

COMMANDS:
  ${chalk_1.default.green('discover')}     Find DeFi opportunities
  ${chalk_1.default.green('predict')}      Predict asset prices  
  ${chalk_1.default.green('optimize')}     Optimize portfolio
  ${chalk_1.default.green('monitor')}      Start monitoring
  ${chalk_1.default.green('analyze')}      Get AI analysis

EXAMPLES:
  ${chalk_1.default.yellow('movemind discover --min-apy 20 --max-risk medium')}
  ${chalk_1.default.yellow('movemind predict APT 24h')}
  ${chalk_1.default.yellow('movemind optimize portfolio.json')}
  ${chalk_1.default.yellow('movemind monitor 0x123... --alerts')}

OPTIONS:
  ${chalk_1.default.blue('--help, -h')}        Show help
  ${chalk_1.default.blue('--version, -v')}     Show version
  ${chalk_1.default.blue('--ai')}              Enable AI analysis
  ${chalk_1.default.blue('--verbose')}         Verbose output

For more info: ${chalk_1.default.cyan('https://movemind.ai/docs')}
`);
}
//# sourceMappingURL=formatters.js.map