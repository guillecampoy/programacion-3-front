import { describe, expect, it } from "vitest";
import {
  createAdminCategory,
  deleteAdminCategory,
  getNextAdminCategoryId,
  getVisibleAdminCategories,
  isCategoryNameTaken,
  updateAdminCategory,
} from "../src/utils/adminCategories";

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
    eliminado: true,
  },
];

describe("adminCategories", () => {
  it("crea una categoría con id incremental y campos recortados", () => {
    const next = createAdminCategory(categories, {
      name: "  Minutas  ",
      description: "  Sandwiches y empanadas  ",
      image: "  chori_bodegon.png  ",
    });

    expect(next).toHaveLength(3);
    expect(next[2]).toMatchObject({
      id: 3,
      nombre: "Minutas",
      descripcion: "Sandwiches y empanadas",
      imagen: "chori_bodegon.png",
      eliminado: false,
    });
  });

  it("actualiza una categoría existente sin tocar las demás", () => {
    const next = updateAdminCategory(categories, 1, {
      name: "Milanesas completas",
      description: "Versiones completas",
      image: "mila_a_caballo.png",
    });

    expect(next[0]).toMatchObject({
      id: 1,
      nombre: "Milanesas completas",
      descripcion: "Versiones completas",
      imagen: "mila_a_caballo.png",
    });
    expect(next[1]).toMatchObject({
      id: 2,
      nombre: "Papas Fritas",
    });
  });

  it("marca la categoría como eliminada en vez de borrarla", () => {
    const next = deleteAdminCategory(categories, 1);

    expect(next[0].eliminado).toBe(true);
    expect(next[1].eliminado).toBe(true);
    expect(getVisibleAdminCategories(next)).toHaveLength(0);
  });

  it("detecta nombres duplicados ignorando categorías eliminadas", () => {
    expect(isCategoryNameTaken(categories, "Milanesas")).toBe(true);
    expect(isCategoryNameTaken(categories, "papas fritas")).toBe(false);
    expect(isCategoryNameTaken(categories, "Milanesas completas", 1)).toBe(false);
  });

  it("calcula el siguiente id desde el mayor existente", () => {
    expect(getNextAdminCategoryId(categories)).toBe(3);
  });
});
