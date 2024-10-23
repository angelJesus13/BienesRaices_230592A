import express from "express"; 
const router = express.Router(); 

// Ruta dinámica para buscar usuario por ID
router.get("/findByID/:id", (req, res) => {
    res.send(`Se está solicitando buscar al usuario con su ID: ${req.params.id}`);
});

// Ruta para crear un nuevo usuario
router.post("/newUser/:name/:email/:password", (req, res) => {
    res.send(`Se solicita crear un nuevo usuario de nombre: ${req.params.name}, 
              asociado al correo: ${req.params.email}, 
              con la contraseña: ${req.params.password}`);
});

// Ruta para actualizar usuario (ejemplo con PATCH)
router.patch("/ReplaceUserByEmail/:name/:email/:password", (req, res) => {
    res.send(`Se ha solicitado reemplazar el email: ${req.params.email} 
              por el nombre: ${req.params.name} con la contraseña: ${req.params.password}`);
});

// Ruta para actualizar la contraseña con validación
router.put("/updatePassword/:email/:newPassword/:newPasswordConfirm", (req, res) => {
    const { newPassword, newPasswordConfirm } = req.params;

    if (newPassword === newPasswordConfirm) {
        res.send(`Se ha solicitado el cambio de contraseña para el correo: ${req.params.email}. 
                  Contraseña confirmada y cambios aceptados.`);
    } else {
        res.send(`Se ha solicitado el cambio de contraseña para el correo: ${req.params.email}. 
                  Las contraseñas no coinciden, cambios rechazados.`);
    }
});

router.delete("/deleteUser/:email", function (req, res) {
    res.send(`Se a solicitado la eliminacion del usuario asociado al coreeo ${req.params.email}`)
});
export default router;
