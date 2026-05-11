import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { categories } from "../../../types/Product";
import { logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getProducts } from "../../../utils/products";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
buttonLogout?.addEventListener("click", () => {
  logout();
});

const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const categoryList = document.querySelector<HTMLUListElement>("#lista-categorias");
const productList = document.querySelector<HTMLElement>("#contenedor-productos");

if (!loggedUserName || !logo || !categoryList || !productList) {
  throw new Error("No se encontraron los elementos necesarios del catálogo");
}

logo.src = logoImage;
loggedUserName.textContent = getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

categories.forEach((category) => {
  const li = document.createElement("li");
  const link = document.createElement("a");

  link.href = "#";
  link.textContent = category;
  li.appendChild(link);
  categoryList.appendChild(li);
});

const featuredProducts = getProducts().filter((product) => product.destacado);

featuredProducts.forEach((product) => {
  const article = document.createElement("article");
  article.className = "product-card";
  article.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3 class="product-title">${product.name}</h3>
    <p class="product-description">${product.description}</p>
    <p class="product-price">Precio: <strong>$${currencyFormatter.format(
      product.price
    )}</strong></p>
    <button type="button">Ver detalle</button>
    <button type="button" class="btn-agregar" data-id="${product.id}">
      Agregar al carrito
    </button>
  `;

  productList.appendChild(article);
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  if (!target.classList.contains("btn-agregar")) {
    return;
  }

  const productId = Number(target.dataset.id);
  const product = featuredProducts.find((item) => item.id === productId);

  if (product) {
    alert(`Agregaste "${product.name}" a tu carrito de compra`);
  }
});
