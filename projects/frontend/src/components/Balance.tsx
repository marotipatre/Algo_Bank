import React, { useEffect, useState } from "react";
import algosdk from "algosdk";

const algodClient = new algosdk.Algodv2(
  "", 
  "https://testnet-api.algonode.cloud", // Testnet endpoint
  "" // No token needed for Algonode
);

export default function ShowBalance({ walletAddress }) {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const accountInfo = await algodClient.accountInformation(walletAddress).do();
      setBalance(accountInfo.amount / 1e6); // Convert microAlgos to ALGOs
    } catch (err) {
      setError("Failed to fetch balance.");
      console.error(err);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `https://testnet-idx.algonode.cloud/v2/accounts/${walletAddress}/transactions?limit=5`
      );
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      setError("Failed to fetch transactions.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;

    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchBalance(), fetchTransactions()]);
      setLoading(false);
    };

    loadData();
  }, [walletAddress]);

  if (!walletAddress) {
    return <p className="text-gray-500">Please connect your wallet to view balance.</p>;
  }

  if (loading) {
    return <p className="text-blue-500">Loading account details...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-6 rounded-2xl shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Account Overview</h2>

      <div className="mb-4">
        <p className="text-gray-600">Wallet Address:</p>
        <p className="text-sm text-gray-800 break-all">{walletAddress}</p>
      </div>

      <div className="mb-6">
        <p className="text-gray-600">Current Balance:</p>
        <p className="text-2xl font-semibold text-green-600">{balance} ALGO</p>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2 text-gray-700">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions found.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((txn) => (
              <li
                key={txn.id}
                className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
              >
                <p><strong>ID:</strong> {txn.id}</p>
                <p>
                  <strong>Type:</strong> {txn.txn.txn.type.toUpperCase()}
                </p>
                <p>
                  <strong>Amount:</strong> {txn.txn.txn.amt ? txn.txn.txn.amt / 1e6 : 0} ALGO
                </p>
                <p className="text-gray-500">
                  {new Date(txn["round-time"] * 1000).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
