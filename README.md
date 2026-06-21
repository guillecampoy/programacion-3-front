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
- carrito local con checkout y creacion de pedidos;
- panel de administracion;
- persistencia client-side con `localStorage`.

No hay backend en esta entrega. La sesion, los usuarios, los productos, las categorias, los pedidos y el carrito viven en el navegador.
El README describe el estado validado del proyecto, no solo la consigna.

### Login validado

- El login consulta `public/data/usuarios.json`.
- La sesion se guarda en `localStorage.userData` sin password.
- La redireccion depende del rol del usuario autenticado.

### Registro validado

- El registro pide nombre, email y contraseña.
- Verifica que el email no exista en `public/data/usuarios.json`.
- El alta queda solo en la sesion local y no se persiste en `usuarios.json`.
- El alta realiza auto-login como `USUARIO`.

### Catalogo validado

- El catalogo carga categorias desde `public/data/categorias.json`.
- El catalogo carga productos desde `public/data/productos.json`.
- Solo se muestran productos disponibles y no eliminados.
- El filtro por categoria, la busqueda por nombre y el ordenamiento se resuelven en el cliente.
- Cada tarjeta muestra imagen, nombre, precio y badge de disponibilidad.

### Detalle validado

- El detalle de producto vive en `src/pages/store/productDetail/`.
- Se carga por `id` desde la query string.
- Muestra imagen, nombre, descripcion, precio, stock y estado.
- La cantidad respeta el stock restante y no permite agregar sin disponibilidad.
- Al agregar, el producto queda en `localStorage.cart` con la cantidad elegida.

### Carrito, pedido e historial validado

- El carrito muestra subtotal, envio y total.
- El envio fijo actual es de `$2500`.
- El checkout pide telefono y forma de pago.
- El pedido se crea en `localStorage.orders` con estado `PENDIENTE`.
- Al confirmar, el carrito se vacia y la navegacion pasa a `Mis pedidos`.
- `Mis pedidos` carga `/data/pedidos.json` y lo combina con los pedidos locales del checkout.
- El historial filtra por el usuario en sesion, muestra tarjetas con estado coloreado y abre un modal con el detalle completo.
- Si no hay pedidos para el usuario, se muestra un estado vacio.

### Dashboard admin validado

- El panel admin muestra un dashboard inicial con 4 tarjetas: total de categorias, total de productos, total de pedidos y productos disponibles.
- El resumen de dashboard calcula categorias activas/inactivas, productos disponibles/no disponibles, usuarios administradores/clientes y pedidos por estado desde los JSON locales.
- El acceso al panel sigue restringido al rol `ADMIN`.
- La navegacion admin incluye acceso a dashboard, productos, categorias, pedidos y un enlace para volver a la tienda.

### CRUD de categorias admin validado

- Las categorias se cargan desde `/data/categorias.json` y se administran en memoria durante la sesion.
- El alta y la edicion se resuelven en un modal con nombre, descripcion e imagen obligatorios.
- La eliminacion pide confirmacion y oculta la fila de inmediato.
- El selector de productos reutiliza las categorias visibles de la sesion actual.

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

- `userData`: usuario autenticado.
- `products`: productos del catalogo.
- `orders`: pedidos de prueba o generados localmente.
- `cart`: items del carrito.

`users` quedo como almacenamiento legado de una version anterior y ya no participa en el login ni en el registro actual.
`categories` quedo como almacenamiento legado de una version anterior y ya no participa en el CRUD actual de categorias.

## Rutas principales

- Login: `/src/pages/auth/login/login.html`
- Registro: `/src/pages/auth/registro/registro.html`
- Admin: `/src/pages/admin/home/home.html`
- Catalogo: `/src/pages/store/home/home.html`
- Detalle de producto: `/src/pages/store/productDetail/productDetail.html`
- Carrito: `/src/pages/store/cart/cart.html`
- Mis pedidos: `/src/pages/client/orders/orders.html`

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
