const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const fs = require('fs');
const { getById } = require('../models/model.usuarios');


const checkToken = async (req, res, next) => {
    // mira que exista una autorizacion
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Necesitas un codigo de autorizacion' })
    }
    //Valida el token
    const token = req.headers['authorization'];
    let payload;
    try {
        payload = jwt.verify(token, 'CODIGO DE AUTORIZACION'); // convierte el token en un diccionario
        req.user = payload; // Adjunta la información del token decodificado a `req.user`

        console.log('playload:', payload);
        console.log('Valor de acceso en el middleware:', req.user.userAccess);

        console.log('middleware')

        // se asegura de que caduque
        if (payload.expiredAt < dayjs().unix() || !req.user.userAccess) {
            if (payload.expiredAt < dayjs().unix()) {
                return res.status(403).json({ error: 'TU CODIGO HA CADUCADO, VUELVE A INICIALIZAR SESION' });

            } else {
                return res.status(403).json({ error: 'NO TIENES ACCESO' });
            }
        }

        const usuario = await getById(payload.userId);
        req.user = usuario; // agrega el usuario a la ruta

        next();

    } catch (error) {
        return res.status(403).json({
            error: 'CODIGO INCORRECTO',
            msg: error.message
        })
    }

}

// Agrega las peticiones a un fichero txt
const log = (req, res, next) => {
    console.log('Peticion registrada en el fichero');
    const text = '\n ' + dayjs().unix().toString() + ' | ' + req.body.email + ' | ' + req.method + ' | ' + req.url + ' | ' + res.statusCode + ' | ' + (res.error ? res.error.message : 'No error') + '\n';
    fs.appendFileSync('./logs/registroPeticiones.log', text);
    next();

}

module.exports = { checkToken, log };