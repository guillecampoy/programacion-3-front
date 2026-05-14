# Proyecto: Food Store con protección de rutas

Proyecto unificado en Vite que integra el prototipo de autenticación, autorización por roles y rutas protegidas con el catálogo estático de Food Store.

No usa backend: la sesión, usuarios y datos semilla se manejan en el navegador con `localStorage`.

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
- `products`: array serializado de productos del catálogo.
- `orders`: array serializado de pedidos de prueba para la vista admin.

## Rutas principales

- Entrada Vite: `/index.html`
- Login: `/src/pages/auth/login/login.html`
- Registro: `/src/pages/auth/registro/registro.html`
- Admin: `/src/pages/admin/home/home.html`
- Client / catálogo Food Store: `/src/pages/client/home/home.html`

## Organización integrada

- `src/assets/food-store/`: imágenes y favicon del catálogo.
- `src/pages/client/home/home.html`: vista protegida del cliente y catálogo.
- `src/pages/client/home/home.ts`: carga dinámica de categorías/productos y logout.
- `src/types/Product.ts`: modelo de artículos/productos, incluyendo `destacado`.
- `src/utils/products.ts`: datos iniciales y persistencia local del catálogo.
- `src/utils/orders.ts`: datos iniciales y persistencia local de pedidos.
- `src/style.css`: estilos unificados para las vistas.
- `src/utils/`: autenticación, navegación, hash, validación y persistencia.
- `src/types/`: contratos de usuario y roles.

## Limitaciones conocidas

- Las contraseñas se guardan con hash `SHA-256` en `localStorage`, pero sigue siendo un enfoque solo de frontend.
- La validación de credenciales es de cliente: email con formato básico y contraseña de 8 a 64 caracteres con letras y números.
- La autorización se basa en rutas del frontend y puede manipularse desde el navegador.
- Este enfoque sirve solo para practicar flujo, tipado, navegación y separación de responsabilidades.
