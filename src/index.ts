export * from "./MoveMindSDK";
export * from "./formatters";
export * from "./cli/MoveMindCLI";

// Re-export original classes for backward compatibility
export { MoveMindSDK as defiLens } from "./MoveMindSDK";

export const version = "1.0.0";
export const name = "MoveMind AI SDK";

export function quickStart(environment: 'testnet' | 'mainnet' = 'testnet', openAiApiKey?: string) {
  const { MoveMindSDK } = require('./MoveMindSDK');
  return new MoveMindSDK(environment, { openAiApiKey });
}
