import type { Expense } from '../types/expense'
import { isDateInRange, type DateRange } from './dateUtils'

export interface CategoryTotal {
  category: string
  total: number
  count: number
  percentage: number
}

export function filterByDateRange(expenses: Expense[], range: DateRange): Expense[] {
  return expenses.filter((expense) => isDateInRange(expense.date, range))
}

export function calculateTotal(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0)
}

export function aggregateByCategory(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<string, { total: number; count: number }>()

  expenses.forEach((expense) => {
    const existing = totals.get(expense.category) || { total: 0, count: 0 }
    totals.set(expense.category, {
      total: existing.total + expense.amount,
      count: existing.count + 1,
    })
  })

  const grandTotal = calculateTotal(expenses)

  const result: CategoryTotal[] = []
  totals.forEach((value, category) => {
    result.push({
      category,
      total: value.total,
      count: value.count,
      percentage: grandTotal > 0 ? (value.total / grandTotal) * 100 : 0,
    })
  })

  // Sort by total descending
  return result.sort((a, b) => b.total - a.total)
}

export function sortExpensesByDate(expenses: Expense[]): Expense[] {
  return [...expenses].sort((a, b) => {
    // First by date descending
    if (a.date !== b.date) {
      return b.date.localeCompare(a.date)
    }
    // Then by createdAt descending
    return b.createdAt.localeCompare(a.createdAt)
  })
}
