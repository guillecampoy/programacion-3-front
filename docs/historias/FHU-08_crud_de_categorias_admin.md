# FHU-08 - CRUD de categorías admin

## Resumen

**Épica:** Administración  
**Prioridad:** Alta  
**Story Points:** 10  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** administrador autenticado  
**Quiero** crear, editar y eliminar categorías desde la interfaz  
**Para** mantener organizado el catálogo de productos

## Alcance funcional

- Gestión en `src/pages/admin/categories/`.
- Tabla de categorías.
- Modal crear/editar.
- Eliminación con confirmación.
- Estado en memoria.

## Criterios de aceptación

- Fetch a `/data/categorias.json` para listar las categorías en tabla.
- Modal de creación con campos nombre, descripción e imagen, todos requeridos.
- Modal de edición carga los valores actuales del registro seleccionado.
- Confirmación antes de eliminar.
- Las operaciones se aplican sobre el estado en memoria.
- La tabla se actualiza inmediatamente después de cada operación.

## Guía de implementación sugerida

- Mantener array local de categorías en estado.
- Crear ids locales incrementales.
- Eliminar como baja visual/en memoria; no escribir JSON.
- Validar campos requeridos.
- Cerrar modal y limpiar formulario al guardar/cancelar.

## Validación esperada

- Crear categoría agrega fila.
- Editar categoría actualiza fila.
- Eliminar requiere confirmación y quita/oculta fila.
- Campos requeridos bloquean submit.
- Recargar página vuelve al JSON original.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-08 - CRUD de categorías admin.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como administrador autenticado, quiero crear, editar y eliminar categorías desde la interfaz, para mantener organizado el catálogo de productos.

Criterios de aceptación obligatorios:
1. Fetch a `/data/categorias.json` para listar las categorías en tabla.
2. Modal de creación con campos nombre, descripción e imagen, todos requeridos.
3. Modal de edición carga los valores actuales del registro seleccionado.
4. Confirmación antes de eliminar.
5. Las operaciones se aplican sobre el estado en memoria.
6. La tabla se actualiza inmediatamente después de cada operación.

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
