# Food Store Frontend

Frontend del TPI de Programacion 3, construido con Vite y TypeScript.

La fuente funcional de este proyecto es `docs/TPI.pdf` hasta la pagina 19.  
Las historias de usuario a iterar estan en `docs/historias/` y este README se va a actualizar a medida que avance cada implementacion.

## Fuentes de verdad

- `docs/TPI.pdf`: alcance funcional general del front.
- `docs/historias/`: historias a implementar una por una.
- `public/data/`: contrato de datos local que define el TPI para la primera iteracion del frontend.

## Estado actual

La base ya integra estos modulos del front:

- autenticacion y registro;
- catalogo de productos con busqueda, filtros y detalle;
- carrito local;
- panel de administracion;
- persistencia client-side con `localStorage`.

No hay backend en esta entrega. La sesion, los usuarios, los productos, las categorias, los pedidos y el carrito viven en el navegador.
El README describe el estado validado del proyecto, no solo la consigna.

### Login validado

- El login consulta `public/data/usuarios.json`.
- La sesion se guarda en `localStorage.userData` sin password.
- La redireccion depende del rol del usuario autenticado.

## Como ejecutar

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
```

## Usuarios semilla

Los usuarios de referencia para el login viven en `public/data/usuarios.json`:

- Admin
  - Email: `admin@test.com`
  - Password: `Admin1234`
- Cliente
  - Email: `client@test.com`
  - Password: `Client1234`

## Persistencia local

Claves usadas en `localStorage`:

- `users`: usuarios registrados.
- `userData`: usuario autenticado.
- `categories`: categorias del catalogo.
- `products`: productos del catalogo.
- `orders`: pedidos de prueba o generados localmente.
- `cart`: items del carrito.

## Rutas principales

- Login: `/src/pages/auth/login/login.html`
- Registro: `/src/pages/auth/registro/registro.html`
- Admin: `/src/pages/admin/home/home.html`
- Catalogo: `/src/pages/store/home/home.html`
- Carrito: `/src/pages/store/cart/cart.html`

## Estructura relevante

- `src/pages/auth/`: login y registro.
- `src/pages/store/home/`: catalogo del cliente.
- `src/pages/store/cart/`: carrito y cierre local.
- `src/pages/admin/home/`: panel de administracion.
- `src/utils/`: auth, navegacion, validaciones y persistencia.
- `src/data/data.ts`: semilla inicial de categorias y productos.
- `src/types/`: contratos de dominio del front.
- `src/assets/food-store/`: imagenes y favicon del proyecto.

## Notas funcionales

- El acceso por rol se resuelve en el front.
- La validacion de credenciales y formularios es client-side.
- La persistencia es local, por lo que recargar el navegador no usa un backend real.
- Las historias futuras se van a cerrar de a una sobre esta base.
