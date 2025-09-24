import { algodClient } from "./algorandClient";

// Fetch account balance
export const getAccountBalance = async (walletAddress) => {
  if (!walletAddress) throw new Error("Wallet address is required");

  try {
    const accountInfo = await algodClient.accountInformation(walletAddress).do();
    return {
      address: accountInfo.address,
      balance: accountInfo.amount / 1e6, // Convert microAlgos to ALGO
    };
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw new Error("Failed to fetch account balance");
  }
};
