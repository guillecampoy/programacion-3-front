# FHU-04 - Ver detalle de producto y agregar al carrito

## Resumen

**Épica:** Catálogo  
**Prioridad:** Alta  
**Story Points:** 8  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** cliente autenticado  
**Quiero** ver la información completa de un producto y agregarlo al carrito  
**Para** tomar una decisión de compra informada

## Alcance funcional

- Detalle en `src/pages/store/productDetail/`.
- Carga por id.
- Selector de cantidad.
- Validación de stock/disponibilidad.
- Alta de ítem en carrito local.

## Criterios de aceptación

- Fetch a `/data/productos.json`, filtrar por ID.
- Se muestran imagen, nombre, descripción, precio, stock y estado.
- Selector de cantidad respeta el stock disponible.
- No permite agregar si `disponible = false` o `stock = 0`.
- Al agregar, el ítem se guarda en `localStorage` con cantidad y precio.
- Se muestra mensaje de confirmación.

## Guía de implementación sugerida

- Resolver id desde ruta/query según estructura existente.
- Manejar id inválido con mensaje y botón volver.
- Usar `utils/cart.ts` para agregar/acumular cantidad.
- Si el producto ya existe en carrito, respetar stock máximo total.
- Actualizar badge del carrito luego de agregar.

## Validación esperada

- Detalle con id válido muestra datos completos.
- Id inexistente muestra estado de error.
- Cantidad no puede ser menor a 1 ni mayor a stock.
- Agregar producto suma o crea ítem en carrito.
- Producto sin stock/deshabilitado no se puede agregar.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-04 - Ver detalle de producto y agregar al carrito.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como cliente autenticado, quiero ver la información completa de un producto y agregarlo al carrito, para tomar una decisión de compra informada.

Criterios de aceptación obligatorios:
1. Fetch a `/data/productos.json`, filtrar por ID.
2. Se muestran imagen, nombre, descripción, precio, stock y estado.
3. Selector de cantidad respeta el stock disponible.
4. No permite agregar si `disponible = false` o `stock = 0`.
5. Al agregar, el ítem se guarda en `localStorage` con cantidad y precio.
6. Se muestra mensaje de confirmación.

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
