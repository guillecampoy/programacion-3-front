import { describe, expect, it } from "vitest";
import type { CartItem } from "../src/types/Cart";
import type { IUser } from "../src/types/IUser";
import { Rol } from "../src/types/Rol";
import {
  calculateCartSummary,
  createOrderFromCart,
  ENVIO,
} from "../src/utils/orders";

describe("orders", () => {
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
});
