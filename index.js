import express from "express";
import generalRoutes from "./routes/generalRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const nombre = "angel";
console.log(`Hola desde NODE JS eres: ${nombre}`);

// Instancia de la aplicación web
const app = express();
const port = 3001;

// Uso de los routers
app.use("/general", generalRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
    console.log(`La aplicación ha iniciado en el puerto: ${port}`);
});
