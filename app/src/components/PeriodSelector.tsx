import type { Period } from '../types/expense'

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

const periods: { value: Period; label: string }[] = [
  { value: 'daily', label: 'Day' },
  { value: 'weekly', label: 'Week' },
  { value: 'monthly', label: 'Month' },
]

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex bg-[#1a1a1a] rounded-xl p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
            value === period.value
              ? 'bg-[#2a2a2a] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
