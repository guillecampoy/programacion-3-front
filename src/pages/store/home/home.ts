import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import type { Product } from "../../../types/Product";
import { logout } from "../../../utils/auth";
import { getCategories } from "../../../utils/categories";
import {
  addProductToCart,
  getCart,
  getUser,
} from "../../../utils/localStorage";
import { getProducts } from "../../../utils/products";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
buttonLogout?.addEventListener("click", () => {
  logout();
});

const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const categoryList = document.querySelector<HTMLUListElement>("#lista-categorias");
const productList = document.querySelector<HTMLElement>("#contenedor-productos");
const searchForm = document.querySelector<HTMLFormElement>("#searchForm");
const searchInput = document.querySelector<HTMLInputElement>("#buscarProducto");
const featuredFilterInput =
  document.querySelector<HTMLInputElement>("#featuredFilter");
const searchMessage = document.querySelector<HTMLParagraphElement>("#searchMessage");
const productsTitle = document.querySelector<HTMLHeadingElement>("#productsTitle");
const showAllProductsButton = document.querySelector<HTMLButtonElement>(
  "#showAllProductsButton"
);
const productDetailModal =
  document.querySelector<HTMLDivElement>("#productDetailModal");
const closeProductDetailButton = document.querySelector<HTMLButtonElement>(
  "#closeProductDetailButton"
);
const productDetailImage =
  document.querySelector<HTMLImageElement>("#productDetailImage");
const productDetailTitle =
  document.querySelector<HTMLHeadingElement>("#productDetailTitle");
const productDetailCategory = document.querySelector<HTMLParagraphElement>(
  "#productDetailCategory"
);
const productDetailDescription = document.querySelector<HTMLParagraphElement>(
  "#productDetailDescription"
);
const productDetailPrice =
  document.querySelector<HTMLParagraphElement>("#productDetailPrice");
const cartQuantity = document.querySelector<HTMLSpanElement>("#cartQuantity");

if (
  !loggedUserName ||
  !logo ||
  !categoryList ||
  !productList ||
  !searchForm ||
  !searchInput ||
  !featuredFilterInput ||
  !searchMessage ||
  !productsTitle ||
  !showAllProductsButton ||
  !productDetailModal ||
  !closeProductDetailButton ||
  !productDetailImage ||
  !productDetailTitle ||
  !productDetailCategory ||
  !productDetailDescription ||
  !productDetailPrice ||
  !cartQuantity
) {
  throw new Error("No se encontraron los elementos necesarios del catálogo");
}

logo.src = logoImage;
loggedUserName.textContent = getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

const products = getProducts();
const categories = getCategories();
let selectedCategory = "";

const renderCartQuantity = (): void => {
  const totalQuantity = getCart().reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  cartQuantity.textContent = String(totalQuantity);
};

const setActiveCategoryButton = (): void => {
  document.querySelectorAll<HTMLButtonElement>(".category-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === selectedCategory);
  });
};

const renderProductsTitle = (): void => {
  productsTitle.textContent = selectedCategory
    ? `Productos de ${selectedCategory}`
    : "Productos";
};

categories.forEach((category) => {
  const li = document.createElement("li");
  const button = document.createElement("button");

  button.type = "button";
  button.className = "button-secondary category-filter";
  button.dataset.category = category.name;
  button.textContent = category.name;
  li.appendChild(button);
  categoryList.appendChild(li);
});

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const productMatchesSearch = (product: Product, searchText: string): boolean =>
  normalizeSearchText(product.name).includes(normalizeSearchText(searchText));

const renderProducts = (productsToRender: Product[]): void => {
  productList.innerHTML = "";
  searchMessage.textContent = "";

  if (productsToRender.length === 0) {
    searchMessage.textContent = "No se encontraron productos con ese nombre.";
    return;
  }

  productsToRender.forEach((product) => {
    const article = document.createElement("article");
    article.className = "product-card";
    article.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">Precio: <strong>$${currencyFormatter.format(
        product.price
      )}</strong></p>
      <button type="button" class="btn-detalle" data-id="${product.id}">
        Ver detalle
      </button>
      <button type="button" class="btn-agregar" data-id="${product.id}">
        Agregar al carrito
      </button>
    `;

    productList.appendChild(article);
  });
};

const openProductDetail = (product: Product): void => {
  productDetailImage.src = product.image;
  productDetailImage.alt = product.name;
  productDetailTitle.textContent = product.name;
  productDetailCategory.textContent = product.category;
  productDetailDescription.textContent = product.longDescription;
  productDetailPrice.innerHTML = `Precio: <strong>$${currencyFormatter.format(
    product.price
  )}</strong>`;
  productDetailModal.hidden = false;
};

const closeProductDetail = (): void => {
  productDetailModal.hidden = true;
};

const filterProducts = (): void => {
  const searchText = searchInput.value.trim();
  const productsToRender = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    const matchesSearch = searchText
      ? productMatchesSearch(product, searchText)
      : true;
    const matchesFeatured = featuredFilterInput.checked
      ? product.destacado
      : true;

    return matchesCategory && matchesSearch && matchesFeatured;
  });

  renderProductsTitle();
  setActiveCategoryButton();
  renderProducts(productsToRender);
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
});

searchInput.addEventListener("input", filterProducts);
featuredFilterInput.addEventListener("change", filterProducts);

showAllProductsButton.dataset.category = "";
showAllProductsButton.addEventListener("click", () => {
  selectedCategory = "";
  filterProducts();
});

categoryList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  selectedCategory = target.dataset.category ?? "";
  filterProducts();
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  if (
    !target.classList.contains("btn-agregar") &&
    !target.classList.contains("btn-detalle")
  ) {
    return;
  }

  const productId = Number(target.dataset.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (target.classList.contains("btn-detalle")) {
    openProductDetail(product);
    return;
  }

  if (target.classList.contains("btn-agregar")) {
    const cart = addProductToCart(product);
    const cartItem = cart.find((item) => item.product.id === product.id);

    renderCartQuantity();
    alert(
      `Agregaste "${product.name}" a tu carrito de compra. Cantidad: ${
        cartItem?.quantity ?? 1
      }`
    );
  }
});

closeProductDetailButton.addEventListener("click", closeProductDetail);

productDetailModal.addEventListener("click", (event) => {
  if (event.target === productDetailModal) {
    closeProductDetail();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !productDetailModal.hidden) {
    closeProductDetail();
  }
});

renderCartQuantity();
filterProducts();
