// index.js
import express from "express";
import generalRoutes from "./routes/generalRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const port = 3001;

// Configuración del motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Registro de rutas sin prefijo "/auth"
app.use("/", userRoutes); 
app.use("/general", generalRoutes);

app.use(express.static("./public"))

// Inicia el servidor
app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});
