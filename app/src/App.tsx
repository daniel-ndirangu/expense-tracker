import { ExpenseProvider } from './context/ExpenseContext'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-[#111111]">
        <Dashboard />
      </div>
    </ExpenseProvider>
  )
}

export default App
