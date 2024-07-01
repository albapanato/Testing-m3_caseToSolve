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

exports.registroUsuario = ({ nombre, email, password }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO usuarios (nombre, email, password) values (?, ?, ?);',
            [nombre, email, password],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        )
    });
};

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

// DEFINIR QUE COJONES HACE ESTO

exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT username,email,name FROM usuarios WHERE id = ?',
            [id],
            (err, rows) => {
                if (err) return reject(err);
                if (rows.length !== 1) return resolve(null);
                resolve(rows[0]);
            }
        )
    });
}