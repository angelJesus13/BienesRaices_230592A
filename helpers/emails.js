import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
//mejora la sensibilidad de los datos más sensibles del usuario
dotenv.config({ path: '.env' });

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = datos;

    await transport.sendMail({
        from: 'BienesRaices.com <no-reply@bienesraices.com>',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                }
                .email-content {
                    width: 600px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    padding: 30px;
                    text-align: center;
                }
                .email-content h1 {
                    color: #000000;
                    font-size: 2.5em;
                }
                .email-content p {
                    font-size: 1.2em;
                    color: #333333;
                }
                .button {
                    display: inline-block;
                    background-color: #91CB3E;
                    color: white;
                    padding: 15px 30px;
                    font-size: 1.2em;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
                .button:hover {
                    background-color: #53A548;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 0.9em;
                    color: #888888;
                }
                .footer a {
                    color: #1a73e8;
                    text-decoration: none;
                }
                .image-container {
                    margin-top: 20px;
                }
                .image-container img {
                    width: 100%;
                    max-width: 200px;
                    height: auto;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="email-content">
                    <h1>Bienes<span style="color: #4C934C;">Raices</span></h1>
                    <p>Hola ${nombre}, confirma tu cuenta en BienesRaices.com</p>
                    <p>Te informamos que tu cuenta en BienesRaices ha sido creada con éxito. Para completar el proceso, por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                    <a href="${process.env.BACKEND_DOMAIN}:${process.env.BACKEND_PORT}/auth/confirmAccount/${token}" class="button">Confirmar tu cuenta</a>

                    <p>Si no fuiste tú quien creó esta cuenta, por favor ignora este mensaje.</p>
                    <div class="footer">
                        <p>Gracias por confiar en nosotros. Atentamente el CEO <br> BienesRaices.com</p>
                    </div>
                    <div class="image-container">
                        <img src="http://localhost:3001/img/signature_pandadoc.png" alt="Bienes Raices">
                    </div>
                </div>
            </div>
        </body>
    </html>
`
    
    });
};

export {
    emailRegistro
};
