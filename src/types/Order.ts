export interface OrderItem {
  productName: string;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  clientEmail: string;
  status: "Pendiente" | "Preparando" | "Entregado";
  total: number;
  createdAt: string;
  items: OrderItem[];
}
