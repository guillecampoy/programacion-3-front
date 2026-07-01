# FHU-10 - Gestión de pedidos admin

## Resumen

**Épica:** Administración  
**Prioridad:** Alta  
**Story Points:** 10  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** administrador autenticado  
**Quiero** ver todos los pedidos y actualizar su estado  
**Para** gestionar el flujo de las órdenes de los clientes

## Alcance funcional

- Gestión en `src/pages/admin/orders/`.
- Fetch pedidos y usuarios.
- Filtro por estado.
- Modal de detalle.
- Cambio de estado en memoria.
- Orden descendente por fecha.

## Criterios de aceptación

- Fetch a `/data/pedidos.json` y `/data/usuarios.json`.
- Lista todos los pedidos con nombre del cliente, fecha, estado y total.
- Filtro por estado funciona client-side.
- Modal de detalle muestra toda la información del pedido.
- Select para cambiar estado del pedido; se actualiza en memoria.
- Los pedidos se ordenan por fecha, más recientes primero.

## Guía de implementación sugerida

- Combinar pedidos JSON con pedidos locales si el checkout los guarda.
- Resolver usuario por `idUsuario`.
- Resolver productos de detalle si se necesita mostrar nombre.
- Actualizar estado sin persistir JSON.
- Mantener filtro aplicado luego de cambiar estado.

## Validación esperada

- Admin ve pedidos de todos los usuarios.
- Filtro por cada estado funciona.
- Modal muestra detalle completo.
- Cambiar estado actualiza card y badge.
- Orden por fecha descendente es correcto.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-10 - Gestión de pedidos admin.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como administrador autenticado, quiero ver todos los pedidos y actualizar su estado, para gestionar el flujo de las órdenes de los clientes.

Criterios de aceptación obligatorios:
1. Fetch a `/data/pedidos.json` y `/data/usuarios.json`.
2. Lista todos los pedidos con nombre del cliente, fecha, estado y total.
3. Filtro por estado funciona client-side.
4. Modal de detalle muestra toda la información del pedido.
5. Select para cambiar estado del pedido; se actualiza en memoria.
6. Los pedidos se ordenan por fecha, más recientes primero.

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
