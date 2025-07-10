"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPythPriceData = fetchPythPriceData;
const axios_1 = __importDefault(require("axios"));
async function fetchPythPriceData(feedId, apiUrl) {
    try {
        const response = await axios_1.default.get(`${apiUrl}?ids[]=${feedId}`);
        const priceUpdate = response.data;
        if (priceUpdate && priceUpdate.parsed && priceUpdate.parsed.length > 0) {
            const feedData = priceUpdate.parsed.find((entry) => entry.id === feedId);
            if (feedData && feedData.price) {
                const rawPrice = feedData.price.price;
                const exponent = feedData.price.expo;
                const humanReadablePrice = rawPrice * Math.pow(10, exponent);
                return humanReadablePrice;
            }
        }
        return null;
    }
    catch (err) {
        console.error("Error fetching Pyth price data:", err);
        return null;
    }
}
//# sourceMappingURL=fetchPythPriceData.js.map