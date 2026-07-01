# Food Store Frontend

Frontend del TPI de Programacion 3, construido con Vite y TypeScript.

## Estado actual

- autenticacion y registro;
- catalogo de productos con busqueda, filtros y detalle;
- carrito local con checkout y creacion de pedidos;
- panel de administracion con dashboard, CRUD de categorias/productos y gestion de pedidos;
- persistencia client-side con `localStorage`.

No hay backend en esta entrega. La sesion, los usuarios, los productos, las categorias, los pedidos y el carrito viven en el navegador.
Este README describe el estado validado del proyecto y el cierre final del frontend respecto del TPI.

### Login

- El login consulta `public/data/usuarios.json`.
- La sesion se guarda en `localStorage.userData` sin password.
- La redireccion depende del rol del usuario autenticado.

### Registro

- El registro pide nombre, email y contraseña.
- Verifica que el email no exista en `public/data/usuarios.json`.
- El alta queda solo en la sesion local y no se persiste en `usuarios.json`.
- El alta realiza auto-login como `USUARIO`.

### Catalogo

- El catalogo carga categorias desde `public/data/categorias.json`.
- El catalogo carga productos desde `public/data/productos.json`.
- Solo se muestran productos con `disponible = true`; el stock se usa solo para impedir la compra cuando llega a cero.
- El filtro por categoria, la busqueda por nombre y el ordenamiento se resuelven en el cliente.
- Cada tarjeta muestra imagen, nombre, precio y badge de disponibilidad.
- Si la sesion es `ADMIN`, el catalogo queda en modo solo lectura: no muestra accesos al carrito ni botones de compra.

### Detalle

- El detalle de producto vive en `src/pages/store/productDetail/`.
- Se carga por `id` desde la query string.
- Muestra imagen, nombre, descripcion, precio, stock y estado.
- La cantidad respeta el stock restante y no permite agregar si no hay stock.
- Al agregar, el producto queda en `localStorage.cart` con la cantidad elegida.

### Carrito, pedido e historial

- El carrito muestra subtotal, envio y total.
- El envio fijo actual es de `$2500`.
- El checkout pide telefono y forma de pago.
- El pedido se crea en `localStorage.orders` con estado `PENDIENTE`.
- Al confirmar, el carrito se vacia y la navegacion pasa a `Mis pedidos`.
- `Mis pedidos` carga `/data/pedidos.json` y lo combina con los pedidos locales del checkout.
- El historial filtra por el usuario en sesion, muestra tarjetas con estado coloreado y abre un modal con el detalle completo.
- Si no hay pedidos para el usuario, se muestra un estado vacio.

### Dashboard admin

- El panel admin muestra un dashboard inicial con 4 tarjetas: total de categorias, total de productos, total de pedidos y productos disponibles.
- El resumen de dashboard calcula categorias activas/inactivas, productos disponibles/no disponibles, usuarios administradores/clientes y pedidos por estado desde los JSON locales.
- El acceso al panel sigue restringido al rol `ADMIN`.
- La navegacion admin incluye acceso a dashboard, productos, categorias, pedidos y un enlace para volver a la tienda como vista de catalogo sin compras.

### CRUD de categorias admin

- Las categorias se cargan desde `/data/categorias.json` y se administran en memoria durante la sesion.
- El alta y la edicion se resuelven en un modal con nombre, descripcion e imagen obligatorios.
- La eliminacion pide confirmacion y oculta la fila de inmediato.
- El selector de productos reutiliza las categorias visibles de la sesion actual.

### CRUD de productos admin

- Los productos se cargan desde `/data/productos.json` y las categorias visibles desde `/data/categorias.json`.
- La tabla de administracion muestra todos los campos del producto y resuelve el nombre de categoria.
- El alta y la edicion se resuelven en un modal con nombre, descripcion, precio, stock, categoria, imagen y disponible.
- Las validaciones rechazan precio menor o igual a 0, stock negativo y categorias inexistentes o eliminadas.
- Las operaciones de alta, edicion y borrado se aplican sobre el estado en memoria de la sesion.

### Gestion de pedidos admin

- Los pedidos se cargan desde `/data/pedidos.json` y se combinan con los pedidos locales generados en la sesion.
- La lista de pedidos se ordena por fecha descendente y muestra el nombre del cliente resuelto desde `/data/usuarios.json`.
- El filtro por estado funciona en el cliente y mantiene el orden actual.
- El detalle se abre en un modal con la informacion principal del pedido y los items incluidos.
- El cambio de estado se aplica sobre el estado en memoria de la sesion.

## Cierre

### Validación

1. `npm test`: 49 tests pasados.
2. `npx vitest run --coverage`: 82.46% statements, 83.01% lines, 92% functions.
3. `npm run build`: compilacion y empaquetado correctos.

### Cobertura funcional

1. Login y registro con `localStorage` y fetch local a `public/data/usuarios.json`.
2. Catalogo de cliente con filtros, busqueda, ordenamiento y detalle de producto.
3. Carrito local con checkout, envio fijo documentado y creacion de pedidos.
4. Historial de pedidos del cliente con modal de detalle.
5. Panel admin con dashboard, ABM de categorias, ABM de productos y gestion de pedidos.
6. Guards por rol, con `ADMIN` habilitado para ver tienda en modo solo lectura y `USUARIO` habilitado para compra.

### Extensiones incorporadas

1. El area admin tiene paginas de entrada separadas para categorias, productos y pedidos, pero sigue reutilizando la implementacion central para no duplicar logica.
2. La base de pedidos ya no depende de semilla hardcoded; parte de `public/data/pedidos.json` y la sesion solo agrega el overlay local del checkout y cambios de estado.
3. El dashboard agrega un resumen extra de usuarios admin/cliente. Es una lectura adicional, no un requisito del TPI.

## Como ejecutar

```bash
pnpm install
pnpm run dev
```

## Checks

```bash
pnpm test
pnpm build
```

`pnpm-workspace.yaml` queda versionado porque pnpm 11 guarda ahi la aprobacion de scripts nativos como `esbuild`; asi `pnpm install` funciona en un clon limpio sin pedir pasos manuales extra.

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

- `userData`: usuario autenticado.
- `products`: almacenamiento legado de una version anterior; el CRUD admin de productos ya trabaja en memoria durante la sesion.
- `orders`: pedidos de prueba o generados localmente.
- `cart`: items del carrito.

`users` quedo como almacenamiento legado de una version anterior y ya no participa en el login ni en el registro actual.
`categories` quedo como almacenamiento legado de una version anterior y ya no participa en el CRUD actual de categorias.
`orders` parte de `public/data/pedidos.json` como base simulada de backend; el checkout y la gestion admin suman cambios en `localStorage.orders` como overlay de sesion para no perder el estado entre pantallas.

## Rutas principales

- Login: `/src/pages/auth/login/login.html`
- Registro: `/src/pages/auth/registro/registro.html`
- Admin: `/src/pages/admin/home/home.html`
- Categorias admin: `/src/pages/admin/categories/categories.html`
- Productos admin: `/src/pages/admin/products/products.html`
- Pedidos admin: `/src/pages/admin/orders/orders.html`
- Catalogo: `/src/pages/store/home/home.html`
- Detalle de producto: `/src/pages/store/productDetail/productDetail.html`
- Carrito: `/src/pages/store/cart/cart.html`
- Mis pedidos: `/src/pages/client/orders/orders.html`

## Estructura relevante

- `src/pages/auth/`: login y registro.
- `src/pages/store/home/`: catalogo del cliente.
- `src/pages/store/cart/`: carrito y cierre local.
- `src/pages/admin/home/`: panel de administracion.
- `src/pages/admin/categories/`: entrada al ABM de categorias.
- `src/pages/admin/products/`: entrada al ABM de productos.
- `src/pages/admin/orders/`: entrada a gestion de pedidos.
- `src/utils/`: auth, navegacion, validaciones y persistencia.
- `src/data/data.ts`: semilla inicial de categorias y productos.
- `src/types/`: contratos de dominio del front.
- `src/assets/food-store/`: imagenes y favicon del proyecto.

## Notas funcionales

- El acceso por rol se resuelve en el front.
- La validacion de credenciales y formularios es client-side.
- La persistencia es local, por lo que recargar el navegador no usa un backend real.
