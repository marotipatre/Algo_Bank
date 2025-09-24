import { indexerClient } from "./algorandClient";

// Fetch recent transactions
export const getRecentTransactions = async (walletAddress, limit = 5) => {
  if (!walletAddress) throw new Error("Wallet address is required");

  try {
    const response = await indexerClient
      .searchForTransactions()
      .address(walletAddress)
      .limit(limit)
      .do();

    return response.transactions || [];
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch recent transactions");
  }
};
