export const ROUTES = {
  login: "/src/pages/auth/login/login.html",
  registro: "/src/pages/auth/registro/registro.html",
  adminHome: "/src/pages/admin/home/home.html",
  clientHome: "/src/pages/client/home/home.html",
} as const;

export const navigate = (route: string): void => {
  window.location.href = route;
};
