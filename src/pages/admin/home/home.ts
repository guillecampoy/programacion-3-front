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
import { deleteAdminCategory, type AdminCategory, createAdminCategory, getVisibleAdminCategories, isCategoryNameTaken, updateAdminCategory } from "../../../utils/adminCategories";
import { buildAdminDashboardStats } from "../../../utils/adminDashboard";
import { logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getOrders } from "../../../utils/orders";
import {
  productImageOptions,
  resolveProductImageUrl,
} from "../../../utils/productImages";
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
const openCategoryModalButton = document.querySelector<HTMLButtonElement>(
  "#openCategoryModalButton"
);
const categoryModal = document.querySelector<HTMLDivElement>("#categoryModal");
const closeCategoryModalButton = document.querySelector<HTMLButtonElement>(
  "#closeCategoryModalButton"
);
const categoryModalTitle = document.querySelector<HTMLHeadingElement>(
  "#categoryModalTitle"
);
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
const categoryDescriptionInput = document.querySelector<HTMLTextAreaElement>(
  "#categoryDescription"
);
const categoryImageSelect =
  document.querySelector<HTMLSelectElement>("#categoryImage");
const categoryImagePreview =
  document.querySelector<HTMLImageElement>("#categoryImagePreview");
const categoryMessage =
  document.querySelector<HTMLParagraphElement>("#categoryMessage");
const categoriesMessage =
  document.querySelector<HTMLParagraphElement>("#categoriesMessage");
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
  !openCategoryModalButton ||
  !categoryModal ||
  !closeCategoryModalButton ||
  !categoryModalTitle ||
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
  !categoryDescriptionInput ||
  !categoryImageSelect ||
  !categoryImagePreview ||
  !categoryMessage ||
  !categoriesMessage ||
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
let productCategories: AdminCategory[] = [];

const metricToneClass = {
  neutral: "dashboard-metric-neutral",
  accent: "dashboard-metric-accent",
  success: "dashboard-metric-success",
  warning: "dashboard-metric-warning",
} as const;

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

const updateCategoryImagePreview = (): void => {
  if (!categoryImageSelect.value) {
    categoryImagePreview.removeAttribute("src");
    categoryImagePreview.alt = "Sin imagen seleccionada";
    return;
  }

  categoryImagePreview.src = resolveProductImageUrl(categoryImageSelect.value);
  categoryImagePreview.alt = categoryImageSelect.selectedOptions[0]?.textContent
    ? `Vista previa de ${categoryImageSelect.selectedOptions[0].textContent}`
    : "Vista previa de imagen seleccionada";
};

const renderCategoryImageOptions = (): void => {
  categoryImageSelect.innerHTML = "";

  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = "Seleccioná una imagen";
  categoryImageSelect.appendChild(emptyOption);

  productImageOptions.forEach((imageOption) => {
    const option = document.createElement("option");
    option.value = imageOption.fileName;
    option.textContent = imageOption.label;
    categoryImageSelect.appendChild(option);
  });

  updateCategoryImagePreview();
};

const openCategoryModal = (title: string): void => {
  categoryModalTitle.textContent = title;
  categoryModal.hidden = false;
};

const closeCategoryModal = (): void => {
  categoryModal.hidden = true;
};

const resetCategoryForm = (clearMessage = true): void => {
  categoryForm.reset();
  categoryIdInput.value = "";
  updateCategoryImagePreview();

  if (clearMessage) {
    clearFormMessage(categoryMessage);
  }
};

const renderCategories = (): void => {
  categorySelect.innerHTML = "";

  getVisibleAdminCategories(productCategories).forEach((category) => {
    const option = document.createElement("option");
    option.value = category.nombre;
    option.textContent = category.nombre;
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

  const visibleCategories = getVisibleAdminCategories(productCategories);

  categoriesMessage.textContent =
    visibleCategories.length === 0 ? "No hay categorías cargadas." : "";

  visibleCategories.forEach((category) => {
    const tr = document.createElement("tr");
    const imageUrl = resolveProductImageUrl(category.imagen);

    tr.innerHTML = `
      <td>${category.nombre}</td>
      <td>${category.descripcion}</td>
      <td>
        <img class="admin-category-image" src="${imageUrl}" alt="${category.nombre}">
      </td>
      <td>Activa</td>
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

const getFormCategory = (): Category => categorySelect.value as Category;

const refreshCategoryViews = (): void => {
  renderCategories();
  renderCategoryTable();
};

const loadAdminCategories = async (): Promise<void> => {
  productCategories = await fetchCategories().catch(() => []);
  refreshCategoryViews();
};

const openCategoryEditor = (category?: AdminCategory): void => {
  resetCategoryForm();
  if (category) {
    categoryIdInput.value = String(category.id);
    categoryNameInput.value = category.nombre;
    categoryDescriptionInput.value = category.descripcion;
    categoryImageSelect.value = category.imagen;
    updateCategoryImagePreview();
  }

  openCategoryModal(category ? "Editar categoría" : "Nueva categoría");
  categoryNameInput.focus();
};

const updateProductsForCategoryRename = (
  previousName: string,
  nextName: string
): void => {
  if (previousName === nextName) {
    return;
  }

  products = products.map((product) =>
    product.category === previousName ? { ...product, category: nextName } : product
  );
  saveProducts(products);
  renderProducts();
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const activeCategories = getVisibleAdminCategories(productCategories);

  if (activeCategories.length === 0) {
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
  const categoryDescription = categoryDescriptionInput.value.trim();
  const categoryImage = categoryImageSelect.value.trim();
  const currentCategory = productCategories.find(
    (category) => category.id === categoryId
  );
  const categoryAlreadyExists = isCategoryNameTaken(
    productCategories,
    categoryName,
    categoryId || undefined
  );

  if (!categoryName || !categoryDescription || !categoryImage) {
    setFormMessage(categoryMessage, "Completá todos los campos.", "error");
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
    productCategories = updateAdminCategory(productCategories, categoryId, {
      name: categoryName,
      description: categoryDescription,
      image: categoryImage,
    });
    updateProductsForCategoryRename(currentCategory.nombre, categoryName);
    setFormMessage(
      categoryMessage,
      "Categoría actualizada correctamente.",
      "success"
    );
  } else {
    productCategories = createAdminCategory(productCategories, {
      name: categoryName,
      description: categoryDescription,
      image: categoryImage,
    });
    setFormMessage(
      categoryMessage,
      "Categoría creada correctamente.",
      "success"
    );
  }

  refreshCategoryViews();
  resetCategoryForm(false);
  closeCategoryModal();
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
    openCategoryEditor(category);
    setFormMessage(categoryMessage, `Editando categoría: ${category.nombre}.`, "info");
    return;
  }

  if (target.classList.contains("btn-delete-category")) {
    const confirmed = window.confirm(
      `¿Eliminar la categoría ${category.nombre}?`
    );

    if (!confirmed) {
      return;
    }

    productCategories = deleteAdminCategory(productCategories, categoryId);
    refreshCategoryViews();
    resetCategoryForm(false);
    closeCategoryModal();
    setFormMessage(
      categoryMessage,
      `Categoría eliminada: ${category.nombre}.`,
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

openCategoryModalButton.addEventListener("click", () => {
  openCategoryEditor();
});

closeCategoryModalButton.addEventListener("click", () => {
  closeCategoryModal();
});

categoryModal.addEventListener("click", (event) => {
  if (event.target === categoryModal) {
    closeCategoryModal();
  }
});

categoryImageSelect.addEventListener("change", updateCategoryImagePreview);

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
  closeCategoryModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !categoryModal.hidden) {
    closeCategoryModal();
  }
});

renderProductImageOptions();
renderCategoryImageOptions();
renderProducts();
renderOrders();
void loadAdminCategories();
void renderDashboard();
