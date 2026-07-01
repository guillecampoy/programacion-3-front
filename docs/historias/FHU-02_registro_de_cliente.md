# FHU-02 - Registro de cliente

## Resumen

**Épica:** Autenticación  
**Prioridad:** Alta  
**Story Points:** 8  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** visitante del sistema  
**Quiero** registrarme con nombre, email y contraseña  
**Para** poder realizar compras en el sistema

## Alcance funcional

- Página de registro en `src/pages/auth/register/`.
- Validaciones de email y contraseña.
- Verificación de mail existente contra `usuarios.json`.
- Alta solo en memoria/sesión local.
- Auto-login tras registro.

## Criterios de aceptación

- Formulario con nombre, email y contraseña.
- Validación: email con formato válido, contraseña mínimo 6 caracteres.
- Verifica que el email no esté ya en `usuarios.json`.
- Solo se registran clientes con rol `USUARIO`.
- Auto-login después del registro exitoso.

## Guía de implementación sugerida

- Crear validador simple de email.
- Validar contraseña solo en registro.
- Consultar usuarios existentes antes de registrar.
- Generar id local temporal sin persistir en JSON.
- Guardar sesión sin password y redirigir a tienda.

## Validación esperada

- Registro con email inválido falla.
- Registro con password menor a 6 falla.
- Registro con email ya existente falla.
- Registro correcto inicia sesión como `USUARIO`.
- Tras logout, el usuario local no debe asumirse como persistido en JSON.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-02 - Registro de cliente.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como visitante del sistema, quiero registrarme con nombre, email y contraseña, para poder realizar compras en el sistema.

Criterios de aceptación obligatorios:
1. Formulario con nombre, email y contraseña.
2. Validación: email con formato válido, contraseña mínimo 6 caracteres.
3. Verifica que el email no esté ya en `usuarios.json`.
4. Solo se registran clientes con rol `USUARIO`.
5. Auto-login después del registro exitoso.

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
