var express = require("express");
var router = express.Router();

const dayjs = require("dayjs"); // Necesario instalar : npm install dayjs jsonwebtoken
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { checkToken, verifyIsAdmin } = require("../middleware");
const { body, validationResult } = require("express-validator");
const {
  getAll,
  newUser,
  updateUser,
  deleteUser,
  getByEmail,
} = require("../../models/model.usuarios");

//CREAMOS EL TOKEN CON PARAMETROS ID, ACCESO y ROL -- FUNCIONA
function createToken(user) {
  const payload = {
    userId: user.id,
    userAccess: Boolean(user.acceso),
    userRol: user.rol,
    expiredAt: dayjs().add(60, "minutes").unix(), // tiempo de caducidad del token
    createdAt: dayjs().unix(),
  };
  console.log(payload);
  return jwt.sign(payload, "CODIGO DE AUTORIZACION");
}

// http://localhost:3333/api/usuarios/login -- FUNCIONA

router.post("/login", async (req, res) => {
  // Recuperamos el usuario de la base de datos
  const user = await getByEmail(req.body.email);
  if (user) {
    // Comprobamos la password de la base de datos con la que ha enviado el usuario en el body
    const iguales = bcrypt.compareSync(req.body.password, user.password);
    if (iguales) {
      console.log("Iniciando sesion...", new Date().toString());
      res.json({
        Acceso_permitido: `Bienvenid@ ${user.nombre} , tu numero de ID es ${user.id}, se te proporcionara cada vez que hagas login`,
        // Devuelve un token cuando hacemos login:
        Codigo_de_acceso: createToken(user),
      });
    } else {
      console.log("No se ha podido iniciar sesion", new Date().toString());
      // Si la password no coincide devolvemos error
      res.json({ error: "Error en usuario y/o password" });
    }
  } else {
    console.log("No se ha podido iniciar sesion", new Date().toString());
    // Si el usuario no existe en la BD devolvemos un error
    res.json({ error: "Error en usuario y/o password" });
  }
});

// http://localhost:3333/api/usuarios -- FUNCIONA
router.post(
  "/",
  body("nombre", "Es requerido una longitud mínima de 2 caracteres")
    .exists()
    .isLength({ min: 2 }),
  body("email", "El email debe tener un formato de email").isEmail(),
  body("password", "Es requerido una longitud mínima de 6 caracteres")
    .exists()
    .isLength({ min: 6 }),
  async (req, res) => {
    // Si llegamos hasta aqui es porque el usuario tiene accesso, procedemos a gestionar la parte de validacion, si no hay errores...
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Procederemos a encriptar la contraña y a registrar los datos en la tabla de usuarios.

    // console.log('Valor de acceso en privada/usuarios.js:', req.user.userAccess);
    req.body.password = bcrypt.hashSync(req.body.password, 10); // encripta el password
    const result = await newUser(req.body);
    res.json(result);

    console.log("El usuario se a agregado correctamente"); // :)
  }
);

// http://localhost:3333/api/usuarios -- EXTRA

router.put(
  "/",
  checkToken,
  body("nombre", "Es requerido una longitud mínima de 2 caracteres")
    .exists()
    .isLength({ min: 2 }),
  body("email", "El email debe tener un formato de email").isEmail(),
  body("password", "Es requerido una longitud mínima de 6 caracteres")
    .exists()
    .isLength({ min: 6 }),
  (req, res) => {
    //ALMACENAMOS EL RESULTADO
    const datosDelToken = {
      id: req.user.id,
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
    };
    // console.log(datosDelToken)
    // console.log('body:', req.body)
    // console.log('id:', req.user.id)
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    updateUser(req.user.id, req.body)
      .then((result) => res.json(result))
      .catch((error) => res.json({ error: error.message }));
  }
);

//POR REVISAR O POR BORRAR

// http://localhost:3333/api/usuarios/admin/id -- EXTRA

router.delete("/delete/:usuarioId", verifyIsAdmin, (req, res) => {
  // Usando promesas
  deleteUser(req.params.usuarioId)
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: error.message }));
});

// http://localhost:3333/api/usuarios/admin -- EXTRA --
router.get("/admin", verifyIsAdmin, (req, res, next) => {
  getAll()
    .then((listaUsuarios) => res.json(listaUsuarios))
    .catch((error) => {
      console.error(error);
      next(error);
    });
});

module.exports = { createToken };
module.exports = router;
