import { describe, expect, it } from "vitest";
import { buildAdminDashboardStats } from "../src/utils/adminDashboard";

describe("adminDashboard", () => {
  it("calcula métricas y resúmenes desde los JSON", () => {
    const stats = buildAdminDashboardStats({
      categories: [
        { id: 1, nombre: "Milanesas", descripcion: "", imagen: "", eliminado: false },
        { id: 2, nombre: "Papas", descripcion: "", imagen: "", eliminado: true },
      ],
      products: [
        {
          id: 1,
          nombre: "Milanesa Napolitana",
          descripcion: "",
          precio: 18000,
          stock: 12,
          imagen: "",
          disponible: true,
          eliminado: false,
          categoriaId: 1,
        },
        {
          id: 2,
          nombre: "Papas Cheddar",
          descripcion: "",
          precio: 11000,
          stock: 4,
          imagen: "",
          disponible: false,
          eliminado: false,
          categoriaId: 2,
        },
        {
          id: 3,
          nombre: "Papas Panceta",
          descripcion: "",
          precio: 11500,
          stock: 0,
          imagen: "",
          disponible: true,
          eliminado: true,
          categoriaId: 2,
        },
      ],
      users: [
        {
          id: "admin-1",
          nombre: "Admin",
          apellido: "FoodStore",
          mail: "admin@test.com",
          celular: "1111111111",
          password: "Admin1234",
          rol: "ADMIN",
        },
        {
          id: "user-1",
          nombre: "Client",
          apellido: "FoodStore",
          mail: "client@test.com",
          celular: "2222222222",
          password: "Client1234",
          rol: "USUARIO",
        },
      ],
      orders: [
        {
          id: "PED-1",
          fecha: "2026-06-01",
          estado: "PENDIENTE",
          total: 18000,
          formaPago: "EFECTIVO",
          idUsuario: "user-1",
          detalles: [],
        },
        {
          id: "PED-2",
          fecha: "2026-06-02",
          estado: "TERMINADO",
          total: 30000,
          formaPago: "TARJETA",
          idUsuario: "user-1",
          detalles: [],
        },
      ],
    });

    expect(stats.totalCategories).toBe(2);
    expect(stats.totalProducts).toBe(3);
    expect(stats.totalOrders).toBe(2);
    expect(stats.availableProducts).toBe(2);
    expect(stats.activeCategories).toBe(1);
    expect(stats.inactiveCategories).toBe(1);
    expect(stats.activeProducts).toBe(2);
    expect(stats.inactiveProducts).toBe(1);
    expect(stats.adminUsers).toBe(1);
    expect(stats.clientUsers).toBe(1);
    expect(stats.orderStatusCounts.PENDIENTE).toBe(1);
    expect(stats.orderStatusCounts.CONFIRMADO).toBe(0);
    expect(stats.orderStatusCounts.TERMINADO).toBe(1);
    expect(stats.orderStatusCounts.CANCELADO).toBe(0);
  });

  it("soporta datasets vacíos", () => {
    const stats = buildAdminDashboardStats({
      categories: [],
      products: [],
      users: [],
      orders: [],
    });

    expect(stats.totalCategories).toBe(0);
    expect(stats.totalProducts).toBe(0);
    expect(stats.totalOrders).toBe(0);
    expect(stats.availableProducts).toBe(0);
    expect(stats.activeCategories).toBe(0);
    expect(stats.inactiveCategories).toBe(0);
    expect(stats.activeProducts).toBe(0);
    expect(stats.inactiveProducts).toBe(0);
    expect(stats.adminUsers).toBe(0);
    expect(stats.clientUsers).toBe(0);
  });
});
