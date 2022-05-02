# Como ejecutar la función

## Requisitos
- Añadir SA y guardar en la carpeta con el nombre de `sa.json`

## Desarrollo local
- Run ```npm i && node index.js```
- Abrir navegador con localhost:5000

Listado de endpoints:
- /get_older. Muestra las personas mayores que la edad introducida.
*Parámetro requerido*: edad
- /add. Añade una persona a datastore
*Parámetros requeridos:* edad y nombre. 
- /create. Crea un usuario nuevo para autenticarse con firebase
*Parametros requeridos:* user (tiene que tener formato de correo) y pass (mínimo 6 caracteres)

