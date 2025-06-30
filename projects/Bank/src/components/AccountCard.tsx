// src/components/AccountCard.tsx
import React from 'react'

interface AccountCardProps {
  title: string
  content: React.ReactNode
  highlight?: boolean
}

const AccountCard: React.FC<AccountCardProps> = ({ title, content, highlight = false }) => {
  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h3 className="text-gray-600">{title}</h3>
      <div className={`mt-2 ${highlight ? 'text-xl font-semibold text-green-600' : 'text-sm text-gray-800'}`}>
        {content}
      </div>
    </div>
  )
}

export default AccountCard
