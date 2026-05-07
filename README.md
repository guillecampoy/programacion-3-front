# Proyecto: Protección de rutas

Prototipo educativo de autenticación, autorización por roles y rutas protegidas con Vite, TypeScript y `localStorage`.

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```

## Usuarios semilla

Al iniciar la aplicación, si no existe `localStorage.users`, se crean estos usuarios:

Admin:

- Email: `admin@test.com`
- Password: `admin123`

Client:

- Email: `client@test.com`
- Password: `client123`

## Persistencia

El prototipo usa estas claves de `localStorage`:

- `users`: array serializado de usuarios registrados.
- `userData`: objeto serializado del usuario autenticado.

## Rutas principales

- Login: `/src/pages/auth/login/login.html`
- Registro: `/src/pages/auth/registro/registro.html`
- Admin: `/src/pages/admin/home/home.html`
- Client: `/src/pages/client/home/home.html`

La protección centralizada se ejecuta desde `src/main.ts`.

## Limitaciones conocidas

- Las contraseñas se guardan con hash `SHA-256` en `localStorage`, pero sigue siendo un enfoque solo de frontend.
- La validación de credenciales es de cliente: email con formato básico y contraseña de 8 a 64 caracteres con letras y números.
- La autorización se basa en rutas del frontend y puede manipularse desde el navegador.
- Este enfoque sirve solo para practicar flujo, tipado, navegación y separación de responsabilidades.
