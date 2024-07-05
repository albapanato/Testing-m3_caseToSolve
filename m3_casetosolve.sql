-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: m3_casetosolve
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `restaurantes`
--

DROP TABLE IF EXISTS `restaurantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `nombre` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `tipo_comida` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `restaurantes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurantes`
--

LOCK TABLES `restaurantes` WRITE;
/*!40000 ALTER TABLE `restaurantes` DISABLE KEYS */;
INSERT INTO `restaurantes` VALUES (4,5,'Rincon del comer','Calle Guadalest 43, Almeria','Casera'),(6,6,'La braseria de Rita','Calle Ramon Y Cajal 8, Granada','Casera'),(7,7,'Patatin Patatan','Av Gran Via 38, Alicante','Comida para llevar'),(8,10,'La mar de buena','Av Lungomare 234, Valencia ','Marisqueria');
/*!40000 ALTER TABLE `restaurantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `acceso` tinyint(1) NOT NULL DEFAULT '1',
  `rol` enum('admin','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Rafa Gamero','rafa.gamero@gmail.com','$2a$10$fTRNa2.0YY5HFS/ckmcfEu0BIF205b30cnMswo2PN7QyGzP.uWGg.',1,'admin'),(2,'Alba Panato00','alba.panato@gmail.com','$2a$10$a8.r/zrz1.JwqCe2xx1bKOB9y5jsuPv.sePh0cVnBBhuksyNX3XGK',1,'admin'),(3,'Maria Sarmiento','maria.sarmiento@gmail.com','$2a$10$1IrQ8kepS0uDGGPGzlx4BuUogpVzJV/ZomcrZd7t2RbrOxOF2NBL6',1,'user'),(4,'Lola Mento','lola.mento@gmail.com','$2a$10$dWniDVaytKnyTtKmxCzLfOnMS2xZ4b8zNbU.osK47cSD8x9l6GvLG',1,'user'),(5,'Aitor Menta','aitor.menta@gmail.com','$2a$10$N6nDQAbyDNuQgBnLoc2cqO4QjlfTbmr7Sg1bTRlzM8t/fnLAHOdnm',1,'user'),(6,'Paco Mermela','paco.mermela@gmail.com','$2a$10$T.ICfQgO7YMew4fVls/hIeYVqQ6osN0sPkE.OwKysUtGAgDUll2DO',1,'user'),(7,'Jony Mentero','Jony.mentero@gmail.com','$2a$10$4NtoaimgPSmttOWXEUlqi.gAaZl7tNbkN5uPT9zQYmEnBg7OVHmk.',1,'user'),(8,'Kes Crotolamo','kes.crotolamo@gmail.com','$2a$10$bVy4IYV5dkfWIyIEyYfngO5Oz2M.JMK6IIDgymGvy9ZZfAMaN7kvW',1,'user'),(10,'Ana Cardo','ana.cardo@gmail.com','$2a$10$sTgQB9TEPw1PtazFQoCTNOuBz7PIjuQ3fbmIlVtbhwMgOH2IP8CMK',1,'user'),(11,'Luz Cuesta','luz.cuesta@gmail.com','$2a$10$mWNpMuqRbzjglzgSo02jfONKb4ymoNlLqK89fj1smJRdikZLss01i',1,'user');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `valoraciones`
--

DROP TABLE IF EXISTS `valoraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valoraciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `id_restaurante` int NOT NULL,
  `restaurante` varchar(100) NOT NULL,
  `puntuacion` tinyint NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_restaurante` (`id_restaurante`),
  CONSTRAINT `valoraciones_ibfk_1` FOREIGN KEY (`id_restaurante`) REFERENCES `restaurantes` (`id`),
  CONSTRAINT `valoraciones_chk_1` CHECK (((`puntuacion` >= 1) and (`puntuacion` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `valoraciones`
--

LOCK TABLES `valoraciones` WRITE;
/*!40000 ALTER TABLE `valoraciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `valoraciones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-06  0:46:26
