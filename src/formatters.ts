import Table from "cli-table3";
import chalk from "chalk";

export function formatTable(title: string, data: Array<{ key: string; value: string | number }>): string {
  const table = new Table({
    head: [chalk.bold("📊 Metric"), chalk.bold("💎 Value")],
    colWidths: [30, 60],
    style: { head: ['cyan'], border: ['gray'] }
  });

  data.forEach((item) => {
    table.push([chalk.white(item.key), chalk.green(item.value.toString())]);
  });

  return chalk.bold.cyan(`\n🚀 ================= ${title} =================`) + "\n" + 
         table.toString() + "\n" + 
         chalk.bold.cyan("🚀 =====================================================\n");
}

export function formatError(message: string): string {
  return chalk.red(`\n❌ ERROR: ${message}\n`) + 
         chalk.yellow(`💡 TIP: Check your API keys and network connection\n`);
}

export function formatAIInsights(analysis: any): string {
  let output = chalk.bold.blue("\n🤖 ================= AI ANALYSIS =================\n");

  if (analysis.insights && analysis.insights.length > 0) {
    output += chalk.bold.green("💡 KEY INSIGHTS:\n");
    analysis.insights.forEach((insight: string, index: number) => {
      output += chalk.white(`   ${index + 1}. ${insight}\n`);
    });
    output += "\n";
  }

  if (analysis.risk) {
    const riskColor = analysis.risk.overall < 30 ? 'green' : 
                     analysis.risk.overall < 70 ? 'yellow' : 'red';
    
    output += chalk.bold.blue("🛡️  RISK ASSESSMENT:\n");
    output += chalk[riskColor](`   Overall Risk: ${analysis.risk.overall}/100\n`);
    
    if (analysis.risk.warnings && analysis.risk.warnings.length > 0) {
      output += chalk.red("   ⚠️  Warnings:\n");
      analysis.risk.warnings.forEach((warning: string) => {
        output += chalk.red(`     • ${warning}\n`);
      });
    }
    output += "\n";
  }

  if (analysis.opportunities && analysis.opportunities.length > 0) {
    output += chalk.bold.green("🎯 OPPORTUNITIES:\n");
    analysis.opportunities.forEach((opportunity: string, index: number) => {
      output += chalk.green(`   ${index + 1}. ${opportunity}\n`);
    });
    output += "\n";
  }

  if (analysis.confidence) {
    const confidenceColor = analysis.confidence > 80 ? 'green' : 
                           analysis.confidence > 60 ? 'yellow' : 'red';
    output += chalk[confidenceColor](`🎯 AI Confidence: ${analysis.confidence}%\n`);
  }

  output += chalk.bold.blue("🤖 ===================================================\n");
  return output;
}

export function formatOpportunities(opportunities: any[]): string {
  if (opportunities.length === 0) {
    return chalk.yellow("\n🔍 No opportunities found matching your criteria.\n");
  }

  let output = chalk.bold.green(`\n🎯 ================= DISCOVERED ${opportunities.length} OPPORTUNITIES =================\n`);

  const table = new Table({
    head: [
      chalk.bold("🏛️  Protocol"),
      chalk.bold("📈 APY"),
      chalk.bold("💰 TVL"),
      chalk.bold("⚡ Risk"),
      chalk.bold("🤖 AI Score")
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
      chalk.white(opp.protocol),
      chalk.green(`${opp.apy}%`),
      chalk.cyan(`$${(opp.tvl / 1000000).toFixed(1)}M`),
      chalk[riskColor](opp.risk.toUpperCase()),
      chalk[scoreColor](`${opp.aiScore}/100`)
    ]);
  });

  output += table.toString();
  output += chalk.bold.green("\n🎯 ====================================================\n");

  const topOpp = opportunities[0];
  output += chalk.bold.blue("🏆 TOP RECOMMENDATION:\n");
  output += chalk.white(`   ${topOpp.protocol} - ${topOpp.reasoning}\n\n`);

  return output;
}

export function formatPredictions(predictions: any[]): string {
  if (predictions.length === 0) {
    return chalk.yellow("\n🔮 No predictions available.\n");
  }

  let output = chalk.bold.magenta(`\n🔮 ================= PRICE PREDICTIONS =================\n`);

  predictions.forEach((pred) => {
    const changePercent = ((pred.predictedPrice - pred.currentPrice) / pred.currentPrice * 100);
    const trend = changePercent > 0 ? "📈" : "📉";
    const changeColor = changePercent > 0 ? 'green' : 'red';
    
    output += chalk.bold.white(`${trend} ${pred.asset.toUpperCase()} (${pred.timeframe}):\n`);
    output += chalk.gray(`   Current: $${pred.currentPrice.toFixed(4)}\n`);
    output += chalk.white(`   Predicted: $${pred.predictedPrice.toFixed(4)} `);
    output += chalk[changeColor](`(${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)\n`);
    output += chalk.blue(`   Confidence: ${pred.confidence}%\n`);
    output += chalk.gray(`   Reasoning: ${pred.reasoning}\n\n`);
  });

  output += chalk.bold.magenta("🔮 =====================================================\n");
  return output;
}

export function formatPortfolioOptimization(optimization: any): string {
  let output = chalk.bold.blue("\n💼 ================= PORTFOLIO OPTIMIZATION =================\n");

  output += chalk.bold.white("📊 CURRENT PORTFOLIO:\n");
  output += chalk.gray(`   Total Value: $${optimization.currentValue.toLocaleString()}\n\n`);

  output += chalk.bold.green("🎯 OPTIMIZED ALLOCATION:\n");
  Object.entries(optimization.suggestedAllocation).forEach(([asset, value]) => {
    const percentage = ((value as number) / optimization.currentValue * 100).toFixed(1);
    output += chalk.white(`   ${asset}: $${(value as number).toLocaleString()} (${percentage}%)\n`);
  });

  output += chalk.bold.yellow(`\n📈 Expected Return: ${(optimization.expectedReturn * 100).toFixed(1)}%\n`);
  output += chalk.bold.blue(`🛡️  Risk Score: ${optimization.riskScore}/10\n\n`);

  if (optimization.actions && optimization.actions.length > 0) {
    output += chalk.bold.cyan("🎬 RECOMMENDED ACTIONS:\n");
    optimization.actions.forEach((action: any, index: number) => {
      const actionColor = action.type === 'buy' ? 'green' : 
                         action.type === 'sell' ? 'red' : 'yellow';
      
      output += chalk[actionColor](`   ${index + 1}. ${action.type.toUpperCase()} ${action.amount} ${action.asset}\n`);
      output += chalk.gray(`      Reason: ${action.reason}\n`);
    });
  }

  output += chalk.bold.blue("\n💼 =========================================================\n");
  return output;
}

export function formatAlert(alert: any): string {
  const severityEmoji = {
    low: "🔵", medium: "🟡", high: "🔴", critical: "🚨"
  };

  const emoji = severityEmoji[alert.severity as keyof typeof severityEmoji] || "📢";
  
  return chalk.bold.yellow(`${emoji} ALERT: ${alert.message}\n`) +
         chalk.gray(`   Address: ${alert.address}\n`) +
         chalk.gray(`   Time: ${new Date(alert.timestamp || Date.now()).toLocaleString()}\n`);
}

export function formatSuccess(message: string): string {
  return chalk.green(`✅ ${message}\n`);
}

export function formatLoading(message: string): string {
  return chalk.blue(`⏳ ${message}...`);
}

export function formatWarning(message: string): string {
  return chalk.yellow(`⚠️  WARNING: ${message}\n`);
}

export function formatHelp(): string {
  return chalk.bold.cyan(`
🚀 MoveMind AI - Aptos DeFi Intelligence Platform

COMMANDS:
  ${chalk.green('discover')}     Find DeFi opportunities
  ${chalk.green('predict')}      Predict asset prices  
  ${chalk.green('optimize')}     Optimize portfolio
  ${chalk.green('monitor')}      Start monitoring
  ${chalk.green('analyze')}      Get AI analysis

EXAMPLES:
  ${chalk.yellow('movemind discover --min-apy 20 --max-risk medium')}
  ${chalk.yellow('movemind predict APT 24h')}
  ${chalk.yellow('movemind optimize portfolio.json')}
  ${chalk.yellow('movemind monitor 0x123... --alerts')}

OPTIONS:
  ${chalk.blue('--help, -h')}        Show help
  ${chalk.blue('--version, -v')}     Show version
  ${chalk.blue('--ai')}              Enable AI analysis
  ${chalk.blue('--verbose')}         Verbose output

For more info: ${chalk.cyan('https://movemind.ai/docs')}
`);
}
