import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import usuarioRoutes from './routes/userRoutes.js';  // Asegúrate de que la ruta sea correcta


const app = express();

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Middlewares para parsear los datos de los formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//habilitamos cookie parser

app.use(cookieParser())

//habilitar csrf

app.use( csrf({cookie: true}))

// Configuración de las vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas de la aplicación
app.use('/auth', usuarioRoutes);  // Asegúrate de usar '/auth' como prefijo para las rutas

// Resto de configuración de la aplicación
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
