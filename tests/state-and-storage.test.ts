import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ApiCategory, ApiProduct } from "../src/utils/api";
import {
  clearCart,
  getCart,
  getCartQuantityForProduct,
  getUser,
  getUsers,
  removeProductFromCart,
  removeUser,
  saveCart,
  saveUser,
  saveUsers,
  updateProductQuantityInCart,
  addProductToCart,
} from "../src/utils/localStorage";
import {
  deductStock,
  getCategories,
  getDeductedStock,
  getProductStock,
  getProducts,
  initCategories,
  initProducts,
  refundStock,
  saveCategories,
  saveProducts,
} from "../src/utils/productState";
import { createOrderFromCart, getOrders, saveOrders } from "../src/utils/orders";
import type { Order } from "../src/types/Order";
import type { CartItem } from "../src/types/Cart";
import type { IUser } from "../src/types/IUser";
import { Rol } from "../src/types/Rol";

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

describe("state and storage", () => {
  const product: ApiProduct = {
    id: 1,
    nombre: "Milanesa Napolitana",
    descripcion: "",
    precio: 18000,
    stock: 2,
    imagen: "",
    disponible: true,
    eliminado: false,
    categoriaId: 1,
  };

  const user: IUser = {
    id: "user-1",
    name: "Client",
    email: "client@test.com",
    role: Rol.Client,
  };

  const cartItem: CartItem = {
    product: {
      id: 1,
      name: "Milanesa Napolitana",
      description: "",
      longDescription: "",
      price: 18000,
      image: "",
      category: "Milanesas",
      destacado: false,
      stock: 2,
    },
    quantity: 1,
  };

  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
    vi.stubGlobal("fetch", vi.fn());
  });

  it("guarda y recupera usuarios, sesión y carrito", () => {
    saveUsers([
      {
        id: "u-1",
        name: "Ana",
        email: "ana@test.com",
        role: Rol.Admin,
        password: "secret",
      },
    ]);
    saveUser(user);
    saveCart([cartItem]);

    expect(getUsers()).toHaveLength(1);
    expect(getUser()).toEqual(user);
    expect(getCart()).toEqual([cartItem]);
    expect(getCartQuantityForProduct(1)).toBe(1);
  });

  it("agrega, actualiza y elimina items respetando el stock del producto", () => {
    addProductToCart(cartItem.product, 3);
    expect(getCartQuantityForProduct(1)).toBe(2);

    updateProductQuantityInCart(1, 5);
    expect(getCartQuantityForProduct(1)).toBe(2);

    expect(removeProductFromCart(1)).toEqual([]);
    expect(getCart()).toEqual([]);
    clearCart();
    removeUser();
    expect(getUser()).toBeNull();
  });

  it("inicializa productos y categorías desde fetch y calcula stock", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [product],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            nombre: "Milanesas",
            descripcion: "",
            imagen: "",
            eliminado: false,
          },
        ],
      } as Response);

    await expect(initProducts()).resolves.toHaveLength(1);
    await expect(initCategories()).resolves.toHaveLength(1);
    expect(getProducts()).toHaveLength(1);
    expect(getCategories()).toHaveLength(1);
    expect(getProductStock(1)).toBe(2);

    deductStock([{ idProducto: 1, cantidad: 1 }]);
    expect(getDeductedStock(1)).toBe(1);
    expect(getProductStock(1)).toBe(1);

    refundStock([{ idProducto: 1, cantidad: 1 }]);
    expect(getDeductedStock(1)).toBe(0);
  });

  it("persiste y recupera pedidos de sesión", () => {
    const order: Order = createOrderFromCart(
      [cartItem],
      user,
      "1155555555",
      "EFECTIVO"
    );

    saveOrders([order]);
    expect(getOrders()).toEqual([order]);
  });
});
