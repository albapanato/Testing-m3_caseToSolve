import {
  getPublicInfo,
  newBusinesses,
  updateInfoFromBussiness,
} from "../../../src/models/model.restaurantes";

global.db = {
  query: jest.fn(),
};

describe("Testing model.restaurantes.js", () => {
  describe("getPublicInfo", () => {
    const restaurantsList = {
      nombre: "Patatin Patatan",
      direccion: "Calle Mayor 3",
      tipo_comida: "Comida casera",
    };
    it("should return all the info from the restaurants", async () => {
      global.db.query.mockImplementation((query, callback) => {
        callback(null, restaurantsList);
      });
      const result = await getPublicInfo();
      expect(result).toEqual(restaurantsList);
    });
    it("should throw an error when the query failed", async () => {
      const mockError = new Error("Database query failed");
      global.db.query.mockImplementation((query, callback) => {
        callback(mockError, null);
      });
      await expect(getPublicInfo()).rejects.toThrow("Database query failed");
      expect(global.db.query).toHaveBeenCalled();
    });
  });
  describe("newBusinesses", () => {
    const newRestaurant = {
      id_usuario: 1,
      nombre: "La mar de buena",
      direccion: "Av Lungomare 234, Valencia ",
      tipo_comida: "Marisqueria",
    };
    it("should create a new restaurant", async () => {
      //Arrange
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, newRestaurant);
      });
      //Act
      const result = await newBusinesses(newRestaurant);
      //Assert
      expect(result).toEqual(newRestaurant);
      expect(global.db.query).toHaveBeenCalledWith(
        "INSERT INTO restaurantes (id_usuario, nombre, direccion, tipo_comida) values (?, ?, ?, ?);",
        [
          newRestaurant.id_usuario,
          newRestaurant.nombre,
          newRestaurant.direccion,
          newRestaurant.tipo_comida,
        ],
        expect.any(Function)
      );
    });
    it("should throw an error when the query fails", async () => {
      //Arrange
      const mockError = new Error("Database inser failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      //Act
      await expect(newBusinesses(newRestaurant)).rejects.toThrow(
        "Database inser failed"
      );
      //Assert
      expect(global.db.query).toHaveBeenCalledWith(
        "INSERT INTO restaurantes (id_usuario, nombre, direccion, tipo_comida) values (?, ?, ?, ?);",
        [
          newRestaurant.id_usuario,
          newRestaurant.nombre,
          newRestaurant.direccion,
          newRestaurant.tipo_comida,
        ],
        expect.any(Function)
      );
    });
  });
  describe("updatedInfoFromBussiness", () => {
    const restaurantBeforeUpdated = {
      id_usuario: 1,
      nombre: "La mar de buena",
      direccion: "Av Lungomare 234, Valencia ",
      tipo_comida: "Marisqueria",
    };
    const restaurantToBeUpdated = {
      id_usuario: 1,
      nombre: "La mar de buena",
      direccion: "Av Lungomare 123, Valencia ",
      tipo_comida: "Marisqueria y Arroceria",
    };
    it("should updated an existing user", async () => {
      //Arrange
      global.db.query.mockImplementation((query, values, callback) => {
        callback(null, restaurantToBeUpdated);
      });
      //Act
      await updateInfoFromBussiness(
        restaurantBeforeUpdated.id_usuario,
        restaurantToBeUpdated
      );
      //Assert
      expect(global.db.query).toHaveBeenCalledWith(
        "UPDATE restaurantes SET nombre = ? , direccion = ? , tipo_comida= ? WHERE id_usuario = ?",
        [
          restaurantToBeUpdated.nombre,
          restaurantToBeUpdated.direccion,
          restaurantToBeUpdated.tipo_comida,
          restaurantBeforeUpdated.id_usuario,
        ],
        expect.any(Function)
      );
    });
    it("should throw an error when the query fails", async () => {
      //Arrange
      const mockError = new Error("Database updated failed");
      global.db.query.mockImplementation((query, values, callback) => {
        callback(mockError, null);
      });
      //Act & Assert
      await expect(
        updateInfoFromBussiness(
          restaurantBeforeUpdated.id_usuario,
          restaurantToBeUpdated
        )
      ).rejects.toThrow("Database updated failed");
      //Assert
      expect(global.db.query).toHaveBeenCalledWith(
        "UPDATE restaurantes SET nombre = ? , direccion = ? , tipo_comida= ? WHERE id_usuario = ?",
        [
          restaurantToBeUpdated.nombre,
          restaurantToBeUpdated.direccion,
          restaurantToBeUpdated.tipo_comida,
          restaurantBeforeUpdated.id_usuario,
        ],
        expect.any(Function)
      );
    });
  });

  //Por terminar model.restaurantes.js
  describe("findRestaurant", () => {
    const restaurantList = [
      {
        id_usuario: 1,
        nombre: "La mar de buena",
        direccion: "Av Lungomare 123, Valencia ",
        tipo_comida: "Marisqueria y Arroceria",
      },
      {
        id_usuario: 2,
        nombre: "Patatin Patatan",
        direccion: "Calle Mayor 3",
        tipo_comida: "Comida casera",
      },
      {
        id_usuario: 1,
        nombre: "El asador de la abuela",
        direccion: "Av Lungomare 156, Valencia ",
        tipo_comida: "Comida Argentina",
      },
    ];
    it("should ");
  });
});
