import { formatCurrency } from '../utils/formatCurrency'
import { formatDateRange, navigateDate } from '../utils/dateUtils'
import type { Period } from '../types/expense'

interface TotalCardProps {
  total: number
  period: Period
  selectedDate: string
  onDateChange: (date: string) => void
}

export default function TotalCard({ total, period, selectedDate, onDateChange }: TotalCardProps) {
  const handlePrev = () => {
    onDateChange(navigateDate(period, selectedDate, 'prev'))
  }

  const handleNext = () => {
    onDateChange(navigateDate(period, selectedDate, 'next'))
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrev}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          aria-label="Previous period"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-gray-400 text-sm">
          {formatDateRange(period, selectedDate)}
        </span>
        <button
          onClick={handleNext}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          aria-label="Next period"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="text-center">
        <p className="text-gray-400 text-sm mb-1">Total Spent</p>
        <p className="text-4xl font-semibold text-white tracking-tight">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  )
}
