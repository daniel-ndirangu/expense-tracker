import { useState, memo } from 'react'
import type { Expense } from '../types/expense'
import ExpenseItem from './ExpenseItem'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export default memo(function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (expenses.length === 0) {
    return null
  }

  const displayedExpenses = isExpanded ? expenses : expenses.slice(0, 3)
  const hasMore = expenses.length > 3

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-lg font-semibold text-white">
          Expenses ({expenses.length})
        </h2>
        {hasMore && (
          <span className="text-gray-400 text-sm">
            {isExpanded ? 'Show less' : `+${expenses.length - 3} more`}
          </span>
        )}
      </button>
      <div className="space-y-2 transform-gpu">
        {displayedExpenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
})
