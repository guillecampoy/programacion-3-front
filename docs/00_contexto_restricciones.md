# Frontend - Contexto, restricciones y reglas de implementación

## Objetivo

Completar la Parte 1 del TPI Food Store: aplicación web con TypeScript, Vite, HTML5, CSS3 y Tailwind CSS opcional. En esta iteración el frontend **no consume backend real**: toda lectura se hace con `fetch()` a archivos JSON locales.

## Estructura esperada

```text
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── data/
│       ├── categorias.json
│       ├── productos.json
│       ├── usuarios.json
│       └── pedidos.json
└── src/
    ├── main.ts
    ├── style.css
    ├── types/
    ├── utils/
    │   ├── api.ts        # sugerido: capa de fetch reemplazable
    │   ├── auth.ts       # sugerido: sesión y roles
    │   ├── cart.ts       # sugerido: carrito en localStorage
    │   └── format.ts     # sugerido: moneda, fechas, ids
    └── pages/
        ├── auth/
        │   ├── login/
        │   └── register/
        ├── store/
        │   ├── home/
        │   ├── productDetail/
        │   └── cart/
        ├── client/
        │   └── orders/
        └── admin/
            ├── adminHome/
            ├── categories/
            ├── products/
            └── orders/
```

## Archivos JSON obligatorios

- `public/data/categorias.json`: array de `Categoria` con `id`, `nombre`, `descripcion`, `imagen`, `eliminado`.
- `public/data/productos.json`: array de `Producto` con `id`, `nombre`, `precio`, `descripcion`, `stock`, `imagen`, `disponible`, `eliminado`, `categoriaId`.
- `public/data/usuarios.json`: array de `Usuario` con `id`, `nombre`, `apellido`, `mail`, `celular`, `password`, `rol`.
- `public/data/pedidos.json`: array de `Pedido` con `id`, `fecha`, `estado`, `total`, `formaPago`, `idUsuario`, `detalles[]` con `idProducto`, `cantidad`, `subtotal`.

## Restricciones fuertes

- No implementar JWT, cookies de sesión, OAuth ni seguridad real.
- Login contra `usuarios.json`; las contraseñas están en texto plano solo para fines educativos.
- Guardar en `localStorage` el usuario autenticado **sin password**.
- Validar roles en frontend; aceptar que `localStorage` es manipulable.
- Las escrituras de alta/edición/baja en administración se aplican sobre estado en memoria. No modificar físicamente los JSON desde el navegador.
- Al recargar la página se puede perder estado modificado en memoria; esto es intencional.
- El registro de cliente agrega el usuario al estado local de la sesión. No persiste en `usuarios.json`; si hace logout, no podrá reloguearse con ese usuario hasta integrar backend.
- Cada `fetch()` debe apuntar a `/data/*.json` mediante una capa centralizada para que luego se reemplace por API REST.
- Los JSON usan IDs planos; el backend usa objetos relacionados. No mezclar los modelos: mapear del lado frontend cuando haga falta.
- El costo de envío debe ser una constante del frontend (`ENVIO`) y debe quedar documentada en el README. El total de pedido es `subtotal + envio`.
- Formas de pago del checkout: `TARJETA`, `TRANSFERENCIA`, `EFECTIVO`.
- Estados de pedido: `PENDIENTE`, `CONFIRMADO`, `TERMINADO`, `CANCELADO`.
- Productos visibles en catálogo cliente: `disponible === true` y `eliminado === false`.

## Roles y permisos

| Acción | ADMIN | USUARIO |
|---|---:|---:|
| Panel de administración | Sí | No |
| Ver categorías | Sí | Sí |
| Ver productos | Sí | Sí |
| Ver todos los pedidos | Sí | No |
| Ver catálogo | Sí | Sí |
| Carrito y compras | No aplica | Sí |
| Ver mis pedidos | No aplica | Sí |

## Datos mínimos de prueba

- Al menos 2 categorías.
- Al menos 5 productos.
- Al menos 2 usuarios: uno `ADMIN` y uno `USUARIO`.
- Al menos 2 pedidos coherentes con usuarios y productos.

## Validación general

```bash
npm install
npm run dev
npm run build
```

Además, validar manualmente el video-flow: login usuario -> compra completa -> mis pedidos -> logout -> login admin -> dashboard -> categorías -> productos -> pedidos -> cambio de estado.
