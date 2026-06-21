import type { ApiCategory } from "./api";

export interface AdminCategory extends ApiCategory {}

export interface AdminCategoryInput {
  name: string;
  description: string;
  image: string;
}

const normalizeCategoryName = (value: string): string =>
  value.replace(/\s+/g, "").toLowerCase();

export const isCategoryNameTaken = (
  categories: AdminCategory[],
  name: string,
  excludedId?: number
): boolean => {
  const normalizedName = normalizeCategoryName(name);

  return categories.some(
    (category) =>
      !category.eliminado &&
      normalizeCategoryName(category.nombre) === normalizedName &&
      category.id !== excludedId
  );
};

export const getNextAdminCategoryId = (
  categories: AdminCategory[]
): number =>
  categories.reduce(
    (currentMax, category) => Math.max(currentMax, category.id),
    0
  ) + 1;

export const createAdminCategory = (
  categories: AdminCategory[],
  input: AdminCategoryInput
): AdminCategory[] => [
  ...categories,
  {
    id: getNextAdminCategoryId(categories),
    nombre: input.name.trim(),
    descripcion: input.description.trim(),
    imagen: input.image.trim(),
    eliminado: false,
  },
];

export const updateAdminCategory = (
  categories: AdminCategory[],
  id: number,
  input: AdminCategoryInput
): AdminCategory[] =>
  categories.map((category) =>
    category.id === id
      ? {
          ...category,
          nombre: input.name.trim(),
          descripcion: input.description.trim(),
          imagen: input.image.trim(),
        }
      : category
  );

export const deleteAdminCategory = (
  categories: AdminCategory[],
  id: number
): AdminCategory[] =>
  categories.map((category) =>
    category.id === id ? { ...category, eliminado: true } : category
  );

export const getVisibleAdminCategories = (
  categories: AdminCategory[]
): AdminCategory[] => categories.filter((category) => !category.eliminado);
