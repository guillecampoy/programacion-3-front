import type { ApiCategory, ApiOrder, ApiProduct, ApiUser } from "./api";
import type { OrderStatus } from "../types/Order";

export interface AdminDashboardData {
  categories: ApiCategory[];
  products: ApiProduct[];
  users: ApiUser[];
  orders: ApiOrder[];
}

export interface AdminDashboardStats {
  totalCategories: number;
  totalProducts: number;
  totalOrders: number;
  availableProducts: number;
  activeCategories: number;
  inactiveCategories: number;
  activeProducts: number;
  inactiveProducts: number;
  adminUsers: number;
  clientUsers: number;
  orderStatusCounts: Record<OrderStatus, number>;
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "TERMINADO",
  "CANCELADO",
];

const emptyStatusCounts = (): Record<OrderStatus, number> =>
  ORDER_STATUSES.reduce(
    (counts, status) => ({
      ...counts,
      [status]: 0,
    }),
    {} as Record<OrderStatus, number>
  );

export const buildAdminDashboardStats = ({
  categories,
  products,
  users,
  orders,
}: AdminDashboardData): AdminDashboardStats => {
  const activeCategories = categories.filter((category) => !category.eliminado).length;
  const inactiveCategories = categories.length - activeCategories;
  const availableProducts = products.filter(
    (product) => product.disponible && !product.eliminado
  ).length;
  const activeProducts = availableProducts;
  const inactiveProducts = products.length - activeProducts;

  const orderStatusCounts = emptyStatusCounts();

  orders.forEach((order) => {
    orderStatusCounts[order.estado] += 1;
  });

  return {
    totalCategories: categories.length,
    totalProducts: products.length,
    totalOrders: orders.length,
    availableProducts,
    activeCategories,
    inactiveCategories,
    activeProducts,
    inactiveProducts,
    adminUsers: users.filter((user) => user.rol === "ADMIN").length,
    clientUsers: users.filter((user) => user.rol === "USUARIO").length,
    orderStatusCounts,
  };
};
