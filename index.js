import express from 'express';
import bodyParser from 'body-parser';
import { formularioLogin, formularioRegistro, registrar, formularioOlvidePassword } from './controllers/usuarioController.js';

const app = express();


// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));


// Middlewares para parsear los datos de los formularios
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de las vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas de la aplicación
app.get('/auth/login', formularioLogin);
app.get('/auth/registro', formularioRegistro);
app.post('/auth/registro', registrar);
app.get('/auth/Olvide-Password', formularioOlvidePassword);

// Resto de configuración de la aplicación
app.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});

