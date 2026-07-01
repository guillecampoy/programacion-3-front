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

import {
  canAccessRoute,
  guardRoute,
  loginUser,
  redirectByRole,
  registerUser,
} from "../src/utils/auth";
import { Rol } from "../src/types/Rol";
import { validateRegistration } from "../src/utils/validation";

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

const mockWindow = {
  location: {
    pathname: "/src/pages/store/home/home.html",
  },
} as Window;

describe("auth", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    vi.stubGlobal("localStorage", createLocalStorageMock());
    mockWindow.location.pathname = "/src/pages/store/home/home.html";
    vi.stubGlobal("window", mockWindow);
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
      name: "Admin FoodStore",
      email: "admin@test.com",
      role: Rol.Admin,
    });
    expect(localStorage.getItem("userData")).toBe(
      JSON.stringify({
        id: "admin-1",
        name: "Admin FoodStore",
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

  it("permite a admin entrar a la tienda sin redirigirlo al panel", async () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ id: "1", email: "admin@test.com", role: Rol.Admin })
    );

    await guardRoute();

    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("sigue bloqueando al cliente fuera del panel admin", () => {
    expect(canAccessRoute(Rol.Client, "/src/pages/admin/home/home.html")).toBe(
      false
    );
    expect(canAccessRoute(Rol.Admin, "/src/pages/store/home/home.html")).toBe(
      true
    );
    expect(canAccessRoute(Rol.Admin, "/src/pages/store/cart/cart.html")).toBe(
      false
    );
  });

  it("redirige a tienda cuando admin intenta entrar al carrito", async () => {
    localStorage.setItem(
      "userData",
      JSON.stringify({ id: "1", email: "admin@test.com", role: Rol.Admin })
    );
    mockWindow.location.pathname = "/src/pages/store/cart/cart.html";

    await guardRoute();

    expect(navigateMock).toHaveBeenCalledWith("/src/pages/store/home/home.html");
  });

  it("registra un usuario de forma local y lo deja logueado", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));

    const error = await registerUser("Nuevo Cliente", "nuevo@test.com", "abc123");

    expect(error).toBeNull();
    const storedUser = JSON.parse(localStorage.getItem("userData") ?? "{}") as {
      id: string;
      name: string;
      email: string;
      role: string;
    };

    expect(storedUser.id).toContain("user-");
    expect(storedUser.name).toBe("Nuevo Cliente");
    expect(storedUser.email).toBe("nuevo@test.com");
    expect(storedUser.role).toBe(Rol.Client);
  });

  it("rechaza emails ya existentes en usuarios.json", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: "u-1",
          nombre: "Existente",
          apellido: "User",
          mail: "existente@test.com",
          celular: "000",
          password: "abc123",
          rol: "USUARIO",
        },
      ],
    }));

    const error = await registerUser("Otro", "existente@test.com", "abc123");

    expect(error).toBe("Ya existe un usuario con ese email.");
    expect(localStorage.getItem("userData")).toBeNull();
  });

  it("valida el formulario de registro", () => {
    expect(validateRegistration("", "nuevo@test.com", "abc123")).toBe(
      "El nombre es requerido."
    );
    expect(validateRegistration("Nuevo", "mal", "abc123")).toBe(
      "Ingresá un email válido."
    );
    expect(validateRegistration("Nuevo", "nuevo@test.com", "abc")).toBe(
      "La contraseña debe tener al menos 6 caracteres."
    );
  });
});
