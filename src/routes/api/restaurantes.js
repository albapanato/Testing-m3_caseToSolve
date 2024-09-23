const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  checkToken,
  getUserRestaurantById,
  verifyIsAdmin,
  verifyIdComment,
} = require("../middleware");
const { body } = require("express-validator");
const {
  updateInfoFromBussiness,
  getPublicInfo,
  newBusinesses,
  getAllBusinesses,
  deleteBusinesses,
  newOpinion,
  modifyOpinion,
  commets,
} = require("../../models/model.restaurantes");
const dayjs = require("dayjs");
// http://localhost:3333/api/restaurantes (Publica)
router.get("/", (req, res) => {
  getPublicInfo()
    .then((restaurantes) => res.json(restaurantes))
    .catch((error) => res.json({ error: error.message }));
});

// http://localhost:3333/api/restaurantes/nuevo (Privada)
router.post(
  "/nuevo",
  checkToken,
  body("nombre", "Es requerido una longitud mínima de 2 caracteres")
    .exists()
    .isLength({ min: 2 }),
  body("direccion", "La direccion debe de contener más caracteres")
    .exists()
    .isLength({ min: 5 }),
  body("tipo_comida", "Introduce que tipo de comida tiene el restaurante")
    .exists()
    .isLength({ min: 5 }),
  (req, res) => {
    // agregar token
    const restaurante = {
      id_usuario: req.user.id,
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      tipo_comida: req.body.tipo_comida,
    };
    console.log(restaurante);
    newBusinesses(restaurante)
      .then((result) => res.json(result))
      .catch((error) => res.json({ error: error.message }));
  }
);

// http://localhost:3333/api/restaurantes (Privada)
router.put(
  "/",
  getUserRestaurantById,
  body("nombre", "Es requerido una longitud mínima de 2 caracteres")
    .exists()
    .isLength({ min: 2 }),
  body("direccion", "La direccion debe de contener más caracteres")
    .exists()
    .isLength({ min: 5 }),
  body("tipo_comida", "Introduce que tipo de comida tiene el restaurante")
    .exists()
    .isLength({ min: 5 }),
  (req, res) => {
    const restaurante = {
      id_usuario: req.user.userId,
      nombre: req.body.nombre,
      direccion: req.body.direccion,
      tipo_comida: req.body.tipo_comida,
    };
    // console.log('valor restaurante: ', restaurante.id_usuario)
    // console.log('valor restaurante: ', restaurante.nombre)
    // console.log('valor restaurante: ', restaurante.direccion)
    // console.log('valor restaurante: ', restaurante.tipo_comida)
    // console.log('valor restaurante.body', req.body)
    updateInfoFromBussiness(restaurante.id_usuario, req.body)
      .then((result) => res.json(result))
      .catch((error) => res.json({ error: error.message }));
  }
);

// http://localhost:3333/api/restaurantes/1 (Protegida)
router.delete("/:restauranteId", verifyIsAdmin, (req, res) => {
  deleteBusinesses(req.params.restauranteId)
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: error.message }));
});

// http://localhost:3333/api/restaurantes/admin -- EXTRA (Protegida)
router.get("/admin", verifyIsAdmin, (req, res) => {
  getAllBusinesses()
    .then((restaurantes) => res.json(restaurantes))
    .catch((error) => res.json({ error: error.message }));
});

// ----------------TABLA DE COMENTARIOS CON RELACION DE ID RESTAURANTES

// http://localhost:3333/api/restaurantes/comentarios
router.get("/comentarios", (req, res) => {
  commets()
    .then((allComments) => res.json(allComments))
    .catch((error) => res.json({ error: error.message }));
});

function createReference(comentId) {
  const number = {
    comentId: comentId,
    expiredAt: dayjs().add(60, "minutes").unix(),
    createdAt: dayjs().unix(),
  };
  console.log("id comentario: ", comentId);
  return jwt.sign(number, "Numero de referencia del comentario");
}

// http://localhost:3333/api/restaurantes/comentario -- Tabla de valoraciones
router.post("/comentario", async (req, res) => {
  try {
    const newComment = await newOpinion(
      req.body.nombre,
      req.body.id_restaurante,
      req.body.restaurante,
      req.body.puntuacion,
      req.body.comentario
    );
    console.log(req.body);
    if (newComment) {
      console.log("pasa por aqui");
      res.json({
        Tu_comentario_se_ha_guardado_correctamente:
          "Guarda el siguiente número de referencia por si deseas editar tu comentario",
        Numero_de_referencia: createReference(newComment.insertId), // Aquí usamos insertId si estás usando MySQL.
      });
      console.log("pasa por aqui");
    } else {
      console.log("Tu opinion no se ha guardado");
      res.status(500).json({ error: "Tu opinion no se ha guardado" });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: error.message });
  }
});

///----------------------------------------

//----- POR REVISAR SI DA TIEMPO

// router.put('/comentario', verifyIdComment, async (req, res) => {
//     try {
//         const { id, nombre, id_restaurante, restaurante, puntuacion, comentario } = req.body;

//         const result = await modifyOpinion(id);

//         res.json({
//             message: '¡Comentario actualizado correctamente!',
//             updatedComment: result
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// router.put('/comentario', verifyIdComment,
//     (req, res) => {
//         const updatedComment = {
//             nombre: req.body.nombre,
//             id_restaurante: req.body.id_restaurante,
//             restaurante: req.body.restaurante,
//             comentario: req.body.comentario
//         }
//         // console.log('valor restaurante: ', restaurante.id_usuario)
//         // console.log('valor restaurante: ', restaurante.nombre)
//         // console.log('valor restaurante: ', restaurante.direccion)
//         // console.log('valor restaurante: ', restaurante.tipo_comida)
//         // console.log('valor restaurante.body', req.body)
//         console.log(updatedComment.id)
//         modifyOpinion(updatedComment.id)
//             .then(result => res.json(result))
//             .catch(error => res.json({ error: error.message }));
//     }
// )

module.exports = router;
