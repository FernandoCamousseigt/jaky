//0. cambio en html y agrego los id
//1.CAPTURAR el EVENTO SUBMIT del formulario
//los elementos tienen acciones por defecto como lo es el caso del submit de un formulario, por lo que debemos evitarla utilizando event.preventDefault()
$( '#js-form' ).submit((event) => {
    event.preventDefault()
    const email = document .getElementById( 'js-input-email' ).value   //<--accedemos al email y  inputs
    const password = document .getElementById( 'js-input-password' ).value   //<-- accedemos al password y input
    console .log(email)  //<-- comprobar que funciona
    console .log(password) //<-- comprobar que funciona
    })


//2.LLAMADO A NUESTRA API, esto lo haremos utilizando el método FETCH
//para hacer nuestro código más legible esta característica la añadiremos en una función llamada postData , como el método fetch retorna una promesa y utilizaremos async/await.
const postData = async (email, password) => {
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
    }

    //3.Cambiamos el codigo entre line 3 y 9. porque: Y llamamos estos método desde el SUBMIT de la siguiente manera:
    $( '#js-form' ).submit( async (event) => {
        event.preventDefault()
        const email = document .getElementById( 'js-input-email' ).value
        const password = document .getElementById( 'js-input-password' ).value
        const JWT = await postData(email,password)
        console .log(JWT)
        })
// Si te fijas incluimos async/await también para esperar que se resuelva la promesa del método postData


//4.Cambio html y agrego id en TABLA
//5. FUNCION que llamaremos getPosts la cual llamará a nuestra API de posts
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
    return data
    } catch (err) {
    console .error( `Error: ${err} ` )
    }
    }

//6  En la funcion inicial llamamos este método después de recibir el token del login:
$( '#js-form' ).submit( async (event) => {
    event.preventDefault()
    const email = document .getElementById( 'js-input-email' ).value
    const password = document .getElementById( 'js-input-password' ).value
    const JWT = await postData(email,password)
    const posts = await getPosts(JWT)
    console .log(posts)
    })
