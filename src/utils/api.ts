import type { Rol } from "../types/Rol";

export interface ApiUser {
  id: string;
  nombre: string;
  apellido: string;
  mail: string;
  celular: string;
  password: string;
  rol: "ADMIN" | "USUARIO";
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

export const fetchUsers = async (): Promise<ApiUser[]> => {
  const response = await fetch("/data/usuarios.json");

  if (!response.ok) {
    throw new Error("No se pudieron cargar los usuarios.");
  }

  const parsedUsers = (await response.json()) as unknown;

  if (!Array.isArray(parsedUsers)) {
    return [];
  }

  return parsedUsers.filter(isApiUser);
};

export const mapApiRoleToRole = (role: ApiUser["rol"]): Rol =>
  role === "ADMIN" ? "admin" : "client";
