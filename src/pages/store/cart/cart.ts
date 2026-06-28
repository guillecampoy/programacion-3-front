import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import { calculateCartSummary, createOrderFromCart, saveOrders, getOrders } from "../../../utils/orders";
import { navigate, ROUTES } from "../../../utils/navigate";
import { validateCheckout } from "../../../utils/validation";
import {
  clearCart,
  getCart,
  getUser,
  removeProductFromCart,
  updateProductQuantityInCart,
} from "../../../utils/localStorage";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const cartQuantity = document.querySelector<HTMLSpanElement>("#cartQuantity");
const cartContent = document.querySelector<HTMLDivElement>("#cartContent");
const clearCartButton = document.querySelector<HTMLButtonElement>("#clearCartButton");

if (!loggedUserName || !logo || !cartQuantity || !cartContent || !buttonLogout || !clearCartButton) {
  throw new Error("No se encontraron los elementos necesarios del carrito");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

clearCartButton.addEventListener("click", () => {
  if (confirm("¿Vaciar el carrito? Se eliminarán todos los productos.")) {
    clearCart();
    renderCart();
  }
});

logo.src = logoImage;
loggedUserName.textContent = getUser()?.name ?? getUser()?.email ?? "";

if (!getUser()) {
  navigate(ROUTES.login);
}

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const renderCartQuantity = (): void => {
  cartQuantity.textContent = String(
    getCart().reduce((total, cartItem) => total + cartItem.quantity, 0)
  );
};

const renderEmptyState = (): void => {
  cartContent.className = "client-cart-box empty-cart-box";
  cartContent.innerHTML = `
    <div class="cart-empty-state">
      <p class="empty-message">Tu carrito está vacío.</p>
      <p>No tenés productos cargados en el pedido.</p>
    </div>
    <div class="cart-actions">
      <a class="cart-return-link" href="../home/home.html">Agregar más productos</a>
    </div>
  `;
};

const renderCart = (): void => {
  const cart = getCart();
  const { subtotal, envio, total } = calculateCartSummary(cart);

  renderCartQuantity();
  clearCartButton.hidden = cart.length === 0;

  if (cart.length === 0) {
    renderEmptyState();
    return;
  }

  cartContent.className = "client-cart-box";
  cartContent.innerHTML = `
    <p class="cart-help-text">Revisá los productos y ajustá las cantidades. Completá teléfono y forma de pago para confirmar el pedido.</p>
    <div class="cart-table-wrapper">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Precio unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          ${cart
            .map(
              (cartItem) => `
                <tr>
                  <td data-label="Imagen">
                    <img
                      class="cart-product-image"
                      src="${cartItem.product.image}"
                      alt="${cartItem.product.name}"
                    >
                  </td>
                  <td data-label="Producto">${cartItem.product.name}</td>
                  <td data-label="Precio unitario">${currencyFormatter.format(cartItem.product.price)}</td>
                  <td data-label="Cantidad">
                    <div class="cart-qty-control">
                      <button
                        type="button"
                        class="cart-qty-btn cart-qty-dec"
                        data-product-id="${cartItem.product.id}"
                        aria-label="Reducir cantidad de ${cartItem.product.name}"
                      >−</button>
                      <input
                        type="number"
                        class="cart-quantity-input"
                        data-product-id="${cartItem.product.id}"
                        value="${cartItem.quantity}"
                        min="1"
                        max="${cartItem.product.stock ?? cartItem.quantity}"
                        step="1"
                        aria-label="Cantidad de ${cartItem.product.name}"
                      >
                      <button
                        type="button"
                        class="cart-qty-btn cart-qty-inc"
                        data-product-id="${cartItem.product.id}"
                        aria-label="Aumentar cantidad de ${cartItem.product.name}"
                      >+</button>
                    </div>
                    ${cartItem.product.stock !== undefined && cartItem.product.stock <= 5 ? `<span class="cart-stock-indicator">Stock: ${cartItem.product.stock}</span>` : ''}
                  </td>
                  <td data-label="Subtotal">${currencyFormatter.format(
                    cartItem.product.price * cartItem.quantity
                  )}</td>
                  <td data-label="Acción">
                    <button
                      type="button"
                      class="cart-remove-button"
                      data-product-id="${cartItem.product.id}"
                      aria-label="Eliminar ${cartItem.product.name} del carrito"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <section class="cart-totalizer" aria-label="Subtotal">
      <span>Subtotal</span>
      <strong>${currencyFormatter.format(subtotal)}</strong>
    </section>
    <section class="cart-totalizer" aria-label="Costo de envío">
      <span>Envío</span>
      <strong>${currencyFormatter.format(envio)}</strong>
    </section>
    <section class="cart-totalizer" aria-label="Total del carrito">
      <span>Total</span>
      <strong>${currencyFormatter.format(total)}</strong>
    </section>
    <form id="checkoutForm" class="cart-checkout-box">
      <h3 class="client-section-title">Checkout</h3>
      <label for="phone">Teléfono</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        autocomplete="tel"
        placeholder="Ej: 1155555555"
        inputmode="numeric"
        required
      >
      <label for="paymentMethod">Forma de pago</label>
      <select id="paymentMethod" name="paymentMethod" required>
        <option value="">Seleccioná una forma de pago</option>
        <option value="TARJETA">Tarjeta</option>
        <option value="TRANSFERENCIA">Transferencia</option>
        <option value="EFECTIVO">Efectivo</option>
      </select>
      <p id="checkoutMessage" class="form-message"></p>
      <div class="cart-actions">
        <a class="cart-return-link" href="../home/home.html">Agregar más productos</a>
        <button type="submit" class="cart-confirm-button">Confirmar pedido</button>
      </div>
    </form>
  `;

  const checkoutForm = cartContent.querySelector<HTMLFormElement>("#checkoutForm");
  const checkoutMessage =
    cartContent.querySelector<HTMLParagraphElement>("#checkoutMessage");
  const removeButtons =
    cartContent.querySelectorAll<HTMLButtonElement>(".cart-remove-button");
  const quantityInputs =
    cartContent.querySelectorAll<HTMLInputElement>(".cart-quantity-input");
  const qtyDecButtons =
    cartContent.querySelectorAll<HTMLButtonElement>(".cart-qty-dec");
  const qtyIncButtons =
    cartContent.querySelectorAll<HTMLButtonElement>(".cart-qty-inc");
  const phoneInput = cartContent.querySelector<HTMLInputElement>("#phone");
  const paymentMethodSelect =
    cartContent.querySelector<HTMLSelectElement>("#paymentMethod");

  const setCheckoutMessage = (text: string, isError = false): void => {
    if (!checkoutMessage) {
      return;
    }

    checkoutMessage.textContent = text;
    checkoutMessage.className = isError
      ? "form-message form-message-error"
      : "form-message form-message-success";
  };

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.productId);

      if (Number.isNaN(productId)) {
        return;
      }

      if (!confirm("¿Eliminar este producto del carrito?")) {
        return;
      }

      removeProductFromCart(productId);
      renderCart();
    });
  });

  quantityInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const productId = Number(input.dataset.productId);
      const quantity = Number(input.value);

      if (Number.isNaN(productId) || !Number.isInteger(quantity) || quantity <= 0) {
        const currentItem = getCart().find((item) => item.product.id === productId);
        input.value = String(currentItem?.quantity ?? 1);
        return;
      }

      updateProductQuantityInCart(productId, quantity);
      renderCart();
    });
  });

  qtyDecButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.productId);
      const input = cartContent.querySelector<HTMLInputElement>(
        `.cart-quantity-input[data-product-id="${productId}"]`
      );

      if (!input || Number(input.value) <= 1) {
        return;
      }

      input.value = String(Number(input.value) - 1);
      input.dispatchEvent(new Event("change"));
    });
  });

  qtyIncButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.productId);
      const input = cartContent.querySelector<HTMLInputElement>(
        `.cart-quantity-input[data-product-id="${productId}"]`
      );

      if (!input || Number(input.value) >= Number(input.max)) {
        return;
      }

      input.value = String(Number(input.value) + 1);
      input.dispatchEvent(new Event("change"));
    });
  });

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const confirmButton = checkoutForm.querySelector<HTMLButtonElement>(".cart-confirm-button");

    if (confirmButton?.disabled) {
      return;
    }

    const user = getUser();

    if (!user) {
      navigate(ROUTES.login);
      return;
    }

    const phone = phoneInput?.value ?? "";
    const paymentMethod = paymentMethodSelect?.value ?? "";
    const validationError = validateCheckout(phone, paymentMethod);

    if (validationError) {
      setCheckoutMessage(validationError, true);
      return;
    }

    if (confirmButton) {
      confirmButton.disabled = true;
      confirmButton.textContent = "Confirmando…";
    }

    try {
      const order = createOrderFromCart(
        getCart(),
        user,
        phone,
        paymentMethod as "TARJETA" | "TRANSFERENCIA" | "EFECTIVO"
      );

      saveOrders([...getOrders(), order]);
      clearCart();
      navigate(ROUTES.clientOrders);
    } catch {
      setCheckoutMessage("Error al confirmar el pedido. Intentá de nuevo.", true);

      if (confirmButton) {
        confirmButton.disabled = false;
        confirmButton.textContent = "Confirmar pedido";
      }
    }
  });
};

renderCart();
