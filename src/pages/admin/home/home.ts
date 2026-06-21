import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import type { Category, Product } from "../../../types/Product";
import {
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchUsers,
} from "../../../utils/api";
import { buildAdminDashboardStats } from "../../../utils/adminDashboard";
import { logout } from "../../../utils/auth";
import {
  getCategories,
  getNextCategoryId,
  saveCategories,
} from "../../../utils/categories";
import { getUser } from "../../../utils/localStorage";
import { getOrders } from "../../../utils/orders";
import { productImageOptions } from "../../../utils/productImages";
import { getNextProductId, getProducts, saveProducts } from "../../../utils/products";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
buttonLogout?.addEventListener("click", () => {
  logout();
});

const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const dashboardMessage = document.querySelector<HTMLParagraphElement>("#dashboardMessage");
const dashboardMetrics = document.querySelector<HTMLDivElement>("#dashboardMetrics");
const dashboardSummary = document.querySelector<HTMLDivElement>("#dashboardSummary");
const form = document.querySelector<HTMLFormElement>("#productForm");
const productSection = document.querySelector<HTMLElement>("#productos");
const productIdInput = document.querySelector<HTMLInputElement>("#productId");
const nameInput = document.querySelector<HTMLInputElement>("#productName");
const categorySelect =
  document.querySelector<HTMLSelectElement>("#productCategory");
const priceInput = document.querySelector<HTMLInputElement>("#productPrice");
const imageInput = document.querySelector<HTMLSelectElement>("#productImage");
const imagePreview =
  document.querySelector<HTMLImageElement>("#productImagePreview");
const descriptionInput =
  document.querySelector<HTMLTextAreaElement>("#productDescription");
const longDescriptionInput = document.querySelector<HTMLTextAreaElement>(
  "#productLongDescription"
);
const featuredInput =
  document.querySelector<HTMLInputElement>("#productFeatured");
const message = document.querySelector<HTMLParagraphElement>("#productMessage");
const productsTableBody =
  document.querySelector<HTMLTableSectionElement>("#productsTableBody");
const ordersTableBody =
  document.querySelector<HTMLTableSectionElement>("#ordersTableBody");
const cancelEditButton =
  document.querySelector<HTMLButtonElement>("#cancelEditButton");
const adminSearchForm =
  document.querySelector<HTMLFormElement>("#adminSearchForm");
const adminSearchInput =
  document.querySelector<HTMLInputElement>("#adminProductSearch");
const adminSearchMessage =
  document.querySelector<HTMLParagraphElement>("#adminSearchMessage");
const categoryForm = document.querySelector<HTMLFormElement>("#categoryForm");
const categoryIdInput = document.querySelector<HTMLInputElement>("#categoryId");
const categoryNameInput =
  document.querySelector<HTMLInputElement>("#categoryName");
const categoryMessage =
  document.querySelector<HTMLParagraphElement>("#categoryMessage");
const categoriesTableBody =
  document.querySelector<HTMLTableSectionElement>("#categoriesTableBody");
const cancelCategoryEditButton = document.querySelector<HTMLButtonElement>(
  "#cancelCategoryEditButton"
);

if (
  !logo ||
  !loggedUserName ||
  !dashboardMessage ||
  !dashboardMetrics ||
  !dashboardSummary ||
  !form ||
  !productSection ||
  !productIdInput ||
  !nameInput ||
  !categorySelect ||
  !priceInput ||
  !imageInput ||
  !imagePreview ||
  !descriptionInput ||
  !longDescriptionInput ||
  !featuredInput ||
  !message ||
  !productsTableBody ||
  !ordersTableBody ||
  !cancelEditButton ||
  !adminSearchForm ||
  !adminSearchInput ||
  !adminSearchMessage ||
  !categoryForm ||
  !categoryIdInput ||
  !categoryNameInput ||
  !categoryMessage ||
  !categoriesTableBody ||
  !cancelCategoryEditButton
) {
  throw new Error("No se encontraron los elementos necesarios del admin");
}

logo.src = logoImage;
loggedUserName.textContent = getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");
const numberFormatter = new Intl.NumberFormat("es-AR");

type FormMessageType = "success" | "error" | "info";

let products = getProducts();
let productCategories = getCategories();

const metricToneClass = {
  neutral: "dashboard-metric-neutral",
  accent: "dashboard-metric-accent",
  success: "dashboard-metric-success",
  warning: "dashboard-metric-warning",
} as const;

const normalizeCategoryName = (categoryName: string): string =>
  categoryName.replace(/\s+/g, "").toLowerCase();

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const setFormMessage = (
  element: HTMLParagraphElement,
  text: string,
  type: FormMessageType
): void => {
  element.textContent = text;
  element.className = `form-message form-message-${type}`;
  element.setAttribute("role", type === "error" ? "alert" : "status");
};

const clearFormMessage = (element: HTMLParagraphElement): void => {
  element.textContent = "";
  element.className = "form-message";
  element.removeAttribute("role");
};

const resetForm = (clearMessage = true): void => {
  form.reset();
  productIdInput.value = "";
  updateImagePreview();

  if (clearMessage) {
    clearFormMessage(message);
  }
};

const resetCategoryForm = (clearMessage = true): void => {
  categoryForm.reset();
  categoryIdInput.value = "";

  if (clearMessage) {
    clearFormMessage(categoryMessage);
  }
};

const renderCategories = (): void => {
  categorySelect.innerHTML = "";

  productCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
};

const updateImagePreview = (): void => {
  const selectedOption = imageInput.selectedOptions[0];

  if (!imageInput.value) {
    imagePreview.removeAttribute("src");
    imagePreview.alt = "Sin imagen seleccionada";
    return;
  }

  imagePreview.src = imageInput.value;
  imagePreview.alt = selectedOption?.textContent
    ? `Vista previa de ${selectedOption.textContent}`
    : "Vista previa de imagen seleccionada";
};

const renderProductImageOptions = (): void => {
  imageInput.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Seleccioná una imagen";
  imageInput.appendChild(emptyOption);

  productImageOptions.forEach((imageOption) => {
    const option = document.createElement("option");
    option.value = imageOption.url;
    option.textContent = imageOption.label;
    imageInput.appendChild(option);
  });

  updateImagePreview();
};

const selectProductImage = (imageUrl: string): void => {
  const hasImageOption = productImageOptions.some(
    (imageOption) => imageOption.url === imageUrl
  );

  if (!hasImageOption) {
    const currentImageOption = document.createElement("option");
    currentImageOption.value = imageUrl;
    currentImageOption.textContent = "Imagen actual";
    imageInput.appendChild(currentImageOption);
  }

  imageInput.value = imageUrl;
  updateImagePreview();
};

const renderCategoryTable = (): void => {
  categoriesTableBody.innerHTML = "";

  productCategories.forEach((category) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${category.name}</td>
      <td>
        <button type="button" class="button-secondary btn-edit-category" data-id="${category.id}">Editar</button>
        <button type="button" class="btn-delete-category" data-id="${category.id}">Eliminar</button>
      </td>
    `;

    categoriesTableBody.appendChild(tr);
  });
};

const productMatchesSearch = (product: Product, searchText: string): boolean =>
  normalizeSearchText(product.name).includes(normalizeSearchText(searchText));

const getFilteredProducts = (): Product[] => {
  const searchText = adminSearchInput.value.trim();

  if (!searchText) {
    return products;
  }

  return products.filter((product) => productMatchesSearch(product, searchText));
};

const renderProducts = (productsToRender = getFilteredProducts()): void => {
  productsTableBody.innerHTML = "";
  adminSearchMessage.textContent = "";

  if (productsToRender.length === 0) {
    adminSearchMessage.textContent = "No se encontraron productos con ese nombre.";
    return;
  }

  productsToRender.forEach((product) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>$${currencyFormatter.format(product.price)}</td>
      <td>${product.destacado ? "Sí" : "No"}</td>
      <td>
        <button type="button" class="button-secondary btn-edit" data-id="${
          product.id
        }">Editar</button>
        <button type="button" class="btn-delete" data-id="${
          product.id
        }">Eliminar</button>
      </td>
    `;

    productsTableBody.appendChild(tr);
  });
};

const renderOrders = (): void => {
  ordersTableBody.innerHTML = "";

  getOrders().forEach((order) => {
    const tr = document.createElement("tr");
    const itemCount = order.detalles.reduce(
      (totalItems, item) => totalItems + item.cantidad,
      0
    );

    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.idUsuario}</td>
      <td>${order.estado}</td>
      <td>${itemCount}</td>
      <td>$${currencyFormatter.format(order.total)}</td>
      <td>${order.fecha}</td>
    `;

    ordersTableBody.appendChild(tr);
  });
};

const renderDashboard = async (): Promise<void> => {
  try {
    const [apiCategories, apiProducts, apiUsers, apiOrders] = await Promise.all([
      fetchCategories().catch(() => []),
      fetchProducts().catch(() => []),
      fetchUsers().catch(() => []),
      fetchOrders().catch(() => []),
    ]);

    const stats = buildAdminDashboardStats({
      categories: apiCategories,
      products: apiProducts,
      users: apiUsers,
      orders: apiOrders,
    });

    dashboardMessage.textContent = "";
    dashboardMetrics.innerHTML = `
      <article class="dashboard-metric ${metricToneClass.accent}">
        <span>Total categorías</span>
        <strong>${numberFormatter.format(stats.totalCategories)}</strong>
      </article>
      <article class="dashboard-metric ${metricToneClass.neutral}">
        <span>Total productos</span>
        <strong>${numberFormatter.format(stats.totalProducts)}</strong>
      </article>
      <article class="dashboard-metric ${metricToneClass.warning}">
        <span>Total pedidos</span>
        <strong>${numberFormatter.format(stats.totalOrders)}</strong>
      </article>
      <article class="dashboard-metric ${metricToneClass.success}">
        <span>Productos disponibles</span>
        <strong>${numberFormatter.format(stats.availableProducts)}</strong>
      </article>
    `;

    dashboardSummary.innerHTML = `
      <article class="dashboard-summary-card">
        <h3>Categorías</h3>
        <p>Activas: <strong>${stats.activeCategories}</strong></p>
        <p>Inactivas: <strong>${stats.inactiveCategories}</strong></p>
      </article>
      <article class="dashboard-summary-card">
        <h3>Productos</h3>
        <p>Disponibles: <strong>${stats.activeProducts}</strong></p>
        <p>No disponibles: <strong>${stats.inactiveProducts}</strong></p>
      </article>
      <article class="dashboard-summary-card">
        <h3>Usuarios</h3>
        <p>Administradores: <strong>${stats.adminUsers}</strong></p>
        <p>Clientes: <strong>${stats.clientUsers}</strong></p>
      </article>
      <article class="dashboard-summary-card dashboard-summary-card-wide">
        <h3>Pedidos por estado</h3>
        <ul class="dashboard-status-list">
          <li>Pendientes: <strong>${stats.orderStatusCounts.PENDIENTE}</strong></li>
          <li>Confirmados: <strong>${stats.orderStatusCounts.CONFIRMADO}</strong></li>
          <li>Terminados: <strong>${stats.orderStatusCounts.TERMINADO}</strong></li>
          <li>Cancelados: <strong>${stats.orderStatusCounts.CANCELADO}</strong></li>
        </ul>
      </article>
    `;
  } catch {
    dashboardMessage.textContent = "No se pudo cargar el dashboard.";
    dashboardMetrics.innerHTML = "";
    dashboardSummary.innerHTML = "";
  }
};

const persistProducts = (): void => {
  saveProducts(products);
  renderProducts();
};

const persistCategories = (): void => {
  saveCategories(productCategories);
  renderCategories();
  renderCategoryTable();
};

const getFormCategory = (): Category => categorySelect.value as Category;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (productCategories.length === 0) {
    setFormMessage(
      message,
      "Creá una categoría antes de cargar productos.",
      "error"
    );
    return;
  }

  const productId = Number(productIdInput.value);
  const productPrice = Number(priceInput.value);
  const productData: Product = {
    id: productId || getNextProductId(products),
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    longDescription: longDescriptionInput.value.trim(),
    price: productPrice,
    image: imageInput.value.trim(),
    category: getFormCategory(),
    destacado: featuredInput.checked,
  };

  if (
    !productData.name ||
    !productData.description ||
    !productData.longDescription ||
    !productData.image ||
    !Number.isFinite(productData.price) ||
    productData.price <= 0
  ) {
    setFormMessage(
      message,
      "Completá todos los campos del producto con un precio numérico mayor a cero.",
      "error"
    );
    return;
  }

  if (productId) {
    products = products.map((product) =>
      product.id === productId ? productData : product
    );
    setFormMessage(message, "Producto actualizado correctamente.", "success");
  } else {
    products = [...products, productData];
    setFormMessage(message, "Producto creado correctamente.", "success");
  }

  persistProducts();
  resetForm(false);
});

categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const categoryId = Number(categoryIdInput.value);
  const categoryName = categoryNameInput.value.trim();
  const normalizedCategoryName = normalizeCategoryName(categoryName);
  const currentCategory = productCategories.find(
    (category) => category.id === categoryId
  );
  const categoryAlreadyExists = productCategories.some(
    (category) =>
      normalizeCategoryName(category.name) === normalizedCategoryName &&
      category.id !== categoryId
  );

  if (!categoryName) {
    setFormMessage(
      categoryMessage,
      "Completá el nombre de la categoría.",
      "error"
    );
    return;
  }

  if (categoryAlreadyExists) {
    setFormMessage(
      categoryMessage,
      "Ya existe una categoría con ese nombre.",
      "error"
    );
    return;
  }

  if (categoryId && currentCategory) {
    const previousCategoryName = currentCategory.name;

    productCategories = productCategories.map((category) =>
      category.id === categoryId ? { ...category, name: categoryName } : category
    );
    products = products.map((product) =>
      product.category === previousCategoryName
        ? { ...product, category: categoryName }
        : product
    );
    saveProducts(products);
    renderProducts();
    setFormMessage(
      categoryMessage,
      "Categoría actualizada correctamente.",
      "success"
    );
  } else {
    productCategories = [
      ...productCategories,
      { id: getNextCategoryId(productCategories), name: categoryName },
    ];
    setFormMessage(
      categoryMessage,
      "Categoría creada correctamente.",
      "success"
    );
  }

  persistCategories();
  resetCategoryForm(false);
});

productsTableBody.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const productId = Number(target.dataset.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (target.classList.contains("btn-edit")) {
    productIdInput.value = product.id.toString();
    nameInput.value = product.name;
    categorySelect.value = product.category;
    priceInput.value = product.price.toString();
    selectProductImage(product.image);
    descriptionInput.value = product.description;
    longDescriptionInput.value = product.longDescription;
    featuredInput.checked = product.destacado;
    setFormMessage(message, `Editando producto: ${product.name}.`, "info");
    productSection.scrollIntoView({ behavior: "smooth", block: "start" });
    nameInput.focus();
    return;
  }

  if (target.classList.contains("btn-delete")) {
    const deletedProductName = product.name;

    products = products.filter((item) => item.id !== productId);
    persistProducts();
    resetForm(false);
    setFormMessage(
      message,
      `Producto eliminado: ${deletedProductName}.`,
      "success"
    );
  }
});

categoriesTableBody.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const categoryId = Number(target.dataset.id);
  const category = productCategories.find((item) => item.id === categoryId);

  if (!category) {
    return;
  }

  if (target.classList.contains("btn-edit-category")) {
    categoryIdInput.value = category.id.toString();
    categoryNameInput.value = category.name;
    setFormMessage(categoryMessage, `Editando categoría: ${category.name}.`, "info");
    return;
  }

  if (target.classList.contains("btn-delete-category")) {
    const categoryHasProducts = products.some(
      (product) => product.category === category.name
    );

    if (categoryHasProducts) {
      setFormMessage(
        categoryMessage,
        "No se puede eliminar una categoría con productos asociados.",
        "error"
      );
      return;
    }

    const deletedCategoryName = category.name;

    productCategories = productCategories.filter((item) => item.id !== categoryId);
    persistCategories();
    resetCategoryForm(false);
    setFormMessage(
      categoryMessage,
      `Categoría eliminada: ${deletedCategoryName}.`,
      "success"
    );
  }
});

adminSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
});

adminSearchInput.addEventListener("input", () => {
  renderProducts();
});

imageInput.addEventListener("change", updateImagePreview);

cancelEditButton.addEventListener("click", () => {
  const wasEditing = productIdInput.value !== "";

  resetForm(false);
  setFormMessage(
    message,
    wasEditing
      ? "Edición de producto cancelada."
      : "Formulario de producto limpio.",
    "info"
  );
});

cancelCategoryEditButton.addEventListener("click", () => {
  const wasEditing = categoryIdInput.value !== "";

  resetCategoryForm(false);
  setFormMessage(
    categoryMessage,
    wasEditing
      ? "Edición de categoría cancelada."
      : "Formulario de categoría limpio.",
    "info"
  );
});

renderProductImageOptions();
renderCategories();
renderCategoryTable();
renderProducts();
renderOrders();
void renderDashboard();
