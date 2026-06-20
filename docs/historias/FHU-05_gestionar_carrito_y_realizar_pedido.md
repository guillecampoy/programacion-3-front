# FHU-05 - Gestionar carrito y realizar pedido

## Resumen

**Épica:** Compra  
**Prioridad:** Alta  
**Story Points:** 12  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** cliente autenticado  
**Quiero** revisar mi carrito, modificar cantidades y confirmar la compra  
**Para** completar mi pedido con los productos seleccionados

## Alcance funcional

- Carrito en `src/pages/store/cart/`.
- Persistencia en `localStorage`.
- Controles de cantidad y eliminación.
- Checkout con teléfono y forma de pago.
- Generación de pedido local.
- Limpieza de carrito.

## Criterios de aceptación

- El carrito se carga desde `localStorage` al acceder a la página.
- Se pueden modificar cantidades respetando stock y eliminar productos.
- Se calcula subtotal por producto y total del carrito.
- El formulario de checkout solicita teléfono y forma de pago.
- Al confirmar, se genera el objeto pedido y se guarda en `localStorage`.
- El carrito se limpia después de confirmar el pedido.
- Estado vacío con mensaje y botón de vuelta a la tienda.

## Guía de implementación sugerida

- Definir constante `ENVIO` y documentarla en README.
- Total = subtotal + ENVIO.
- Formas de pago: `TARJETA`, `TRANSFERENCIA`, `EFECTIVO`.
- Generar pedido con `id`, `fecha`, `estado=PENDIENTE`, `total`, `formaPago`, `idUsuario`, `detalles`.
- Persistir pedidos locales en una key clara de localStorage, combinando con pedidos JSON al visualizar.

## Validación esperada

- Carrito vacío muestra mensaje.
- Modificar + y - recalcula subtotales y total.
- No superar stock al subir cantidad.
- Checkout sin teléfono/forma de pago falla.
- Confirmar pedido guarda objeto, limpia carrito y redirige a Mis Pedidos.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-05 - Gestionar carrito y realizar pedido.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como cliente autenticado, quiero revisar mi carrito, modificar cantidades y confirmar la compra, para completar mi pedido con los productos seleccionados.

Criterios de aceptación obligatorios:
1. El carrito se carga desde `localStorage` al acceder a la página.
2. Se pueden modificar cantidades respetando stock y eliminar productos.
3. Se calcula subtotal por producto y total del carrito.
4. El formulario de checkout solicita teléfono y forma de pago.
5. Al confirmar, se genera el objeto pedido y se guarda en `localStorage`.
6. El carrito se limpia después de confirmar el pedido.
7. Estado vacío con mensaje y botón de vuelta a la tienda.

Restricciones:
- Mantener el alcance acotado a esta historia.
- No cambiar estructura general salvo que sea imprescindible y justificado.
- No introducir frameworks no pedidos.
- Devolver resumen del diff, archivos tocados, validaciones ejecutadas y riesgos pendientes.
- No hacer commit automáticamente; dejar el cambio listo para revisión humana.
```

## Checklist de revisión humana

- [ ] Leí el diff completo.
- [ ] Ejecuté la aplicación o build correspondiente.
- [ ] Probé el caso feliz.
- [ ] Probé al menos un caso de error/validación.
- [ ] Confirmé que no se rompió una historia anterior.
- [ ] Dejé nota de deuda técnica si aplica.
