// src/components/Navbar.tsx
import React from 'react'

interface NavbarProps {
  onConnectClick: () => void
  connected: boolean
}

const Navbar: React.FC<NavbarProps> = ({ onConnectClick, connected }) => {
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">AlgoBank</div>
      <button className="btn btn-outline btn-sm" onClick={onConnectClick}>
        {connected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
    </nav>
  )
}

export default Navbar
