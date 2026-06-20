# FHU-01 - Login de usuario

## Resumen

**Épica:** Autenticación  
**Prioridad:** Alta  
**Story Points:** 8  
**Proyecto:** frontend Vite/TypeScript

## Historia de usuario

**Como** usuario del sistema  
**Quiero** iniciar sesión con mi email y contraseña  
**Para** acceder al sistema según mi rol

## Alcance funcional

- Página de login en `src/pages/auth/login/`.
- Validación de campos requeridos.
- Consulta a `/data/usuarios.json`.
- Persistencia de sesión en `localStorage` sin password.
- Redirección por rol.

## Criterios de aceptación

- Formulario con campos de email y contraseña visibles.
- Validación de campos requeridos antes de procesar.
- Fetch a `/data/usuarios.json` para verificar credenciales.
- Si las credenciales son incorrectas, se muestra un mensaje de error.
- Si son correctas, se guardan los datos del usuario en `localStorage`.
- Se redirige al catálogo si es `USUARIO`, al panel admin si es `ADMIN`.

## Guía de implementación sugerida

- Crear/ajustar tipos `Usuario` y `Rol`.
- Centralizar lectura de usuarios en `utils/api.ts` o equivalente.
- Crear helper `login(email, password)` en `utils/auth.ts` que elimine `password` antes de guardar sesión.
- Agregar guardas de redirección si ya existe sesión.
- Evitar mostrar password en UI o logs.

## Validación esperada

- Intentar login vacío: debe mostrar validación.
- Intentar mail inexistente o password incorrecta: debe mostrar error.
- Login `USUARIO`: debe navegar a tienda.
- Login `ADMIN`: debe navegar a admin.
- Inspeccionar localStorage: no debe quedar `password`.

## Definition of Done

- La historia compila y ejecuta localmente.
- Se cumplen todos los criterios de aceptación.
- No se introducen cambios fuera del alcance sin justificación explícita.
- Los nombres de rutas, paquetes y archivos respetan la estructura del proyecto existente.
- Queda registro en README o comentario técnico cuando la consigna lo pide.
- La revisión humana inspeccionó el diff y ejecutó la validación mínima.

## Prompt sugerido para la sesión agentica

```text
Actuá como par de desarrollo. Revisá el proyecto actual y aplicá únicamente la historia FHU-01 - Login de usuario.

Contexto: proyecto frontend Vite/TypeScript. Ya existe una base funcional que debe extenderse, no reescribirse.

Objetivo:
Como usuario del sistema, quiero iniciar sesión con mi email y contraseña, para acceder al sistema según mi rol.

Criterios de aceptación obligatorios:
1. Formulario con campos de email y contraseña visibles.
2. Validación de campos requeridos antes de procesar.
3. Fetch a `/data/usuarios.json` para verificar credenciales.
4. Si las credenciales son incorrectas, se muestra un mensaje de error.
5. Si son correctas, se guardan los datos del usuario en `localStorage`.
6. Se redirige al catálogo si es `USUARIO`, al panel admin si es `ADMIN`.

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
