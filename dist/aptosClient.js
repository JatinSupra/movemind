"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAptosAccountData = fetchAptosAccountData;
exports.fetchAptosTransactions = fetchAptosTransactions;
const axios_1 = __importDefault(require("axios"));
const APTOS_RPC_URL = "https://api.testnet.aptoslabs.com/v1";
async function fetchAptosAccountData(address) {
    try {
        const response = await axios_1.default.get(`${APTOS_RPC_URL}/accounts/${address}`);
        return response.data;
    }
    catch (err) {
        console.error("Error fetching Aptos account data:", err.message);
        throw err;
    }
}
async function fetchAptosTransactions(address) {
    try {
        const response = await axios_1.default.get(`${APTOS_RPC_URL}/accounts/${address}/transactions`);
        return response.data;
    }
    catch (err) {
        console.error("Error fetching Aptos transactions:", err.message);
        throw err;
    }
}
//# sourceMappingURL=aptosClient.js.map