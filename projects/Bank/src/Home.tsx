// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import Navbar from './components/Navbar'
import AccountCard from './components/AccountCard'
import QuickActions from './components/QuickActions'


const Home: React.FC = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)
  const toggleDemoModal = () => setOpenDemoModal(!openDemoModal)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-semibold text-blue-600">AlgoBank</div>
        <div className="flex gap-4">
          <button className="btn btn-outline btn-sm" onClick={toggleWalletModal}>
            {activeAddress ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="p-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Account Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-600">Wallet Address</h3>
            <p className="mt-2 text-sm break-words text-gray-800">
              {activeAddress || 'Not connected'}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-600">Total Balance</h3>
            <p className="mt-2 text-xl font-semibold text-green-600">ALGO 0.00</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-gray-600">Recent Activity</h3>
            <p className="mt-2 text-sm text-gray-500">No recent transactions</p>
          </div>
        </div>

        {/* Actions */}
        {activeAddress && (
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary" onClick={toggleDemoModal}>
                Make Transaction
              </button>
              <a
                className="btn btn-outline"
                href="https://github.com/algorandfoundation/algokit-cli"
                target="_blank"
              >
                AlgoKit Docs
              </a>
            </div>
          </div>
        )}

        <Navbar onConnectClick={toggleWalletModal} connected={!!activeAddress} />

<AccountCard title="Wallet Address" content={activeAddress || 'Not connected'} />
<AccountCard title="Total Balance" content="ALGO 0.00" highlight />
<AccountCard title="Recent Activity" content="No recent transactions" />

{activeAddress && <QuickActions onTransactionClick={toggleDemoModal} />}
      </main>

      {/* Modals */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
    </div>
  )
}

export default Home
