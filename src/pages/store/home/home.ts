import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import type { CatalogProduct, CatalogSort } from "../../../utils/catalog";
import {
  buildCatalogProducts,
  filterCatalogProducts,
} from "../../../utils/catalog";
import { logout } from "../../../utils/auth";
import { fetchCategories, fetchProducts } from "../../../utils/api";
import { getCart, getUser, addProductToCart } from "../../../utils/localStorage";
import { renderStoreNavigation } from "../../../utils/storeNavigation";
import type { Product } from "../../../types/Product";
import { Rol } from "../../../types/Rol";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const storeNavigation = document.querySelector<HTMLElement>("#storeNavigation");
const categoryList = document.querySelector<HTMLUListElement>("#lista-categorias");
const productList = document.querySelector<HTMLElement>("#contenedor-productos");
const searchForm = document.querySelector<HTMLFormElement>("#searchForm");
const searchInput = document.querySelector<HTMLInputElement>("#buscarProducto");
const sortSelect = document.querySelector<HTMLSelectElement>("#sortProducts");
const searchMessage = document.querySelector<HTMLParagraphElement>("#searchMessage");
const productsTitle = document.querySelector<HTMLHeadingElement>("#productsTitle");
const showAllProductsButton = document.querySelector<HTMLButtonElement>(
  "#showAllProductsButton"
);

if (
  !buttonLogout ||
  !loggedUserName ||
  !logo ||
  !storeNavigation ||
  !categoryList ||
  !productList ||
  !searchForm ||
  !searchInput ||
  !sortSelect ||
  !searchMessage ||
  !productsTitle ||
  !showAllProductsButton
) {
  throw new Error("No se encontraron los elementos necesarios del catálogo");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
const currentUser = getUser();
const isAdminUser = currentUser?.role === Rol.Admin;

loggedUserName.textContent = currentUser?.name ?? currentUser?.email ?? "";
renderStoreNavigation(storeNavigation, {
  isAdmin: isAdminUser,
  cartQuantity: getCart().reduce((total, cartItem) => total + cartItem.quantity, 0),
});

const currencyFormatter = new Intl.NumberFormat("es-AR");

let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
let catalogProducts: CatalogProduct[] = [];
let selectedCategoryId: number | null = null;

const renderCartQuantity = (): void => {
  renderStoreNavigation(storeNavigation, {
    isAdmin: isAdminUser,
    cartQuantity: getCart().reduce((total, cartItem) => total + cartItem.quantity, 0),
  });
};

const renderProductsTitle = (): void => {
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  productsTitle.textContent = selectedCategory
    ? `Productos de ${selectedCategory.nombre}`
    : "Productos";
};

const toCartProduct = (product: CatalogProduct): Product => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion,
  longDescription: product.descripcion,
  price: product.precio,
  image: product.imagen,
  category: product.categoryName,
  destacado: true,
  stock: product.stock,
});

const setActiveCategoryButton = (): void => {
  document.querySelectorAll<HTMLButtonElement>(".category-filter").forEach((button) => {
    button.classList.toggle("active", button.dataset.categoryId === String(selectedCategoryId ?? ""));
  });
};

const renderCategories = (): void => {
  categoryList.innerHTML = "";

  categories.forEach((category) => {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "button-secondary category-filter";
    button.dataset.categoryId = String(category.id);
    button.textContent = category.nombre;
    li.appendChild(button);
    categoryList.appendChild(li);
  });
};

const navigateToProductDetail = (productId: number): void => {
  window.location.href = `../productDetail/productDetail.html?id=${productId}`;
};

const createTextParagraph = (className: string, text: string): HTMLParagraphElement => {
  const paragraph = document.createElement("p");
  paragraph.className = className;
  paragraph.textContent = text;
  return paragraph;
};

const createProductCard = (product: CatalogProduct): HTMLElement => {
  const article = document.createElement("article");
  article.className = "product-card";
  article.dataset.id = String(product.id);
  article.tabIndex = 0;
  article.setAttribute("role", "link");
  article.setAttribute("aria-label", `Abrir detalle de ${product.nombre}`);

  const image = document.createElement("img");
  image.src = product.imagen;
  image.alt = product.nombre;
  article.appendChild(image);

  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.nombre;
  article.appendChild(title);

  const badges = document.createElement("div");
  badges.className = "product-badges";
  const badge = document.createElement("span");
  badge.className = "product-badge available";
  badge.textContent = "Disponible";
  badges.appendChild(badge);
  article.appendChild(badges);

  const description = createTextParagraph("product-description", product.descripcion);
  article.appendChild(description);

  const price = document.createElement("p");
  price.className = "product-price";
  price.append("Precio: ");
  const priceValue = document.createElement("strong");
  priceValue.textContent = `$${currencyFormatter.format(product.precio)}`;
  price.appendChild(priceValue);
  article.appendChild(price);

  const detailButton = document.createElement("button");
  detailButton.type = "button";
  detailButton.className = "btn-detalle";
  detailButton.dataset.id = String(product.id);
  detailButton.textContent = "Ver detalle";
  article.appendChild(detailButton);

  if (!isAdminUser) {
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn-agregar";
    addButton.dataset.id = String(product.id);
    addButton.textContent = "Agregar al carrito";
    article.appendChild(addButton);
  }

  return article;
};

const renderProducts = (): void => {
  const products = filterCatalogProducts(
    catalogProducts,
    searchInput.value,
    selectedCategoryId,
    sortSelect.value as CatalogSort
  );

  productList.innerHTML = "";
  searchMessage.textContent = "";

  if (products.length === 0) {
    searchMessage.textContent = "No se encontraron productos con esos filtros.";
    return;
  }

  products.forEach((product) => {
    productList.appendChild(createProductCard(product));
  });
};

const refreshProducts = (): void => {
  renderProductsTitle();
  setActiveCategoryButton();
  renderProducts();
};

const loadCatalog = async (): Promise<void> => {
  try {
    const [rawCategories, rawProducts] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);

    categories = rawCategories.filter((category) => !category.eliminado);
    catalogProducts = buildCatalogProducts(rawProducts, categories);

    renderCategories();
    refreshProducts();
  } catch {
    searchMessage.textContent = "No se pudo cargar el catálogo.";
  }
};

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  refreshProducts();
});

searchInput.addEventListener("input", refreshProducts);
sortSelect.addEventListener("change", refreshProducts);

showAllProductsButton.dataset.categoryId = "";
showAllProductsButton.addEventListener("click", () => {
  selectedCategoryId = null;
  refreshProducts();
});

categoryList.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }

  const categoryId = Number(event.target.dataset.categoryId);

  if (Number.isNaN(categoryId)) {
    return;
  }

  selectedCategoryId = categoryId;
  refreshProducts();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest<HTMLButtonElement>(".btn-agregar, .btn-detalle");
  const card = event.target.closest<HTMLElement>(".product-card");
  const targetElement = button ?? card;

  if (!targetElement) {
    return;
  }

  const productId = Number(targetElement.dataset.id);
  const product = catalogProducts.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (button?.classList.contains("btn-agregar")) {
    const cart = addProductToCart(toCartProduct(product));
    const cartItem = cart.find((item) => item.product.id === product.id);

    renderCartQuantity();
    alert(
      `Agregaste "${product.nombre}" a tu carrito de compra. Cantidad: ${
        cartItem?.quantity ?? 1
      }`
    );
    return;
  }

  if (button?.classList.contains("btn-detalle") || card) {
    navigateToProductDetail(product.id);
  }
});

productList.addEventListener("keydown", (event) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  const card = event.target.closest<HTMLElement>(".product-card");

  if (!card || event.target !== card) {
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const productId = Number(card.dataset.id);

  if (Number.isNaN(productId)) {
    return;
  }

  event.preventDefault();
  navigateToProductDetail(productId);
});

renderCartQuantity();
void loadCatalog();
