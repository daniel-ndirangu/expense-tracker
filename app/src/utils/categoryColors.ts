// Default category colors
const defaultColors: Record<string, string> = {
  Food: 'bg-orange-500',
  Transport: 'bg-blue-500',
  Bills: 'bg-red-500',
  Shopping: 'bg-purple-500',
  Other: 'bg-gray-500',
}

// Colors for custom categories (cycling through these)
const customColorPalette = [
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-yellow-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-amber-500',
]

// Simple hash function to get consistent color for a category
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function getCategoryColor(category: string): string {
  // Check default colors first (case-insensitive)
  const defaultColor = defaultColors[category]
  if (defaultColor) {
    return defaultColor
  }

  // For custom categories, use hash to pick a consistent color
  const index = hashString(category) % customColorPalette.length
  return customColorPalette[index]
}
