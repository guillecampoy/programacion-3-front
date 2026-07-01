import { ROUTES } from "./navigate";

type StoreNavigationOptions = {
  isAdmin: boolean;
  cartQuantity: number;
};

const appendLink = (
  nav: HTMLElement,
  label: string,
  href: string,
  isActive = false
): void => {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;

  if (isActive) {
    link.setAttribute("aria-current", "page");
  }

  nav.appendChild(link);
};

const appendSeparator = (nav: HTMLElement): void => {
  nav.appendChild(document.createTextNode(" | "));
};

export const renderStoreNavigation = (
  nav: HTMLElement,
  { isAdmin, cartQuantity }: StoreNavigationOptions
): void => {
  nav.replaceChildren();

  appendLink(nav, "Inicio", ROUTES.storeHome, window.location.pathname === ROUTES.storeHome);

  if (isAdmin) {
    appendSeparator(nav);
    appendLink(nav, "Volver al administrador", ROUTES.adminHome);
    return;
  }

  appendSeparator(nav);
  appendLink(nav, "Mis pedidos", ROUTES.clientOrders);
  appendSeparator(nav);

  const cartLink = document.createElement("a");
  cartLink.href = ROUTES.storeCart;
  const quantitySpan = document.createElement("span");
  quantitySpan.id = "cartQuantity";
  quantitySpan.textContent = String(cartQuantity);
  cartLink.append("Carrito(", quantitySpan, ")");
  nav.appendChild(cartLink);
};
