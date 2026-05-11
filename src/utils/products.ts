import choriImage from "../assets/food-store/chori_bodegon.png";
import churrasquitoImage from "../assets/food-store/churrasquito_completo_bodegon.png";
import empanadaImage from "../assets/food-store/empanada_bodegon.png";
import milanesaImage from "../assets/food-store/mila_napo_bodegon.png";
import papasImage from "../assets/food-store/papas_bodegon.png";
import type { Product } from "../types/Product";

const PRODUCTS_KEY = "products";
const DEFAULT_LONG_DESCRIPTION =
  "Texto de prueba para la vista detallada. Acá podés describir ingredientes, tamaño de la porción, guarniciones sugeridas y cualquier aclaración útil para el cliente.";

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Milanesa Napolitana",
    description: "Corte vacuno bola de lomo o cuadrada, según disponibilidad",
    longDescription:
      "Milanesa napolitana preparada con corte vacuno, salsa de tomate, jamón y queso gratinado. Texto de prueba para validar el popup de detalle con información extendida del producto.",
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
    longDescription:
      "Choripán con chorizo casero en pan crocante. Incluye texto orientativo de prueba para revisar cómo se presenta la descripción detallada, los aderezos disponibles y recomendaciones de consumo.",
    price: 13000,
    image: choriImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 3,
    name: "Churrasquito Completo",
    description: "Con lechuga, tomate y queso tybo",
    longDescription:
      "Sándwich de churrasquito con lechuga, tomate fresco y queso tybo. Texto de prueba para mostrar una descripción más extensa en la vista detallada del catálogo.",
    price: 20000,
    image: churrasquitoImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 4,
    name: "Empanada",
    description: "Masa casera, de gran tamaño, carne cortada a cuchillo",
    longDescription:
      "Empanada de masa casera con relleno abundante de carne cortada a cuchillo. Texto orientativo para validar el popup de detalle y el comportamiento del nuevo campo.",
    price: 8000,
    image: empanadaImage,
    category: "Minutas",
    destacado: false,
  },
  {
    id: 5,
    name: "Papas bastón",
    description: "Crujientes, caseras, porción abundante",
    longDescription:
      "Papas bastón caseras, doradas y crujientes. Texto de prueba para describir tamaño de porción, punto de cocción y opciones sugeridas para acompañar.",
    price: 9500,
    image: papasImage,
    category: "Papas Fritas",
    destacado: true,
  },
];

const isStoredProduct = (value: unknown): value is Omit<Product, "longDescription"> & {
  longDescription?: unknown;
} => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    (typeof product.longDescription === "string" ||
      typeof product.longDescription === "undefined") &&
    typeof product.price === "number" &&
    typeof product.image === "string" &&
    typeof product.category === "string" &&
    typeof product.destacado === "boolean"
  );
};

const normalizeProduct = (
  product: Omit<Product, "longDescription"> & { longDescription?: unknown }
): Product => ({
  ...product,
  longDescription:
    typeof product.longDescription === "string" &&
    product.longDescription.trim().length > 0
      ? product.longDescription
      : DEFAULT_LONG_DESCRIPTION,
});

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

    const storedProducts = parsedProducts.filter(isStoredProduct);
    const validProducts = storedProducts.map(normalizeProduct);
    const productsNeedMigration = storedProducts.some(
      (product) =>
        typeof product.longDescription !== "string" ||
        product.longDescription.trim().length === 0
    );

    if (validProducts.length !== parsedProducts.length || productsNeedMigration) {
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
