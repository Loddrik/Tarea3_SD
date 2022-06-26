# **Sistemas Distribuidos:  Tarea 3**

>
>Integrantes:
>
> - Brian Castro
> - Rubén Hermosilla
>

## **Instrucciones de uso**

1. Clonar repositorio ⬇️
>
> ```bash
>    https://github.com/Loddrik/Tarea3_SD.git
>    ```
>

2. Ejecutar docker compose 🏁
>
>```bash
>    docker-compose up --build
>    ```
>
3. Esperar a que los contenedores estén listos, esto toma tiempo así que tome asiento y traiga sus palomitas 🍿 ⏰.

4. Una vez cargado (observar en la consola), podemos hacer uso de las rutas solicitdas. Un ejemplo de uso es el siguiente:

>
> 1. Creamos un paciente en la siguiente ruta:
>
>```bash
>    http://localhost:3000/create [POST]
>    ```
>
> con los parámetros:
>
>```json
>    {
>        "rut":"20330013-1",
>        "nombre":"Brian",
>        "apellido":"Castro",
>        "fecha_nacimiento":"222"
>        "email":"brian.castro@mail.udp.cl",
>    }
>    ```
>
> Donde la Response será el identificador de la receta.
>
> 2. Editamos la receta asignada al paciente en la ruta:
>
>```bash
>    http://localhost:3000/edit [POST]
>    ```
>
> con los parámetros:
>
>```json
>    {
>    "id":"id de la receta que salga jeje",
>    "comentario": "Debido a la inflamación del recto y ano, se recomienda una buena lavada de poto.",
>    "farmacos":"Supositorios",
>    "doctor": "Nicolás Hidalgo"
>   }
>    ```
>
> 3.Verificar cambios!
>
>```bash
>    http://localhost:3000/getRecipes [GET]
>    ```
>
> 4. Podemos de igual manera eliminar la receta
>
>```bash
>    http://localhost:3000/delete [POST]
>    ```
>
> con los siguientes parámetros:
>
>```json
>    {
>       "id": "id que le aparezca al pvto del brian :v"
>    }
> 
>    ```
>
> 5. Usamos una vez más getRecipes para verificar la eliminación de la receta.
>
