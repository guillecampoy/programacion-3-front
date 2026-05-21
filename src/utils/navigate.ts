export const ROUTES = {
  login: "/src/pages/auth/login/login.html",
  registro: "/src/pages/auth/registro/registro.html",
  adminHome: "/src/pages/admin/home/home.html",
  storeHome: "/src/pages/store/home/home.html",
  storeCart: "/src/pages/store/cart/cart.html",
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];

export const navigate = (route: Route): void => {
  window.location.href = route;
};
