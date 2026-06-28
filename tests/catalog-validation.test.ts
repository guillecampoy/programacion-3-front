import { describe, expect, it } from "vitest";
import {
  buildCatalogProducts,
  filterCatalogProducts,
  normalizeSearchText,
} from "../src/utils/catalog";
import {
  validateCheckout,
  validateCredentials,
  validateEmail,
  validatePassword,
  validateRegistration,
} from "../src/utils/validation";

describe("catalog and validation", () => {
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
      stock: 3,
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
      stock: 2,
      imagen: "",
      disponible: false,
      eliminado: false,
      categoriaId: 2,
    },
  ];

  it("normaliza texto y construye el catálogo visible", () => {
    expect(normalizeSearchText("  Milanésa ")).toBe("milanesa");

    expect(buildCatalogProducts(products, categories)).toEqual([
      expect.objectContaining({
        id: 1,
        categoryName: "Milanesas",
      }),
    ]);
  });

  it("filtra y ordena productos por criterio", () => {
    const catalog = buildCatalogProducts(products, categories);

    expect(filterCatalogProducts(catalog, "milanesa", null, "name-asc")).toHaveLength(1);
    expect(filterCatalogProducts(catalog, "", 1, "price-desc")[0].id).toBe(1);
    expect(filterCatalogProducts(catalog, "", null, "name-desc")[0].id).toBe(1);
    expect(filterCatalogProducts(catalog, "", null, "price-asc")[0].id).toBe(1);
  });

  it("valida credenciales, registro y checkout", () => {
    expect(validateEmail("")).toBe("Email y contraseña son requeridos.");
    expect(validateEmail("mal")).toBe("Ingresá un email válido.");
    expect(validatePassword("")).toBe("Email y contraseña son requeridos.");
    expect(validatePassword("abc")).toBe(
      "La contraseña debe tener entre 8 y 20 caracteres."
    );
    expect(validateCredentials("mail", "abc")).toContain("Ingresá un email válido.");
    expect(validateRegistration("", "mail@test.com", "abc123")).toBe(
      "El nombre es requerido."
    );
    expect(validateRegistration("Nuevo", "mail@test.com", "abc")).toBe(
      "La contraseña debe tener al menos 6 caracteres."
    );
    expect(validateCheckout("", "TARJETA")).toBe("El teléfono es requerido.");
    expect(validateCheckout("11ab555", "TARJETA")).toBe(
      "El teléfono debe contener solo números."
    );
    expect(validateCheckout("1155555555", "")).toBe("La forma de pago es requerida.");
  });
});
