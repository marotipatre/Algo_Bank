// src/components/QuickActions.tsx
import React from 'react'

interface QuickActionsProps {
  onTransactionClick: () => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onTransactionClick }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Quick Actions</h3>
      <div className="flex flex-wrap gap-4">
        <button className="btn btn-primary" onClick={onTransactionClick}>
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
  )
}

export default QuickActions
