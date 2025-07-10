export const CONFIG = {
  testnet: {
    aptosRpcUrl: "https://api.testnet.aptoslabs.com/v1",
    pythApiUrl: "https://hermes.pyth.network/v2/updates/price/latest",
    priceFeedIds: {
      aptUsd: "03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
      btcUsd: "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
    },
  },
  mainnet: {
    aptosRpcUrl: "https://api.mainnet.aptoslabs.com/v1",
    pythApiUrl: "https://hermes.pyth.network/v2/updates/price/latest",
    priceFeedIds: {
      aptUsd: "03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
      btcUsd: "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
    },
  },
};
