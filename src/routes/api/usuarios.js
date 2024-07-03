var express = require('express');
var router = express.Router();
const { emailUsuario } = require('../../models/model.usuarios')

const dayjs = require('dayjs'); // Necesario instalar : npm install dayjs jsonwebtoken
const jwt = require('jsonwebtoken');

//CREAMOS EL TOKEN CON PARAMETROS ID Y ACCESO
function createToken(user) {
    const payload = {
        userId: user.id,
        userAccess: Boolean(user.acceso),
        expiredAt: dayjs().add(30, 'minutes').unix(), // tiempo de caducidad del token
        createdAt: dayjs().unix(),
    }
    console.log(payload)
    return jwt.sign(payload, 'CODIGO DE AUTORIZACION');

}

const bcrypt = require('bcryptjs');

//RESULVE LA PROMESA { LOG-IN }
router.post('/login', async (req, res) => {
    // Recuperamos el usuario de la base de datos
    const user = await emailUsuario(req.body.email);
    if (user) {
        // Comprobamos la password de la base de datos con la que ha enviado el usuario en el body
        const iguales = bcrypt.compareSync(req.body.password, user.password);
        if (iguales) {
            console.log('Iniciando sesion...', new Date().toString());
            res.json({
                Acceso_permitido: `Bienvenido ${user.nombre}`,
                // Devuelve un token cuando hacemos login:
                Codigo_de_acceso: createToken(user)
            });
        } else {
            console.log('No se ha podido iniciar sesion', new Date().toString());
            // Si la password no coincide devolvemos error
            res.json({ error: 'Error en usuario y/o password' });
        }
    } else {
        console.log('No se ha podido iniciar sesion', new Date().toString());
        // Si el usuario no existe en la BD devolvemos un error
        res.json({ error: 'Error en usuario y/o password' });
    }
})

router.put('./')

module.exports = { createToken };
module.exports = router;