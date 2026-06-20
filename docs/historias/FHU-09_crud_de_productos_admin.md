# FHU-09 - CRUD de productos admin

## Resumen

**Épica:** Administración  
**Prioridad:** Alta  
**Story Points:** 10  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** administrador autenticado  
**Quiero** crear, editar y eliminar productos desde la interfaz  
**Para** mantener el catálogo actualizado

## Alcance funcional

- Gestión en `src/pages/admin/products/`.
- Fetch productos y categorías.
- Tabla con nombre de categoría.
- Modal completo de producto.
- Validaciones precio/stock/categoría.
- Estado en memoria.

## Criterios de aceptación

- Fetch a `/data/productos.json` y `/data/categorias.json`.
- Tabla con todos los campos del producto incluyendo nombre de categoría.
- Modal con todos los campos: nombre, descripción, precio, stock, categoría, imagen, disponible.
- Validaciones: precio > 0, stock >= 0, categoría existente.
- Las operaciones se aplican sobre el estado en memoria.

## Guía de implementación sugerida

- Resolver `categoriaId` a nombre para mostrar.
- No permitir categoría inexistente.
- Validar números con conversión explícita.
- Mantener `disponible` como boolean.
- Eliminar en memoria de forma consistente con la tabla.

## Validación esperada

- Crear producto válido aparece en tabla con categoría.
- Precio 0/negativo falla.
- Stock negativo falla.
- Editar conserva coherencia de categoría.
- Eliminar producto lo quita/oculta del listado actual.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-09 - CRUD de productos admin.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como administrador autenticado, quiero crear, editar y eliminar productos desde la interfaz, para mantener el catálogo actualizado.

Criterios de aceptación obligatorios:
1. Fetch a `/data/productos.json` y `/data/categorias.json`.
2. Tabla con todos los campos del producto incluyendo nombre de categoría.
3. Modal con todos los campos: nombre, descripción, precio, stock, categoría, imagen, disponible.
4. Validaciones: precio > 0, stock >= 0, categoría existente.
5. Las operaciones se aplican sobre el estado en memoria.

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
