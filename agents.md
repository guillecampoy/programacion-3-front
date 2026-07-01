# Agents

## Fuente de verdad

- Tomar `docs/TPI.pdf` como contexto funcional del proyecto, con foco principal en las paginas 1 a 19.
- Tomar `docs/historias/` como backlog vivo de historias de usuario para iterar una por una.
- No inventar alcance fuera de lo que indiquen esos documentos.

## Alcance del frontend

- El frontend de Food Store se construye con TypeScript, Vite, HTML y CSS.
- La primera iteracion consume datos locales desde `public/data/` mediante `fetch()`.
- Los archivos de datos del TPI son `categorias.json`, `productos.json`, `usuarios.json` y `pedidos.json`.
- La autenticacion es educativa y usa `localStorage`.
- Las escrituras del frontend quedan en memoria o almacenamiento local segun la historia.
- No agregar backend ni cambiar el contrato de datos salvo que la historia actual lo exija.

## Regla de trabajo

- Mantener el diff acotado a la historia activa.
- Si una historia requiere validar algo, agregar el test o check minimo que rompa si la logica falla.
- No tocar documentos de alcance general salvo que el pedido lo diga.
- No reescribir la app completa ni agregar abstracciones innecesarias.

## README

- `README.md` es el documento de estado vivo de la entrega.
- Actualizarlo cuando cambie el estado validado del proyecto o al cerrar una historia que impacte al flujo visible.
- El README debe reflejar el estado real del proyecto, no solo el TPI.
