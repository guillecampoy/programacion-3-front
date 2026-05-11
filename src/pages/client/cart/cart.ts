import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import { getCart, getUser } from "../../../utils/localStorage";

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
      <p class="empty-message">Tu carrito está vacío.</p>
      <p>No tenés productos cargados en el pedido.</p>
      <a class="cart-return-link" href="../home/home.html">Ir a productos</a>
    `;
    return;
  }

  cartContent.className = "client-cart-box";
  cartContent.innerHTML = `
    <div class="cart-table-wrapper">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${cart
            .map(
              (cartItem) => `
                <tr>
                  <td>${cartItem.product.name}</td>
                  <td>$${currencyFormatter.format(cartItem.product.price)}</td>
                  <td>${cartItem.quantity}</td>
                  <td>$${currencyFormatter.format(
                    cartItem.product.price * cartItem.quantity
                  )}</td>
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
  `;
};

renderCart();
