const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

const { getById } = require('../models/model.usuarios');

const checkToken = async (req, res, next) => {
    // mira que exista una autorizacion
    if (!req.headers['autorizacion']) {
        return res.status(403).json({ error: 'Necesitas un codigo de autorizacion, que te sera proporcionado al inicializar sesion' })
    }
    //Valida el token
    const token = req.headers['autorizacion'];
    let payload;
    try {
        payload = jwt.verify(token, 'CODIGO DE AUTORIZACION');
    } catch (error) {
        return res.status(403).json({
            error: 'CODIGO INCORRECTO',
            msg: error.message
        })
    }
    console.log(payload);
    // se asegura de que caduque
    if (payload.expiredAt < dayjs().unix()) {
        return res.status(403).json({ error: 'TU CODIGO HA CADUCADO, VUELVE A INICIALIZAR SESION' });
    }

    const usuario = await getById(payload.userId);
    req.user = usuario; // agrega el usuario a la ruta

    next();
}

module.exports = { checkToken };