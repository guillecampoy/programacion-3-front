# FHU-03 - Ver catálogo de productos

## Resumen

**Épica:** Catálogo  
**Prioridad:** Alta  
**Story Points:** 10  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** cliente autenticado  
**Quiero** ver todos los productos disponibles con filtros y búsqueda  
**Para** encontrar rápidamente lo que quiero comprar

## Alcance funcional

- Home store en `src/pages/store/home/`.
- Sidebar de categorías.
- Grid de productos.
- Filtros client-side.
- Búsqueda y ordenamiento client-side.
- Badge de carrito.

## Criterios de aceptación

- Fetch a `/data/productos.json` carga el grid de productos.
- Fetch a `/data/categorias.json` carga el sidebar de categorías.
- El filtro por categoría actualiza el grid.
- La búsqueda por nombre funciona en tiempo real client-side.
- El ordenamiento por nombre y precio funciona client-side.
- Solo se muestran productos con `disponible = true` y `eliminado = false`.
- Cada tarjeta tiene imagen, nombre, precio y badge de disponibilidad.

## Guía de implementación sugerida

- Crear funciones `getProductos()` y `getCategorias()`.
- Normalizar comparación de búsqueda con lowercase/trim.
- Ordenar sin mutar innecesariamente el dataset base.
- En tarjetas, linkear a detalle por id.
- Actualizar badge de carrito leyendo `localStorage`.

## Validación esperada

- Usuario autenticado ve catálogo.
- Producto no disponible o eliminado no aparece.
- Filtro de categoría combina con búsqueda.
- Orden A-Z/Z-A/precio asc/desc funciona.
- Click de tarjeta navega al detalle correcto.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-03 - Ver catálogo de productos.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como cliente autenticado, quiero ver todos los productos disponibles con filtros y búsqueda, para encontrar rápidamente lo que quiero comprar.

Criterios de aceptación obligatorios:
1. Fetch a `/data/productos.json` carga el grid de productos.
2. Fetch a `/data/categorias.json` carga el sidebar de categorías.
3. El filtro por categoría actualiza el grid.
4. La búsqueda por nombre funciona en tiempo real client-side.
5. El ordenamiento por nombre y precio funciona client-side.
6. Solo se muestran productos con `disponible = true` y `eliminado = false`.
7. Cada tarjeta tiene imagen, nombre, precio y badge de disponibilidad.

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
