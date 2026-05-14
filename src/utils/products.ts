import choriImage from "../assets/food-store/chori_bodegon.png";
import churrasquitoImage from "../assets/food-store/churrasquito_completo_bodegon.png";
import empanadaImage from "../assets/food-store/empanada_bodegon.png";
import milanesaACaballoImage from "../assets/food-store/mila_a_caballo.png";
import milanesaImage from "../assets/food-store/mila_napo_bodegon.png";
import milanesaSimpleImage from "../assets/food-store/mila_simple.png";
import papasImage from "../assets/food-store/papas_bodegon.png";
import type { Product } from "../types/Product";

const PRODUCTS_KEY = "products";
const DEFAULT_LONG_DESCRIPTION =
  "Descripción ampliada pendiente. Acá podés detallar ingredientes, tamaño de la porción, acompañamientos sugeridos y cualquier aclaración útil para el cliente.";

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Milanesa Napolitana",
    description: "Corte vacuno bola de lomo o cuadrada, según disponibilidad",
    longDescription:
      "Milanesa de carne vacuna empanada y dorada al momento, cubierta con salsa de tomate, jamón y queso gratinado. Se sirve en porción abundante y es una de las opciones más completas del menú.",
    price: 18000,
    image: milanesaImage,
    category: "Milanesas",
    destacado: true,
  },
  {
    id: 2,
    name: "Milanesa a Caballo",
    description: "Milanesa con huevos fritos, ideal para compartir",
    longDescription:
      "Milanesa clásica de carne vacuna terminada con huevos fritos sobre la superficie. Combina una base crocante con un agregado simple y contundente, ideal para quienes buscan una opción bien casera.",
    price: 23400,
    image: milanesaACaballoImage,
    category: "Milanesas",
    destacado: true,
  },
  {
    id: 3,
    name: "Milanesa Simple",
    description: "Milanesa clásica, crocante y abundante",
    longDescription:
      "Milanesa vacuna de corte generoso, empanada y cocida hasta lograr un exterior crocante. Es la versión más tradicional del bodegón, pensada para disfrutar sola o sumar una guarnición a elección.",
    price: 12600,
    image: milanesaSimpleImage,
    category: "Milanesas",
    destacado: false,
  },
  {
    id: 4,
    name: "Choripán",
    description:
      "Chorizo casero, mezcla premium, aderezos disponibles chimichurri y salsa criolla",
    longDescription:
      "Chorizo casero de mezcla premium servido en pan crocante, con opción de sumar chimichurri o salsa criolla. Una minuta clásica, sabrosa y práctica para una comida rápida con buen sabor.",
    price: 13000,
    image: choriImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 5,
    name: "Churrasquito Completo",
    description: "Con lechuga, tomate y queso tybo",
    longDescription:
      "Sándwich de churrasquito preparado con carne tierna, lechuga fresca, tomate y queso tybo. Sale en formato completo, ideal para quienes buscan una opción abundante y lista para acompañar con papas.",
    price: 20000,
    image: churrasquitoImage,
    category: "Minutas",
    destacado: true,
  },
  {
    id: 6,
    name: "Empanada",
    description: "Masa casera, de gran tamaño, carne cortada a cuchillo",
    longDescription:
      "Empanada de masa casera, bien cerrada y de tamaño generoso, rellena con carne cortada a cuchillo. Tiene un perfil bien tradicional y funciona tanto como entrada como para sumar al pedido principal.",
    price: 8000,
    image: empanadaImage,
    category: "Minutas",
    destacado: false,
  },
  {
    id: 7,
    name: "Papas bastón",
    description: "Crujientes, caseras, porción abundante",
    longDescription:
      "Porción de papas bastón caseras, doradas por fuera y tiernas por dentro. Llegan en tamaño abundante y funcionan muy bien como acompañamiento o para compartir entre dos personas.",
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
