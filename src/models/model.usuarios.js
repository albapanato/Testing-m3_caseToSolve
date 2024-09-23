// VISUALIZAR LISTADO USUARIOS
exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM usuarios", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// AGREGAR UN NUEVO USUARIO
exports.newUser = ({ nombre, email, password, rol }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO usuarios (nombre, email, password,rol) values (?, ?, ?,?);",
      [nombre, email, password, rol],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// MODIFICAR USUARIO
exports.updateUser = (id, { nombre, email, password }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE usuarios SET nombre= ?, email= ?, password = ?  WHERE id = ?",
      [nombre, email, password, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

//ELIMINAR USUARIO
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

exports.getByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, rows) => {
      if (err) return reject(err);
      if (rows.length !== 1) return resolve(null);
      resolve(rows[0]);
    });
  });
};

exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM usuarios WHERE id = ?", [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};
