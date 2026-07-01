import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { fetchOrders, fetchProducts } from "../../../utils/api";
import { logout } from "../../../utils/auth";
import {
  buildOrderHistory,
  type OrderProductName,
  type OrderHistoryItem,
} from "../../../utils/orderHistory";
import { getCart, getUser } from "../../../utils/localStorage";
import { getOrders } from "../../../utils/orders";
import { renderStoreNavigation } from "../../../utils/storeNavigation";
import { Rol } from "../../../types/Rol";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const storeNavigation = document.querySelector<HTMLElement>("#storeNavigation");
const ordersMessage = document.querySelector<HTMLParagraphElement>("#ordersMessage");
const ordersList = document.querySelector<HTMLDivElement>("#ordersList");
const orderDetailModal = document.querySelector<HTMLDivElement>("#orderDetailModal");
const closeOrderDetailButton = document.querySelector<HTMLButtonElement>(
  "#closeOrderDetailButton"
);
const orderDetailStatus = document.querySelector<HTMLParagraphElement>(
  "#orderDetailStatus"
);
const orderDetailTitle = document.querySelector<HTMLHeadingElement>(
  "#orderDetailTitle"
);
const orderDetailMeta = document.querySelector<HTMLParagraphElement>(
  "#orderDetailMeta"
);
const orderDetailSummary = document.querySelector<HTMLDivElement>(
  "#orderDetailSummary"
);
const orderDetailItems = document.querySelector<HTMLDivElement>("#orderDetailItems");

if (
  !buttonLogout ||
  !loggedUserName ||
  !logo ||
  !storeNavigation ||
  !ordersMessage ||
  !ordersList ||
  !orderDetailModal ||
  !closeOrderDetailButton ||
  !orderDetailStatus ||
  !orderDetailTitle ||
  !orderDetailMeta ||
  !orderDetailSummary ||
  !orderDetailItems
) {
  throw new Error("No se encontraron los elementos necesarios de pedidos");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
loggedUserName.textContent = getUser()?.name ?? getUser()?.email ?? "";

const currentUser = getUser();
const isAdminUser = currentUser?.role === Rol.Admin;

const renderNavigation = (): void => {
  renderStoreNavigation(storeNavigation, {
    isAdmin: isAdminUser,
    cartQuantity: getCart().reduce((total, cartItem) => total + cartItem.quantity, 0),
  });
};

renderNavigation();

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});
const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

const statusLabels: Record<OrderHistoryItem["order"]["estado"], string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  TERMINADO: "Terminado",
  CANCELADO: "Cancelado",
};

const statusClassNames: Record<OrderHistoryItem["order"]["estado"], string> = {
  PENDIENTE: "order-status-pendiente",
  CONFIRMADO: "order-status-confirmado",
  TERMINADO: "order-status-terminado",
  CANCELADO: "order-status-cancelado",
};

let orderHistory: OrderHistoryItem[] = [];

const formatOrderDate = (value: string): string =>
  dateFormatter.format(new Date(`${value}T00:00:00Z`));

let lastOrderTrigger: HTMLButtonElement | null = null;

const closeModal = (): void => {
  orderDetailModal.hidden = true;
  lastOrderTrigger?.focus();
  lastOrderTrigger = null;
};

const renderOrderDetailModal = (orderItem: OrderHistoryItem): void => {
  orderDetailStatus.textContent = statusLabels[orderItem.order.estado];
  orderDetailStatus.className = `order-status-badge ${statusClassNames[orderItem.order.estado]}`;
  orderDetailTitle.textContent = `Pedido ${orderItem.order.id}`;
  orderDetailMeta.textContent = [
    formatOrderDate(orderItem.order.fecha),
    `Forma de pago: ${orderItem.order.formaPago}`,
    `Teléfono: ${orderItem.order.telefono ?? "Sin informar"}`,
  ].join(" · ");
  orderDetailSummary.innerHTML = `
    <div class="order-summary-item">
      <span>Subtotal</span>
      <strong>${currencyFormatter.format(orderItem.subtotal)}</strong>
    </div>
    <div class="order-summary-item">
      <span>Envío</span>
      <strong>${currencyFormatter.format(orderItem.envio)}</strong>
    </div>
    <div class="order-summary-item">
      <span>Total</span>
      <strong>${currencyFormatter.format(orderItem.order.total)}</strong>
    </div>
  `;
  orderDetailItems.innerHTML = `
    <h3 class="order-detail-section-title">Detalle</h3>
    <ul class="order-detail-list">
      ${orderItem.details
        .map(
          (detail) => `
            <li class="order-detail-list-item">
              <div>
                <strong>${detail.productName}</strong>
                <p>Cantidad: ${detail.cantidad}</p>
              </div>
              <strong>${currencyFormatter.format(detail.subtotal)}</strong>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
};

const openModal = (orderItem: OrderHistoryItem, trigger?: HTMLButtonElement): void => {
  lastOrderTrigger = trigger ?? null;
  renderOrderDetailModal(orderItem);
  orderDetailModal.hidden = false;
  closeOrderDetailButton.focus();
};

const renderOrders = (): void => {
  ordersList.innerHTML = "";

  if (orderHistory.length === 0) {
    ordersMessage.className = "empty-message";
    ordersMessage.textContent = "Todavía no tenés pedidos. Explorá nuestros productos y hacé tu primer pedido.";
    return;
  }

  ordersMessage.className = "";
  ordersMessage.textContent = `${orderHistory.length} pedido${
    orderHistory.length === 1 ? "" : "s"
  } encontrado${orderHistory.length === 1 ? "" : "s"}.`;

  orderHistory.forEach((orderItem) => {
    const article = document.createElement("article");
    article.className = "order-card";

    article.innerHTML = `
      <div class="order-card-header">
        <div>
          <p class="order-card-number">${orderItem.order.id}</p>
          <p class="order-card-date">${formatOrderDate(orderItem.order.fecha)}</p>
        </div>
        <span class="order-status-badge ${statusClassNames[orderItem.order.estado]}">
          ${statusLabels[orderItem.order.estado]}
        </span>
      </div>
      <p class="order-card-total">Total: <strong>${currencyFormatter.format(
        orderItem.order.total
      )}</strong></p>
      <p class="order-card-items-count">${orderItem.itemCount} item${
        orderItem.itemCount === 1 ? "" : "s"
      }</p>
      <ul class="order-preview-list">
        ${orderItem.previewDetails
          .map(
            (detail) => `
              <li class="order-preview-item">
                <span>${detail.productName}</span>
                <span>x${detail.cantidad}</span>
              </li>
            `
          )
          .join("")}
      </ul>
      ${orderItem.details.length > orderItem.previewDetails.length ? `<p class="order-preview-more">+${orderItem.details.length - orderItem.previewDetails.length} más</p>` : ""}
      <button type="button" class="button-secondary order-detail-button">Ver detalle</button>
    `;

    const detailButton = article.querySelector<HTMLButtonElement>(".order-detail-button");
    detailButton?.addEventListener("click", () => {
      openModal(orderItem, detailButton);
    });

    ordersList.appendChild(article);
  });
};

const loadOrders = async (): Promise<void> => {
  const currentUser = getUser();

  if (!currentUser) {
    ordersMessage.className = "empty-message";
    ordersMessage.textContent = "No pudimos identificar tu cuenta. Iniciá sesión para ver tus pedidos.";
    ordersList.innerHTML = "";
    return;
  }

  ordersMessage.className = "empty-message";
  ordersMessage.textContent = "Cargando pedidos…";
  ordersList.innerHTML = "";

  try {
    const [remoteOrders, products] = await Promise.all([
      fetchOrders(),
      fetchProducts(),
    ]);
    const productNames: OrderProductName[] = products.map((product) => ({
      id: product.id,
      name: product.nombre,
    }));

    orderHistory = buildOrderHistory(
      [...remoteOrders, ...getOrders()],
      productNames,
      currentUser.id
    );
  } catch {
    orderHistory = buildOrderHistory(getOrders(), [], currentUser.id);
  }

  renderOrders();
};

closeOrderDetailButton.addEventListener("click", closeModal);
orderDetailModal.addEventListener("click", (event) => {
  if (event.target === orderDetailModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !orderDetailModal.hidden) {
    closeModal();
  }
});

void loadOrders();
