import { describe, expect, it } from "vitest";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductCategoryName,
  getNextAdminProductId,
  validateAdminProductInput,
  updateAdminProduct,
} from "../src/utils/adminProducts";

const categories = [
  {
    id: 1,
    nombre: "Milanesas",
    descripcion: "Platos de milanesa",
    imagen: "mila_napo_bodegon.png",
    eliminado: false,
  },
  {
    id: 2,
    nombre: "Papas Fritas",
    descripcion: "Guarniciones",
    imagen: "papas_bodegon.png",
    eliminado: false,
  },
  {
    id: 3,
    nombre: "Minutas",
    descripcion: "Opciones rápidas",
    imagen: "chori_bodegon.png",
    eliminado: true,
  },
];

const products = [
  {
    id: 1,
    nombre: "Milanesa Napolitana",
    descripcion: "Clásica",
    precio: 18000,
    stock: 12,
    imagen: "mila_napo_bodegon.png",
    disponible: true,
    eliminado: false,
    categoriaId: 1,
  },
];

describe("adminProducts", () => {
  it("valida precio, stock y categoría existente", () => {
    expect(
      validateAdminProductInput(
        {
          nombre: "",
          descripcion: "Clásica",
          precio: 18000,
          stock: 1,
          categoriaId: 1,
          imagen: "mila_napo_bodegon.png",
          disponible: true,
        },
        categories
      )
    ).toBe("Completá el nombre del producto.");

    expect(
      validateAdminProductInput(
        {
          nombre: "Nuevo",
          descripcion: "Clásica",
          precio: 0,
          stock: 1,
          categoriaId: 1,
          imagen: "mila_napo_bodegon.png",
          disponible: true,
        },
        categories
      )
    ).toBe("El precio debe ser mayor a cero.");

    expect(
      validateAdminProductInput(
        {
          nombre: "Nuevo",
          descripcion: "Clásica",
          precio: 100,
          stock: -1,
          categoriaId: 1,
          imagen: "mila_napo_bodegon.png",
          disponible: true,
        },
        categories
      )
    ).toBe("El stock debe ser un entero mayor o igual a cero.");

    expect(
      validateAdminProductInput(
        {
          nombre: "Nuevo",
          descripcion: "Clásica",
          precio: 100,
          stock: 1,
          categoriaId: 3,
          imagen: "mila_napo_bodegon.png",
          disponible: true,
        },
        categories
      )
    ).toBe("Seleccioná una categoría existente.");
  });

  it("crea productos con id incremental y valores recortados", () => {
    const next = createAdminProduct(products, {
      nombre: "  Choripán  ",
      descripcion: "  Con pan crocante  ",
      precio: 13000,
      stock: 5,
      categoriaId: 2,
      imagen: "  chori_bodegon.png  ",
      disponible: false,
    });

    expect(next).toHaveLength(2);
    expect(next[1]).toMatchObject({
      id: 2,
      nombre: "Choripán",
      descripcion: "Con pan crocante",
      precio: 13000,
      stock: 5,
      imagen: "chori_bodegon.png",
      disponible: false,
      categoriaId: 2,
    });
  });

  it("actualiza y elimina productos en memoria", () => {
    const updated = updateAdminProduct(products, 1, {
      nombre: "Milanesa a Caballo",
      descripcion: "Con huevo",
      precio: 23400,
      stock: 8,
      categoriaId: 1,
      imagen: "mila_a_caballo.png",
      disponible: false,
    });

    expect(updated[0]).toMatchObject({
      nombre: "Milanesa a Caballo",
      descripcion: "Con huevo",
      precio: 23400,
      stock: 8,
      imagen: "mila_a_caballo.png",
      disponible: false,
      categoriaId: 1,
    });

    const deleted = deleteAdminProduct(updated, 1);

    expect(deleted).toHaveLength(0);
  });

  it("resuelve el nombre de categoría para mostrar", () => {
    expect(getAdminProductCategoryName(2, categories)).toBe("Papas Fritas");
    expect(getAdminProductCategoryName(99, categories)).toBeNull();
  });

  it("calcula el siguiente id desde el mayor existente", () => {
    expect(getNextAdminProductId(products)).toBe(2);
  });
});
