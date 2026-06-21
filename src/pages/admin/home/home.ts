import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import {
  type ApiProduct,
  fetchCategories,
  fetchOrders,
  fetchProducts,
  fetchRawProducts,
  fetchUsers,
} from "../../../utils/api";
import {
  createAdminCategory,
  deleteAdminCategory,
  getVisibleAdminCategories,
  isCategoryNameTaken,
  updateAdminCategory,
  type AdminCategory,
} from "../../../utils/adminCategories";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductCategoryName,
  validateAdminProductInput,
  updateAdminProduct,
} from "../../../utils/adminProducts";
import { buildAdminDashboardStats } from "../../../utils/adminDashboard";
import { logout } from "../../../utils/auth";
import { getUser } from "../../../utils/localStorage";
import { getOrders } from "../../../utils/orders";
import {
  productImageOptions,
  resolveProductImageUrl,
} from "../../../utils/productImages";

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
const openProductModalButton = document.querySelector<HTMLButtonElement>(
  "#openProductModalButton"
);
const productModal = document.querySelector<HTMLDivElement>("#productModal");
const closeProductModalButton = document.querySelector<HTMLButtonElement>(
  "#closeProductModalButton"
);
const productModalTitle = document.querySelector<HTMLHeadingElement>(
  "#productModalTitle"
);
const form = document.querySelector<HTMLFormElement>("#productForm");
const productIdInput = document.querySelector<HTMLInputElement>("#productId");
const nameInput = document.querySelector<HTMLInputElement>("#productName");
const descriptionInput =
  document.querySelector<HTMLTextAreaElement>("#productDescription");
const priceInput = document.querySelector<HTMLInputElement>("#productPrice");
const stockInput = document.querySelector<HTMLInputElement>("#productStock");
const categorySelect =
  document.querySelector<HTMLSelectElement>("#productCategory");
const imageInput = document.querySelector<HTMLSelectElement>("#productImage");
const availableInput = document.querySelector<HTMLInputElement>("#productAvailable");
const imagePreview =
  document.querySelector<HTMLImageElement>("#productImagePreview");
const message = document.querySelector<HTMLParagraphElement>("#productMessage");
const productsTableBody =
  document.querySelector<HTMLTableSectionElement>("#productsTableBody");
const productsMessage =
  document.querySelector<HTMLParagraphElement>("#productsMessage");
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
  !openProductModalButton ||
  !productModal ||
  !closeProductModalButton ||
  !productModalTitle ||
  !form ||
  !productIdInput ||
  !nameInput ||
  !descriptionInput ||
  !priceInput ||
  !stockInput ||
  !categorySelect ||
  !imageInput ||
  !availableInput ||
  !imagePreview ||
  !message ||
  !productsTableBody ||
  !productsMessage ||
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

let productCategories: AdminCategory[] = [];
let adminProducts: ApiProduct[] = [];

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

const renderProductCategoryOptions = (): void => {
  categorySelect.innerHTML = "";

  const visibleCategories = getVisibleAdminCategories(productCategories);

  visibleCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.nombre;
    categorySelect.appendChild(option);
  });

  if (visibleCategories.length === 0) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "Creá una categoría primero";
    categorySelect.appendChild(emptyOption);
  }
};

const updateProductImagePreview = (): void => {
  if (!imageInput.value) {
    imagePreview.removeAttribute("src");
    imagePreview.alt = "Sin imagen seleccionada";
    return;
  }

  imagePreview.src = resolveProductImageUrl(imageInput.value);
  imagePreview.alt = imageInput.selectedOptions[0]?.textContent
    ? `Vista previa de ${imageInput.selectedOptions[0].textContent}`
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
    option.value = imageOption.fileName;
    option.textContent = imageOption.label;
    imageInput.appendChild(option);
  });

  updateProductImagePreview();
};

const renderProductTable = (): void => {
  productsTableBody.innerHTML = "";

  const searchText = normalizeSearchText(adminSearchInput.value.trim());
  const productsToRender = adminProducts.filter((product) => {
    if (!searchText) {
      return true;
    }

    const categoryName = getAdminProductCategoryName(
      product.categoriaId,
      productCategories
    );

    return (
      normalizeSearchText(product.nombre).includes(searchText) ||
      normalizeSearchText(product.descripcion).includes(searchText) ||
      normalizeSearchText(categoryName ?? "").includes(searchText)
    );
  });

  adminSearchMessage.textContent =
    searchText && productsToRender.length === 0
      ? "No se encontraron productos con ese nombre."
      : "";
  productsMessage.textContent =
    productsToRender.length === 0 ? "No hay productos para mostrar." : "";

  if (productsToRender.length === 0) {
    return;
  }

  productsToRender.forEach((product) => {
    const tr = document.createElement("tr");
    const categoryName =
      getAdminProductCategoryName(product.categoriaId, productCategories) ??
      "Categoría eliminada";
    const imageUrl = resolveProductImageUrl(product.imagen);

    tr.innerHTML = `
      <td>${product.nombre}</td>
      <td>${product.descripcion}</td>
      <td>$${currencyFormatter.format(product.precio)}</td>
      <td>${product.stock}</td>
      <td>${categoryName}</td>
      <td>
        <img class="admin-product-image" src="${imageUrl}" alt="${product.nombre}">
      </td>
      <td>${product.disponible ? "Sí" : "No"}</td>
      <td>
        <button type="button" class="button-secondary btn-edit-product" data-id="${product.id}">Editar</button>
        <button type="button" class="btn-delete-product" data-id="${product.id}">Eliminar</button>
      </td>
    `;

    productsTableBody.appendChild(tr);
  });
};

const openProductModal = (title: string): void => {
  productModalTitle.textContent = title;
  productModal.hidden = false;
};

const closeProductModal = (): void => {
  productModal.hidden = true;
};

const resetProductForm = (clearMessage = true): void => {
  form.reset();
  productIdInput.value = "";
  updateProductImagePreview();

  if (clearMessage) {
    clearFormMessage(message);
  }
};

const selectProductImage = (imageUrl: string): void => {
  const hasImageOption = productImageOptions.some(
    (imageOption) => imageOption.fileName === imageUrl
  );

  if (!hasImageOption) {
    const currentImageOption = document.createElement("option");
    currentImageOption.value = imageUrl;
    currentImageOption.textContent = "Imagen actual";
    imageInput.appendChild(currentImageOption);
  }

  imageInput.value = imageUrl;
  updateProductImagePreview();
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

const refreshCategoryViews = (): void => {
  renderProductCategoryOptions();
  renderCategoryTable();
  renderProductTable();
};

const loadAdminCategories = async (): Promise<void> => {
  productCategories = await fetchCategories().catch(() => []);
  refreshCategoryViews();
};

const refreshProductViews = (): void => {
  renderProductCategoryOptions();
  renderProductTable();
};

const loadAdminProducts = async (): Promise<void> => {
  adminProducts = await fetchRawProducts().catch(() => []);
  refreshProductViews();
};

const openProductEditor = (product?: ApiProduct): void => {
  resetProductForm();

  if (product) {
    productIdInput.value = String(product.id);
    nameInput.value = product.nombre;
    descriptionInput.value = product.descripcion;
    priceInput.value = String(product.precio);
    stockInput.value = String(product.stock);
    categorySelect.value = String(product.categoriaId);
    selectProductImage(product.imagen);
    availableInput.checked = product.disponible;
  }

  openProductModal(product ? "Editar producto" : "Nuevo producto");
  nameInput.focus();
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
  const productInput = {
    nombre: nameInput.value.trim(),
    descripcion: descriptionInput.value.trim(),
    precio: Number(priceInput.value),
    stock: Number(stockInput.value),
    categoriaId: Number(categorySelect.value),
    imagen: imageInput.value.trim(),
    disponible: availableInput.checked,
  };

  const validationError = validateAdminProductInput(
    productInput,
    productCategories
  );

  if (validationError) {
    setFormMessage(message, validationError, "error");
    return;
  }

  if (productId) {
    adminProducts = updateAdminProduct(adminProducts, productId, productInput);
    setFormMessage(message, "Producto actualizado correctamente.", "success");
  } else {
    adminProducts = createAdminProduct(adminProducts, productInput);
    setFormMessage(message, "Producto creado correctamente.", "success");
  }

  refreshProductViews();
  resetProductForm(false);
  closeProductModal();
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
  const product = adminProducts.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  if (target.classList.contains("btn-edit-product")) {
    openProductEditor(product);
    setFormMessage(
      message,
      `Editando producto: ${product.nombre}.`,
      "info"
    );
    return;
  }

  if (target.classList.contains("btn-delete-product")) {
    const confirmed = window.confirm(
      `¿Eliminar el producto ${product.nombre}?`
    );

    if (!confirmed) {
      return;
    }

    adminProducts = deleteAdminProduct(adminProducts, productId);
    refreshProductViews();
    resetProductForm(false);
    closeProductModal();
    setFormMessage(
      message,
      `Producto eliminado: ${product.nombre}.`,
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
  renderProductTable();
});

adminSearchInput.addEventListener("input", () => {
  renderProductTable();
});

openProductModalButton.addEventListener("click", () => {
  const hasCategories = getVisibleAdminCategories(productCategories).length > 0;

  if (!hasCategories) {
    setFormMessage(
      message,
      "Creá una categoría antes de cargar productos.",
      "error"
    );
    return;
  }

  openProductEditor();
});

closeProductModalButton.addEventListener("click", () => {
  closeProductModal();
});

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeProductModal();
  }
});

categoryImageSelect.addEventListener("change", updateCategoryImagePreview);
imageInput.addEventListener("change", updateProductImagePreview);

cancelEditButton.addEventListener("click", () => {
  resetProductForm(false);
  setFormMessage(message, "Formulario de producto limpio.", "info");
  closeProductModal();
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
renderProductCategoryOptions();
renderOrders();
void loadAdminCategories();
void loadAdminProducts();
void renderDashboard();
