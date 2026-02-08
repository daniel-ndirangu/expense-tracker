interface AddExpenseButtonProps {
  onClick: () => void
}

export default function AddExpenseButton({ onClick }: AddExpenseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-transform"
      aria-label="Add expense"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </button>
  )
}
