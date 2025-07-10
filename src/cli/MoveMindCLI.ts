import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables

import { Command } from 'commander';
import { MoveMindSDK, AlertData } from '../MoveMindSDK';
import { 
  formatOpportunities, 
  formatPredictions, 
  formatPortfolioOptimization,
  formatAlert,
  formatHelp,
  formatSuccess,
  formatError,
  formatLoading,
  formatWarning
} from '../formatters';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';

export class MoveMindCLI {
  private sdk!: MoveMindSDK;
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommands();
  }

  async init(): Promise<void> {
    const config = this.loadConfig();
    
    this.sdk = new MoveMindSDK(config.environment, {
      openAiApiKey: config.openAiApiKey,
      enableRealTime: true
    });

    this.sdk.on('alert', (alert: AlertData) => {
      console.log(formatAlert(alert));
    });

    this.sdk.on('update', (update: any) => {
      if (config.verbose) {
        console.log(`📡 ${update.address}: ${update.type} = ${update.value}`);
      }
    });
  }

  private setupCommands(): void {
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
        console.log(formatHelp());
      });
  }

  async run(argv: string[]): Promise<void> {
    try {
      await this.init();
      await this.program.parseAsync(argv);
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  }

  private async discoverCommand(options: any): Promise<void> {
    console.log(formatLoading("Discovering DeFi opportunities"));

    try {
      const filters = {
        minAPY: parseFloat(options.minApy),
        maxRisk: options.maxRisk as 'low' | 'medium' | 'high',
        minTVL: parseFloat(options.minTvl),
        protocols: options.protocols ? options.protocols.split(',') : undefined
      };

      const opportunities = await this.sdk.discoverOpportunities(filters);
      
      if (opportunities.length === 0) {
        console.log(formatWarning("No opportunities found matching your criteria"));
        return;
      }

      console.log(formatOpportunities(opportunities));
      
      if (options.ai && opportunities.length > 0) {
        console.log(formatLoading("Getting AI insights for top opportunity"));
        
        const topOpp = opportunities[0];
        const analysis = await this.sdk.queryDefiLens(
          `Should I invest in ${topOpp.protocol}?`,
          'mock-address',
          'aptUsd',
          'liquidity',
          { includeAI: true }
        );
        
        console.log(analysis);
      }

      console.log(formatSuccess(`Found ${opportunities.length} opportunities`));
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Discovery failed'));
    }
  }

  private async predictCommand(asset: string, timeframe: string, options: any): Promise<void> {
    console.log(formatLoading(`Predicting ${asset} price for ${timeframe}`));

    try {
      const predictions = await this.sdk.predictPrice(asset, timeframe);
      console.log(formatPredictions([predictions]));
      
      if (options.confidence) {
        console.log(chalk.bold.blue("🎯 CONFIDENCE BREAKDOWN:"));
        console.log(chalk.white(`   Technical Analysis: ${(predictions.signals.technical * 100).toFixed(1)}%`));
        console.log(chalk.white(`   Fundamental Analysis: ${(predictions.signals.fundamental * 100).toFixed(1)}%`));
        console.log(chalk.white(`   Market Sentiment: ${(predictions.signals.sentiment * 100).toFixed(1)}%`));
      }

      console.log(formatSuccess("Prediction completed"));
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Prediction failed'));
    }
  }

  private async optimizeCommand(portfolio: string, options: any): Promise<void> {
    console.log(formatLoading("Optimizing portfolio"));

    try {
      let portfolioData: Record<string, number>;

      if (fs.existsSync(portfolio)) {
        const fileContent = fs.readFileSync(portfolio, 'utf8');
        portfolioData = JSON.parse(fileContent);
      } else {
        portfolioData = JSON.parse(portfolio);
      }

      const preferences = {
        riskTolerance: parseInt(options.riskTolerance),
        targetReturn: options.targetReturn ? parseFloat(options.targetReturn) / 100 : undefined
      };

      const optimization = await this.sdk.optimizePortfolio(portfolioData, preferences);
      console.log(formatPortfolioOptimization(optimization));
      console.log(formatSuccess("Portfolio optimization completed"));
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Optimization failed'));
    }
  }

  private async monitorCommand(addresses: string[], options: any): Promise<void> {
    console.log(formatLoading(`Starting monitoring for ${addresses.length} addresses`));

    try {
      this.sdk.startMonitoring(addresses);
      
      if (options.alerts) {
        addresses.forEach(address => {
          this.sdk.setSmartAlert(address, {
            type: 'price_change',
            threshold: 0.05,
            callback: (alert: AlertData) => {
              console.log(formatAlert(alert));
            }
          });
        });
      }

      console.log(formatSuccess("Monitoring started"));
      console.log(chalk.yellow("Press Ctrl+C to stop monitoring\n"));

      process.stdin.resume();
      
      process.on('SIGINT', () => {
        console.log(formatSuccess("Monitoring stopped"));
        process.exit(0);
      });
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Monitoring failed'));
    }
  }

  private async analyzeCommand(query: string, options: any): Promise<void> {
    console.log(formatLoading("Getting AI analysis"));

    try {
      const poolAddress = options.pool || 'mock-pool-address';
      const analysisType = options.type as 'liquidity' | 'apr';

      const result = await this.sdk.queryDefiLens(
        query,
        poolAddress,
        'aptUsd',
        analysisType,
        { 
          includeAI: true, 
          includePrediction: true, 
          includeRisk: true 
        }
      );

      console.log(result);
      console.log(formatSuccess("Analysis completed"));
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Analysis failed'));
    }
  }

  private async demoCommand(options: any): Promise<void> {
    console.log(chalk.bold.magenta("\n🎮 Welcome to MoveMind AI Demo!\n"));

    try {
      if (options.full) {
        await this.runFullDemo();
      } else {
        await this.runQuickDemo();
      }
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : 'Demo failed'));
    }
  }

  private async runQuickDemo(): Promise<void> {
    console.log(chalk.bold.blue("🚀 Quick Demo - Discovering Opportunities\n"));
    
    console.log(formatLoading("Discovering opportunities"));
    const opportunities = await this.sdk.discoverOpportunities({ minAPY: 15 });
    console.log(formatOpportunities(opportunities.slice(0, 3)));

    console.log(formatLoading("Predicting APT price"));
    const prediction = await this.sdk.predictPrice('aptUsd', '24h');
    console.log(formatPredictions([prediction]));

    console.log(formatSuccess("Quick demo completed! Use --full for complete demo"));
  }

  private async runFullDemo(): Promise<void> {
    console.log(chalk.bold.blue("🚀 Full Demo - All Features\n"));

    console.log(chalk.bold.yellow("1️⃣  OPPORTUNITY DISCOVERY"));
    console.log(formatLoading("Searching for high-yield opportunities"));
    const opportunities = await this.sdk.discoverOpportunities({ minAPY: 20 });
    console.log(formatOpportunities(opportunities));

    console.log(chalk.bold.yellow("2️⃣  PRICE PREDICTIONS"));
    console.log(formatLoading("Predicting asset prices"));
    const predictions = await Promise.all([
      this.sdk.predictPrice('aptUsd', '24h'),
      this.sdk.predictPrice('btcUsd', '24h')
    ]);
    console.log(formatPredictions(predictions));

    console.log(chalk.bold.yellow("3️⃣  PORTFOLIO OPTIMIZATION"));
    console.log(formatLoading("Optimizing sample portfolio"));
    const mockPortfolio = { 'APT': 10000, 'BTC': 5000 };
    const optimization = await this.sdk.optimizePortfolio(mockPortfolio, { riskTolerance: 7 });
    console.log(formatPortfolioOptimization(optimization));

    console.log(chalk.bold.yellow("4️⃣  AI ANALYSIS"));
    console.log(formatLoading("Getting AI insights"));
    const analysis = await this.sdk.queryDefiLens(
      "What are the best DeFi strategies for maximizing returns?",
      'demo-pool',
      'aptUsd',
      'liquidity',
      { includeAI: true, includePrediction: true, includeRisk: true }
    );
    console.log(analysis);

    console.log(chalk.bold.yellow("5️⃣  REAL-TIME MONITORING (5 seconds)"));
    console.log(formatLoading("Starting monitoring demo"));
    this.sdk.startMonitoring(['demo-address-1', 'demo-address-2']);
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(formatSuccess("Full demo completed! 🎉"));
    console.log(chalk.cyan("Ready to revolutionize DeFi with AI? 🚀"));
  }

  private loadConfig(): any {
    return {
      environment: (process.env.MOVEMIND_ENVIRONMENT || 'testnet') as 'testnet' | 'mainnet',
      openAiApiKey: process.env.OPENAI_API_KEY || '',
      verbose: false
    };
  }
}

export async function runCLI(): Promise<void> {
  const cli = new MoveMindCLI();
  await cli.run(process.argv);
}

if (require.main === module) {
  runCLI().catch(error => {
    console.error(formatError(error.message));
    process.exit(1);
  });
}
