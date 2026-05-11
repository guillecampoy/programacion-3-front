import type { IUser } from "../types/IUser";
import { Rol, type Rol as RolType } from "../types/Rol";
import {
  getUser,
  getUsers,
  removeUser,
  saveUser,
  saveUsers,
} from "./localStorage";
import { hashPassword, isSha256Hash } from "./hash";
import { navigate, ROUTES } from "./navigate";

const seedUsers: IUser[] = [
  {
    id: "admin-seed",
    email: "admin@test.com",
    password: "admin123",
    role: Rol.Admin,
  },
  {
    id: "client-seed",
    email: "client@test.com",
    password: "client123",
    role: Rol.Client,
  },
];

const hashUserPassword = async (user: IUser): Promise<IUser> => ({
  ...user,
  password: await hashPassword(user.password),
});

const migrateUsersIfNeeded = async (): Promise<IUser[]> => {
  const users = getUsers();
  let usersWereMigrated = false;

  const migratedUsers = await Promise.all(
    users.map(async (user) => {
      if (isSha256Hash(user.password)) {
        return user;
      }

      usersWereMigrated = true;
      return hashUserPassword(user);
    })
  );

  if (usersWereMigrated) {
    saveUsers(migratedUsers);
  }

  return migratedUsers;
};

export const seedUsersIfNeeded = async (): Promise<void> => {
  if (!localStorage.getItem("users")) {
    saveUsers(await Promise.all(seedUsers.map(hashUserPassword)));
    return;
  }

  const users = await migrateUsersIfNeeded();
  const hasAdmin = users.some((user) => user.role === Rol.Admin);
  const hasClient = users.some((user) => user.role === Rol.Client);
  const missingSeedUsers = seedUsers.filter((seedUser) => {
    const roleIsMissing =
      (seedUser.role === Rol.Admin && !hasAdmin) ||
      (seedUser.role === Rol.Client && !hasClient);
    const emailExists = users.some((user) => user.email === seedUser.email);

    return roleIsMissing && !emailExists;
  });

  if (missingSeedUsers.length > 0) {
    saveUsers([...users, ...(await Promise.all(missingSeedUsers.map(hashUserPassword)))]);
  }
};

export const registerUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  const normalizedEmail = email.trim();
  const users = await migrateUsersIfNeeded();
  const userExists = users.some((user) => user.email === normalizedEmail);

  if (userExists) {
    return "Ya existe un usuario con ese email.";
  }

  const newUser: IUser = {
    id: `user-${Date.now().toString()}`,
    email: normalizedEmail,
    password: await hashPassword(password),
    role: Rol.Client,
  };

  saveUsers([...users, newUser]);
  return null;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const normalizedEmail = email.trim();
  const users = await migrateUsersIfNeeded();
  const hashedPassword = await hashPassword(password);
  const user = users.find(
    (storedUser) =>
      storedUser.email === normalizedEmail &&
      storedUser.password === hashedPassword
  );

  if (!user) {
    return null;
  }

  saveUser(user);
  return user;
};

export const redirectByRole = (user: IUser): void => {
  if (user.role === Rol.Admin) {
    navigate(ROUTES.adminHome);
    return;
  }

  navigate(ROUTES.clientHome);
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

  if (path.includes("/client/") || path === "/client") {
    return Rol.Client;
  }

  return null;
};

export const guardRoute = async (): Promise<void> => {
  await seedUsersIfNeeded();

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
