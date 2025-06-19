-- Base de datos para el sistema de reporte de incidentes
-- Compatible con SQL Server

-- Crear la base de datos
CREATE DATABASE IncidentReportingDB;
GO

USE IncidentReportingDB;
GO

-- Tabla de usuarios (opcional, para autenticación y trazabilidad)
CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL,
    PasswordHash NVARCHAR(256) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Tabla de entidades de emergencia
CREATE TABLE EmergencyEntities (
    EntityId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Type NVARCHAR(50) NOT NULL, -- police, fire, medical, etc.
    Lat FLOAT NOT NULL,
    Lng FLOAT NOT NULL,
    Phone NVARCHAR(20),
    Address NVARCHAR(200)
);
GO

-- Tabla de incidentes reportados
CREATE TABLE Incidents (
    IncidentId INT IDENTITY(1,1) PRIMARY KEY,
    Type NVARCHAR(50) NOT NULL,
    Description NVARCHAR(500),
    Lat FLOAT NOT NULL,
    Lng FLOAT NOT NULL,
    Anonymous BIT DEFAULT 0,
    Timestamp DATETIME DEFAULT GETDATE(),
    UserId INT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Tabla de comentarios/foro de incidentes
CREATE TABLE IncidentComments (
    CommentId INT IDENTITY(1,1) PRIMARY KEY,
    IncidentId INT NOT NULL,
    UserId INT NULL,
    Comment NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (IncidentId) REFERENCES Incidents(IncidentId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Tabla de contactos de emergencia adicionales
CREATE TABLE EmergencyContacts (
    ContactId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Phone NVARCHAR(20) NOT NULL,
    EntityId INT NULL,
    FOREIGN KEY (EntityId) REFERENCES EmergencyEntities(EntityId)
);
GO

-- Tabla de imágenes de evidencia para incidentes
CREATE TABLE IncidentImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    IncidentId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL, -- Ruta o URL de la imagen
    UploadedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (IncidentId) REFERENCES Incidents(IncidentId)
);
GO

-- Índices útiles
CREATE INDEX IDX_Incidents_Location ON Incidents(Lat, Lng);
CREATE INDEX IDX_Incidents_Type ON Incidents(Type);
GO

-- Datos de ejemplo para entidades de emergencia
INSERT INTO EmergencyEntities (Name, Type, Lat, Lng, Phone, Address) VALUES
('Comisaría Central', 'police', -12.0400, -77.0350, '105', 'Av. España 323'),
('Bomberos Voluntarios', 'fire', -12.0500, -77.0400, '116', 'Jr. Ica 456'),
('Hospital Nacional', 'medical', -12.0300, -77.0500, '117', 'Av. Grau 789'),
('Comisaría San Martín', 'police', -12.0600, -77.0300, '105', 'Av. Universitaria 234'),
('Bomberos Central', 'fire', -12.0250, -77.0600, '116', 'Av. Arequipa 567'),
('Clínica San Juan', 'medical', -12.0550, -77.0250, '117', 'Jr. Lampa 890');
GO
