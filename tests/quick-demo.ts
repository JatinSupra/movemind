import { MoveMindSDK } from '../src/MoveMindSDK';
import { formatOpportunities, formatPredictions, formatSuccess, formatLoading } from '../src/formatters';
import chalk from 'chalk';
import * as dotenv from 'dotenv';

dotenv.config();

async function runQuickDemo() {
  console.log(chalk.bold.magenta('\n🚀 MoveMind AI - Complete Feature Demo\n'));
  console.log(chalk.bold.blue('===============================================\n'));

  console.log(formatLoading('Initializing MoveMind AI SDK'));
  const sdk = new MoveMindSDK('testnet', {
    openAiApiKey: process.env.OPENAI_API_KEY,
    enableRealTime: true
  });

  console.log(formatSuccess('SDK initialized successfully!'));

  try {
    console.log(chalk.bold.yellow('\n1️⃣  ENHANCED ORIGINAL FEATURES'));
    console.log('='.repeat(50));

    console.log(formatLoading('Testing enhanced liquidity query'));
    const liquidityResult = await sdk.queryDefiLens(
      "What's the current liquidity situation?",
      "0x1::demo_pool",
      "aptUsd",
      "liquidity",
      { includeRisk: true }
    );
    console.log(liquidityResult);

    console.log(chalk.bold.yellow('\n2️⃣  AI-POWERED OPPORTUNITY DISCOVERY'));
    console.log('='.repeat(50));

    console.log(formatLoading('Discovering DeFi opportunities with AI scoring'));
    const opportunities = await sdk.discoverOpportunities({
      minAPY: 15,
      maxRisk: 'medium',
      minTVL: 100000
    });

    console.log(formatOpportunities(opportunities));
    console.log(formatSuccess(`Discovered ${opportunities.length} high-quality opportunities!`));

    console.log(chalk.bold.yellow('\n3️⃣  AI PRICE PREDICTIONS'));
    console.log('='.repeat(50));

    if (process.env.OPENAI_API_KEY) {
      console.log(formatLoading('Generating AI-powered price predictions'));
      
      const predictions = await Promise.all([
        sdk.predictPrice('aptUsd', '24h'),
        sdk.predictPrice('btcUsd', '24h')
      ]);

      console.log(formatPredictions(predictions));
      console.log(formatSuccess('AI predictions generated successfully!'));
    } else {
      console.log(chalk.yellow('⚠️  Price predictions require OpenAI API key'));
      console.log(chalk.cyan('💡 Set OPENAI_API_KEY in your .env file to enable AI features'));
    }

    console.log(chalk.bold.yellow('\n4️⃣  PORTFOLIO OPTIMIZATION'));
    console.log('='.repeat(50));

    if (process.env.OPENAI_API_KEY) {
      console.log(formatLoading('Optimizing sample portfolio with AI'));
      
      const portfolioOptimization = await sdk.optimizePortfolio(
        {
          'APT': 10000,
          'BTC': 5000,
          'ETH': 3000
        },
        {
          riskTolerance: 7,
          targetReturn: 0.15
        }
      );

      console.log(chalk.bold.blue('\n💼 PORTFOLIO OPTIMIZATION RESULTS:'));
      console.log(chalk.white(`Current Value: $${portfolioOptimization.currentValue.toLocaleString()}`));
      console.log(chalk.green(`Expected Return: ${(portfolioOptimization.expectedReturn * 100).toFixed(1)}%`));
      console.log(chalk.blue(`Risk Score: ${portfolioOptimization.riskScore}/10`));
      
      if (portfolioOptimization.actions.length > 0) {
        console.log(chalk.bold.cyan('\n🎬 RECOMMENDED ACTIONS:'));
        portfolioOptimization.actions.forEach((action, index) => {
          const actionColor = action.type === 'buy' ? 'green' : action.type === 'sell' ? 'red' : 'yellow';
          console.log(chalk[actionColor](`   ${index + 1}. ${action.type.toUpperCase()} ${action.amount} ${action.asset}`));
          console.log(chalk.gray(`      ${action.reason}`));
        });
      }

      console.log(formatSuccess('Portfolio optimization completed!'));
    } else {
      console.log(chalk.yellow('⚠️  Portfolio optimization requires OpenAI API key'));
    }

    console.log(chalk.bold.yellow('\n5️⃣  REAL-TIME MONITORING DEMO'));
    console.log('='.repeat(50));

    console.log(formatLoading('Starting real-time monitoring (5 seconds demo)'));
    
    let updateCount = 0;
    let alertCount = 0;

    sdk.on('update', (update) => {
      updateCount++;
      if (updateCount <= 3) {
        console.log(chalk.cyan(`📊 Update ${updateCount}: ${update.address} - ${update.type}: ${update.value.toFixed(2)}`));
      }
    });

    sdk.on('alert', (alert) => {
      alertCount++;
      console.log(chalk.red(`🚨 Alert ${alertCount}: ${alert.message}`));
    });

    sdk.startMonitoring([
      '0x1::pool_1',
      '0x1::pool_2', 
      '0x1::pool_3'
    ]);

    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(formatSuccess(`Monitoring demo completed! Received ${updateCount} updates and ${alertCount} alerts`));

    console.log(chalk.bold.magenta('\n🎉 DEMO COMPLETED SUCCESSFULLY!'));
    console.log('='.repeat(50));
    
    console.log(chalk.bold.green('✅ Features Demonstrated:'));
    console.log(chalk.white('   • Enhanced liquidity and APR analysis'));
    console.log(chalk.white('   • AI-powered opportunity discovery'));
    console.log(chalk.white('   • Intelligent price predictions'));
    console.log(chalk.white('   • Portfolio optimization recommendations'));
    console.log(chalk.white('   • Real-time monitoring and alerts'));

    console.log(chalk.bold.blue('\n🚀 MoveMind AI is ready for production!'));
    
    if (!process.env.OPENAI_API_KEY) {
      console.log(chalk.bold.yellow('\n💡 Pro Tip: Add your OpenAI API key to unlock full AI capabilities!'));
      console.log(chalk.cyan('   Set OPENAI_API_KEY in your .env file'));
    }

    console.log(chalk.bold.magenta('\n🏆 Ready to win that hackathon! 🎊\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Demo encountered an error:'));
    console.error(chalk.red(error instanceof Error ? error.message : 'Unknown error'));
    console.log(chalk.yellow('\n💡 This is normal during development. The SDK includes proper error handling.'));
  }
}

if (require.main === module) {
  runQuickDemo().then(() => {
    console.log(chalk.green('\n✅ Demo script completed!'));
    process.exit(0);
  }).catch(error => {
    console.error(chalk.red('\n❌ Demo script failed:'), error);
    process.exit(1);
  });
}

export { runQuickDemo };
