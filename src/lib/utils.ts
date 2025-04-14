import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatGenerationName = (generation: string): string => {
  const genNumber = generation.replace("generation-", "");

  const romanNumerals: { [key: string]: string } = {
    "1": "I",
    "2": "II",
    "3": "III",
    "4": "IV",
    "5": "V",
    "6": "VI",
    "7": "VII",
    "8": "VIII",
    "9": "IX",
  };

  const romanNumeral = romanNumerals[genNumber] || genNumber;
  return `Generation ${romanNumeral.toUpperCase()}`;
};

export const getStatColor = (value: number) => {
  if (value > 100) return "text-purple-500 bg-purple-500"; // Legendary / Beyond normal cap
  if (value === 100) return "text-blue-500 bg-blue-500"; // Maxed stat / Excellent
  if (value >= 75) return "text-green-500 bg-green-500"; // Strong / Impressive
  if (value >= 50) return "text-yellow-500 bg-yellow-500"; // Average / Balanced
  if (value >= 25) return "text-orange-500 bg-orange-500"; // Below average
  return "text-red-500 bg-red-500"; // Weak / Low stat
};
