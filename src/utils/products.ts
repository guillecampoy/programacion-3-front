import {
  DEFAULT_LONG_DESCRIPTION,
  defaultProducts,
} from "../data/data";
import type { Product } from "../types/Product";

const PRODUCTS_KEY = "products";

const isStoredProduct = (value: unknown): value is Omit<Product, "longDescription"> & {
  longDescription?: unknown;
} => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    (typeof product.longDescription === "string" ||
      typeof product.longDescription === "undefined") &&
    typeof product.price === "number" &&
    typeof product.image === "string" &&
    typeof product.category === "string" &&
    typeof product.destacado === "boolean"
  );
};

const normalizeProduct = (
  product: Omit<Product, "longDescription"> & { longDescription?: unknown }
): Product => ({
  ...product,
  longDescription:
    typeof product.longDescription === "string" &&
    product.longDescription.trim().length > 0
      ? product.longDescription
      : DEFAULT_LONG_DESCRIPTION,
});

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const productsFromStorage = localStorage.getItem(PRODUCTS_KEY);

  if (!productsFromStorage) {
    saveProducts(defaultProducts);
    return defaultProducts;
  }

  try {
    const parsedProducts = JSON.parse(productsFromStorage) as unknown;

    if (!Array.isArray(parsedProducts)) {
      saveProducts(defaultProducts);
      return defaultProducts;
    }

    const storedProducts = parsedProducts.filter(isStoredProduct);
    const validProducts = storedProducts.map(normalizeProduct);
    const productsNeedMigration = storedProducts.some(
      (product) =>
        typeof product.longDescription !== "string" ||
        product.longDescription.trim().length === 0
    );

    if (validProducts.length !== parsedProducts.length || productsNeedMigration) {
      saveProducts(validProducts);
    }

    return validProducts;
  } catch {
    saveProducts(defaultProducts);
    return defaultProducts;
  }
};

export const getNextProductId = (products: Product[]): number => {
  const maxId = products.reduce(
    (currentMax, product) => Math.max(currentMax, product.id),
    0
  );

  return maxId + 1;
};
