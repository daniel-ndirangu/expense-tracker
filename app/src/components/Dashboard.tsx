import { useState, useCallback, useMemo } from 'react'
import { useExpenses } from '../context/ExpenseContext'
import { getDateRange } from '../utils/dateUtils'
import { filterByDateRange, calculateTotal, aggregateByCategory, sortExpensesByDate } from '../utils/aggregations'
import type { Expense } from '../types/expense'
import PeriodSelector from './PeriodSelector'
import TotalCard from './TotalCard'
import CategoryBreakdown from './CategoryBreakdown'
import ExpenseList from './ExpenseList'
import AddExpenseButton from './AddExpenseButton'
import ExpenseFormSheet from './ExpenseFormSheet'
import ExportImport from './ExportImport'

export default function Dashboard() {
  const {
    expenses,
    selectedPeriod,
    selectedDate,
    setPeriod,
    setSelectedDate,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showExport, setShowExport] = useState(false)

  // Memoize computed values to prevent unnecessary re-renders
  const dateRange = useMemo(
    () => getDateRange(selectedPeriod, selectedDate),
    [selectedPeriod, selectedDate]
  )

  const filteredExpenses = useMemo(
    () => filterByDateRange(expenses, dateRange),
    [expenses, dateRange]
  )

  const sortedExpenses = useMemo(
    () => sortExpensesByDate(filteredExpenses),
    [filteredExpenses]
  )

  const total = useMemo(
    () => calculateTotal(filteredExpenses),
    [filteredExpenses]
  )

  const categoryTotals = useMemo(
    () => aggregateByCategory(filteredExpenses),
    [filteredExpenses]
  )

  const handleAdd = useCallback(() => {
    setEditingExpense(null)
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((expense: Expense) => {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }, [])

  const handleSave = useCallback((data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      updateExpense({ ...editingExpense, ...data })
    } else {
      addExpense(data)
    }
    setIsFormOpen(false)
    setEditingExpense(null)
  }, [editingExpense, updateExpense, addExpense])

  const handleDelete = useCallback((id: string) => {
    deleteExpense(id)
  }, [deleteExpense])

  const handleClose = useCallback(() => {
    setIsFormOpen(false)
    setEditingExpense(null)
  }, [])

  const handleToggleExport = useCallback(() => {
    setShowExport(prev => !prev)
  }, [])

  const handleCloseExport = useCallback(() => {
    setShowExport(false)
  }, [])

  return (
    <div className="scroll-container bg-[#111111]">
      {/* Fixed Header */}
      <header className="sticky top-0 z-10 bg-[#111111] px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Expenses</h1>
          <button
            onClick={handleToggleExport}
            className="w-10 h-10 flex items-center justify-center text-gray-400 active:text-white"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
        <PeriodSelector value={selectedPeriod} onChange={setPeriod} />
      </header>

      {/* Scrollable Content */}
      <main className="px-4 pt-4 pb-24 flex flex-col gap-6">
        {showExport && (
          <ExportImport onClose={handleCloseExport} />
        )}

        <TotalCard
          total={total}
          period={selectedPeriod}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div>
          <h2 className="text-lg font-semibold text-white mb-3">By Category</h2>
          <CategoryBreakdown categories={categoryTotals} />
        </div>

        <ExpenseList
          expenses={sortedExpenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      {/* FAB - Fixed position */}
      <AddExpenseButton onClick={handleAdd} />

      {/* Form Sheet */}
      <ExpenseFormSheet
        isOpen={isFormOpen}
        expense={editingExpense}
        onSave={handleSave}
        onClose={handleClose}
      />
    </div>
  )
}
