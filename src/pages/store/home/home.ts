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
import type { Product } from "../../../types/Product";
import { Rol } from "../../../types/Rol";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
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
const ordersLink = document.querySelector<HTMLAnchorElement>("#ordersLink");
const cartLink = document.querySelector<HTMLAnchorElement>("#cartLink");

if (
  !buttonLogout ||
  !loggedUserName ||
  !logo ||
  !categoryList ||
  !productList ||
  !searchForm ||
  !searchInput ||
  !sortSelect ||
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
  !cartQuantity ||
  !ordersLink ||
  !cartLink
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
ordersLink.hidden = isAdminUser;
cartLink.hidden = isAdminUser;

const currencyFormatter = new Intl.NumberFormat("es-AR");

let categories: Awaited<ReturnType<typeof fetchCategories>> = [];
let catalogProducts: CatalogProduct[] = [];
let selectedCategoryId: number | null = null;

const renderCartQuantity = (): void => {
  const totalQuantity = getCart().reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  cartQuantity.textContent = String(totalQuantity);
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

const closeProductDetail = (): void => {
  productDetailModal.hidden = true;
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
    const article = document.createElement("article");
    article.className = "product-card";
    article.dataset.id = String(product.id);
    article.tabIndex = 0;
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", `Ver detalle de ${product.nombre}`);
    article.innerHTML = `
      <img src="${product.imagen}" alt="${product.nombre}">
      <h3 class="product-title">${product.nombre}</h3>
      <div class="product-badges">
        <span class="product-badge available">Disponible</span>
      </div>
      <p class="product-description">${product.descripcion}</p>
      <p class="product-price">Precio: <strong>$${currencyFormatter.format(
        product.precio
      )}</strong></p>
      <button type="button" class="btn-detalle" data-id="${product.id}">
        Ver detalle
      </button>
      ${
        isAdminUser
          ? ""
          : `<button type="button" class="btn-agregar" data-id="${product.id}">
        Agregar al carrito
      </button>`
      }
    `;

    productList.appendChild(article);
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
    window.location.href = `../productDetail/productDetail.html?id=${product.id}`;
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
void loadCatalog();
