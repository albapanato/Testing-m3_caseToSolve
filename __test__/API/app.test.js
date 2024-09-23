//TEST DE INTEGRACION
const request = require("supertest");
const app = require("../../app.js");

const jwt = require("jsonwebtoken");
const token = jwt.sign(
  { userId: 1, userRol: "admin" },
  "CODIGO DE AUTORIZACION"
);

describe("SUITE TEST", () => {
  describe("/api", () => {
    it("It should return an status -- 200 SUCCESFULL -- METHOD: GET /api/restaurantes", async () => {
      const response = await request(app).get("/api/restaurantes");
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveLength(0);
    });
    it("It should return an status -- 200 SUSCCESFULL -- METHOD: GET /api/usuarios/admin", async () => {
      const response = await request(app)
        .get("/api/usuarios/admin")
        .set("Authorization", token);
      expect(response.statusCode).toBe(200);
    });
    it("It should return an status -- 403 FORBIDDEN -- METHOD: GET /api/usuarios/admin", async () => {
      const response = await request(app).get("/api/usuarios/admin");
      expect(response.statusCode).toBe(403);
    });
    it("It should return an status -- 404 not found -- METHOD: GET /api/usuarios/admin/384hrhudi", async () => {
      const response = await request(app).get("/api/usuarios/admin/384hrhudi");
      expect(response.statusCode).toBe(404);
    });
  });
});
