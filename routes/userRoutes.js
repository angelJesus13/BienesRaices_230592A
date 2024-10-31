// routes/userRoutes.js
import express from "express"; 
import { formularioLogin, formularioRegister, formularioPasswordRecovery } from "../controllers/userController.js"; 

const router = express.Router();

// Rutas principales
router.get("/login", formularioLogin);
router.get("/register", formularioRegister);
router.get("/passwordRecovery", formularioPasswordRecovery);

// Rutas adicionales con createAccount
router.get("/login/createAccount", (req, res) => {
    res.send("Formulario para crear una cuenta desde la sección de Login.");
});

router.get("/register/createAccount", (req, res) => {
    res.send("Formulario para crear una cuenta desde la sección de Registro.");
});

router.get("/passwordRecovery/createAccount", (req, res) => {
    res.send("Formulario para crear una cuenta desde la sección de Recuperación de Contraseña.");
});

// Ruta dinámica para buscar usuario por ID
router.get("/findByID/:id", (req, res) => {
    res.send(`Se está solicitando buscar al usuario con su ID: ${req.params.id}`);
});
router.get("/invalidPassword", (req, res) => {
    res.json({
        error: "Contraseña incorrecta. Intente nuevamente."
    });
});

// Ruta para crear un nuevo usuario
router.post("/newUser/:name/:email/:password", (req, res) => {
    res.send(`Se solicita crear un nuevo usuario de nombre: ${req.params.name}, 
              asociado al correo: ${req.params.email}, 
              con la contraseña: ${req.params.password}`);
});

// Ruta para actualizar usuario con PATCH
// Ruta para reemplazar el usuario por email (puedes renombrarla si es necesario)
router.patch("/ReplaceUserByEmail/:username/:oldEmail/:newPassword", (req, res) => {
    const { username, oldEmail, newPassword } = req.params;
    res.send(`Se ha solicitado reemplazar el usuario: ${username} con el email: ${oldEmail} 
              y la nueva contraseña.`);
});



// Ruta para actualizar la contraseña con PUT
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

// Ruta para eliminar un usuario
router.delete("/deleteUser/:email", (req, res) => {
    res.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${req.params.email}`);
});

// Exporta el router
export default router;
