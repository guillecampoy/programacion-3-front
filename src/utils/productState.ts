import type { ApiCategory, ApiProduct } from "./api";
import { fetchRawProducts } from "./api";
import { fetchCategories } from "./api";

const PRODUCTS_KEY = "products";
const CATEGORIES_KEY = "categories";
const DEDUCTIONS_KEY = "stock-deductions";

export const getProducts = (): ApiProduct[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) return [];
    return JSON.parse(data) as ApiProduct[];
  } catch {
    return [];
  }
};

export const saveProducts = (products: ApiProduct[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const initProducts = async (): Promise<ApiProduct[]> => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (stored) return getProducts();
  const apiProducts = await fetchRawProducts().catch(() => [] as ApiProduct[]);
  saveProducts(apiProducts);
  return apiProducts;
};

export const getDeductedStock = (productId: number): number => {
  try {
    const data = localStorage.getItem(DEDUCTIONS_KEY);
    if (!data) return 0;
    const deductions = JSON.parse(data) as Record<string, number>;
    return deductions[String(productId)] ?? 0;
  } catch {
    return 0;
  }
};

export const deductStock = (
  items: Array<{ idProducto: number; cantidad: number }>
): void => {
  try {
    const data = localStorage.getItem(DEDUCTIONS_KEY);
    const deductions: Record<string, number> = data ? JSON.parse(data) : {};

    for (const item of items) {
      const key = String(item.idProducto);
      deductions[key] = (deductions[key] ?? 0) + item.cantidad;
    }

    localStorage.setItem(DEDUCTIONS_KEY, JSON.stringify(deductions));
  } catch {

  }
};

export const refundStock = (
  items: Array<{ idProducto: number; cantidad: number }>
): void => {
  try {
    const data = localStorage.getItem(DEDUCTIONS_KEY);
    const deductions: Record<string, number> = data ? JSON.parse(data) : {};

    for (const item of items) {
      const key = String(item.idProducto);
      deductions[key] = Math.max(0, (deductions[key] ?? 0) - item.cantidad);
    }

    localStorage.setItem(DEDUCTIONS_KEY, JSON.stringify(deductions));
  } catch {

  }
};

export const getProductStock = (productId: number): number => {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);
  const baseStock = product && typeof product.stock === "number" ? product.stock : 0;
  const deducted = getDeductedStock(productId);
  return Math.max(0, baseStock - deducted);
};

export const getCategories = (): ApiCategory[] => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) return [];
    return JSON.parse(data) as ApiCategory[];
  } catch {
    return [];
  }
};

export const saveCategories = (categories: ApiCategory[]): void => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const initCategories = async (): Promise<ApiCategory[]> => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) return getCategories();
  const apiCategories = await fetchCategories().catch(() => [] as ApiCategory[]);
  saveCategories(apiCategories);
  return apiCategories;
};
