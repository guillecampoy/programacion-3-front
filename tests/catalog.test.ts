import { describe, expect, it } from "vitest";
import {
  buildCatalogProducts,
  filterCatalogProducts,
  normalizeSearchText,
} from "../src/utils/catalog";

describe("catalog", () => {
  const categories = [
    { id: 1, nombre: "Milanesas", descripcion: "", imagen: "", eliminado: false },
    { id: 2, nombre: "Papas", descripcion: "", imagen: "", eliminado: false },
  ];

  const products = [
    {
      id: 1,
      nombre: "Milanesa Napolitana",
      descripcion: "",
      precio: 18000,
      stock: 12,
      imagen: "mila_napo_bodegon.png",
      disponible: true,
      eliminado: false,
      categoriaId: 1,
    },
    {
      id: 2,
      nombre: "Papas Baston",
      descripcion: "",
      precio: 9500,
      stock: 20,
      imagen: "papas_bodegon.png",
      disponible: true,
      eliminado: false,
      categoriaId: 2,
    },
    {
      id: 3,
      nombre: "Papas Cheddar",
      descripcion: "",
      precio: 11000,
      stock: 4,
      imagen: "papas_cheddar.png",
      disponible: false,
      eliminado: false,
      categoriaId: 2,
    },
  ];

  it("normaliza texto para buscar sin tildes", () => {
    expect(normalizeSearchText("  MilanéSas  ")).toBe("milanesas");
  });

  it("filtra productos no disponibles y eliminados", () => {
    const catalogProducts = buildCatalogProducts(products, categories);

    expect(catalogProducts).toHaveLength(2);
    expect(catalogProducts[0]).toMatchObject({
      id: 1,
      categoryName: "Milanesas",
    });
  });

  it("filtra por categoria, busca y ordena", () => {
    const catalogProducts = buildCatalogProducts(products, categories);
    const filteredProducts = filterCatalogProducts(
      catalogProducts,
      "papas",
      2,
      "price-desc"
    );

    expect(filteredProducts).toHaveLength(1);
    expect(filteredProducts[0].nombre).toBe("Papas Baston");
  });
});
