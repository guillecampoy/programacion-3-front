import { describe, expect, it } from "vitest";
import { validateCheckout } from "../src/utils/validation";

describe("validation", () => {
  it("rechaza un telefono con letras en el checkout", () => {
    expect(validateCheckout("11ab555", "TARJETA")).toBe(
      "El teléfono debe contener solo números."
    );
  });
});
