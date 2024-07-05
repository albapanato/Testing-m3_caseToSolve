// GET /restaurantes 
exports.getPublicInfo = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT id, nombre, direccion, tipo_comida FROM restaurantes', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        )
    });

};
// POST /restaurantes
exports.newBusinesses = ({ id_usuario, nombre, direccion, tipo_comida }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO restaurantes (id_usuario, nombre, direccion, tipo_comida) values (?, ?, ?, ?);',
            [id_usuario, nombre, direccion, tipo_comida],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};
// PUT /restautantes
exports.updateInfoFromUser = (id_usuario, { nombre, direccion, tipo_comida }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE restaurantes SET nombre = ? , direccion = ? , tipo_comida= ? WHERE id_usuario = ?',
            [nombre, direccion, tipo_comida, id_usuario],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};
//middleware: getUserRestaurantById
exports.findRestaurant = (id_usuario) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM restaurantes WHERE id_usuario = ?',
            [id_usuario],
            (err, result) => {
                if (err) return reject(err);
                resolve(result[0])
            }
        )
    });
};

// restaurantes/id
exports.deleteBusinesses = (restauranteId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM restaurantes WHERE id = ?',
            [restauranteId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};

// /restaurantes/admin
exports.getAllBusinesses = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM restaurantes', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
    });
};

//------------------------------POR REVISAR Y POR TERMINAR


// exports.newOpinion = (nombre, id_restaurante, restaurante, puntuacion, comentario) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             `INSERT INTO valoraciones (nombre, id_restaurante, restaurante, puntuacion, comentario, fecha_creacion, fecha_creacion_formateada)
//             VALUES (?, ?, ?, ?, ?, NOW(), DATE_FORMAT(NOW(), '%d-%m-%Y %H:%i:%s'))`
//             [nombre, id_restaurante, restaurante, puntuacion, comentario],
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//             }
//         )
//     })
// }

// exports.modifyOpinion = () => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             `UPDATE valoraciones SET nombre = ?, restaurante = ?, puntuacion = ?, comentario = ?,
//             fecha_creacion_formateada = DATE_FORMAT(fecha_creacion, '%d-%m-%Y %H:%i:%s')
//             WHERE id = ?`,
//             [nombre, restaurante, puntuacion, comentario, id_valoracion],
//             (err, rows) => {
//                 if (err) return reject(err);
//                 resolve(rows);

//             })
//     })

// }

// exports.findOpinionRestaurant = (id) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             'SELECT * FROM valoraciones WHERE id_restaurante = ?',
//             [id_restaurante],
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result[0])
//             }
//         )
//     });
// };