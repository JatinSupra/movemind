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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = exports.version = exports.defiLens = void 0;
exports.quickStart = quickStart;
__exportStar(require("./MoveMindSDK"), exports);
__exportStar(require("./formatters"), exports);
__exportStar(require("./cli/MoveMindCLI"), exports);
// Re-export original classes for backward compatibility
var MoveMindSDK_1 = require("./MoveMindSDK");
Object.defineProperty(exports, "defiLens", { enumerable: true, get: function () { return MoveMindSDK_1.MoveMindSDK; } });
exports.version = "1.0.0";
exports.name = "MoveMind AI SDK";
function quickStart(environment = 'testnet', openAiApiKey) {
    const { MoveMindSDK } = require('./MoveMindSDK');
    return new MoveMindSDK(environment, { openAiApiKey });
}
//# sourceMappingURL=index.js.map