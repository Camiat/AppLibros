//Requiero los paquetes

const express = require('express');
const app = express();

let libros = []; // Arreglo para almacenar los títulos de los libros
let favoritos = [];
let recomendados = [];

const url_api = `https://www.googleapis.com/books/v1/volumes?q=0`;
 //llamado a la api, 20 libros recomendados
fetch(url_api)
    .then(res => res.json())
    .then(data => {
        data.items.forEach((libro, index ) => {
            // Almacena el título,imagen,etc de cada libro en el arreglo 'libros'
            libros.push({id:index+1, titulo: libro.volumeInfo.title, imagen: libro.volumeInfo.imageLinks?.thumbnail, autores: libro.volumeInfo.authors, editorial: libro.volumeInfo.publisher, descripcion: libro.volumeInfo.description, resenas:[] });
        });

        const url_api2 = `https://www.googleapis.com/books/v1/volumes?q=5`;
        fetch(url_api2)
        .then(res => res.json())
        .then(data => {
            // console.log(data.items[0]);
            data.items.forEach((libro, index) => {
                // Almacena el título,image,etc de cada libro en el arreglo 'libros'
                libros.push({ id:index+1, titulo: libro.volumeInfo.title, imagen: libro.volumeInfo.imageLinks?.thumbnail, autores: libro.volumeInfo.authors, editorial: libro.volumeInfo.publisher, descripcion: libro.volumeInfo.description, resenas:[] });
            });

          
        })
        .catch(error => console.error('Error fetching data:', error));
    })
    .catch(error => console.error('Error fetching data:', error));

const url_api3 = `https://www.googleapis.com/books/v1/volumes?q=20`;
fetch(url_api3)
    .then(res => res.json())
    .then(data => {
        recomendados = data.items.map((libro, index) => {
            return { 
                id:index+1,
                titulo: libro.volumeInfo.title, 
                imagen: libro.volumeInfo.imageLinks?.thumbnail, 
                autores: libro.volumeInfo.authors, 
                editorial: libro.volumeInfo.publisher, 
                descripcion: libro.volumeInfo.description,  
            }
        });
    });

//Definimos motor de plantilla
app.set("view engine", "ejs");

app.use(express.static('public'));
//trabajo con body
app.use(express.json())

app.get('/', (request, response) => {
      // Renderiza la vista 'page/Home' y pasa el arreglo 'libros' como variable
            //variable que le paso a home.ejs  //arreglo
    response.render('page/Home', { libros: libros });
});

//Ruta para buscar

app.get('/buscar', (request,response) => {
    const { tipo, busqueda } = request.query;
    let librosFiltrados = []; //array que almacena la busqueda

    if (tipo === 'titulo') {
        librosFiltrados = libros.filter(libro => libro.titulo.toLowerCase().includes(busqueda.toLowerCase()));
    } else if (tipo === 'editorial') {
        librosFiltrados = libros.filter(libro => libro.editorial?.toLowerCase().includes(busqueda.toLowerCase()));
    } else if ( tipo === 'autor') {
        librosFiltrados = libros.filter(libro => {
            if (libro.autores) {
                for (let autor of libro.autores) {
                    if (autor.toLowerCase().includes(busqueda.toLowerCase())) {
                        return true;
                    }
                }
            }
        });
    }

    // console.log(librosFiltrados);
                                // Renderiza la vista 'page/Home' y pasa el arreglo 'libros' como variable
            //variable que le paso a home.ejs  //arreglo 
    response.render('page/Home', { libros: librosFiltrados });
});
//Ruta para borrar libro
app.delete('/borrar',(req,res)=>{
    // libros
    const { id } = req.query; // Recibe como string
                                     //number     //number
    libros = libros.filter(libro => libro.id !== Number(id));

    res.sendStatus(200); // OK
});



app.get('/editar',(req,res)=> {
    const { id } = req.query;

    res.render('page/Editar', {id: id} )
})

app.put('/editar',(req,res)=>{
    const {id,titulo, editorial,descripcion } = req.query;

    libros = libros.map(libro => {
        if (libro.id === Number(id)) {
            return {
                ...libro,
                titulo: titulo, 
                descripcion: descripcion,
                editorial: editorial
            }
        } else {
            return libro
        }

    })

    res.sendStatus(200)
})

app.get('/agregar',(req,res) => {
    res.render('page/Agregar')
})
//recibe querys del formulario para enviar nueva data.
app.post('/agregar', (req,res)=>{
    const {titulo,imagen,autorUno, autorDos, autorTres, editorial, descripcion} = req.query;
    const autores = [];
    
    if (autorUno) {
        autores.push(autorUno)
    } else if (autorDos){
        autores.push(autorDos)
    } else if(autorTres){
        autores.push(autorTres)
    }

    libros.unshift({id: libros.length + 1, titulo:titulo, imagen:imagen,autores:autores,editorial:editorial,descripcion:descripcion, resenas: []})
    
    res.sendStatus(201)
})



app.get('/ver-favorito',(req,res) => {
    res.render('page/Favoritos', {favoritos, recomendados})
});

app.post('/agregar-favorito', (req,res) =>{
    const {id,titulo,imagen,autores, editorial,descripcion} = req.body;

    favoritos.push({id: Number(id),titulo,imagen,autores, editorial,descripcion});

    libros = libros.map(libro => {
        if (libro.id === Number(id)) {
            return {
                ...libro,
                favorito: true
            };
        } else {
            return libro;
        }
    });

    res.status(201).send('libro agregado a favoritos')
})



//Ruta para quitar favorito
app.delete('/quitar-favorito', (req,res) => {
    const { id } = req.query; // Recibe como string
    //number     //number

    favoritos = favoritos.filter(libro => libro.id !== Number(id));

    // 20, 1 -> favorito
    libros = libros.map(libro => {
        if (libro.id === Number(id)) {
            return {
                ...libro,
                favorito: false
            };
        } else {
            return libro;
        }
    });
    
    res.sendStatus(200); // OK
})

app.post('/agregar-resena', (req, res) => {
    const {id, comentario, calificacion} = req.query;

    libros = libros.map(libro => {
        if ( libro.id === Number(id) ) {
            return {
                ...libro,
                resenas: [...libro.resenas, { comentario, calificacion }]
            }
        } else {
            return libro
        }
    });

    res.sendStatus(201);
});


const puerto = 3081;
app.listen( puerto, () => {
    console.log('Servidor ejecutándose en el puerto 3081')
})
