const express = require('express');
const router = express.Router();

const { checkToken, log } = require('./middleware');

const privadaRouter = require('./api/privada/administrador');
router.use('/admin', checkToken, log, privadaRouter);

const usuarioRouter = require('./api/usuarios');
router.use('/usuarios', log, usuarioRouter);

const routerRestaurante = require('./api/restaurantes');
router.use('/restaurantes', checkToken, log, routerRestaurante);


module.exports = router;