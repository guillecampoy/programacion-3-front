export const PRODUCT_IMAGE_DIRECTORY = "../assets/food-store";
export const EXCLUDED_PRODUCT_IMAGE_FILES = [
  "admin.png",
  "editar.png",
  "favicon_bodegon.png",
  "logo_bodegon.png",
];

interface ProductImageOption {
  fileName: string;
  label: string;
  url: string;
}

const productImageModules = import.meta.glob<string>(
  [
    "../assets/food-store/*.{png,jpg,jpeg,webp}",
    "!../assets/food-store/admin.png",
    "!../assets/food-store/editar.png",
    "!../assets/food-store/favicon_bodegon.png",
    "!../assets/food-store/logo_bodegon.png",
  ],
  {
    eager: true,
    import: "default",
    query: "?url",
  }
);

const formatImageLabel = (fileName: string): string =>
  fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const productImageOptions: ProductImageOption[] = Object.entries(
  productImageModules
)
  .map(([path, url]) => {
    const fileName = path.split("/").pop() ?? path;

    return {
      fileName,
      label: formatImageLabel(fileName),
      url,
    };
  })
  .sort((firstOption, secondOption) =>
    firstOption.label.localeCompare(secondOption.label, "es")
  );
