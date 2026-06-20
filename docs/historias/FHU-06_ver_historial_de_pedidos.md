# FHU-06 - Ver historial de pedidos

## Resumen

**Épica:** Compra  
**Prioridad:** Alta  
**Story Points:** 6  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** cliente autenticado  
**Quiero** ver todos mis pedidos con su estado y detalle  
**Para** hacer seguimiento de mis compras

## Alcance funcional

- Mis pedidos en `src/pages/client/orders/`.
- Filtro por usuario en sesión.
- Cards de pedido.
- Modal de detalle.
- Badges de estado.

## Criterios de aceptación

- Fetch a `/data/pedidos.json`, filtrar por `idUsuario` del usuario en sesión.
- Lista de tarjetas con número de pedido, fecha, estado y total.
- Click en pedido abre modal con detalle completo.
- Badge de color según el estado del pedido.
- Estado vacío con mensaje si no hay pedidos.

## Guía de implementación sugerida

- Combinar pedidos JSON con pedidos locales creados en checkout, si existen.
- Resolver nombres de productos desde `productos.json` para el detalle.
- Mostrar primeros 3 productos en resumen.
- Badges sugeridos: PENDIENTE amarillo/naranja, CONFIRMADO azul, TERMINADO verde, CANCELADO rojo.
- No mostrar pedidos de otros usuarios.

## Validación esperada

- Usuario ve solo sus pedidos.
- Pedido recién creado aparece en historial.
- Modal muestra productos, cantidades, subtotales y desglose de costos.
- Usuario sin pedidos ve estado vacío.
- Badges cambian visualmente según estado.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-06 - Ver historial de pedidos.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como cliente autenticado, quiero ver todos mis pedidos con su estado y detalle, para hacer seguimiento de mis compras.

Criterios de aceptación obligatorios:
1. Fetch a `/data/pedidos.json`, filtrar por `idUsuario` del usuario en sesión.
2. Lista de tarjetas con número de pedido, fecha, estado y total.
3. Click en pedido abre modal con detalle completo.
4. Badge de color según el estado del pedido.
5. Estado vacío con mensaje si no hay pedidos.

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
