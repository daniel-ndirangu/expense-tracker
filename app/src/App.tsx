import { ExpenseProvider } from './context/ExpenseContext'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <ExpenseProvider>
      <Dashboard />
    </ExpenseProvider>
  )
}

export default App
