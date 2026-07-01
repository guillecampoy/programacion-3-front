import type { ApiCategory, ApiProduct } from "./api";

export interface AdminProductInput {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  imagen: string;
  disponible: boolean;
}

const isPositiveIntegerOrZero = (value: number): boolean =>
  Number.isInteger(value) && value >= 0;

export const getNextAdminProductId = (products: ApiProduct[]): number =>
  products.reduce((currentMax, product) => Math.max(currentMax, product.id), 0) +
  1;

export const getAdminProductCategoryName = (
  categoryId: number,
  categories: ApiCategory[]
): string | null =>
  categories.find((category) => category.id === categoryId)?.nombre ?? null;

export const validateAdminProductInput = (
  input: AdminProductInput,
  categories: ApiCategory[]
): string | null => {
  if (!input.nombre.trim()) {
    return "Completá el nombre del producto.";
  }

  if (!input.descripcion.trim()) {
    return "Completá la descripción del producto.";
  }

  if (!input.imagen.trim()) {
    return "Seleccioná una imagen.";
  }

  if (!Number.isFinite(input.precio) || input.precio <= 0) {
    return "El precio debe ser mayor a cero.";
  }

  if (!isPositiveIntegerOrZero(input.stock)) {
    return "El stock debe ser un entero mayor o igual a cero.";
  }

  const category = categories.find((item) => item.id === input.categoriaId);

  if (!category || category.eliminado) {
    return "Seleccioná una categoría existente.";
  }

  return null;
};

export const createAdminProduct = (
  products: ApiProduct[],
  input: AdminProductInput
): ApiProduct[] => [
  ...products,
  {
    id: getNextAdminProductId(products),
    nombre: input.nombre.trim(),
    descripcion: input.descripcion.trim(),
    precio: input.precio,
    stock: input.stock,
    imagen: input.imagen.trim(),
    disponible: input.disponible,
    eliminado: false,
    categoriaId: input.categoriaId,
  },
];

export const updateAdminProduct = (
  products: ApiProduct[],
  id: number,
  input: AdminProductInput
): ApiProduct[] =>
  products.map((product) =>
    product.id === id
      ? {
          ...product,
          nombre: input.nombre.trim(),
          descripcion: input.descripcion.trim(),
          precio: input.precio,
          stock: input.stock,
          imagen: input.imagen.trim(),
          disponible: input.disponible,
          categoriaId: input.categoriaId,
        }
      : product
  );

export const deleteAdminProduct = (
  products: ApiProduct[],
  id: number
): ApiProduct[] => products.filter((product) => product.id !== id);
