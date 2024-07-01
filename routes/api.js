const express = require('express');
const router = express.Router();

const usuarioRouter = require('./api/usuarios');
router.use('/usuarios', usuarioRouter);

const routerRestaurante = require('./api/restaurantes');
router.use('/restaurantes', routerRestaurante);


module.exports = router;