import type { CartItem } from "../types/Cart";
import type { IUser } from "../types/IUser";
import type { Product } from "../types/Product";
import { Rol } from "../types/Rol";

const USERS_KEY = "users";
const CURRENT_USER_KEY = "userData";
const CART_KEY = "cart";

const isUser = (value: unknown): value is IUser => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.password === "string" &&
    (user.role === Rol.Admin || user.role === Rol.Client)
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

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const cartItem = value as Record<string, unknown>;
  const product = cartItem.product as Record<string, unknown> | undefined;

  return (
    typeof cartItem.quantity === "number" &&
    cartItem.quantity > 0 &&
    !!product &&
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.longDescription === "string" &&
    typeof product.price === "number" &&
    typeof product.image === "string" &&
    typeof product.category === "string" &&
    typeof product.destacado === "boolean"
  );
};

export const getCart = (): CartItem[] => {
  const cartFromStorage = localStorage.getItem(CART_KEY);

  if (!cartFromStorage) {
    return [];
  }

  try {
    const parsedCart = JSON.parse(cartFromStorage) as unknown;

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.filter(isCartItem);
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

export const removeProductFromCart = (productId: Product["id"]): CartItem[] => {
  const cart = getCart().filter((item) => item.product.id !== productId);

  if (cart.length === 0) {
    clearCart();
    return [];
  }

  saveCart(cart);
  return cart;
};

export const updateProductQuantityInCart = (
  productId: Product["id"],
  quantity: number
): CartItem[] => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return getCart();
  }

  const cart = getCart().map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );

  saveCart(cart);
  return cart;
};

export const addProductToCart = (product: Product): CartItem[] => {
  const cart = getCart();
  const cartItem = cart.find((item) => item.product.id === product.id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ product, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};
