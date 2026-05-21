import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import {
  clearCart,
  getCart,
  getUser,
  removeProductFromCart,
} from "../../../utils/localStorage";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
buttonLogout?.addEventListener("click", () => {
  logout();
});

const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const cartQuantity = document.querySelector<HTMLSpanElement>("#cartQuantity");
const cartContent = document.querySelector<HTMLDivElement>("#cartContent");

if (!loggedUserName || !logo || !cartQuantity || !cartContent) {
  throw new Error("No se encontraron los elementos necesarios del carrito");
}

logo.src = logoImage;
loggedUserName.textContent = getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

const renderCart = (): void => {
  const cart = getCart();
  const totalQuantity = cart.reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );
  const totalAmount = cart.reduce(
    (total, cartItem) => total + cartItem.product.price * cartItem.quantity,
    0
  );

  cartQuantity.textContent = String(totalQuantity);

  if (cart.length === 0) {
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
            <th>Precio</th>
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
                  <td>${cartItem.quantity}</td>
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
      <span>Total</span>
      <strong>$${currencyFormatter.format(totalAmount)}</strong>
    </section>
    <div class="cart-actions">
      <a class="cart-return-link" href="../home/home.html">Agregar más productos</a>
      <button
        type="button"
        id="clearCartButton"
        class="cart-cancel-button"
        title="Elimina el carrito"
      >
        Cancelar pedido
      </button>
    </div>
  `;

  const clearCartButton =
    cartContent.querySelector<HTMLButtonElement>("#clearCartButton");
  const removeButtons =
    cartContent.querySelectorAll<HTMLButtonElement>(".cart-remove-button");

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

  clearCartButton?.addEventListener("click", () => {
    const shouldClearCart = window.confirm(
      "¿Querés cancelar este pedido y limpiar el carrito?"
    );

    if (!shouldClearCart) {
      return;
    }

    clearCart();
    renderCart();
  });
};

renderCart();
