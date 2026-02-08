import { formatCurrency } from '../utils/formatCurrency'
import { getCategoryColor } from '../utils/categoryColors'
import type { CategoryTotal } from '../utils/aggregations'

interface CategoryBreakdownProps {
  categories: CategoryTotal[]
}

export default function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  if (categories.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-2xl p-6 text-center">
        <p className="text-gray-400">No expenses yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const color = getCategoryColor(cat.category)

        return (
          <div key={cat.category} className="bg-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-white font-medium">{cat.category}</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(cat.total)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-300`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              <span className="text-gray-400 text-sm w-12 text-right">
                {cat.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
