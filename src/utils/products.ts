import choriImage from "../assets/food-store/chori_bodegon.png";
import churrasquitoImage from "../assets/food-store/churrasquito_completo_bodegon.png";
import empanadaImage from "../assets/food-store/empanada_bodegon.png";
import milanesaImage from "../assets/food-store/mila_napo_bodegon.png";
import papasImage from "../assets/food-store/papas_bodegon.png";
import type { Product } from "../types/Product";

const PRODUCTS_KEY = "products";

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Milanesa Napolitana",
    description: "Corte vacuno bola de lomo o cuadrada, según disponibilidad",
    price: 18000,
    image: milanesaImage,
    category: "Milanesas",
    destacado: true,
  },
  {
    id: 2,
    name: "Choripán",
    description:
      "Chorizo casero, mezcla premium, aderezos disponibles chimichurri y salsa criolla",
    price: 13000,
    image: choriImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 3,
    name: "Churrasquito Completo",
    description: "Con lechuga, tomate y queso tybo",
    price: 20000,
    image: churrasquitoImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 4,
    name: "Empanada",
    description: "Masa casera, de gran tamaño, carne cortada a cuchillo",
    price: 8000,
    image: empanadaImage,
    category: "Minutas",
    destacado: false,
  },
  {
    id: 5,
    name: "Papas bastón",
    description: "Crujientes, caseras, porción abundante",
    price: 9500,
    image: papasImage,
    category: "Papas Fritas",
    destacado: true,
  },
];

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.price === "number" &&
    typeof product.image === "string" &&
    typeof product.category === "string" &&
    typeof product.destacado === "boolean"
  );
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const productsFromStorage = localStorage.getItem(PRODUCTS_KEY);

  if (!productsFromStorage) {
    saveProducts(defaultProducts);
    return defaultProducts;
  }

  try {
    const parsedProducts = JSON.parse(productsFromStorage) as unknown;

    if (!Array.isArray(parsedProducts)) {
      saveProducts(defaultProducts);
      return defaultProducts;
    }

    const validProducts = parsedProducts.filter(isProduct);

    if (validProducts.length !== parsedProducts.length) {
      saveProducts(validProducts);
    }

    return validProducts;
  } catch {
    saveProducts(defaultProducts);
    return defaultProducts;
  }
};

export const getNextProductId = (products: Product[]): number => {
  const maxId = products.reduce(
    (currentMax, product) => Math.max(currentMax, product.id),
    0
  );

  return maxId + 1;
};
