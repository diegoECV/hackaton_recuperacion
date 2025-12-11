CREATE DATABASE IF NOT EXISTS hackaton;
USE hackaton;

-- Tabla para almacenar la información de los equipos
CREATE TABLE IF NOT EXISTS equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    marcas VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    so VARCHAR(50) NOT NULL,
    almacenamiento INT NOT NULL COMMENT 'Almacenamiento en GB',
    ram INT NOT NULL COMMENT 'RAM en GB',
    estado VARCHAR(50) NOT NULL,
    mantenimiento DATE NOT NULL COMMENT 'Fecha de mantenimiento',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_tipo (tipo),
    INDEX idx_marcas (marcas),
    INDEX idx_estado (estado),
    INDEX idx_fecha_mantenimiento (mantenimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de modelos por marca
CREATE TABLE IF NOT EXISTS modelos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    ram INT DEFAULT 8 COMMENT 'RAM por defecto en GB',
    almacenamiento INT DEFAULT 256 COMMENT 'Almacenamiento por defecto en GB',
    procesador VARCHAR(100),
    INDEX idx_marca (marca),
    UNIQUE KEY unique_marca_modelo (marca, nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar modelos de HP
INSERT INTO modelos (marca, nombre, ram, almacenamiento, procesador) VALUES
('hp', 'HP 15-ef1xxx', 8, 256, 'AMD Ryzen 5'),
('hp', 'HP 15-dy1xxx', 8, 256, 'Intel Core i5'),
('hp', 'HP ProBook 450 G7', 16, 512, 'Intel Core i7'),
('hp', 'HP ProBook 640 G5', 16, 512, 'Intel Core i7'),
('hp', 'HP Pavilion 15', 8, 256, 'Intel Core i5'),
('hp', 'HP Envy 13', 8, 256, 'Intel Core i5'),
('hp', 'HP ZBook 15', 16, 512, 'Intel Core i7'),
('hp', 'EliteBook 840 G8', 16, 512, 'Intel Core i7');

-- Insertar modelos de Dell
INSERT INTO modelos (marca, nombre, ram, almacenamiento, procesador) VALUES
('dell', 'Dell Inspiron 15 3000', 4, 128, 'Intel Core i3'),
('dell', 'Dell Inspiron 15 5000', 8, 256, 'Intel Core i5'),
('dell', 'Dell XPS 13', 16, 512, 'Intel Core i7'),
('dell', 'Dell XPS 15', 16, 512, 'Intel Core i7'),
('dell', 'Dell Latitude 5520', 16, 512, 'Intel Core i7'),
('dell', 'Dell Latitude 7420', 16, 512, 'Intel Core i7'),
('dell', 'Dell Vostro 15', 8, 256, 'Intel Core i5'),
('dell', 'OptiPlex 7090', 32, 1024, 'Intel Core i7');

-- Insertar modelos de Lenovo
INSERT INTO modelos (marca, nombre, ram, almacenamiento, procesador) VALUES
('lenovo', 'Lenovo ThinkPad E15', 8, 256, 'Intel Core i5'),
('lenovo', 'Lenovo ThinkPad T14', 16, 512, 'Intel Core i7'),
('lenovo', 'Lenovo ThinkPad X1', 16, 512, 'Intel Core i7'),
('lenovo', 'Lenovo IdeaPad 5', 8, 256, 'AMD Ryzen 5'),
('lenovo', 'Lenovo IdeaPad 3', 4, 128, 'Intel Core i3'),
('lenovo', 'Lenovo Legion 5', 16, 512, 'Intel Core i7'),
('lenovo', 'Lenovo Yoga 9', 16, 512, 'Intel Core i7'),
('lenovo', 'ThinkSystem SR650', 64, 2048, 'Intel Xeon');

-- Insertar modelos de ASUS
INSERT INTO modelos (marca, nombre, ram, almacenamiento, procesador) VALUES
('asus', 'ASUS VivoBook 15', 8, 256, 'AMD Ryzen 5'),
('asus', 'ASUS VivoBook Pro', 16, 512, 'Intel Core i7'),
('asus', 'ASUS ROG G513', 32, 1024, 'Intel Core i9'),
('asus', 'ASUS ROG Zephyrus', 32, 1024, 'Intel Core i9'),
('asus', 'ASUS ZenBook 13', 8, 256, 'Intel Core i5'),
('asus', 'ASUS ZenBook 14', 8, 256, 'Intel Core i5'),
('asus', 'ASUS TUF Gaming', 16, 512, 'Intel Core i7');

-- Insertar modelos de Apple
INSERT INTO modelos (marca, nombre, ram, almacenamiento, procesador) VALUES
('apple', 'MacBook Air M1', 8, 256, 'Apple M1'),
('apple', 'MacBook Air M2', 8, 256, 'Apple M2'),
('apple', 'MacBook Pro 13', 16, 512, 'Apple M1'),
('apple', 'MacBook Pro 14', 16, 512, 'Apple M1 Pro'),
('apple', 'MacBook Pro 16', 32, 1024, 'Apple M1 Max'),
('apple', 'iMac 24', 16, 512, 'Apple M1'),
('apple', 'Mac Mini M1', 8, 256, 'Apple M1'); 

INSERT INTO equipos (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento) VALUES
('LAP001', 'Laptop', 'HP', 'EliteBook 840 G8', 'Windows 11', 512, 16, 'Operativo', '2025-06-01'),
('LAP002', 'Laptop', 'Dell', 'XPS 13', 'Windows 11', 512, 16, 'Operativo', '2025-06-15'),
('LAP003', 'Laptop', 'Lenovo', 'ThinkPad X1', 'Windows 11', 1024, 32, 'Operativo', '2025-07-01'),
('DSK001', 'Desktop', 'Dell', 'OptiPlex 7090', 'Windows 10', 1024, 32, 'Operativo', '2025-07-15'),
('DSK002', 'Desktop', 'HP', 'ProDesk 600', 'Windows 10', 512, 16, 'En Mantenimiento', '2025-08-01'),
('SRV001', 'Servidor', 'Lenovo', 'ThinkSystem SR650', 'Linux', 2048, 64, 'Operativo', '2025-08-20'),
('IMP001', 'Impresora', 'HP', 'LaserJet Pro M404n', 'N/A', 0, 0, 'Operativo', '2025-09-01');

-- Ver todos los equipos ordenados por fecha de registro
SELECT * FROM equipos ORDER BY fecha_registro DESC;

-- Ver equipos por estado
SELECT estado, COUNT(*) as cantidad FROM equipos GROUP BY estado;

-- Ver equipos que necesitan mantenimiento pronto
SELECT * FROM vista_mantenimiento_proximo;

-- Obtener estadísticas generales
CALL sp_estadisticas_generales();

-- Ver estadísticas por tipo de equipo
SELECT * FROM equipos;