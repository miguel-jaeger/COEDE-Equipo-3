
// La función se ejecutará cuando el DOM (el HTML) esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // Función para cargar contenido de una URL en un elemento del DOM
    function cargarContenido(url, idElemento) {
        fetch(url)
            .then(response => {
                // Si la respuesta no es correcta (ej. error 404), lanzamos un error
                if (!response.ok) {
                    throw new Error(`Error al cargar la página: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                // Inyectamos el contenido HTML en el elemento con el ID especificado
                document.getElementById(idElemento).innerHTML = data;
            })
            .catch(error => {
                console.error('Ha ocurrido un error:', error);
                document.getElementById(idElemento).innerHTML = `<p style="color:red;">No se pudo cargar el contenido.</p>`;
            });
    }

    // Llamamos a la función para cada sección
    cargarContenido('pages/jaeger.html', 'presentacion');

});