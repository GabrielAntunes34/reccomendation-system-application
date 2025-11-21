const STORAGE_KEY = "favorite_products";

const safeParse = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
};

export const getFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
};

export const toggleFavorite = (productId: string): boolean => {
  if (typeof window === "undefined") return false;
  const current = safeParse(localStorage.getItem(STORAGE_KEY));
  const exists = current.includes(productId);
  const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !exists;
};

export const isFavorite = (productId: string): boolean => {
  if (typeof window === "undefined") return false;
  return getFavorites().includes(productId);
};
