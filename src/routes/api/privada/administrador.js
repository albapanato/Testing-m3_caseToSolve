// aqui tengo que meter el post y el put y el delete 
var express = require('express');
var router = express.Router();
const { createToken } = require('../usuarios')
const { checkToken } = require('../../middleware');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const { infoUsuarios, registroUsuario, eliminarUsuario, modificarUsuario } = require('../../../models/model.usuarios')

// RESUELVE PROMESA { VISUALIZAR LISTADO USUARIOS }
router.get('/', (req, res) => {
    infoUsuarios()
        .then(listaUsuarios => res.json(listaUsuarios))
        .catch(error => res.json({ error: error.message }));
});

router.put('/:usuarioId', (req, res) => { // agregar codigo de acceso
    modificarUsuario(req.params.restauranteId, req.body)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));

})


router.delete('/:usuarioId', (req, res) => { // agregar codigo de acceso
    eliminarUsuario(req.params.restauranteId)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
})



router.post('/',
    checkToken,
    body(
        'nombre',
        'Es requerido una longitud mínima de 2 caracteres'
    ).exists().isLength({ min: 2 }),
    body(
        'email',
        'El email debe tener un formato de email'
    ).isEmail(),
    body(
        'acceso',
        'Especifica si tiene acceso (true), o no tiene acceso (false)'
    ).isBoolean(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('Valor de acceso en privada/usuarios.js:', req.user.userAccess);

        req.body.password = bcrypt.hashSync(req.body.password, 10); // encripta el password
        const result = await registroUsuario(req.body);
        res.json(result);

        console.log('funcion post terminada')
    }

);



module.exports = router;