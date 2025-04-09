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
