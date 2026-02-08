import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { Expense, Period } from '../types/expense'
import { DEFAULT_CATEGORIES } from '../types/expense'

const EXPENSES_STORAGE_KEY = 'expense-tracker-data'
const CATEGORIES_STORAGE_KEY = 'expense-tracker-categories'

interface ExpenseState {
  expenses: Expense[]
  customCategories: string[]
  selectedPeriod: Period
  selectedDate: string
}

type ExpenseAction =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_PERIOD'; payload: Period }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'LOAD_EXPENSES'; payload: Expense[] }
  | { type: 'IMPORT_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_CATEGORY'; payload: string }
  | { type: 'LOAD_CATEGORIES'; payload: string[] }

interface ExpenseContextValue extends ExpenseState {
  categories: string[]
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addCategory: (category: string) => boolean
  setPeriod: (period: Period) => void
  setSelectedDate: (date: string) => void
  exportData: () => string
  importData: (jsonString: string) => boolean
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null)

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return { ...state, expenses: [action.payload, ...state.expenses] }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      }
    case 'SET_PERIOD':
      return { ...state, selectedPeriod: action.payload }
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload }
    case 'LOAD_EXPENSES':
      return { ...state, expenses: action.payload }
    case 'IMPORT_EXPENSES':
      return { ...state, expenses: action.payload }
    case 'ADD_CATEGORY':
      return { ...state, customCategories: [...state.customCategories, action.payload] }
    case 'LOAD_CATEGORIES':
      return { ...state, customCategories: action.payload }
    default:
      return state
  }
}

function loadExpensesFromStorage(): Expense[] {
  try {
    const data = localStorage.getItem(EXPENSES_STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch {
    // Start fresh on error
  }
  return []
}

function loadCategoriesFromStorage(): string[] {
  try {
    const data = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch {
    // Start fresh on error
  }
  return []
}

function saveExpensesToStorage(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses))
  } catch {
    // Ignore storage errors
  }
}

function saveCategoriesToStorage(categories: string[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
  } catch {
    // Ignore storage errors
  }
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const today = new Date().toISOString().split('T')[0]

  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    customCategories: [],
    selectedPeriod: 'daily',
    selectedDate: today,
  })

  // Load data on mount
  useEffect(() => {
    const loadedExpenses = loadExpensesFromStorage()
    if (loadedExpenses.length > 0) {
      dispatch({ type: 'LOAD_EXPENSES', payload: loadedExpenses })
    }
    const loadedCategories = loadCategoriesFromStorage()
    if (loadedCategories.length > 0) {
      dispatch({ type: 'LOAD_CATEGORIES', payload: loadedCategories })
    }
  }, [])

  // Save expenses whenever they change
  useEffect(() => {
    saveExpensesToStorage(state.expenses)
  }, [state.expenses])

  // Save categories whenever they change
  useEffect(() => {
    saveCategoriesToStorage(state.customCategories)
  }, [state.customCategories])

  // Combined categories: defaults + custom
  const categories = [...DEFAULT_CATEGORIES, ...state.customCategories]

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense })
  }

  const updateExpense = (expense: Expense) => {
    dispatch({ type: 'UPDATE_EXPENSE', payload: expense })
  }

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id })
  }

  const addCategory = (category: string): boolean => {
    const trimmed = category.trim()
    if (!trimmed) return false
    // Check if already exists (case-insensitive)
    const exists = categories.some(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    )
    if (exists) return false
    dispatch({ type: 'ADD_CATEGORY', payload: trimmed })
    return true
  }

  const setPeriod = (period: Period) => {
    dispatch({ type: 'SET_PERIOD', payload: period })
  }

  const setSelectedDate = (date: string) => {
    dispatch({ type: 'SET_DATE', payload: date })
  }

  const exportData = (): string => {
    return JSON.stringify({
      expenses: state.expenses,
      customCategories: state.customCategories,
    }, null, 2)
  }

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString)
      // Support both old format (array) and new format (object with expenses)
      let expenses: Expense[]
      let customCats: string[] = []

      if (Array.isArray(parsed)) {
        expenses = parsed
      } else if (parsed.expenses && Array.isArray(parsed.expenses)) {
        expenses = parsed.expenses
        customCats = parsed.customCategories || []
      } else {
        return false
      }

      // Basic validation
      const valid = expenses.every(
        (item) =>
          typeof item.id === 'string' &&
          typeof item.amount === 'number' &&
          typeof item.date === 'string' &&
          typeof item.description === 'string' &&
          typeof item.category === 'string'
      )
      if (!valid) {
        return false
      }
      dispatch({ type: 'IMPORT_EXPENSES', payload: expenses })
      if (customCats.length > 0) {
        dispatch({ type: 'LOAD_CATEGORIES', payload: customCats })
      }
      return true
    } catch {
      return false
    }
  }

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        setPeriod,
        setSelectedDate,
        exportData,
        importData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within ExpenseProvider')
  }
  return context
}
