// VISUALIZAR LISTADO USUARIOS
exports.infoUsuarios = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM usuarios', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
    });
};

// AGREGAR UN NUEVO USUARIO
exports.registroUsuario = ({ nombre, email, password, acceso }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios (nombre, email, password, acceso) values (?, ?, ?, ?);',
            [nombre, email, password, acceso],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};

// MODIFICAR USUARIO
exports.modificarUsuario = (restauranteId, { nombre, direccion }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE restaurantes SET nombre = ? , direccion = ? WHERE id = ?',
            [nombre, direccion, restauranteId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )

    })

}

//ELIMINAR USUARIO
exports.eliminarUsuario = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )

    })

}


exports.emailUsuario = (email) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length !== 1) return resolve(null);
                resolve(rows[0]);
            }
        )
    });
}
exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM usuarios WHERE id = ?',
            [id],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        )
    });
}


// exports.getAccess = (acceso) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             'SELECT acceso FROM usuarios',
//             [acceso],
//             (err, rows) => {
//                 if (err) return reject(err);
//                 resolve(rows);
//             }
//         )
//     })
// }
