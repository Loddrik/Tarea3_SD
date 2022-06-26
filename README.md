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

___

## **Preguntas planteadas**

1. Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿Cómo los nodos se conectan?
¿Qué ocurre cuando un cliente realiza una petición a uno de los nodos? ¿Qué ocurre cuando uno de los nodos se desconecta?
¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

>
> Cassandra funciona con un equema distribuido peer-to-peer,
> en donde cada peer se conecta
> con otro mediante el protocolo Gossip,
> el cual permite entre miembros del anillo, "contarse
> chismes" para mantenerse informados continuamente.
>
> Como el esquema es descentralizado, cada
> nodo tiene el mismo peso e importancia que el resto.
> Además como se dijo anteriormente, la
> forma que representa la arquitrectura implementada
> en Cassandra es de tipo Anillo, por lo que
> existe una sola vía continua para la comunicación,
> permitiendo aumentar la cantidad de lectutas
> distribuyendo la información entre peers.
>
> Si le llega una petición a cualquiera de nustros
> peers, dicho peer debe de direccionar la petición
> al peer correspondiente. Luego, se escribe el log
> de la petición en una estructura llamada Mem Table,
> la cual funciona como respaldo en caso de que el nodo,
> caiga. Una vez escrita en la Memoria, se utiliza la SSTable,
> quien se encarga de escribir los datos desde la memoria (logs
> ordenados), hacia el disco.
>
> Cuando un nodo desea desconectarse, avisa a sus pares
> mediante Gossip, de tal forma que se aplique una estrategia
> como RPS (Replica Placement Strategy) o Snitch para repartir las
> consultas o replicar el nodo caído mediante la MemTable.
>
> Si hablamos de la red generada por Cassandra, podemos decir que
> es eficiente hasta cierto punto, dado que Cassandra en sí está hecho
> para procesar una inmensa cantidad de datos, por lo que es necesario
> manetener MemTables de gran tamaño. Ésto último se traduce a que,
> es necesario tener una alta cantidad de memoria a medida que más nodos
> y/o más información se requeira almacenar (y cuánto tiempo). Por otro lado,
> se sabe que P2P es una arquitectura en la que si no se implementan ni
> formailizan procedimientos que aumenten el rendimiento como DHT´S ,
> se pierde mucho tiempo accediendo a cada nodo, uno en uno.
>
> Finalmente, el balanceo de Carga que utiliza Cassandra es RandomPartitioner
> el cual distribuye las peticiones de manera aleatoria.
>

2. Cassandra posee principalmente dos estrategias para mantener reduncancia
en la replicación de datos. ¿Cuáles son estos? ¿Cuál es la ventaja de uno sobre otro?
¿Cuál utilizaría usted para el caso actual y por qué? Justifique apropiadamente su respuesta.

>
> Para mantener la redundancia de datos, Cassandra mantiene dos mecanismos.
> El primero es NetworkTopologyStrategy, la cual genera resúmenes (hash) para calcular
> un Merkle (Árbol binario).
>
> El segundo es SimpleStrategy, el cual coloca réplicas en peers posteriores, en dirección
> del anillo.
>
> Es obvio y simple de ver en el nombre de estas estrategias que la primera
> es utilzada para redes más grandes, en donde se permite el almacenamiento
> de múltiples copias de datos en distintos centros o datacenters.
>
> Para el caso actual se utiliza sólo un datacenter que contiene los 3 nodos que
> se piden en el enunciado, por lo que el mecanismo implementado o que mejor se adapta
> es el SimpleStrategy dada la topología de tipo anillo que se forma.
>

3. Teniendo en cuenta el contexto del problema ¿Usted cree que la solucipón propuesta
es la correcta? ¿Qué ocurre cuando se quiere escalar la solución? ¿Qué mejoras implementaría?
Oriente su respuesta hacia el Sharding y comente una estrategia que pidría seguir para ordenar
los datos.

Como sabemos, el sharding es una forma de segmentar los datos de una base de datos de forma horizontal, es decir, partir la base de datos principal en varias en bases de datos más pequeñas y repartiendo la información. De esta forma lo que se consigue es una partición de datos en diferentes bases que tengan cierta homogeneidad, para conseguir una escalabilidad mucho más rápida.

En Cassandra, la distribución y la replicación de datos van juntas. Los datos se organizan por tabla y se identifican mediante una clave principal, que determina en qué nodo se almacenan los datos. Las réplicas son copias de filas. Cuando los datos se escriben por primera vez, también se los denomina réplica.

Los factores que influyen en la replicación incluyen:

Nodos virtuales : asigna la propiedad de los datos a las máquinas físicas.
Particionador : divide los datos en el clúster.
Estrategia de replicación : determina las réplicas para cada fila de datos.
Snitch : define la información de topología que utiliza la estrategia de replicación para colocar réplicas.

Entonces... Cassandra admite sharding?

Si, Cassandra admite la fragmentación horizontal, pero de una forma no tradicional.

En Mongodb, cada nodo secundario contiene datos completos del nodo principal, pero en Cassandra, cada nodo secundario tiene la responsabilidad de mantener solo algunas particiones clave de datos.

Cassandra divide los nodos (porque si no puede dividirlo, no puede escalarlo). Todos los datos de un clúster de Cassandra se dividen en "el anillo" y cada nodo del anillo es responsable de uno o más rangos de claves. Se tiene control sobre el particionador (p. ej., aleatorio, ordenado) y sobre cuántos nodos en el anillo se debe replicar una clave/columna según sus requisitos.

Entonces... es una buena solución para el problema el usar cassandra?

Según Nuestro Juicio si es una buena solución, al igual que Fruitter, al pertenecer a Melon Musk es un producto que si o si crecerá de manera exponencial en su inicio de producción, entonces estará evolucionando rápidamente y está en "modo de inicio", Cassandra podría ser una buena opción debido a su modelo de datos sin esquema. Esto facilita mantener la base de datos al día con los cambios de la aplicación a medida que se implementa rápidamente.

Por otro lado, hay que mirar la distribución geográfica, Cassandra tiene soporte listo para usar para la distribución geográfica de datos. Se puede configurar Cassandra fácilmente para replicar datos en múltiples centros de datos. Esto ya que La nueva aplicación implementada es algo de caracter global, que podría ver un beneficio de rendimiento al poner los datos cerca del usuario.

Para fragmentar, se necesita encontrar una buena clave para ordenar sus registros. Por ejemplo, se podría dividir los registros de los clientes en 26 máquinas, una para cada letra del alfabeto, cada una de las cuales alojaría solo los registros de los clientes cuyos apellidos comienzan con esa letra en particular. Sin embargo, es probable que esta no sea una buena estrategia por la carga que recibirían las letras más usadas vs las menos usadas.

Entonces una propuesta es fragmentar de acuerdo con algo numérico, como el rut de las personas o el id de las entidades(recetas o clientes), aunque todo depende de cómo es probable que se distribuyan los datos específicos.

