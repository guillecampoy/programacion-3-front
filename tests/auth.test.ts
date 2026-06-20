import { beforeEach, describe, expect, it, vi } from "vitest";

const { navigateMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
}));

vi.mock("../src/utils/navigate", () => ({
  navigate: navigateMock,
  ROUTES: {
    login: "/src/pages/auth/login/login.html",
    registro: "/src/pages/auth/registro/registro.html",
    adminHome: "/src/pages/admin/home/home.html",
    storeHome: "/src/pages/store/home/home.html",
    storeCart: "/src/pages/store/cart/cart.html",
  },
}));

import { loginUser, redirectByRole } from "../src/utils/auth";
import { Rol } from "../src/types/Rol";

const createLocalStorageMock = (): Storage => {
  const store = new Map<string, string>();

  return {
    length: 0,
    clear: () => {
      store.clear();
    },
    getItem: (key: string) => store.get(key) ?? null,
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
  } satisfies Storage;
};

describe("auth", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.stubGlobal("localStorage", createLocalStorageMock());
  });

  it("inicia sesión desde usuarios.json y guarda la sesión sin password", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "admin-1",
          nombre: "Admin",
          apellido: "FoodStore",
          mail: "admin@test.com",
          celular: "1111111111",
          password: "Admin1234",
          rol: "ADMIN",
        },
      ],
    });

    vi.stubGlobal("fetch", fetchMock);

    const user = await loginUser("admin@test.com", "Admin1234");

    expect(fetchMock).toHaveBeenCalledWith("/data/usuarios.json");
    expect(user).toEqual({
      id: "admin-1",
      email: "admin@test.com",
      role: Rol.Admin,
    });
    expect(localStorage.getItem("userData")).toBe(
      JSON.stringify({
        id: "admin-1",
        email: "admin@test.com",
        role: Rol.Admin,
      })
    );
    expect(localStorage.getItem("userData") ?? "").not.toContain("password");
  });

  it("rechaza credenciales inválidas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));

    const user = await loginUser("missing@test.com", "Wrong123");

    expect(user).toBeNull();
    expect(localStorage.getItem("userData")).toBeNull();
  });

  it("redirige según el rol", () => {
    redirectByRole({ id: "1", email: "admin@test.com", role: Rol.Admin });
    expect(navigateMock).toHaveBeenCalledWith("/src/pages/admin/home/home.html");

    navigateMock.mockClear();

    redirectByRole({ id: "2", email: "client@test.com", role: Rol.Client });
    expect(navigateMock).toHaveBeenCalledWith("/src/pages/store/home/home.html");
  });
});
