-- Script de creación de base de datos para el sistema de registro de equipos
-- Base de datos: hackaton

-- Crear la base de datos si no existe
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

-- Datos de ejemplo (opcional - descomentar para insertar)
-- INSERT INTO equipos (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento) VALUES
-- ('LAP001', 'Laptop', 'HP', 'EliteBook 840 G8', 'Windows 11', 512, 16, 'Operativo', '2025-06-01'),
-- ('LAP002', 'Laptop', 'Dell', 'XPS 13', 'Windows 11', 512, 16, 'Operativo', '2025-06-15'),
-- ('LAP003', 'Laptop', 'Lenovo', 'ThinkPad X1', 'Windows 11', 1024, 32, 'Operativo', '2025-07-01'),
-- ('DSK001', 'Desktop', 'Dell', 'OptiPlex 7090', 'Windows 10', 1024, 32, 'Operativo', '2025-07-15'),
-- ('DSK002', 'Desktop', 'HP', 'ProDesk 600', 'Windows 10', 512, 16, 'En Mantenimiento', '2025-08-01'),
-- ('SRV001', 'Servidor', 'Lenovo', 'ThinkSystem SR650', 'Linux', 2048, 64, 'Operativo', '2025-08-20'),
-- ('IMP001', 'Impresora', 'HP', 'LaserJet Pro M404n', 'N/A', 0, 0, 'Operativo', '2025-09-01');

-- Vista para estadísticas de equipos por tipo
CREATE OR REPLACE VIEW vista_equipos_por_tipo AS
SELECT 
    tipo,
    COUNT(*) as cantidad,
    SUM(almacenamiento) as almacenamiento_total,
    AVG(ram) as ram_promedio,
    SUM(CASE WHEN estado = 'Operativo' THEN 1 ELSE 0 END) as operativos,
    SUM(CASE WHEN estado != 'Operativo' THEN 1 ELSE 0 END) as no_operativos
FROM equipos
GROUP BY tipo;

-- Vista para equipos que requieren mantenimiento pronto (próximos 30 días)
CREATE OR REPLACE VIEW vista_mantenimiento_proximo AS
SELECT 
    codigo,
    tipo,
    marcas,
    modelo,
    estado,
    mantenimiento,
    DATEDIFF(mantenimiento, CURDATE()) as dias_restantes
FROM equipos
WHERE mantenimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY mantenimiento ASC;

-- Procedimiento almacenado para obtener estadísticas generales
DELIMITER //
CREATE PROCEDURE sp_estadisticas_generales()
BEGIN
    SELECT 
        COUNT(*) as total_equipos,
        COUNT(DISTINCT tipo) as tipos_diferentes,
        COUNT(DISTINCT marcas) as marcas_diferentes,
        SUM(almacenamiento) as almacenamiento_total_gb,
        AVG(ram) as ram_promedio_gb,
        SUM(CASE WHEN estado = 'Operativo' THEN 1 ELSE 0 END) as equipos_operativos,
        SUM(CASE WHEN estado != 'Operativo' THEN 1 ELSE 0 END) as equipos_no_operativos
    FROM equipos;
END //
DELIMITER ;

-- Trigger para validar datos antes de insertar
DELIMITER //
CREATE TRIGGER tr_validar_equipo_antes_insertar
BEFORE INSERT ON equipos
FOR EACH ROW
BEGIN
    -- Validar que almacenamiento y RAM sean positivos
    IF NEW.almacenamiento < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El almacenamiento no puede ser negativo';
    END IF;
    
    IF NEW.ram < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La RAM no puede ser negativa';
    END IF;
    
    -- Convertir código a mayúsculas
    SET NEW.codigo = UPPER(NEW.codigo);
END //
DELIMITER ;

-- Trigger para validar datos antes de actualizar
DELIMITER //
CREATE TRIGGER tr_validar_equipo_antes_actualizar
BEFORE UPDATE ON equipos
FOR EACH ROW
BEGIN
    -- Validar que almacenamiento y RAM sean positivos
    IF NEW.almacenamiento < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El almacenamiento no puede ser negativo';
    END IF;
    
    IF NEW.ram < 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La RAM no puede ser negativa';
    END IF;
    
    -- Convertir código a mayúsculas
    SET NEW.codigo = UPPER(NEW.codigo);
END //
DELIMITER ;

-- Consultas útiles comentadas:

-- Ver todos los equipos ordenados por fecha de registro
-- SELECT * FROM equipos ORDER BY fecha_registro DESC;

-- Ver equipos por estado
-- SELECT estado, COUNT(*) as cantidad FROM equipos GROUP BY estado;

-- Ver equipos que necesitan mantenimiento pronto
-- SELECT * FROM vista_mantenimiento_proximo;

-- Obtener estadísticas generales
-- CALL sp_estadisticas_generales();

-- Ver estadísticas por tipo de equipo
-- SELECT * FROM vista_equipos_por_tipo;
