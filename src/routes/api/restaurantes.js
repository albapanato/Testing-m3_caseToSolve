const express = require('express');
const router = express.Router();

const { checkToken, getUserRestaurantById, verifyIsAdmin } = require('../middleware')
const { body } = require('express-validator');
const { updateInfoFromUser, getPublicInfo, newBusinesses, getAllBusinesses, deleteBusinesses, newOpinion, modifyOpinion } = require('../../models/model.restaurantes');

// http://localhost:3333/api/restaurantes (Publica)
router.get('/', (req, res) => {
    getPublicInfo()
        .then(restaurantes => res.json(restaurantes))
        .catch(error => res.json({ error: error.message }))
});

// http://localhost:3333/api/restaurantes/nuevo (Privada)
router.post('/nuevo',
    checkToken,
    body(
        'nombre',
        'Es requerido una longitud mínima de 2 caracteres'
    ).exists().isLength({ min: 2 }),
    body(
        'direccion',
        'La direccion debe de contener más caracteres'
    ).exists().isLength({ min: 5 }),
    body(
        'tipo_comida',
        'Introduce que tipo de comida tiene el restaurante'
    ).exists().isLength({ min: 5 }),
    (req, res) => { // agregar token
        const restaurante = {
            id_usuario: req.user.id,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            tipo_comida: req.body.tipo_comida
        }
        console.log(restaurante)
        newBusinesses(restaurante)

            .then(result => res.json(result))
            .catch(error => res.json({ error: error.message }));
    })

// http://localhost:3333/api/restaurantes (Privada)
router.put('/',
    getUserRestaurantById,
    body(
        'nombre',
        'Es requerido una longitud mínima de 2 caracteres'
    ).exists().isLength({ min: 2 }),
    body(
        'direccion',
        'La direccion debe de contener más caracteres'
    ).exists().isLength({ min: 5 }),
    body(
        'tipo_comida',
        'Introduce que tipo de comida tiene el restaurante'
    ).exists().isLength({ min: 5 }),
    (req, res) => {
        const restaurante = {
            id_usuario: req.user.userId,
            nombre: req.body.nombre,
            direccion: req.body.direccion,
            tipo_comida: req.body.tipo_comida
        }
        // console.log('valor restaurante: ', restaurante.id_usuario)
        // console.log('valor restaurante: ', restaurante.nombre)
        // console.log('valor restaurante: ', restaurante.direccion)
        // console.log('valor restaurante: ', restaurante.tipo_comida)
        // console.log('valor restaurante.body', req.body)
        updateInfoFromUser(restaurante.id_usuario, req.body)
            .then(result => res.json(result))
            .catch(error => res.json({ error: error.message }));
    });


// http://localhost:3333/api/restaurantes/1 (Protegida)
router.delete('/:restauranteId', verifyIsAdmin, (req, res) => {
    deleteBusinesses(req.params.restauranteId)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
});


// http://localhost:3333/api/restaurantes/admin -- EXTRA (Protegida)
router.get('/admin', verifyIsAdmin, (req, res) => {
    getAllBusinesses()
        .then(restaurantes => res.json(restaurantes))
        .catch(error => res.json({ error: error.message }))
});


module.exports = router;





///----------------------------------------

//----- POR REVISAR,
//       TIRA ERROR
// {
//     "error": "The first argument must be of type string or an instance of Buffer, ArrayBuffer, or Array or an Array-like Object. Received undefined"
//   }
// NO ESTA CREANDO EL TOKEN

// http://localhost:3333/api/restaurantes/comentario

// router.post('/comentario', (req, res) => {
//     // const valoracion = {
//     //     id: req.valoracion.id,
//     //     nombre: req.body.nombre,
//     //     id_restaurante: req.body.id_restaurante,
//     //     restaurante: req.body.restaurante,
//     //     puntuacion: req.body.puntuacion,
//     //     comentario: req.body.valoracion
//     // }
//     // console.log(valoracion)
//     console.log(req.body)
//     newOpinion(req.body.nombre, req.body.id_restaurante, req.body.puntuacion, req.body.comentario)
//         .then(opinion => {
//             console.log('pasa por aqui')
//             res.json({
//                 Tu_comentario_se_ha_guardado_correctamente: ' Guarda el siguiente numero de referencia por si deseas editar tu comentario',
//                 Numero_de_referencia: createReference(opinion[0])
//             })
//             console.log('pasa por aqui')
//         }).catch(error => res.json({ error: error.message }))
// })



// function createReference(coment) {
//     const number = {
//         comentId: coment.id,
//     }
//     console.log(coment.id)
//     return jwt.sign(payload, 'Numero de referencia del comentario');

// }

