const nombre = "angel";
console.log(`Hola desde NODE JS eres: ${nombre}`)
//importar la libreria para crear uin servidor web - commonJS
//instancia nuestra aplicacion web
const app = express()
//
const port = 3001;
import express from "express"
app.listen(port, ()=>{
    console.log(`La aplicacion ha iniciado en el puerto: ${port}`)
});

//Routing 
app.get('/', function(req, resp){
    resp.send("Hola desde el web en Node.js")
})
//Routing 
app.get('/quienEres', function(req, resp){
    resp.json({
        "Nombre": "Angel de Jesus",
        "Carrera": "D.S.M",
        "Grado":"4",
        "Grupo":"A",
    })
})
//Peticiones 1 por accion 
