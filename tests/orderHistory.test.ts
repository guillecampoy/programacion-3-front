import { describe, expect, it } from "vitest";
import type { Order } from "../src/types/Order";
import type { Product } from "../src/types/Product";
import {
  buildOrderHistory,
  filterOrdersByUser,
  getOrderShipping,
  getOrderSubtotal,
  mergeOrdersById,
  sortOrdersByDateDesc,
} from "../src/utils/orderHistory";

const products: Product[] = [
  {
    id: 1,
    name: "Milanesa Napolitana",
    description: "",
    longDescription: "",
    price: 18000,
    image: "",
    category: "Milanesas",
    destacado: false,
  },
  {
    id: 6,
    name: "Papas Baston",
    description: "",
    longDescription: "",
    price: 9500,
    image: "",
    category: "Papas Fritas",
    destacado: false,
  },
];

const orders: Order[] = [
  {
    id: "PED-1001",
    fecha: "2026-05-11",
    estado: "PENDIENTE",
    total: 30000,
    formaPago: "EFECTIVO",
    idUsuario: "user-1",
    detalles: [
      {
        idProducto: 1,
        cantidad: 1,
        subtotal: 18000,
      },
      {
        idProducto: 6,
        cantidad: 1,
        subtotal: 9500,
      },
    ],
  },
  {
    id: "PED-2001",
    fecha: "2026-05-12",
    estado: "CONFIRMADO",
    total: 38500,
    formaPago: "TARJETA",
    idUsuario: "user-2",
    detalles: [
      {
        idProducto: 6,
        cantidad: 2,
        subtotal: 19000,
      },
    ],
  },
  {
    id: "PED-1001",
    fecha: "2026-05-11",
    estado: "TERMINADO",
    total: 30500,
    formaPago: "EFECTIVO",
    idUsuario: "user-1",
    detalles: [
      {
        idProducto: 1,
        cantidad: 1,
        subtotal: 18000,
        productName: "Milanesa Napolitana",
      },
      {
        idProducto: 6,
        cantidad: 1,
        subtotal: 10000,
      },
    ],
  },
];

describe("orderHistory", () => {
  it("combina, filtra y ordena pedidos sin duplicados por id", () => {
    const merged = mergeOrdersById(orders);
    const userOrders = filterOrdersByUser(merged, "user-1");
    const sorted = sortOrdersByDateDesc(userOrders);

    expect(merged).toHaveLength(2);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].estado).toBe("TERMINADO");
  });

  it("arma el historial con nombres de producto y resumen de totales", () => {
    const history = buildOrderHistory(orders, products, "user-1");

    expect(history).toHaveLength(1);
    expect(history[0].order.id).toBe("PED-1001");
    expect(history[0].subtotal).toBe(28000);
    expect(history[0].envio).toBe(2500);
    expect(history[0].itemCount).toBe(2);
    expect(history[0].previewDetails[1].productName).toBe("Papas Baston");
  });

  it("nunca devuelve envío negativo", () => {
    expect(
      getOrderShipping({
        id: "PED-1",
        fecha: "2026-06-01",
        estado: "PENDIENTE",
        total: 1000,
        formaPago: "EFECTIVO",
        idUsuario: "user-1",
        detalles: [
          {
            idProducto: 1,
            cantidad: 1,
            subtotal: 1800,
          },
        ],
      })
    ).toBe(0);
  });

  it("calcula subtotal a partir del detalle", () => {
    expect(getOrderSubtotal(orders[0])).toBe(27500);
  });
});
