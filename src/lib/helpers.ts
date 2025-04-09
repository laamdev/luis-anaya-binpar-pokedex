export const getStatColor = (value: number) => {
  if (value > 100) return "text-purple-500 bg-purple-500"; // Legendary / Beyond normal cap
  if (value === 100) return "text-blue-500 bg-blue-500"; // Maxed stat / Excellent
  if (value >= 75) return "text-green-500 bg-green-500"; // Strong / Impressive
  if (value >= 50) return "text-yellow-500 bg-yellow-500"; // Average / Balanced
  if (value >= 25) return "text-orange-500 bg-orange-500"; // Below average
  return "text-red-500 bg-red-500"; // Weak / Low stat
};
