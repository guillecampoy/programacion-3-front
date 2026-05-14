# Guion para video demostrativo del prototipo Food Store

Duracion estimada: 11 a 12 minutos.

## 0:00 - 0:45 | Apertura

**Accion en pantalla:** mostrar una placa simple con el nombre del proyecto.

**Texto sugerido para apertura:**

Food Store es un prototipo frontend desarrollado con Vite y TypeScript. El objetivo es demostrar un flujo de catalogo, autenticacion de cliente, carga dinamica de productos y carrito persistido en `localStorage`.

En este video se van a recorrer cinco historias de usuario: busqueda de productos, filtrado por categoria, agregado al carrito, visualizacion del carrito y calculo del total.

## 0:45 - 1:30 | Contexto del prototipo

**Accion en pantalla:** abrir el proyecto ejecutandose en el navegador desde la ruta inicial.

**Narracion:**

El prototipo no utiliza backend. Los datos principales se almacenan en el navegador mediante `localStorage`. Al iniciar la aplicacion, se crean usuarios semilla si no existen datos previos.

Para esta demostracion voy a ingresar como cliente con las credenciales:

- Email: `client@test.com`
- Password: `client123`

Este usuario tiene acceso al catalogo y al carrito. El rol administrador queda reservado para el ABM de productos, categorias y consulta de pedidos.

**Accion en pantalla:** iniciar sesion como cliente.

## 1:30 - 3:00 | HU-P1-01: Buscar productos en el catalogo

**Historia de usuario:**

Como cliente de Food Store, quiero poder buscar productos por nombre dentro del catalogo, para encontrar mas rapido el producto que deseo visualizar.

**Accion en pantalla:**

1. Mostrar la pantalla principal del catalogo.
2. Identificar visualmente el campo de busqueda.
3. Escribir un texto parcial, por ejemplo `mila`.
4. Mostrar que se listan solo los productos cuyo nombre coincide total o parcialmente.
5. Cambiar la busqueda por un texto sin coincidencias, por ejemplo `pizza`.
6. Mostrar el mensaje visual indicando que no hay resultados.

**Narracion:**

En la pantalla principal del catalogo se encuentra un campo de busqueda visible. La busqueda trabaja sobre los productos cargados dinamicamente desde la capa de datos del prototipo.

Al escribir una palabra o una parte del nombre, la lista se actualiza y se renderizan solamente los productos que coinciden. Por ejemplo, al buscar milanesa, el catalogo muestra las opciones relacionadas con esa palabra.

Si el usuario escribe un texto que no coincide con ningun producto, la interfaz informa visualmente que no se encontraron productos. Esto evita dejar la pantalla vacia sin explicacion y cumple con el criterio de aceptacion de feedback al usuario.

**Punto tecnico a mencionar:**

La logica de filtrado se aplica en la vista del catalogo antes de renderizar las tarjetas, por eso funciona sobre los productos que ya estan cargados en memoria.

## 3:00 - 4:30 | HU-P1-02: Filtrar productos por categoria

**Historia de usuario:**

Como cliente de Food Store, quiero poder filtrar los productos por categoria, para visualizar unicamente aquellos que pertenecen al tipo de comida que me interesa.

**Accion en pantalla:**

1. Limpiar la busqueda o volver al catalogo completo.
2. Mostrar el menu lateral de categorias.
3. Seleccionar la categoria `Milanesas`.
4. Verificar que solo se muestran productos de esa categoria.
5. Seleccionar otra categoria, por ejemplo `Minutas` o `Papas Fritas`.
6. Presionar la opcion para volver a ver todos los productos.

**Narracion:**

El catalogo tambien permite filtrar por categoria. Las categorias se muestran en una seccion lateral y se generan dinamicamente a partir de los datos disponibles.

Cuando se selecciona una categoria, el listado se vuelve a renderizar mostrando solo los productos que pertenecen a ese grupo. En este caso, al seleccionar Milanesas, aparecen las opciones de milanesa cargadas en el prototipo.

El usuario tambien puede volver al catalogo completo. Esto es importante porque el filtro no debe encerrar al usuario en una categoria: siempre debe existir una forma clara de recuperar la vista general.

**Punto tecnico a mencionar:**

El filtrado por categoria se combina con la misma funcion de renderizado que utiliza la busqueda. Esto permite que ambos criterios puedan convivir sin duplicar la logica de pintado de productos.

## 4:30 - 6:30 | HU-P1-03: Agregar productos al carrito

**Historia de usuario:**

Como cliente autenticado, quiero poder agregar productos al carrito desde el catalogo, para ir armando mi compra.

**Accion en pantalla:**

1. Mostrar una tarjeta de producto.
2. Señalar el boton `Agregar al carrito`.
3. Agregar una `Milanesa Napolitana`.
4. Mostrar el indicador visual de confirmacion.
5. Observar que el contador del carrito aumenta.
6. Agregar nuevamente el mismo producto.
7. Mostrar que la cantidad aumenta en lugar de duplicar el item como producto separado.
8. Agregar otro producto distinto, por ejemplo `Papas baston`.

**Narracion:**

Cada tarjeta del catalogo tiene una accion visible para agregar el producto al carrito. Al presionar el boton, el producto se guarda en `localStorage`.

Si el producto todavia no estaba en el carrito, se crea un nuevo item con cantidad uno. Si el producto ya existia, el sistema actualiza la cantidad del item existente. Esto evita duplicados innecesarios y mantiene una estructura de carrito mas clara.

Despues de cada agregado, el usuario recibe una confirmacion visual y el contador del carrito se actualiza. De esta forma se evidencia que la accion fue tomada correctamente.

**Punto tecnico a mencionar:**

La logica de carrito esta separada en utilitarios de almacenamiento local. Esto permite reutilizar la lectura y escritura del carrito desde distintas pantallas.

## 6:30 - 8:15 | HU-P1-04: Visualizar el carrito

**Historia de usuario:**

Como cliente autenticado, quiero visualizar los productos que fui agregando al carrito, para revisar mi seleccion antes de una futura compra.

**Accion en pantalla:**

1. Ir al enlace de carrito desde la navegacion.
2. Mostrar la tabla del carrito.
3. Señalar las columnas principales: imagen, producto, precio, cantidad y subtotal.
4. Mostrar que los datos corresponden a los productos agregados en la pantalla anterior.
5. Explicar que la informacion se recupera desde `localStorage`.
6. Opcional: eliminar articulos o cancelar el pedido para mostrar el estado vacio.
7. Mostrar el mensaje `Tu carrito esta vacio` si se limpia el carrito.

**Narracion:**

La aplicacion cuenta con una vista de carrito accesible desde la navegacion. Esta pantalla recupera los items almacenados en `localStorage` y los presenta en una tabla.

Como minimo, se muestran el nombre del producto, el precio y la cantidad. El prototipo tambien incluye imagen y subtotal para mejorar la lectura del pedido.

Si no hay productos cargados, la pantalla no queda vacia: se muestra un mensaje indicando que el carrito esta vacio y se ofrece una accion para volver al catalogo y agregar productos.

**Punto tecnico a mencionar:**

La vista de carrito no depende de variables temporales del catalogo. Al leer desde `localStorage`, conserva el estado aunque se navegue entre paginas del prototipo.

## 8:15 - 9:45 | HU-P1-05: Calcular el total del carrito

**Historia de usuario:**

Como cliente autenticado, quiero ver el total acumulado de los productos cargados en el carrito, para conocer el importe total de mi seleccion.

**Accion en pantalla:**

1. Mostrar los subtotales por producto.
2. Señalar el total general al pie del carrito.
3. Explicar el calculo: precio por cantidad para cada item, y suma de todos los subtotales.
4. Eliminar un articulo del carrito.
5. Mostrar que el total se recalcula en vivo.
6. Cancelar el pedido o eliminar todos los articulos para mostrar que el total desaparece junto con la tabla y aparece el estado vacio.

**Narracion:**

El total del carrito se calcula como la suma de los subtotales. Cada subtotal surge de multiplicar el precio del producto por la cantidad agregada.

Cuando el usuario elimina un articulo, el carrito se vuelve a renderizar y el total se actualiza inmediatamente. Esto permite revisar el importe final sin tener que recargar la pagina.

Este comportamiento responde al criterio de que el valor debe actualizarse correctamente segun el contenido almacenado.

**Punto tecnico a mencionar:**

El calculo se realiza en la vista del carrito usando los datos persistidos. Por eso el total refleja el estado real del carrito en ese momento.

## 9:45 - 10:45 | Recorrido de integracion

**Accion en pantalla:**

1. Volver al catalogo.
2. Buscar un producto.
3. Filtrar por categoria.
4. Agregar un producto.
5. Ir al carrito.
6. Confirmar cantidad y total.

**Narracion:**

En conjunto, estas funcionalidades forman un flujo basico de compra. El cliente puede encontrar productos por nombre, acotar el catalogo por categoria, agregar productos al carrito, revisar el detalle de su seleccion y conocer el total acumulado.

El foco del prototipo esta puesto en la experiencia frontend, la persistencia local y la separacion de responsabilidades entre vistas y utilitarios.

## 10:45 - 11:30 | Cierre

**Accion en pantalla:** mostrar una placa de cierre o dejar visible el carrito con productos cargados.

**Texto sugerido para cierre:**

Con este recorrido se verifican las cinco historias de usuario solicitadas para el prototipo Food Store. Se demostro busqueda dinamica, filtrado por categoria, agregado al carrito con persistencia, visualizacion del carrito y calculo actualizado del total.

Como siguientes mejoras posibles, el prototipo podria incorporar checkout, confirmacion de pedido, stock, carga de imagenes desde un servicio externo y persistencia real en backend.

## Checklist de cobertura para el video

- HU-P1-01: campo de busqueda visible, filtrado por texto y mensaje sin resultados.
- HU-P1-02: categorias visibles, filtrado por categoria y regreso al catalogo completo.
- HU-P1-03: boton para agregar al carrito, persistencia en `localStorage`, actualizacion de cantidad y feedback visual.
- HU-P1-04: vista de carrito accesible, datos recuperados desde `localStorage` y mensaje de carrito vacio.
- HU-P1-05: subtotales, total general y recalculo al modificar el carrito.

## Recomendaciones para la grabacion

- Antes de grabar, limpiar `localStorage` si se quiere mostrar el estado inicial del prototipo.
- Iniciar sesion como cliente con `client@test.com` y `client123`.
- Tener preparados dos ejemplos de busqueda: uno con coincidencias y otro sin resultados.
- Agregar al menos dos productos al carrito para que el calculo del total sea claro.
- Repetir el agregado de un mismo producto para evidenciar que aumenta la cantidad.
