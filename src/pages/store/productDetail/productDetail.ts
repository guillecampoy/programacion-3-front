import "../../../main";
import "../../../style.css";

import logoImage from "../../../assets/food-store/logo_bodegon.png";
import { logout } from "../../../utils/auth";
import { fetchCategories, fetchProducts } from "../../../utils/api";
import { getCart, getCartQuantityForProduct, addProductToCart, getUser } from "../../../utils/localStorage";
import { ROUTES } from "../../../utils/navigate";
import { renderStoreNavigation } from "../../../utils/storeNavigation";
import type { Product } from "../../../types/Product";
import { Rol } from "../../../types/Rol";

const buttonLogout = document.querySelector<HTMLButtonElement>("#logoutButton");
const loggedUserName = document.querySelector<HTMLSpanElement>("#loggedUserName");
const logo = document.querySelector<HTMLImageElement>("#storeLogo");
const storeNavigation = document.querySelector<HTMLElement>("#storeNavigation");
const productDetailLayout = document.querySelector<HTMLElement>("#productDetailLayout");
const productDetailState = document.querySelector<HTMLElement>("#productDetailState");
const productDetailCard = document.querySelector<HTMLElement>("#productDetailCard");
const productDetailImage = document.querySelector<HTMLImageElement>("#productDetailImage");
const productDetailCategory = document.querySelector<HTMLParagraphElement>("#productDetailCategory");
const productDetailTitle = document.querySelector<HTMLHeadingElement>("#productDetailTitle");
const productDetailDescription = document.querySelector<HTMLParagraphElement>("#productDetailDescription");
const productDetailPrice = document.querySelector<HTMLParagraphElement>("#productDetailPrice");
const productDetailStock = document.querySelector<HTMLParagraphElement>("#productDetailStock");
const productDetailStatus = document.querySelector<HTMLParagraphElement>("#productDetailStatus");
const decreaseQuantityButton = document.querySelector<HTMLButtonElement>("#decreaseQuantityButton");
const increaseQuantityButton = document.querySelector<HTMLButtonElement>("#increaseQuantityButton");
const quantityInput = document.querySelector<HTMLInputElement>("#quantity");
const addToCartButton = document.querySelector<HTMLButtonElement>("#addToCartButton");
const productDetailMessage = document.querySelector<HTMLParagraphElement>("#productDetailMessage");
const backToCatalogLink = document.querySelector<HTMLAnchorElement>("#backToCatalogLink");

if (
  !buttonLogout ||
  !loggedUserName ||
  !logo ||
  !storeNavigation ||
  !productDetailState ||
  !productDetailLayout ||
  !productDetailCard ||
  !productDetailImage ||
  !productDetailCategory ||
  !productDetailTitle ||
  !productDetailDescription ||
  !productDetailPrice ||
  !productDetailStock ||
  !productDetailStatus ||
  !decreaseQuantityButton ||
  !increaseQuantityButton ||
  !quantityInput ||
  !addToCartButton ||
  !productDetailMessage ||
  !backToCatalogLink
) {
  throw new Error("No se encontraron los elementos necesarios del detalle");
}

buttonLogout.addEventListener("click", () => {
  logout();
});

logo.src = logoImage;
backToCatalogLink.href = ROUTES.storeHome;
const currentUser = getUser();
const isAdminUser = currentUser?.role === Rol.Admin;

loggedUserName.textContent = currentUser?.name ?? currentUser?.email ?? "";
renderStoreNavigation(storeNavigation, {
  isAdmin: isAdminUser,
  cartQuantity: getCart().reduce((total, item) => total + item.quantity, 0),
});

const currencyFormatter = new Intl.NumberFormat("es-AR");

const updateCartQuantity = (): void => {
  renderStoreNavigation(storeNavigation, {
    isAdmin: isAdminUser,
    cartQuantity: getCart().reduce((total, item) => total + item.quantity, 0),
  });
};

const setMessage = (text: string, isError = false): void => {
  productDetailMessage.textContent = text;
  productDetailMessage.className = isError
    ? "form-message form-message-error"
    : "form-message form-message-success";
};

const setBusy = (isBusy: boolean): void => {
  productDetailLayout.setAttribute("aria-busy", String(isBusy));
};

const renderLoading = (): void => {
  productDetailCard.hidden = true;
  productDetailState.hidden = false;
  productDetailState.className = "product-detail-state product-detail-state-loading";
  productDetailState.replaceChildren();

  const paragraph = document.createElement("p");
  paragraph.textContent = "Cargando detalle del producto...";
  productDetailState.appendChild(paragraph);
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
  productDetailState.className = "product-detail-state product-detail-state-error";
  setBusy(false);

  productDetailState.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  const link = document.createElement("a");
  link.className = "cart-return-link";
  link.href = ROUTES.storeHome;
  link.textContent = "Volver al catálogo";

  productDetailState.append(paragraph, link);
};

const renderDetail = async (): Promise<void> => {
  const productId = getProductIdFromQuery();

  if (!productId) {
    renderError("No pudimos abrir este producto porque el enlace no incluye un ID válido.");
    return;
  }

  setBusy(true);
  renderLoading();

  let categories: Awaited<ReturnType<typeof fetchCategories>>;
  let products: Awaited<ReturnType<typeof fetchProducts>>;

  try {
    [categories, products] = await Promise.all([
      fetchCategories(),
      fetchProducts(),
    ]);
  } catch {
    renderError("No pudimos cargar el detalle del producto. Revisá tu conexión y volvé a intentar.");
    return;
  }

  const product = products.find((item) => item.id === productId);

  if (!product) {
    renderError("No encontramos ese producto. Volvé al catálogo y probá con otro artículo.");
    return;
  }

  const categoryName =
    categories.find((category) => category.id === product.categoriaId)?.nombre ??
    "Sin categoría";
  let remainingStock = Math.max(
    product.stock - getCartQuantityForProduct(productId),
    0
  );
  const canAdd =
    !isAdminUser && product.disponible && product.stock > 0 && remainingStock > 0;

  setBusy(false);
  productDetailState.hidden = true;
  productDetailCard.hidden = false;

  productDetailImage.src = product.imagen;
  productDetailImage.alt = product.nombre;
  productDetailImage.hidden = false;
  productDetailCategory.textContent = categoryName;
  productDetailTitle.textContent = product.nombre;
  productDetailDescription.textContent = product.descripcion;
  productDetailPrice.replaceChildren();
  productDetailPrice.append("Precio: ");
  const priceValue = document.createElement("strong");
  priceValue.textContent = `${currencyFormatter.format(product.precio)}`;
  productDetailPrice.appendChild(priceValue);
  productDetailStock.textContent = `Stock disponible: ${remainingStock}`;
  productDetailStatus.textContent = product.disponible && product.stock > 0
    ? "Estado: Disponible"
    : "Estado: No disponible";

  if (!canAdd) {
    quantityInput.disabled = true;
    addToCartButton.disabled = true;
    quantityInput.value = "1";
    setMessage(
      isAdminUser
        ? "Los administradores no pueden agregar productos al carrito."
        : product.stock <= 0
        ? "Este producto no tiene stock disponible."
        : "Este producto no está disponible en este momento.",
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
    decreaseQuantityButton.disabled = remainingStock <= 0;
    increaseQuantityButton.disabled = remainingStock <= 0;
    quantityInput.value = String(Math.min(1, remainingStock));
  };

  syncControls();

  const changeQuantity = (delta: number): void => {
    const currentQuantity = Number(quantityInput.value);
    const nextQuantity = Number.isInteger(currentQuantity) ? currentQuantity + delta : 1;
    const normalizedQuantity = Math.min(Math.max(nextQuantity, 1), remainingStock);

    quantityInput.value = String(normalizedQuantity);
  };

  quantityInput.addEventListener("input", () => {
    const quantity = Number(quantityInput.value);
    const normalizedQuantity = Number.isInteger(quantity) && quantity > 0
      ? Math.min(quantity, remainingStock)
      : 1;

    quantityInput.value = String(normalizedQuantity);
  });

  decreaseQuantityButton.addEventListener("click", () => {
    changeQuantity(-1);
  });

  increaseQuantityButton.addEventListener("click", () => {
    changeQuantity(1);
  });

  addToCartButton.addEventListener("click", () => {
    const quantity = Number(quantityInput.value);

    if (!Number.isInteger(quantity) || quantity <= 0 || quantity > remainingStock) {
      setMessage("La cantidad no puede superar el stock disponible. Ajustá el número e intentá de nuevo.", true);
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
