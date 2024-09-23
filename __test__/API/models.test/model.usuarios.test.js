//SUITES TEST

const {
  getAll,
  newUser,
  updateUser,
  deleteUser,
  getByEmail,
  getById,
} = require("../../../src/models/model.usuarios.js");

global.db = {
  query: jest.fn(), // Mockea específicamente el método query
};

describe("Testing model.usuarios.js", () => {
  describe("getAll", () => {
    it("should return a list of users when the query is successful", async () => {
      const mockUsuarios = [
        {
          id: 1,
          name: "Alejandro",
          email: "alejandro@gmail.com",
        },
        {
          id: 2,
          name: "Alba",
          email: "alba@gmail.com",
        },
      ];
      global.db.query.mockImplementation((query, callback) => {
        callback(null, mockUsuarios);
      });
      const result = await getAll();
      expect(result).toEqual(mockUsuarios);
    });

    it("should throw an error when the query fails", async () => {
      const mockError = new Error("Database query failed");
      // Simula que db.query llama al callback con un error
      global.db.query.mockImplementation((query, callback) => {
        callback(mockError, null);
      });
      await expect(getAll()).rejects.toThrow("Database query failed");
      expect(global.db.query).toHaveBeenCalled();
    });
  });

  describe("newUser", () => {
    const newUsuario = {
      nombre: "Pepe Martinez",
      email: "pepe@gmail.com",
      password: "PepeMartinez",
      rol: "user",
    };
    it("should create a new user", async () => {
      const mockResult = { insertId: 1 };
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, mockResult);
      });
      const result = await newUser(newUsuario);
      expect(result).toEqual(mockResult);
      expect(global.db.query).toHaveBeenCalledWith(
        "INSERT INTO usuarios (nombre, email, password,rol) values (?, ?, ?,?);",
        [
          newUsuario.nombre,
          newUsuario.email,
          newUsuario.password,
          newUsuario.rol,
        ],
        expect.any(Function)
      );
    });
    it("should throw an error when the query fails", async () => {
      const mockError = new Error("Database inser failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      await expect(newUser(newUsuario)).rejects.toThrow(
        "Database inser failed"
      );
      expect(global.db.query).toHaveBeenCalledWith(
        "INSERT INTO usuarios (nombre, email, password,rol) values (?, ?, ?,?);",
        [
          newUsuario.nombre,
          newUsuario.email,
          newUsuario.password,
          newUsuario.rol,
        ],
        expect.any(Function)
      );
    });
  });
  describe("updatedUser", () => {
    const userBeforeUpdated = {
      id: 3,
      nombre: "Pepe Martinez",
      email: "pepe@gmail.com",
      password: "PepeMartinez",
    };
    const usertoBeUpdated = {
      id: 4,
      nombre: "Jose Martinez",
      email: "pepe@gmail.com",
      password: "JoseMartinez",
    };
    it("should updated an existing user", async () => {
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, usertoBeUpdated);
      });
      await updateUser(userBeforeUpdated.id, usertoBeUpdated);
      expect(global.db.query).toHaveBeenCalledWith(
        "UPDATE usuarios SET nombre= ?, email= ?, password = ?  WHERE id = ?",
        [
          usertoBeUpdated.nombre,
          usertoBeUpdated.email,
          usertoBeUpdated.password,
          userBeforeUpdated.id,
        ],
        expect.any(Function)
      );
    });
    it("should throw an error when the query fails", async () => {
      //Act
      const mockError = new Error("Database updated failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      //Act & Assert
      await expect(
        updateUser(userBeforeUpdated.id, usertoBeUpdated)
      ).rejects.toThrow("Database updated failed");
      //Assert
      expect(global.db.query).toHaveBeenCalledWith(
        "UPDATE usuarios SET nombre= ?, email= ?, password = ?  WHERE id = ?",
        [
          usertoBeUpdated.nombre,
          usertoBeUpdated.email,
          usertoBeUpdated.password,
          userBeforeUpdated.id,
        ],
        expect.any(Function)
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      //Arrange
      const mockResult = { affectedRows: 1 };
      const userId = 4;
      global.db.query = jest.fn((query, values, callback) => {
        callback(null, mockResult);
      });
      //Act
      const result = await deleteUser(userId);

      //Assert
      expect(result).toEqual(mockResult);
      expect(global.db.query).toHaveBeenCalledWith(
        "DELETE FROM usuarios WHERE id = ?",
        [userId],
        expect.any(Function)
      );
    });

    it("should reject with an error when the query fails", async () => {
      //Arrange
      const mockError = new Error("Database deletion failed");
      const userId = 1;
      global.db.query = jest.fn((query, values, callback) => {
        callback(mockError, null); // Simulando un error en la eliminación
      });
      // Act (Acción)
      const promise = deleteUser(userId); // Ejecutar la función que estamos testeando
      // Assert
      await expect(promise).rejects.toThrow("Database deletion failed");
      expect(global.db.query).toHaveBeenCalledWith(
        "DELETE FROM usuarios WHERE id = ?",
        [userId],
        expect.any(Function)
      );
    });
  });
  describe("getByEmail", () => {
    const email = "pepe@gmail.com";
    it("should return a user when the email exists", async () => {
      const mockUser = {
        id: 1,
        nombre: "Pepe Martinez",
        email: "pepe@gmail.com",
        password: "PepeMartinez",
        rol: "user",
      };
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, [mockUser]);
      });
      const result = await getByEmail(email);
      expect(result).toEqual(mockUser);
      expect(global.db.query).toHaveBeenCalledWith(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        expect.any(Function)
      );
    });

    it("should return null when no user is found with the given email", async () => {
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });
      const result = await getByEmail(email);
      expect(result).toBeNull();
      expect(global.db.query).toHaveBeenCalledWith(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        expect.any(Function)
      );
    });

    it("should throw an error when the query fails", async () => {
      const mockError = new Error("Database query failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      await expect(getByEmail(email)).rejects.toThrow("Database query failed");
    });
  });

  describe("getById", () => {
    const id = 1;
    it("should return a user when the id exists", async () => {
      const mockUser = {
        id: 1,
        nombre: "Pepe Martinez",
        email: "pepe@gmail.com",
        password: "PepeMartinez",
        rol: "user",
      };
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, [mockUser]);
      });

      const result = await getById(id);
      expect(result).toEqual(mockUser);
      expect(global.db.query).toHaveBeenCalledWith(
        "SELECT * FROM usuarios WHERE id = ?",
        [id],
        expect.any(Function)
      );
    });

    it("should throw an error when the query fails", async () => {
      const mockError = new Error("Database query failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      await expect(getById(id)).rejects.toThrow("Database query failed");
    });
  });
});
