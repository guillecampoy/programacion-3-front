import type { IUser } from "../types/IUser";
import { Rol, type Rol as RolType } from "../types/Rol";
import type { ApiUser } from "./api";
import { fetchUserByEmail, fetchUsers, mapApiRoleToRole } from "./api";
import { getUser, removeUser, saveUser } from "./localStorage";
import { navigate, ROUTES } from "./navigate";

const mapApiUserToSessionUser = (user: ApiUser): IUser => ({
  id: user.id,
  name: `${user.nombre} ${user.apellido}`.trim(),
  email: user.mail.trim(),
  role: mapApiRoleToRole(user.rol),
});

export const registerUser = async (
  name: string,
  email: string,
  _password: string
): Promise<string | null> => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim();
  const existingUser = await fetchUserByEmail(normalizedEmail).catch(() => null);

  if (existingUser) {
    return "Ya existe un usuario con ese email.";
  }

  const newUser: IUser = {
    id: `user-${Date.now().toString()}`,
    name: normalizedName,
    email: normalizedEmail,
    role: Rol.Client,
  };

  saveUser(newUser);
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

export const canAccessRoute = (userRole: RolType, path: string): boolean => {
  const requiredRole = getRequiredRole(path);

  if (requiredRole === Rol.Admin) {
    return userRole === Rol.Admin;
  }

  if (path === ROUTES.storeCart || path === ROUTES.clientOrders) {
    return userRole === Rol.Client;
  }

  if (path === ROUTES.storeHome || path === ROUTES.storeProductDetail) {
    return true;
  }

  return true;
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

  if (!canAccessRoute(currentUser.role, path)) {
    navigate(ROUTES.storeHome);
  }
};

export const logout = (): void => {
  removeUser();
  navigate(ROUTES.login);
};
