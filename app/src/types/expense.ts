export const DEFAULT_CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Other',
] as const

export interface Expense {
  id: string
  amount: number
  date: string // ISO date string YYYY-MM-DD
  description: string
  category: string
  createdAt: string // ISO timestamp
}

export type Period = 'daily' | 'weekly' | 'monthly'
