import type { Rol } from "../types/Rol";
import { resolveProductImageUrl } from "./productImages";

export interface ApiUser {
  id: string;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  password: string;
  rol: "ADMIN" | "USUARIO";
}

export interface ApiCategory {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  eliminado: boolean;
}

export interface ApiProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
  disponible: boolean;
  eliminado: boolean;
  categoriaId: number;
}

const isApiUser = (value: unknown): value is ApiUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.nombre === "string" &&
    typeof user.apellido === "string" &&
    typeof user.mail === "string" &&
    typeof user.celular === "string" &&
    typeof user.password === "string" &&
    (user.rol === "ADMIN" || user.rol === "USUARIO")
  );
};

const isApiCategory = (value: unknown): value is ApiCategory => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const category = value as Record<string, unknown>;

  return (
    typeof category.id === "number" &&
    typeof category.nombre === "string" &&
    typeof category.descripcion === "string" &&
    typeof category.imagen === "string" &&
    typeof category.eliminado === "boolean"
  );
};

const isApiProduct = (value: unknown): value is ApiProduct => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.nombre === "string" &&
    typeof product.descripcion === "string" &&
    typeof product.precio === "number" &&
    typeof product.stock === "number" &&
    typeof product.imagen === "string" &&
    typeof product.disponible === "boolean" &&
    typeof product.eliminado === "boolean" &&
    typeof product.categoriaId === "number"
  );
};

const fetchJsonArray = async <T>(
  path: string,
  isItem: (value: unknown) => value is T
): Promise<T[]> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path}.`);
  }

  const parsedValue = (await response.json()) as unknown;

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter(isItem);
};

export const fetchUsers = async (): Promise<ApiUser[]> => {
  return fetchJsonArray("/data/usuarios.json", isApiUser);
};

export const fetchUserByEmail = async (email: string): Promise<ApiUser | null> => {
  const users = await fetchUsers();
  const normalizedEmail = email.trim();

  return (
    users.find((user) => user.mail.trim() === normalizedEmail) ?? null
  );
};

export const fetchCategories = async (): Promise<ApiCategory[]> =>
  fetchJsonArray("/data/categorias.json", isApiCategory);

export const fetchProducts = async (): Promise<ApiProduct[]> =>
  fetchJsonArray("/data/productos.json", isApiProduct).then((products) =>
    products.map((product) => ({
      ...product,
      imagen: resolveProductImageUrl(product.imagen) || product.imagen,
    }))
  );

export const mapApiRoleToRole = (role: ApiUser["rol"]): Rol =>
  role === "ADMIN" ? "admin" : "client";
