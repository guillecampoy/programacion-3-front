import { describe, expect, it } from "vitest";
import {
  filterAdminOrdersByStatus,
  getAdminOrderCustomerName,
  getAdminOrderItemCount,
  sortAdminOrdersByDateDesc,
  updateAdminOrderStatus,
} from "../src/utils/adminOrders";

describe("adminOrders", () => {
  const users = [
    {
      id: "user-1",
      nombre: "Ana",
      apellido: "García",
      mail: "ana@test.com",
      celular: "1111111111",
      password: "secret",
      rol: "USUARIO" as const,
    },
  ];

  const orders = [
    {
      id: "PED-1",
      fecha: "2026-05-11",
      estado: "PENDIENTE" as const,
      total: 1000,
      formaPago: "EFECTIVO" as const,
      idUsuario: "user-1",
      detalles: [
        {
          idProducto: 1,
          cantidad: 2,
          subtotal: 1000,
        },
      ],
    },
    {
      id: "PED-2",
      fecha: "2026-06-01",
      estado: "CONFIRMADO" as const,
      total: 2000,
      formaPago: "TARJETA" as const,
      idUsuario: "user-x",
      detalles: [],
    },
  ];

  it("ordena los pedidos por fecha descendente", () => {
    const sorted = sortAdminOrdersByDateDesc(orders);

    expect(sorted[0].id).toBe("PED-2");
    expect(sorted[1].id).toBe("PED-1");
  });

  it("filtra por estado y conserva todos cuando el filtro es TODOS", () => {
    expect(filterAdminOrdersByStatus(orders, "CONFIRMADO")).toHaveLength(1);
    expect(filterAdminOrdersByStatus(orders, "TODOS")).toHaveLength(2);
  });

  it("resuelve el nombre del cliente y el total de items", () => {
    expect(getAdminOrderCustomerName(orders[0], users)).toBe("Ana García");
    expect(getAdminOrderCustomerName(orders[1], users)).toBe("user-x");
    expect(getAdminOrderItemCount(orders[0])).toBe(2);
  });

  it("actualiza el estado del pedido en memoria", () => {
    const updated = updateAdminOrderStatus(orders, "PED-1", "TERMINADO");

    expect(updated[0].estado).toBe("TERMINADO");
    expect(updated[1].estado).toBe("CONFIRMADO");
  });
});
