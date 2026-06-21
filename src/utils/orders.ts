import type { CartItem } from "../types/Cart";
import type { IUser } from "../types/IUser";
import type {
  Order,
  OrderDetail,
  OrderStatus,
  PaymentMethod,
} from "../types/Order";

const ORDERS_KEY = "orders";

export const ENVIO = 2500;

const defaultOrders: Order[] = [
  {
    id: "PED-1001",
    fecha: "2026-05-11",
    estado: "PENDIENTE",
    total: 30000,
    formaPago: "EFECTIVO",
    idUsuario: "user-1",
    telefono: "1111111111",
    detalles: [
      {
        idProducto: 1,
        cantidad: 1,
        subtotal: 18000,
        productName: "Milanesa Napolitana",
      },
      {
        idProducto: 6,
        cantidad: 1,
        subtotal: 9500,
        productName: "Papas Baston",
      },
    ],
  },
  {
    id: "PED-1002",
    fecha: "2026-05-11",
    estado: "CONFIRMADO",
    total: 28500,
    formaPago: "TARJETA",
    idUsuario: "user-1",
    telefono: "2222222222",
    detalles: [
      {
        idProducto: 4,
        cantidad: 2,
        subtotal: 26000,
        productName: "Choripan",
      },
    ],
  },
];

const ORDER_STATUS_VALUES: OrderStatus[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "TERMINADO",
  "CANCELADO",
];

const PAYMENT_METHOD_VALUES: PaymentMethod[] = [
  "TARJETA",
  "TRANSFERENCIA",
  "EFECTIVO",
];

const normalizeLegacyStatus = (status: unknown): OrderStatus | null => {
  if (typeof status !== "string") {
    return null;
  }

  if (ORDER_STATUS_VALUES.includes(status as OrderStatus)) {
    return status as OrderStatus;
  }

  switch (status) {
    case "Pendiente":
      return "PENDIENTE";
    case "Preparando":
      return "CONFIRMADO";
    case "Entregado":
      return "TERMINADO";
    case "Cancelado":
      return "CANCELADO";
    default:
      return null;
  }
};

const normalizePaymentMethod = (value: unknown): PaymentMethod | null => {
  if (typeof value !== "string") {
    return null;
  }

  return PAYMENT_METHOD_VALUES.includes(value as PaymentMethod)
    ? (value as PaymentMethod)
    : null;
};

const normalizeLegacyDetail = (value: unknown): OrderDetail | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const detail = value as Record<string, unknown>;

  if (
    typeof detail.idProducto !== "number" ||
    typeof detail.cantidad !== "number" ||
    typeof detail.subtotal !== "number"
  ) {
    return null;
  }

  const normalizedDetail: OrderDetail = {
    idProducto: detail.idProducto,
    cantidad: detail.cantidad,
    subtotal: detail.subtotal,
  };

  if (typeof detail.productName === "string") {
    normalizedDetail.productName = detail.productName;
  }

  return normalizedDetail;
};

const isOrderDetail = (value: unknown): value is OrderDetail => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const detail = value as Record<string, unknown>;

  return (
    typeof detail.idProducto === "number" &&
    typeof detail.cantidad === "number" &&
    typeof detail.subtotal === "number"
  );
};

const isOrder = (value: unknown): value is Order => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.id === "string" &&
    typeof order.fecha === "string" &&
    normalizeLegacyStatus(order.estado) !== null &&
    typeof order.total === "number" &&
    normalizePaymentMethod(order.formaPago) !== null &&
    typeof order.idUsuario === "string" &&
    Array.isArray(order.detalles) &&
    order.detalles.every(isOrderDetail)
  );
};

const migrateOrder = (order: Record<string, unknown>): Order | null => {
  const status = normalizeLegacyStatus(order.estado ?? order.status);
  const paymentMethod = normalizePaymentMethod(order.formaPago) ?? "EFECTIVO";
  const idUsuario =
    typeof order.idUsuario === "string"
      ? order.idUsuario
      : typeof order.clientEmail === "string"
        ? order.clientEmail
        : null;

  if (!status || !idUsuario) {
    return null;
  }

  const detalles = Array.isArray(order.detalles)
    ? order.detalles.filter(isOrderDetail)
    : Array.isArray(order.items)
      ? order.items
          .map(normalizeLegacyDetail)
          .filter((item): item is OrderDetail => item !== null)
      : [];

  return {
    id: typeof order.id === "string" ? order.id : `PED-${Date.now()}`,
    fecha:
      typeof order.fecha === "string"
        ? order.fecha
        : typeof order.createdAt === "string"
          ? order.createdAt
          : new Date().toISOString().slice(0, 10),
    estado: status,
    total: typeof order.total === "number" ? order.total : 0,
    formaPago: paymentMethod,
    idUsuario,
    telefono: typeof order.telefono === "string" ? order.telefono : undefined,
    detalles,
  };
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

    const normalizedOrders = parsedOrders
      .map((order) =>
        isOrder(order) ? order : migrateOrder(order as Record<string, unknown>)
      )
      .filter((order): order is Order => order !== null);

    if (normalizedOrders.length !== parsedOrders.length) {
      saveOrders(normalizedOrders);
    }

    return normalizedOrders;
  } catch {
    saveOrders(defaultOrders);
    return defaultOrders;
  }
};

export const calculateCartSummary = (cart: CartItem[]): {
  subtotal: number;
  envio: number;
  total: number;
} => {
  const subtotal = cart.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
    0
  );

  return {
    subtotal,
    envio: ENVIO,
    total: subtotal + ENVIO,
  };
};

export const createOrderFromCart = (
  cart: CartItem[],
  user: IUser,
  phone: string,
  paymentMethod: PaymentMethod
): Order => {
  const { total } = calculateCartSummary(cart);

  return {
    id: `PED-${Date.now()}`,
    fecha: new Date().toISOString().slice(0, 10),
    estado: "PENDIENTE",
    total,
    formaPago: paymentMethod,
    idUsuario: user.id,
    telefono: phone.trim(),
    detalles: cart.map((cartItem) => ({
      idProducto: cartItem.product.id,
      cantidad: cartItem.quantity,
      subtotal: cartItem.product.price * cartItem.quantity,
      productName: cartItem.product.name,
    })),
  };
};
