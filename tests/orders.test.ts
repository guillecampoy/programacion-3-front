import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CartItem } from "../src/types/Cart";
import type { IUser } from "../src/types/IUser";
import { Rol } from "../src/types/Rol";
import {
  calculateCartSummary,
  createOrderFromCart,
  ENVIO,
  getOrders,
  saveOrders,
} from "../src/utils/orders";
import type { Order } from "../src/types/Order";

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

describe("orders", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
  });

  const cart: CartItem[] = [
    {
      product: {
        id: 1,
        name: "Milanesa Napolitana",
        description: "",
        longDescription: "",
        price: 18000,
        image: "",
        category: "Milanesas",
        destacado: false,
        stock: 3,
      },
      quantity: 2,
    },
  ];

  const user: IUser = {
    id: "user-1",
    name: "Client FoodStore",
    email: "client@test.com",
    role: Rol.Client,
  };

  it("calcula subtotal, envio y total", () => {
    const summary = calculateCartSummary(cart);

    expect(summary.subtotal).toBe(36000);
    expect(summary.envio).toBe(ENVIO);
    expect(summary.total).toBe(36000 + ENVIO);
  });

  it("crea una orden desde el carrito", () => {
    const order = createOrderFromCart(cart, user, "1155555555", "TARJETA");

    expect(order.id).toContain("PED-");
    expect(order.estado).toBe("PENDIENTE");
    expect(order.idUsuario).toBe("user-1");
    expect(order.formaPago).toBe("TARJETA");
    expect(order.telefono).toBe("1155555555");
    expect(order.detalles).toHaveLength(1);
    expect(order.total).toBe(36000 + ENVIO);
  });

  it("guarda y recupera estados de pedidos actualizados", () => {
    const orders: Order[] = [
      {
        id: "PED-1001",
        fecha: "2026-05-11",
        estado: "CANCELADO",
        total: 30000,
        formaPago: "EFECTIVO",
        idUsuario: "user-1",
        telefono: "1111111111",
        detalles: [],
      },
    ];

    saveOrders(orders);

    expect(getOrders()).toEqual(orders);
  });
});
