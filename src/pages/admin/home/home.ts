import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import type { Category, Product } from "../../../types/Product";
import { categories } from "../../../types/Product";
import { logout } from "../../../utils/auth";
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
const featuredInput =
  document.querySelector<HTMLInputElement>("#productFeatured");
const message = document.querySelector<HTMLParagraphElement>("#productMessage");
const productsTableBody =
  document.querySelector<HTMLTableSectionElement>("#productsTableBody");
const ordersTableBody =
  document.querySelector<HTMLTableSectionElement>("#ordersTableBody");
const cancelEditButton =
  document.querySelector<HTMLButtonElement>("#cancelEditButton");

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
  !featuredInput ||
  !message ||
  !productsTableBody ||
  !ordersTableBody ||
  !cancelEditButton
) {
  throw new Error("No se encontraron los elementos necesarios del admin");
}

logo.src = logoImage;
loggedUserName.textContent = getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

let products = getProducts();

const resetForm = (): void => {
  form.reset();
  productIdInput.value = "";
  message.textContent = "";
};

const renderCategories = (): void => {
  categorySelect.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
};

const renderProducts = (): void => {
  productsTableBody.innerHTML = "";

  products.forEach((product) => {
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

const getFormCategory = (): Category => categorySelect.value as Category;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const productId = Number(productIdInput.value);
  const productData: Product = {
    id: productId || getNextProductId(products),
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: Number(priceInput.value),
    image: imageInput.value.trim(),
    category: getFormCategory(),
    destacado: featuredInput.checked,
  };

  if (
    !productData.name ||
    !productData.description ||
    !productData.image ||
    productData.price <= 0
  ) {
    message.textContent = "Completá todos los campos del producto.";
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
  resetForm();
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

cancelEditButton.addEventListener("click", resetForm);

renderCategories();
renderProducts();
renderOrders();
