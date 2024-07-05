const express = require('express');
const router = express.Router();

const { log } = require('./middleware');

const usuarioRouter = require('./api/usuarios');
router.use('/usuarios', log, usuarioRouter);

const routerRestaurante = require('./api/restaurantes');
router.use('/restaurantes', log, routerRestaurante);

// const privadaRouter = require('./api/privadaAdministrador/administrador');
// router.use('/administrador', checkToken, log, privadaRouter);

// const propietarioRouter = require('./api/privadaRestaurantes/propietarioRestaurante');
// router.use('/propietarios', log, propietarioRouter);


module.exports = router;