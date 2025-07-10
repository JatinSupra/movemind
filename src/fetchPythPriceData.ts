import axios from "axios";

export async function fetchPythPriceData(feedId: string, apiUrl: string): Promise<number | null> {
  try {
    const response = await axios.get(`${apiUrl}?ids[]=${feedId}`);
    const priceUpdate = response.data;

    if (priceUpdate && priceUpdate.parsed && priceUpdate.parsed.length > 0) {
      const feedData = priceUpdate.parsed.find((entry: any) => entry.id === feedId);

      if (feedData && feedData.price) {
        const rawPrice = feedData.price.price;
        const exponent = feedData.price.expo;
        const humanReadablePrice = rawPrice * Math.pow(10, exponent);
        return humanReadablePrice;
      }
    }
    return null;
  } catch (err) {
    console.error("Error fetching Pyth price data:", err);
    return null;
  }
}
