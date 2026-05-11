import type { Order } from "../types/Order";

const ORDERS_KEY = "orders";

const defaultOrders: Order[] = [
  {
    id: "PED-1001",
    clientEmail: "client@test.com",
    status: "Pendiente",
    total: 27500,
    createdAt: "2026-05-11",
    items: [
      {
        productName: "Milanesa Napolitana",
        quantity: 1,
        subtotal: 18000,
      },
      {
        productName: "Papas bastón",
        quantity: 1,
        subtotal: 9500,
      },
    ],
  },
  {
    id: "PED-1002",
    clientEmail: "client@test.com",
    status: "Preparando",
    total: 26000,
    createdAt: "2026-05-11",
    items: [
      {
        productName: "Choripán",
        quantity: 2,
        subtotal: 26000,
      },
    ],
  },
];

const isOrder = (value: unknown): value is Order => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.id === "string" &&
    typeof order.clientEmail === "string" &&
    (order.status === "Pendiente" ||
      order.status === "Preparando" ||
      order.status === "Entregado") &&
    typeof order.total === "number" &&
    typeof order.createdAt === "string" &&
    Array.isArray(order.items)
  );
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const ordersFromStorage = localStorage.getItem(ORDERS_KEY);

  if (!ordersFromStorage) {
    saveOrders(defaultOrders);
    return defaultOrders;
  }

  try {
    const parsedOrders = JSON.parse(ordersFromStorage) as unknown;

    if (!Array.isArray(parsedOrders)) {
      saveOrders(defaultOrders);
      return defaultOrders;
    }

    return parsedOrders.filter(isOrder);
  } catch {
    saveOrders(defaultOrders);
    return defaultOrders;
  }
};
