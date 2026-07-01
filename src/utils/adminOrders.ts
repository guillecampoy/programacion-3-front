import type { ApiUser } from "./api";
import { mergeOrdersById, sortOrdersByDateDesc } from "./orderHistory";
import type { Order, OrderStatus } from "../types/Order";

export type AdminOrderStatusFilter = OrderStatus | "TODOS";

export const sortAdminOrdersByDateDesc = (orders: Order[]): Order[] =>
  sortOrdersByDateDesc(mergeOrdersById(orders));

export const filterAdminOrdersByStatus = (
  orders: Order[],
  status: AdminOrderStatusFilter
): Order[] =>
  status === "TODOS" ? orders : orders.filter((order) => order.estado === status);

export const updateAdminOrderStatus = (
  orders: Order[],
  orderId: string,
  status: OrderStatus
): Order[] =>
  orders.map((order) =>
    order.id === orderId ? { ...order, estado: status } : order
  );

export const getAdminOrderCustomerName = (
  order: Order,
  users: ApiUser[]
): string => {
  const user = users.find((item) => item.id === order.idUsuario);

  if (!user) {
    return order.idUsuario;
  }

  const fullName = `${user.nombre} ${user.apellido}`.trim();

  return fullName.length > 0 ? fullName : user.mail;
};

export const getAdminOrderItemCount = (order: Order): number =>
  order.detalles.reduce((total, detail) => total + detail.cantidad, 0);
