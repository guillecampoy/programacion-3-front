import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/utils/productImages", () => ({
  resolveProductImageUrl: (fileName: string) =>
    fileName ? `/mapped/${fileName}` : "",
}));

import {
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchRawProducts,
  fetchUserByEmail,
  fetchUsers,
  mapApiRoleToRole,
} from "../src/utils/api";

describe("api", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("filtra y mapea usuarios válidos", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "u-1",
          nombre: "Ana",
          apellido: "García",
          mail: "ana@test.com",
          celular: "111",
          password: "secret",
          rol: "USUARIO",
        },
        {
          id: "broken",
          nombre: "Broken",
        },
      ],
    } as Response);

    const users = await fetchUsers();
    const user = await fetchUserByEmail("ana@test.com");

    expect(users).toHaveLength(1);
    expect(user?.id).toBe("u-1");
  });

  it("carga categorías, productos y pedidos desde JSON local", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            nombre: "Milanesas",
            descripcion: "",
            imagen: "mila_napo_bodegon.png",
            eliminado: false,
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            nombre: "Milanesa Napolitana",
            descripcion: "",
            precio: 18000,
            stock: 3,
            imagen: "mila_napo_bodegon.png",
            disponible: true,
            eliminado: false,
            categoriaId: 1,
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            nombre: "Milanesa Napolitana",
            descripcion: "",
            precio: 18000,
            stock: 3,
            imagen: "mila_napo_bodegon.png",
            disponible: true,
            eliminado: false,
            categoriaId: 1,
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "PED-1",
            fecha: "2026-06-01",
            estado: "PENDIENTE",
            total: 18000,
            formaPago: "EFECTIVO",
            idUsuario: "u-1",
            detalles: [],
          },
        ],
      } as Response);

    const categories = await fetchCategories();
    const rawProducts = await fetchRawProducts();
    const products = await fetchProducts();
    const orders = await fetchOrders();

    expect(categories).toHaveLength(1);
    expect(rawProducts).toHaveLength(1);
    expect(products).toEqual([
      expect.objectContaining({ imagen: "/mapped/mila_napo_bodegon.png" }),
    ]);
    expect(orders).toHaveLength(1);
  });

  it("rechaza respuestas no exitosas", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

    await expect(fetchUsers()).rejects.toThrow("No se pudo cargar /data/usuarios.json.");
  });

  it("mapea el rol API al rol de sesión", () => {
    expect(mapApiRoleToRole("ADMIN")).toBe("admin");
    expect(mapApiRoleToRole("USUARIO")).toBe("client");
  });
});
