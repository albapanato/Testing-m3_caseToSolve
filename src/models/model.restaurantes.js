
// VISUALIZAR LISTADO RESTAURANTES
exports.infoRestaurantes = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM restaurantes', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            })
    });
};

// AGREGAR UN NUEVO RESTAURANTE

exports.registroRestaurante = ({ id_usuario, nombre, direccion }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO restaurantes (id_usuario, nombre, direccion) values (?, ?, ?);',
            [id_usuario, nombre, direccion],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};

// MODIFICA LOS DATOS DEL RESTAURANTE
// NECESARIO UN TOKEN PARA PODER HACER ESTO -- POR HACER
exports.modificarRestaurante = (restauranteId, { nombre, direccion }) => {
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

// ELIMINA LOS DATOS DEL RESTAURANTE
// NECESARIO UN TOKEN PARA HACER ESTO -- POR HACER
exports.eliminarRestaurante = (restauranteId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'DELETE FROM restaurantes WHERE id = ?',
            [restauranteId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )

    })

}