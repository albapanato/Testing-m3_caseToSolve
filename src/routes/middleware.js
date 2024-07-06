var express = require('express');

const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const fs = require('fs');

const { getById } = require('../models/model.usuarios');
const { findRestaurant } = require('../models/model.restaurantes')


const log = (req, res, next) => {
    console.log('Datos almacenados en el fichero (./logs/registroPeticiones.log) ');
    // Interceptar el método res.send
    const originalSend = res.send;
    res.send = function (body) {
        res.body = body;
        originalSend.apply(res, arguments);
    };
    res.on('finish', () => {
        const logText = `${dayjs().format()} | ${req.body.email || 'N/A'} | ${req.method} | ${req.url} | ${res.statusCode} | ${res.statusMessage}\n`;
        fs.appendFileSync('./logs/registroPeticiones.log', logText);
    });
    res.on('error', (err) => {
        const errorText = `${dayjs().format()} | ${req.body.email || 'N/A'} | ${req.method} | ${req.url} | ${res.statusCode} | ${err.message}\n`;
        fs.appendFileSync('./logs/registroErrores.log', errorText);
    });
    next();

}

const checkToken = async (req, res, next) => {
    // mira que exista una autorizacion
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Necesitas un codigo de autorizacion o tener acceso a este portal' })
    }
    const token = req.headers['authorization']; //---- Valida el token
    let payload;
    try {
        payload = jwt.verify(token, 'CODIGO DE AUTORIZACION'); //---- convierte el token en un diccionario
        req.user = payload; // ---- Adjunta la información del token decodificado a `req.user`
        // console.log('playload:', payload);
        // console.log('Valor de acceso en el middleware:', req.user.userAccess);
        if (payload.expiredAt < dayjs().unix() || !req.user.userAccess) { // ---- se asegura de que caduque y de que si no tiene acceso
            if (payload.expiredAt < dayjs().unix()) {
                return res.status(403).json({ error: 'TU CODIGO HA CADUCADO, VUELVE A INICIALIZAR SESION' });
            } else {
                return res.status(403).json({ error: 'NO TIENES ACCESO' });
            }
        }
        const usuario = await getById(payload.userId); // 
        req.user = usuario; // ---- almacenamos la informacion en 'usuario'
        // console.log('usuario', usuario);
        // console.log('usuario-id', usuario.userId);
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'CODIGO INCORRECTO',
            msg: error.message
        })
    }
}

const verifyIsAdmin = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Necesitas un codigo de autorizacion para proceder con la solicitud' })
    }
    const token = req.headers['authorization'];
    let infoUser;
    try {
        infoUser = jwt.verify(token, 'CODIGO DE AUTORIZACION');
        req.user = infoUser;
        if (infoUser.userRol === 'user' || !infoUser.userRol) {
            const mensaje = res.status(403).json({ error: 'No tienes acceso para borrar ningun tipo de informacion' });
            res.send(mensaje)
        }
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'SE HA PRODUCIDO UN ERROR CON EL MIDDLEWARE',
            msg: error.message
        })
    }
}

const getUserRestaurantById = async (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(403).json({ error: 'Necesitas un codigo de autorizacion o tener acceso a este portal' })
    }
    console.log('PASA POR AQUI??')
    const token = req.headers['authorization'];
    let payload;
    try {
        payload = jwt.verify(token, 'CODIGO DE AUTORIZACION');
        req.user = payload;
        // console.log('playload:', payload);
        // console.log('ESTAS EN MIDDLEWARE: Valor de del id del token :', req.user.userId);
        // se asegura de que caduque y de que si no tiene acceso
        if (payload.expiredAt < dayjs().unix() || !req.user.userId === req.user.userId) {
            if (payload.expiredAt < dayjs().unix()) {
                return res.status(403).json({ error: 'TU CODIGO HA CADUCADO, VUELVE A INICIALIZAR SESION' });
            } else {
                return res.status(403).json({ error: 'NO TIENES ACCESO a modificar los datos de este restaurante' });
            }
        }
        const restaurante = await findRestaurant(req.user.userId); // 4
        res.user = restaurante; // agrega el usuario 
        console.log('valor propietario: ', restaurante);
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'CODIGO INCORRECTO',
            msg: error.message
        })
    }
}



module.exports = {
    log,
    checkToken,
    verifyIsAdmin,
    getUserRestaurantById
};


// POR REVISAR SI DA TIEMPO

// const verifyIdComment = async (req, res, next) => {
//     if (!req.headers['authorization']) {
//         return res.status(403).json({ error: 'Necesitas un codigo de autorizacion o tener acceso a este portal' })
//     }
//     const token = req.headers['authorization'];
//     let payload;
//     try {
//         payload = jwt.verify(token, 'CODIGO DE AUTORIZACION');
//         req.user = payload;
//         if (payload.expiredAt < dayjs().unix()) {
//             return res.status(403).json({ error: 'TU CODIGO HA CADUCADO, VUELVE A INICIALIZAR SESION' });
//         }
//         const messageModify = await modifyOpinion(req.user.id)
//         res.user = messageModify;
//         next();
//     } catch (error) {
//         return res.status(403).json({
//             error: 'CODIGO INCORRECTO',
//             msg: error.message
//         })
//     }

// }


// const verifyIdComment = async (req, res, next) => {
//     try {
//         if (!req.headers['authorization']) {
//             return res.status(403).json({ error: 'Necesitas un código de autorización para acceder a este recurso' });
//         }

//         const token = req.headers['authorization'];
//         const payload = jwt.verify(token, 'SECRET_KEY'); // Verifica y decodifica el token

//         // Verifica la validez del token
//         if (payload.expiredAt < dayjs().unix()) {
//             return res.status(403).json({ error: 'El token ha caducado, por favor inicia sesión nuevamente' });
//         }

//         // Asigna el id del comentario desde el token al objeto req
//         req.user = { comentId: payload.comentId };

//         // Continúa con la ejecución del siguiente middleware o controlador
//         next();
//     } catch (error) {
//         return res.status(403).json({ error: 'Token inválido', msg: error.message });
//     }
// };