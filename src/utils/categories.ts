import { defaultCategories } from "../data/data";
import type { ICategoria } from "../types/Product";

const CATEGORIES_KEY = "categories";

const isProductCategory = (value: unknown): value is ICategoria => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const category = value as Record<string, unknown>;

  return typeof category.id === "number" && typeof category.name === "string";
};

export const saveCategories = (categories: ICategoria[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const getCategories = (): ICategoria[] => {
  const categoriesFromStorage = localStorage.getItem(CATEGORIES_KEY);

  if (!categoriesFromStorage) {
    saveCategories(defaultCategories);
    return defaultCategories;
  }

  try {
    const parsedCategories = JSON.parse(categoriesFromStorage) as unknown;

    if (!Array.isArray(parsedCategories)) {
      saveCategories(defaultCategories);
      return defaultCategories;
    }

    const validCategories = parsedCategories
      .filter(isProductCategory)
      .map((category) => ({
        ...category,
        name: category.name.trim(),
      }))
      .filter((category) => category.name.length > 0);

    if (validCategories.length !== parsedCategories.length) {
      saveCategories(validCategories);
    }

    return validCategories;
  } catch {
    saveCategories(defaultCategories);
    return defaultCategories;
  }
};

export const getNextCategoryId = (categories: ICategoria[]): number => {
  const maxId = categories.reduce(
    (currentMax, category) => Math.max(currentMax, category.id),
    0
  );

  return maxId + 1;
};
