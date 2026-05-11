import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import type { Category, Product } from "../../../types/Product";
import { logout } from "../../../utils/auth";
import {
  getCategories,
  getNextCategoryId,
  saveCategories,
} from "../../../utils/categories";
import { getUser } from "../../../utils/localStorage";
import { getOrders } from "../../../utils/orders";
import { getNextProductId, getProducts, saveProducts } from "../../../utils/products";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
buttonLogout?.addEventListener("click", () => {
  logout();
});

const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const form = document.querySelector<HTMLFormElement>("#productForm");
const productIdInput = document.querySelector<HTMLInputElement>("#productId");
const nameInput = document.querySelector<HTMLInputElement>("#productName");
const categorySelect =
  document.querySelector<HTMLSelectElement>("#productCategory");
const priceInput = document.querySelector<HTMLInputElement>("#productPrice");
const imageInput = document.querySelector<HTMLInputElement>("#productImage");
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
  !form ||
  !productIdInput ||
  !nameInput ||
  !categorySelect ||
  !priceInput ||
  !imageInput ||
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

let products = getProducts();
let productCategories = getCategories();

const normalizeCategoryName = (categoryName: string): string =>
  categoryName.replace(/\s+/g, "").toLowerCase();

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const resetForm = (clearMessage = true): void => {
  form.reset();
  productIdInput.value = "";

  if (clearMessage) {
    message.textContent = "";
  }
};

const resetCategoryForm = (clearMessage = true): void => {
  categoryForm.reset();
  categoryIdInput.value = "";

  if (clearMessage) {
    categoryMessage.textContent = "";
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
    const itemCount = order.items.reduce(
      (totalItems, item) => totalItems + item.quantity,
      0
    );

    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.clientEmail}</td>
      <td>${order.status}</td>
      <td>${itemCount}</td>
      <td>$${currencyFormatter.format(order.total)}</td>
      <td>${order.createdAt}</td>
    `;

    ordersTableBody.appendChild(tr);
  });
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
    message.textContent = "Creá una categoría antes de cargar productos.";
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
    message.textContent =
      "Completá todos los campos del producto con un precio numérico mayor a cero.";
    return;
  }

  if (productId) {
    products = products.map((product) =>
      product.id === productId ? productData : product
    );
    message.textContent = "Producto actualizado.";
  } else {
    products = [...products, productData];
    message.textContent = "Producto creado.";
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
    categoryMessage.textContent = "Completá el nombre de la categoría.";
    return;
  }

  if (categoryAlreadyExists) {
    categoryMessage.textContent = "Ya existe una categoría con ese nombre.";
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
    categoryMessage.textContent = "Categoría actualizada.";
  } else {
    productCategories = [
      ...productCategories,
      { id: getNextCategoryId(productCategories), name: categoryName },
    ];
    categoryMessage.textContent = "Categoría creada.";
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
    imageInput.value = product.image;
    descriptionInput.value = product.description;
    longDescriptionInput.value = product.longDescription;
    featuredInput.checked = product.destacado;
    message.textContent = "Editando producto.";
    return;
  }

  if (target.classList.contains("btn-delete")) {
    products = products.filter((item) => item.id !== productId);
    persistProducts();
    resetForm();
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
    categoryMessage.textContent = "Editando categoría.";
    return;
  }

  if (target.classList.contains("btn-delete-category")) {
    const categoryHasProducts = products.some(
      (product) => product.category === category.name
    );

    if (categoryHasProducts) {
      categoryMessage.textContent =
        "No se puede eliminar una categoría con productos asociados.";
      return;
    }

    productCategories = productCategories.filter((item) => item.id !== categoryId);
    persistCategories();
    resetCategoryForm();
  }
});

adminSearchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderProducts();
});

adminSearchInput.addEventListener("input", () => {
  renderProducts();
});

cancelEditButton.addEventListener("click", () => resetForm());
cancelCategoryEditButton.addEventListener("click", () => resetCategoryForm());

renderCategories();
renderCategoryTable();
renderProducts();
renderOrders();
