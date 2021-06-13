//0. cambio en html y agrego los id
//1.CAPTURAR el EVENTO SUBMIT del formulario
//los elementos tienen acciones por defecto como lo es el caso del submit de un formulario, por lo que debemos evitarla utilizando event.preventDefault()
 $( '#js-form' ).submit((event) => {
    event.preventDefault()
    const email = document .getElementById( 'js-input-email' ).value   //<--accedemos al email y  inputs
    const password = document .getElementById( 'js-input-password' ).value   //<-- accedemos al password y input
    console.log(email)  //<-- comprobar que funciona
    console.log(password) //<-- comprobar que funciona
    }) 


    

//2.LLAMADO A NUESTRA API, esto lo haremos utilizando el método FETCH
//para hacer nuestro código más legible esta característica la añadiremos en una función llamada postData , como el método fetch retorna una promesa y utilizaremos async/await.
/* const postData = async (email, password) => {
    try {
    const response = await fetch( 'http://localhost:3000/api/login' ,
    {
    method: 'POST' ,
    body: JSON .stringify({email:email,password:password})
    })
    const {token} = await response.json()
    return token
    } catch (err) {
    console .error( `Error: ${err} ` )
    }
    } */

    //3.Cambiamos el codigo entre line 3 y 9. porque: Y llamamos estos método desde el SUBMIT de la siguiente manera:
     $( '#js-form' ).submit( async (event) => {
        event.preventDefault()
        const email = document .getElementById( 'js-input-email' ).value
        const password = document .getElementById( 'js-input-password' ).value
        const JWT = await postData(email,password)
        console.log(JWT)
        }) 
// Si te fijas incluimos async/await también para esperar que se resuelva la promesa del método postData


//4.Cambio html y agrego id en TABLA
//5. FUNCION que llamaremos getPosts la cual llamará a nuestra API de posts
/* const getPosts = async (jwt) => {
    try {
    const response = await fetch( 'http://localhost:3000/api/posts' ,
    {
    method: 'GET' ,
    headers: {
    Authorization: `Bearer ${jwt} `
    }
    })
    const {data} = await response.json()
    return data
    } catch (err) {
    console .error( `Error: ${err} ` )
    }
    } */

//6  En la funcion inicial llamamos este método después de recibir el token del login:
 $( '#js-form' ).submit( async (event) => {
    event.preventDefault()
    const email = document .getElementById( 'js-input-email' ).value
    const password = document .getElementById( 'js-input-password' ).value
    const JWT = await postData(email,password)
    const posts = await getPosts(JWT)
    console.log(posts)
    }) 

    //7.Añadir los datos con jQuery a la tabla de html
       //7.1 para ello liminar la clase helper de bootstrap d-none, la cual aplica el estilo de css display:none a nuestro elemento y al borrarla podremos ver el elemento
       //7.1 para completar la tabla con los datos crearemos una función que se llame fillTable

       const fillTable = (data,table) => {
            let rows = "" ;
            $.each(data, (i, row) => {
                rows += `<tr>
                            <td> ${row.title} </td>
                            <td> ${row.body} </td>
                        </tr>`
            })
            $( `#${table} tbody` ).append(rows);
        }
        //como apreciamos nuestra función recibe la data y el id de la tabla donde queremos añadir los datos

        //ahora llamemos nuestra función desde el submit luego de haber recibido los posts.
        $( '#js-form' ).submit( async (event) => {
            event.preventDefault()
            const email = document .getElementById( 'js-input-email' ).value
            const password = document .getElementById( 'js-input-password' ).value
            const JWT = await postData(email,password)
            const posts = await getPosts(JWT)
            fillTable(posts, 'js-table-posts' )
            })

     //8.DESPUES DE AGREGAR EN EL HTML EL < div id= "js-form-wrapper" y cambiar a style= "display: block;" y div id= "js-table-wrapper" class= "col-md-12" style= "display: none" >
        // Se debe realizar la siguiente funcion llamada toggleFormAndTable:
        // Funcion que ocultara este div y muestrara el div con id js-table-wrapper.
        const toggleFormAndTable = (form,table) => {
            $( `#${form} ` ).toggle()
            $( `#${table} ` ).toggle()
            }

    //9. Se llamará la funcion desde el SUBMIT
    $( '#js-form' ).submit( async (event) => {
        event.preventDefault()
        const email = document .getElementById( 'js-input-email' ).value
        const password = document .getElementById( 'js-input-password' ).value
        const JWT = await postData(email,password)
        const posts = await getPosts(JWT)
        fillTable(posts, 'js-table-posts' )
        toggleFormAndTable( 'js-form-wrapper' , 'js-table-wrapper' )  //<-- ahí está el llamado
        })

        //con ello deja de aparecer el boton submit y la opcion de ingresar otro correo y clave.
        //si refrescamos la pantalla, volvemos ver nuestro formulario, pues nos falta hacer persistencia del JWT y es lo que haremos a continuación
        //hay varias alternativas para persistir el token, utilizaremos localStorage ya que para el alcance de nuestro proyecto cumple perfectamente el objetivo

//Usar localStorage es muy sencillo ya que para:
// AÑADIR un valor debemos usar la siguiente instrucción: localStorage.setItem ('llave-para-identificar', 'valor-que-guardamos')
// Y para acceder al valor guardado en el localStorage se utiliza la siguiente instrucción: localStorage.getItem( 'llave-para-identificar' )

//10. método localStorage.setItem para almacenar el JWT al momento de hacer login en la función postData:

const postData = async (email, password) => {
    try {
    const response = await fetch( 'http://localhost:3000/api/login' ,
    {
    method: 'POST' ,
    body: JSON .stringify({email:email,password:password})
    })
    const {token} = await response.json()
    localStorage.setItem( 'jwt-token' ,token)
    return token
    } catch (err) {
    console .error( `Error: ${err} ` )
    }
    }

    //Validemos que esté funcionando, volviendo hacer login en nuestro proyecto. en la consola vamos a Application, click en localStorage y http://localhost:3000   y se desplegará nuestra llave jwt-token con su valor
    //Ahora, al refrescar el navegador te darás cuenta que nuestro jwt-token se mantiene, pero nuestro formulario volvió a aparecer, esto sucede porque no hemos implementado que cuando se cargue el sitio valide si existe un JWT

//11.Para validar si hay un JWT, crearemos una función que se ejecute cuando se cargue nuestra página y valide si existe un JWT, de ser así, debería automáticamente llamar a nuestra API de posts
    /* const init = async () => {
        const token = localStorage.getItem( 'jwt-token' )
        if (token) {
        const posts = await getPosts(token)
        fillTable(posts, 'js-table-posts' )
        toggleFormAndTable( 'js-form-wrapper' , 'js-table-wrapper' )
        }
        }
        init() */

        /* Nuestro requerimiento está casi terminado, sólo falta validar si nuestro token es válido, para
    emular este caso abriremos nuestro inspector de elemento y nos dirigiremos al localStorage
    como lo vimos anteriormente, ahora si hacemos doble click en el valor del token te darás
    cuenta que es posible editar este valor, así que agrégale algún carácter para que deje de ser
    válido.

    Cerramos el inspector y refrescamos, si nuestro cambio fue correcto deberíamos ver
    nuestra tabla vacía y un error en la consola.
     */

    /* Para controlar este comportamiento vamos a refactorizar el código que hemos construido,
es decir, vamos mover alguna funciones de lugar, lo primero que haremos será sacar las
funciones fillTable y toggleFormAndTable de dentro del evento submit, también de nuestra
función init y nos quedaría así: */

//SUBMIT
$( '#js-form' ).submit( async (event) => {
    event.preventDefault()
    const email = document .getElementById( 'js-input-email' ).value
    const password = document .getElementById( 'js-input-password' ).value
    const JWT = await postData(email,password)
    getPosts(JWT)
    })

//init
const init = async () => {
    const token = localStorage.getItem( 'jwt-token' )
    if (token) {
    getPosts(token)
    }
    }

/* Estas funciones de fillTable y toggleFormAndTable las llevaremos dentro de la función
getPosts y las llamaremos siempre y cuando la respuesta de la API sea algo válido: */
/* const getPosts = async (jwt) => {
    try {
    const response = await fetch( 'http://localhost:3000/api/posts' ,
    {
    method: 'GET' ,
    headers: {
    Authorization: `Bearer ${jwt} `
    }
    })
    const {data} = await response.json()
    if (data) {
    fillTable(data, 'js-table-posts' )
    toggleFormAndTable( 'js-form-wrapper' , 'js-table-wrapper' )
    }
    } catch (err) {
    console .error( `Error: ${err} ` )
    }
    } */

    /* Con este cambio estamos controlando el caso de mostrar la tabla sólo si la respuesta de la
API es una respuesta válida (con un JWT válido), ahora sólo deberíamos limpiar nuestro
localStorage dentro del catch que es donde cae nuestro código cuando el JWT es inválido. */
const getPosts = async (jwt) => {
    try {
    const response = await fetch( 'http://localhost:3000/api/posts' ,
    {
    method: 'GET' ,
    headers: {
    Authorization: `Bearer ${jwt} `
    }
    })
    const {data} = await response.json()
    if (data) {
    fillTable(data, 'js-table-posts' )
    toggleFormAndTable( 'js-form-wrapper' , 'js-table-wrapper' )
    }
    } catch (err) {
    localStorage.clear()
    console .error( `Error: ${err} ` )
    }
    }



