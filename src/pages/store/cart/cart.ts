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

if (!loggedUserName || !logo || !cartQuantity || !cartContent || !buttonLogout) {
  throw new Error("No se encontraron los elementos necesarios del carrito");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
loggedUserName.textContent = getUser()?.name ?? getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

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

  if (cart.length === 0) {
    renderEmptyState();
    return;
  }

  cartContent.className = "client-cart-box";
  cartContent.innerHTML = `
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
                  <td>
                    <img
                      class="cart-product-image"
                      src="${cartItem.product.image}"
                      alt="${cartItem.product.name}"
                    >
                  </td>
                  <td>${cartItem.product.name}</td>
                  <td>$${currencyFormatter.format(cartItem.product.price)}</td>
                  <td>
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
                  </td>
                  <td>$${currencyFormatter.format(
                    cartItem.product.price * cartItem.quantity
                  )}</td>
                  <td>
                    <button
                      type="button"
                      class="cart-remove-button"
                      data-product-id="${cartItem.product.id}"
                      aria-label="Eliminar ${cartItem.product.name} del carrito"
                      title="Eliminar artículo"
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
    <section class="cart-totalizer" aria-label="Total del carrito">
      <span>Subtotal</span>
      <strong>$${currencyFormatter.format(subtotal)}</strong>
    </section>
    <section class="cart-totalizer" aria-label="Costo de envío">
      <span>Envío</span>
      <strong>$${currencyFormatter.format(envio)}</strong>
    </section>
    <section class="cart-totalizer" aria-label="Total del carrito">
      <span>Total</span>
      <strong>$${currencyFormatter.format(total)}</strong>
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
      >
      <label for="paymentMethod">Forma de pago</label>
      <select id="paymentMethod" name="paymentMethod">
        <option value="">Seleccioná una forma de pago</option>
        <option value="TARJETA">TARJETA</option>
        <option value="TRANSFERENCIA">TRANSFERENCIA</option>
        <option value="EFECTIVO">EFECTIVO</option>
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

  checkoutForm?.addEventListener("submit", (event) => {
    event.preventDefault();

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

    const order = createOrderFromCart(
      getCart(),
      user,
      phone,
      paymentMethod as "TARJETA" | "TRANSFERENCIA" | "EFECTIVO"
    );

    saveOrders([...getOrders(), order]);
    clearCart();
    navigate(ROUTES.clientOrders);
  });
};

renderCart();
