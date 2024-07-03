const express = require('express');
const router = express.Router();

const { infoRestaurantes, registroRestaurante, modificarRestaurante, eliminarRestaurante } = require('../../models/model.restaurantes');

router.get('/', (req, res) => {
    infoRestaurantes()
        .then(restaurantes => res.json(restaurantes))
        .catch(error => res.json({ error: error.message }))
});



router.post('/', (req, res) => { // agregar token
    registroRestaurante(req.body)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
})


router.put('/:restauranteId', (req, res) => { // agregar codigo de acceso
    modificarRestaurante(req.params.restauranteId, req.body)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));

})


router.delete('/:restauranteId', (req, res) => { // agregar codigo de acceso
    eliminarRestaurante(req.params.restauranteId)
        .then(result => res.json(result))
        .catch(error => res.json({ error: error.message }));
})


module.exports = router