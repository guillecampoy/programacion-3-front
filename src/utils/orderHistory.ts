import type { Order, OrderDetail } from "../types/Order";

export interface OrderHistoryDetail extends OrderDetail {
  productName: string;
}

export interface OrderProductName {
  id: number;
  name: string;
}

export interface OrderHistoryItem {
  order: Order;
  subtotal: number;
  envio: number;
  itemCount: number;
  previewDetails: OrderHistoryDetail[];
  details: OrderHistoryDetail[];
}

const resolveDetailProductName = (
  detail: OrderDetail,
  productNamesById: Map<number, string>
): string => detail.productName ?? productNamesById.get(detail.idProducto) ?? `Producto #${detail.idProducto}`;

export const mergeOrdersById = (orders: Order[]): Order[] => {
  const ordersById = new Map<string, Order>();

  orders.forEach((order) => {
    ordersById.set(order.id, order);
  });

  return Array.from(ordersById.values());
};

export const filterOrdersByUser = (
  orders: Order[],
  userId: string
): Order[] => orders.filter((order) => order.idUsuario === userId);

export const sortOrdersByDateDesc = (orders: Order[]): Order[] =>
  [...orders].sort((left, right) => {
    const dateDiff = right.fecha.localeCompare(left.fecha);

    if (dateDiff !== 0) {
      return dateDiff;
    }

    return right.id.localeCompare(left.id);
  });

export const getOrderSubtotal = (order: Order): number =>
  order.detalles.reduce((total, detail) => total + detail.subtotal, 0);

export const getOrderShipping = (order: Order): number =>
  Math.max(order.total - getOrderSubtotal(order), 0);

export const buildOrderHistory = (
  orders: Order[],
  products: OrderProductName[],
  userId: string
): OrderHistoryItem[] => {
  const productNamesById = new Map<number, string>(
    products.map((product) => [product.id, product.name])
  );

  return sortOrdersByDateDesc(
    filterOrdersByUser(mergeOrdersById(orders), userId)
  ).map((order) => {
    const details = order.detalles.map((detail) => ({
      ...detail,
      productName: resolveDetailProductName(detail, productNamesById),
    }));

    return {
      order,
      subtotal: getOrderSubtotal(order),
      envio: getOrderShipping(order),
      itemCount: order.detalles.reduce((total, detail) => total + detail.cantidad, 0),
      previewDetails: details.slice(0, 3),
      details,
    };
  });
};
