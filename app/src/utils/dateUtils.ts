import type { Period } from '../types/expense'

export interface DateRange {
  start: string // ISO date string
  end: string // ISO date string
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getDateRange(period: Period, dateStr: string): DateRange {
  const date = parseDate(dateStr)

  switch (period) {
    case 'daily':
      return {
        start: dateStr,
        end: dateStr,
      }

    case 'weekly': {
      // Monday-Sunday week
      const dayOfWeek = date.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(date)
      monday.setDate(date.getDate() + mondayOffset)

      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)

      return {
        start: toISODate(monday),
        end: toISODate(sunday),
      }
    }

    case 'monthly': {
      const year = date.getFullYear()
      const month = date.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      return {
        start: toISODate(firstDay),
        end: toISODate(lastDay),
      }
    }

    default:
      return { start: dateStr, end: dateStr }
  }
}

export function formatDateRange(period: Period, dateStr: string): string {
  const date = parseDate(dateStr)

  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })

    case 'weekly': {
      const range = getDateRange('weekly', dateStr)
      const start = parseDate(range.start)
      const end = parseDate(range.end)
      return `${start.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}`
    }

    case 'monthly':
      return date.toLocaleDateString('en-KE', {
        month: 'long',
        year: 'numeric',
      })

    default:
      return dateStr
  }
}

export function isDateInRange(dateStr: string, range: DateRange): boolean {
  return dateStr >= range.start && dateStr <= range.end
}

export function getTodayISO(): string {
  return toISODate(new Date())
}

export function formatExpenseDate(dateStr: string): string {
  const date = parseDate(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (dateStr === toISODate(today)) {
    return 'Today'
  }
  if (dateStr === toISODate(yesterday)) {
    return 'Yesterday'
  }

  return date.toLocaleDateString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function navigateDate(period: Period, dateStr: string, direction: 'prev' | 'next'): string {
  const date = parseDate(dateStr)
  const offset = direction === 'next' ? 1 : -1

  switch (period) {
    case 'daily':
      date.setDate(date.getDate() + offset)
      break
    case 'weekly':
      date.setDate(date.getDate() + offset * 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + offset)
      break
  }

  return toISODate(date)
}
