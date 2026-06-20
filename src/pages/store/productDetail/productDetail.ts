import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import { fetchCategories, fetchProducts } from "../../../utils/api";
import { getCart, getCartQuantityForProduct, addProductToCart, getUser } from "../../../utils/localStorage";
import { ROUTES } from "../../../utils/navigate";
import type { Product } from "../../../types/Product";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const cartQuantity = document.querySelector<HTMLSpanElement>("#cartQuantity");
const productDetailState = document.querySelector<HTMLParagraphElement>("#productDetailState");
const productDetailCard = document.querySelector<HTMLElement>("#productDetailCard");
const productDetailImage = document.querySelector<HTMLImageElement>("#productDetailImage");
const productDetailCategory = document.querySelector<HTMLParagraphElement>("#productDetailCategory");
const productDetailTitle = document.querySelector<HTMLHeadingElement>("#productDetailTitle");
const productDetailDescription = document.querySelector<HTMLParagraphElement>("#productDetailDescription");
const productDetailPrice = document.querySelector<HTMLParagraphElement>("#productDetailPrice");
const productDetailStock = document.querySelector<HTMLParagraphElement>("#productDetailStock");
const productDetailStatus = document.querySelector<HTMLParagraphElement>("#productDetailStatus");
const quantityInput = document.querySelector<HTMLInputElement>("#quantity");
const addToCartButton = document.querySelector<HTMLButtonElement>("#addToCartButton");
const productDetailMessage = document.querySelector<HTMLParagraphElement>("#productDetailMessage");

if (
  !buttonLogout ||
  !loggedUserName ||
  !logo ||
  !cartQuantity ||
  !productDetailState ||
  !productDetailCard ||
  !productDetailImage ||
  !productDetailCategory ||
  !productDetailTitle ||
  !productDetailDescription ||
  !productDetailPrice ||
  !productDetailStock ||
  !productDetailStatus ||
  !quantityInput ||
  !addToCartButton ||
  !productDetailMessage
) {
  throw new Error("No se encontraron los elementos necesarios del detalle");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
loggedUserName.textContent = getUser()?.name ?? getUser()?.email ?? "";

const currencyFormatter = new Intl.NumberFormat("es-AR");

const updateCartQuantity = (): void => {
  cartQuantity.textContent = String(
    getCart().reduce((total, item) => total + item.quantity, 0)
  );
};

const setMessage = (text: string, isError = false): void => {
  productDetailMessage.textContent = text;
  productDetailMessage.className = isError
    ? "form-message form-message-error"
    : "form-message form-message-success";
};

const getProductIdFromQuery = (): number | null => {
  const productId = Number(new URLSearchParams(window.location.search).get("id"));

  return Number.isInteger(productId) && productId > 0 ? productId : null;
};

const toCartProduct = (product: Awaited<ReturnType<typeof fetchProducts>>[number], categoryName: string): Product => ({
  id: product.id,
  name: product.nombre,
  description: product.descripcion,
  longDescription: product.descripcion,
  price: product.precio,
  image: product.imagen,
  category: categoryName,
  destacado: false,
  stock: product.stock,
});

const renderError = (message: string): void => {
  productDetailCard.hidden = true;
  productDetailState.hidden = false;
  productDetailState.className = "product-detail-state";
  productDetailState.innerHTML = `
    <p>${message}</p>
    <a class="cart-return-link" href="${ROUTES.storeHome}">Volver al catálogo</a>
  `;
};

const renderDetail = async (): Promise<void> => {
  const productId = getProductIdFromQuery();

  if (!productId) {
    renderError("No se indicó un producto válido.");
    return;
  }

  const [categories, products] = await Promise.all([
    fetchCategories(),
    fetchProducts(),
  ]);

  const product = products.find((item) => item.id === productId);

  if (!product) {
    renderError("No se encontró el producto solicitado.");
    return;
  }

  const categoryName =
    categories.find((category) => category.id === product.categoriaId)?.nombre ??
    "Sin categoría";
  let remainingStock = Math.max(
    product.stock - getCartQuantityForProduct(productId),
    0
  );
  const canAdd = product.disponible && product.stock > 0 && remainingStock > 0;

  productDetailState.hidden = true;
  productDetailCard.hidden = false;

  productDetailImage.src = product.imagen;
  productDetailImage.alt = product.nombre;
  productDetailCategory.textContent = categoryName;
  productDetailTitle.textContent = product.nombre;
  productDetailDescription.textContent = product.descripcion;
  productDetailPrice.innerHTML = `Precio: <strong>$${currencyFormatter.format(
    product.precio
  )}</strong>`;
  productDetailStock.textContent = `Stock disponible: ${remainingStock}`;
  productDetailStatus.textContent = product.disponible && product.stock > 0
    ? "Estado: Disponible"
    : "Estado: No disponible";

  if (!canAdd) {
    quantityInput.disabled = true;
    addToCartButton.disabled = true;
    quantityInput.value = "1";
    setMessage(
      product.stock <= 0
        ? "Producto sin stock."
        : "Producto no disponible.",
      true
    );
    return;
  }

  const syncControls = (): void => {
    remainingStock = Math.max(
      product.stock - getCartQuantityForProduct(productId),
      0
    );
    productDetailStock.textContent = `Stock disponible: ${remainingStock}`;
    quantityInput.min = "1";
    quantityInput.max = String(Math.max(remainingStock, 1));
    quantityInput.disabled = remainingStock <= 0;
    addToCartButton.disabled = remainingStock <= 0;
    quantityInput.value = String(Math.min(1, remainingStock));
  };

  syncControls();

  quantityInput.addEventListener("input", () => {
    const quantity = Number(quantityInput.value);
    const normalizedQuantity = Number.isInteger(quantity) && quantity > 0
      ? Math.min(quantity, remainingStock)
      : 1;

    quantityInput.value = String(normalizedQuantity);
  });

  addToCartButton.addEventListener("click", () => {
    const quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > remainingStock) {
      setMessage("La cantidad no puede superar el stock disponible.", true);
      return;
    }

    addProductToCart(toCartProduct(product, categoryName), quantity);
    updateCartQuantity();
    syncControls();
    setMessage("Producto agregado al carrito.");
  });
};

updateCartQuantity();
void renderDetail();
