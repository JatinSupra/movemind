import axios from "axios";

const APTOS_RPC_URL = "https://api.testnet.aptoslabs.com/v1"; 

export async function fetchAptosAccountData(address: string): Promise<any> {
  try {
    const response = await axios.get(`${APTOS_RPC_URL}/accounts/${address}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching Aptos account data:", (err as Error).message);
    throw err;
  }
}

export async function fetchAptosTransactions(address: string): Promise<any> {
  try {
    const response = await axios.get(`${APTOS_RPC_URL}/accounts/${address}/transactions`);
    return response.data;
  } catch (err) {
    console.error("Error fetching Aptos transactions:", (err as Error).message);
    throw err;
  }
}
