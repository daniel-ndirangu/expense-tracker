import { useState, useEffect } from 'react'
import type { Expense } from '../types/expense'
import { useExpenses } from '../context/ExpenseContext'
import { getTodayISO } from '../utils/dateUtils'

interface ExpenseFormSheetProps {
  isOpen: boolean
  expense: Expense | null
  onSave: (data: Omit<Expense, 'id' | 'createdAt'>) => void
  onClose: () => void
}

const ADD_NEW_VALUE = '__add_new__'

export default function ExpenseFormSheet({ isOpen, expense, onSave, onClose }: ExpenseFormSheetProps) {
  const { categories, addCategory } = useExpenses()

  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(getTodayISO())
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and lock
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      if (expense) {
        setAmount(expense.amount.toString())
        setDescription(expense.description)
        setCategory(expense.category)
        setDate(expense.date)
      } else {
        setAmount('')
        setDescription('')
        setCategory(categories[0] || 'Other')
        setDate(getTodayISO())
      }
      setIsAddingCategory(false)
      setNewCategoryName('')
    }
  }, [isOpen, expense, categories])

  const handleCategoryChange = (value: string) => {
    if (value === ADD_NEW_VALUE) {
      setIsAddingCategory(true)
    } else {
      setCategory(value)
    }
  }

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim()
    if (trimmed && addCategory(trimmed)) {
      setCategory(trimmed)
      setIsAddingCategory(false)
      setNewCategoryName('')
    }
  }

  const handleCancelAddCategory = () => {
    setIsAddingCategory(false)
    setNewCategoryName('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return
    }
    onSave({
      amount: parsedAmount,
      description: description.trim() || 'Expense',
      category,
      date,
    })
  }

  // Prevent touch events from propagating to background
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const isValid = amount && parseFloat(amount) > 0 && category

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 touch-none"
      onTouchMove={handleTouchMove}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl animate-slide-up flex flex-col touch-auto"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Drag handle - fixed */}
        <div className="flex-shrink-0 pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto" />
        </div>

        {/* Scrollable content */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-6"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            {expense ? 'Edit Expense' : 'Add Expense'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Amount */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">KSh</span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#2a2a2a] text-white text-lg font-medium rounded-xl py-4 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What was this for?"
                className="w-full bg-[#2a2a2a] text-white rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Category</label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-1 bg-[#2a2a2a] text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-white/20"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCategory()
                      } else if (e.key === 'Escape') {
                        handleCancelAddCategory()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="px-4 py-3 bg-white text-black rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddCategory}
                    className="px-4 py-3 bg-[#2a2a2a] text-gray-300 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-[#2a2a2a] text-white rounded-xl py-4 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value={ADD_NEW_VALUE}>+ Add new category</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 pb-safe">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 text-gray-300 font-medium rounded-xl bg-[#2a2a2a] active:bg-[#3a3a3a]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className="flex-1 py-4 text-black font-medium rounded-xl bg-white active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {expense ? 'Save' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </div>
  )
}
