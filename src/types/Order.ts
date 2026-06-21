export type OrderStatus =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "TERMINADO"
  | "CANCELADO";

export type PaymentMethod = "TARJETA" | "TRANSFERENCIA" | "EFECTIVO";

export interface OrderDetail {
  idProducto: number;
  cantidad: number;
  subtotal: number;
  productName?: string;
}

export interface Order {
  id: string;
  fecha: string;
  estado: OrderStatus;
  total: number;
  formaPago: PaymentMethod;
  idUsuario: string;
  telefono?: string;
  detalles: OrderDetail[];
}
