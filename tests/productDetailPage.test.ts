import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string): string =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

describe("product detail page", () => {
  it("does not keep the loading state section in the page markup", () => {
    const source = readSource("src/pages/store/productDetail/productDetail.html");

    expect(source).not.toContain('<section id="productDetailState"');
  });

  it("does not keep the loading state section in the page script", () => {
    const source = readSource("src/pages/store/productDetail/productDetail.ts");

    expect(source).not.toContain("#productDetailState");
    expect(source).not.toContain("Cargando detalle del producto...");
  });

  it("renders the product image as a cover-style banner", () => {
    const source = readSource("src/style.css");

    expect(source).toContain(".product-detail-image");
    expect(source).toContain("aspect-ratio: 16 / 9;");
    expect(source).toContain("object-fit: cover;");
  });
});
