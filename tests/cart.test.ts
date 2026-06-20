import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addProductToCart,
  getCart,
  getCartQuantityForProduct,
  updateProductQuantityInCart,
} from "../src/utils/localStorage";
import type { Product } from "../src/types/Product";

const createLocalStorageMock = (): Storage => {
  const store = new Map<string, string>();

  return {
    length: 0,
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } satisfies Storage;
};

describe("cart", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
  });

  const product: Product = {
    id: 1,
    name: "Milanesa Napolitana",
    description: "",
    longDescription: "",
    price: 18000,
    image: "",
    category: "Milanesas",
    destacado: false,
    stock: 2,
  };

  it("capa la cantidad al stock disponible", () => {
    addProductToCart(product, 3);

    expect(getCartQuantityForProduct(1)).toBe(2);
    expect(getCart()[0].quantity).toBe(2);
  });

  it("limita la edicion de cantidad al stock", () => {
    addProductToCart(product, 1);
    updateProductQuantityInCart(1, 5);

    expect(getCartQuantityForProduct(1)).toBe(2);
  });
});
