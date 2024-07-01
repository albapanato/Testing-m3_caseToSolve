var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator'); // Necesario instalar : npm install express-validator

const { infoUsuarios, registroUsuario, emailUsuario } = require('../../models/model.usuarios')

// RESUELVE PROMESA { VISUALIZAR LISTADO USUARIOS }
router.get('/', (req, res) => {
    infoUsuarios()
        .then(listaUsuarios => res.json(listaUsuarios))
        .catch(error => res.json({ error: error.message }));
});


// RESUELVE PROMESA { AGREGAR UN NUEVO USUARIO }
router.post('/admin', body(
    'nombre',
    'El campo nombre es requerido y longitud mínima de 2 caracteres'
).exists().isLength({ min: 2 }),
    body(
        'email',
        'El email debe tener un formato correcto'
    ).isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10); // encripta el password
        const result = await registroUsuario(req.body);
        res.json(result);
    });

// agregar put/admin

//RESULVE LA PROMESA { LOG-IN }


const dayjs = require('dayjs'); // Necesario instalar : npm install dayjs jsonwebtoken
const jwt = require('jsonwebtoken');
function createToken(user) {
    const payload = {
        userId: user.id,
        expiredAt: dayjs().add(20, 'minutes').unix(), // tiempo de caducidad del token
        createdAt: dayjs().unix()
    }
    return jwt.sign(payload, 'CODIGO DE AUTORIZACION');

}

router.post('/login', async (req, res) => {
    // Recuperamos el usuario de la base de datos
    const user = await emailUsuario(req.body.email);
    if (user) {
        // Comprobamos la password de la base de datos con la que ha enviado el usuario en el body
        const iguales = bcrypt.compareSync(req.body.password, user.password);
        if (iguales) {
            console.log('Iniciando sesion...', new Date().toString());
            res.json({
                Acceso_permitido: 'BIENVENIDO', // CAMBIAR MENSAJE Y METER EL NOMBRE DE LA PERSONA QUE INICIE SESION ??${nombre}??
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
module.exports = router;