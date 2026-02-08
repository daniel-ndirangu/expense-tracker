import type { Expense } from '../types/expense'
import { formatCurrency } from '../utils/formatCurrency'
import { formatExpenseDate } from '../utils/dateUtils'
import { getCategoryColor } from '../utils/categoryColors'

interface ExpenseItemProps {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const color = getCategoryColor(expense.category)

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-sm font-medium">
          {expense.category.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{expense.description}</p>
        <p className="text-gray-400 text-sm">
          {expense.category} • {formatExpenseDate(expense.date)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-white font-medium whitespace-nowrap">
          {formatCurrency(expense.amount)}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(expense)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            aria-label="Edit expense"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Delete expense"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
