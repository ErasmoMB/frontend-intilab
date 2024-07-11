Proyecto: Slider de Autores con Información Académica

# Descripción del Proyecto

Este proyecto tiene como objetivo desarrollar un slider interactivo en una aplicación web utilizando React, que mostrará información detallada de varios autores académicos. Cada slide del slider representará a un autor específico e incluirá su imagen, nombre, grados académicos, total de citas y total de documentos.

## Objetivo

Crear un slider funcional que permita a los usuarios explorar la información académica de varios autores de manera interactiva y visualmente atractiva.

## Requerimientos y Recursos Disponibles

### Backend:

Rutas Activas:

- http://127.0.0.1:5000/documentos: Devuelve el total de documentos por autor.
- http://127.0.0.1:5000/autores: Devuelve el total de citas por autor.
- http://127.0.0.1:5000/datos: Devuelve datos detallados de cada autor, incluyendo nombre, grados académicos y ruta de imagen.

Datos Necesarios por Autor:

- Nombre completo del autor.
- Grados académicos obtenidos.
- Ruta de la imagen del autor.
- Total de citas del autor (calculado a partir de los datos obtenidos en la primera consulta).
- Total de documentos del autor (obtenido de la segunda consulta).

### Implementación Propuesta

#### Configuración del Entorno:

- Desarrollar la aplicación frontend utilizando React.
- Configurar un proyecto React utilizando Create React App u otro método preferido.

#### Consumo de API:

- Implementar solicitudes HTTP (GET) para obtener datos de las siguientes rutas del backend:
  - /documentos
  - /autores
  - /datos

#### Desarrollo del Slider:

- Utilizar un componente de slider en React (por ejemplo, react-slick o swiper) para mostrar los autores de manera deslizante.
- Diseñar una tarjeta para cada autor que muestre:
  - La imagen del autor (ruta_imagen).
  - Nombre completo del autor (nombre).
  - Grados académicos obtenidos del autor (grado_academico).
  - Total de citas del autor (calculado sumando los valores de citedby-count de cada artículo obtenido en la primera consulta).
  - Total de documentos del autor (obtenido de la segunda consulta).

#### Integración de Datos:

- Integrar la información obtenida de las tres consultas para cada autor y asegurarse de mostrarla correctamente en la vista del slider.

#### Estilo y Animación:

- Aplicar estilos CSS para mejorar la presentación del slider y las tarjetas de los autores.
- Implementar animaciones para transiciones suaves entre los slides.

#### Pruebas y Ajustes:

- Realizar pruebas exhaustivas para garantizar que el slider funcione correctamente en diferentes dispositivos y navegadores.
- Asegurarse de que la información se presente de manera clara y legible en cada slide del slider.

## Consideraciones Adicionales

- Manejar adecuadamente la carga y visualización de imágenes de los autores, especialmente si provienen de un servidor externo como AWS S3.
- Implementar manejo de errores y carga asincrónica de datos para una experiencia de usuario robusta.
- Considerar la implementación de funcionalidades adicionales como filtros de búsqueda o categorización de autores según áreas académicas.

### Variables a Utilizar:

- ruta_imagen: Ruta URL de la imagen del autor.
- nombre: Nombre completo del autor.
- grado_academico: Array de grados académicos obtenidos por el autor.
- total_citas: Total de citas del autor, obtenido sumando los valores de citedby-count de cada artículo.
- total_documentos: Total de documentos del autor, obtenido de la segunda consulta.

Con estos detalles y variables definidos, podrás proceder a implementar el slider de autores con la información académica requerida de manera organizada y efectiva en tu aplicación React.
