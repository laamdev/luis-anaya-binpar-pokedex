export const getStatColor = (value: number) => {
  if (value > 100) return "text-blue-500 bg-blue-500";
  if (value >= 90) return "text-green-500 bg-green-500";
  if (value >= 75) return "text-yellow-500 bg-yellow-500";
  if (value >= 50) return "text-orange-500 bg-orange-500";
  if (value >= 25) return "text-red-400 bg-red-400";
  return "text-red-600 bg-red-600";
};
