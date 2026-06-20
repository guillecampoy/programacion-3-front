import type { ApiCategory, ApiProduct } from "./api";

export type CatalogSort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface CatalogProduct extends ApiProduct {
  categoryName: string;
}

export const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const buildCatalogProducts = (
  products: ApiProduct[],
  categories: ApiCategory[]
): CatalogProduct[] => {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return products
    .filter((product) => product.disponible && !product.eliminado)
    .map((product) => ({
      ...product,
      categoryName: categoriesById.get(product.categoriaId)?.nombre ?? "Sin categoria",
    }));
};

export const filterCatalogProducts = (
  products: CatalogProduct[],
  searchText: string,
  categoryId: number | null,
  sortBy: CatalogSort
): CatalogProduct[] => {
  const normalizedSearchText = normalizeSearchText(searchText);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryId === null || product.categoriaId === categoryId;
    const matchesSearch =
      normalizedSearchText.length === 0 ||
      normalizeSearchText(product.nombre).includes(normalizedSearchText);

    return matchesCategory && matchesSearch;
  });

  return [...filteredProducts].sort((firstProduct, secondProduct) => {
    switch (sortBy) {
      case "name-asc":
        return firstProduct.nombre.localeCompare(secondProduct.nombre, "es");
      case "name-desc":
        return secondProduct.nombre.localeCompare(firstProduct.nombre, "es");
      case "price-asc":
        return firstProduct.precio - secondProduct.precio;
      case "price-desc":
        return secondProduct.precio - firstProduct.precio;
    }
  });
};
