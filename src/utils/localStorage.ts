import type { IUser } from "../types/IUser";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "userData";

const isUser = (value: unknown): value is IUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.password === "string" &&
    (user.role === "admin" || user.role === "client")
  );
};

export const getUsers = (): IUser[] => {
  const usersFromStorage = localStorage.getItem(USERS_KEY);

  if (!usersFromStorage) {
    return [];
  }

  try {
    const parsedUsers = JSON.parse(usersFromStorage) as unknown;

    if (!Array.isArray(parsedUsers)) {
      return [];
    }

    return parsedUsers.filter(isUser);
  } catch {
    return [];
  }
};

export const saveUsers = (users: IUser[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const saveUser = (user: IUser): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getUser = (): IUser | null => {
  const userFromStorage = localStorage.getItem(CURRENT_USER_KEY);

  if (!userFromStorage) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(userFromStorage) as unknown;
    return isUser(parsedUser) ? parsedUser : null;
  } catch {
    return null;
  }
};

export const removeUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
