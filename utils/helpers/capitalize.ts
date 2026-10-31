export const capitalizeFirstWord = (text: any = ""): string => {
  // 1. Type Guard: Ensure we are working with a string
  if (typeof text !== 'string') {
    return ""; 
  }

  const trimmed = text.trim();

  // 2. Empty String Check
  if (!trimmed) {
    return "";
  }

  // 3. Transformation Logic
  // To capitalize ONLY the first letter of the entire string:
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

export const capitalizeAllLetters = (text?: unknown): string => {
  if (typeof text !== "string") {
    return "";
  }

  return text.trim().toUpperCase();
};


export const capitalizeSubstring = (text: any = ""): string => {
  // Type guard
  if (typeof text !== "string") return "";

  const trimmed = text.trim();
  if (!trimmed) return "";

  try {
    return trimmed
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch (error) {
    console.error("capitalizeFirstWord error:", error);
    return "";
  }
};
