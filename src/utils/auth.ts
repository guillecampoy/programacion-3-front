import type { IUser } from "../types/IUser";
import { Rol, type Rol as RolType } from "../types/Rol";
import type { ApiUser } from "./api";
import { fetchUsers, mapApiRoleToRole } from "./api";
import {
  getUser,
  getUsers,
  removeUser,
  saveUser,
  saveUsers,
  type IStoredUser,
} from "./localStorage";
import { hashPassword } from "./hash";
import { navigate, ROUTES } from "./navigate";

const mapApiUserToSessionUser = (user: ApiUser): IUser => ({
  id: user.id,
  email: user.mail.trim(),
  role: mapApiRoleToRole(user.rol),
});

export const registerUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  const normalizedEmail = email.trim();
  const localUsers = getUsers();
  const apiUsers = await fetchUsers().catch(() => []);
  const emailExists =
    localUsers.some((user) => user.email === normalizedEmail) ||
    apiUsers.some((user) => user.mail.trim() === normalizedEmail);

  if (emailExists) {
    return "Ya existe un usuario con ese email.";
  }

  const newUser: IStoredUser = {
    id: `user-${Date.now().toString()}`,
    email: normalizedEmail,
    password: await hashPassword(password),
    role: Rol.Client,
  };

  saveUsers([...localUsers, newUser]);
  return null;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const normalizedEmail = email.trim();
  const users = await fetchUsers().catch(() => []);
  const user = users.find(
    (storedUser) =>
      storedUser.mail.trim() === normalizedEmail &&
      storedUser.password === password
  );

  if (!user) {
    return null;
  }

  const sessionUser = mapApiUserToSessionUser(user);
  saveUser(sessionUser);
  return sessionUser;
};

export const redirectByRole = (user: IUser): void => {
  if (user.role === Rol.Admin) {
    navigate(ROUTES.adminHome);
    return;
  }

  navigate(ROUTES.storeHome);
};

const isPublicRoute = (path: string): boolean => {
  const publicRoutes = [
    "/",
    "/index.html",
    "/login",
    "/registro",
    "/auth/login",
    "/auth/registro",
    ROUTES.login,
    ROUTES.registro,
  ];

  return publicRoutes.includes(path);
};

const getRequiredRole = (path: string): RolType | null => {
  if (path.includes("/admin/") || path === "/admin") {
    return Rol.Admin;
  }

  if (
    path.includes("/store/") ||
    path === "/store" ||
    path.includes("/client/") ||
    path === "/client"
  ) {
    return Rol.Client;
  }

  return null;
};

export const guardRoute = async (): Promise<void> => {
  const path = window.location.pathname;

  if (isPublicRoute(path)) {
    return;
  }

  const requiredRole = getRequiredRole(path);

  if (!requiredRole) {
    return;
  }

  const currentUser = getUser();

  if (!currentUser) {
    navigate(ROUTES.login);
    return;
  }

  if (currentUser.role !== requiredRole) {
    redirectByRole(currentUser);
  }
};

export const logout = (): void => {
  removeUser();
  navigate(ROUTES.login);
};
