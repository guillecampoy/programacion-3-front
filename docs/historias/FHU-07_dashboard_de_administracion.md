# FHU-07 - Dashboard de administración

## Resumen

**Épica:** Administración  
**Prioridad:** Alta  
**Story Points:** 6  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** administrador autenticado  
**Quiero** ver un resumen del estado del sistema al ingresar al panel  
**Para** tener una vista rápida de categorías, productos y pedidos

## Alcance funcional

- Dashboard en `src/pages/admin/adminHome/`.
- Protección por rol ADMIN.
- Fetch de los 4 JSON.
- Tarjetas de métricas.
- Sidebar admin.

## Criterios de aceptación

- Accesible solo para usuarios con rol `ADMIN`.
- Fetch a los 4 archivos JSON para calcular estadísticas client-side.
- 4 tarjetas: total categorías, total productos, total pedidos, productos disponibles.
- Panel de resumen: activos/inactivos por entidad, pedidos por estado.
- Sidebar de navegación hacia todos los módulos de administración.

## Guía de implementación sugerida

- Crear guard `requireAdmin()`.
- Reutilizar capa de fetch.
- Calcular totales filtrando `eliminado` cuando aplique.
- Agregar link “Ver tienda”.
- Evitar que `USUARIO` acceda por URL directa.

## Validación esperada

- Admin entra al dashboard.
- Usuario normal es redirigido o bloqueado.
- Métricas coinciden con JSON.
- Sidebar navega a categorías/productos/pedidos.
- No hay errores si algún array está vacío.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-07 - Dashboard de administración.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como administrador autenticado, quiero ver un resumen del estado del sistema al ingresar al panel, para tener una vista rápida de categorías, productos y pedidos.

Criterios de aceptación obligatorios:
1. Accesible solo para usuarios con rol `ADMIN`.
2. Fetch a los 4 archivos JSON para calcular estadísticas client-side.
3. 4 tarjetas: total categorías, total productos, total pedidos, productos disponibles.
4. Panel de resumen: activos/inactivos por entidad, pedidos por estado.
5. Sidebar de navegación hacia todos los módulos de administración.

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
