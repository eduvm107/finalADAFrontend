-- Script para poblar la base de datos con entidades de emergencia de Lima
-- Asegúrate de que las tablas EmergencyEntities y EmergencyContacts existen

-- Insertar algunas comisarías principales
INSERT INTO EmergencyEntities (Name, Type, Address, District, Phone, Lat, Lng)
VALUES 
    ('Comisaría Central de Lima', 'policia', 'Jr. Camaná 431, Cercado de Lima', 'Lima', '01-4281930', -12.0464, -77.0428),
    ('Comisaría de San Isidro', 'policia', 'Av. Prescott 156, San Isidro', 'San Isidro', '01-4408270', -12.0976, -77.0365),
    ('Comisaría de Miraflores', 'policia', 'Av. Grau 1156, Miraflores', 'Miraflores', '01-4455168', -12.1196, -77.0365),
    ('Comisaría de San Borja', 'policia', 'Av. San Luis 2495, San Borja', 'San Borja', '01-4765432', -12.1022, -77.0022);

-- Insertar hospitales principales
INSERT INTO EmergencyEntities (Name, Type, Address, District, Phone, Lat, Lng)
VALUES 
    ('Hospital Nacional Dos de Mayo', 'hospital', 'Av. Grau cdra. 13, Cercado de Lima', 'Lima', '01-3286969', -12.0581, -77.0322),
    ('Hospital Nacional Edgardo Rebagliati Martins', 'hospital', 'Av. Edgardo Rebagliati 490, Jesús María', 'Jesús María', '01-2654901', -12.0710, -77.0532),
    ('Clínica Anglo Americana', 'hospital', 'Av. Salazar 3er piso, San Isidro', 'San Isidro', '01-7129000', -12.0976, -77.0365),
    ('Hospital Nacional Guillermo Almenara Irigoyen', 'hospital', 'Av. Grau 800, La Victoria', 'La Victoria', '01-3242983', -12.0678, -77.0322);

-- Insertar estaciones de bomberos
INSERT INTO EmergencyEntities (Name, Type, Address, District, Phone, Lat, Lng)
VALUES 
    ('Compañía 1 Lima Centro', 'bomberos', 'Jr. Huancavelica 281, Cercado de Lima', 'Lima', '01-2665454', -12.0464, -77.0428),
    ('Compañía 4 San Isidro', 'bomberos', 'Av. Dos de Mayo 1545, San Isidro', 'San Isidro', '01-4408270', -12.0976, -77.0365),
    ('Compañía 21 Miraflores', 'bomberos', 'Av. Ejército 738, Miraflores', 'Miraflores', '01-4455168', -12.1196, -77.0365),
    ('Compañía 10 San Borja', 'bomberos', 'Av. San Luis 2495, San Borja', 'San Borja', '01-4765432', -12.1022, -77.0022);

-- Insertar estaciones de serenazgo
INSERT INTO EmergencyEntities (Name, Type, Address, District, Phone, Lat, Lng)
VALUES 
    ('Serenazgo Lima Metropolitana', 'serenazgo', 'Jr. de la Unión 300, Cercado de Lima', 'Lima', '01-3156000', -12.0464, -77.0428),
    ('Serenazgo San Isidro', 'serenazgo', 'Av. Prescott 156, San Isidro', 'San Isidro', '01-5133333', -12.0976, -77.0365),
    ('Serenazgo Miraflores', 'serenazgo', 'Av. Larco 400, Miraflores', 'Miraflores', '01-6178000', -12.1196, -77.0365),
    ('Serenazgo San Borja', 'serenazgo', 'Av. San Luis 2495, San Borja', 'San Borja', '01-4118100', -12.1022, -77.0022);

-- Insertar estaciones de defensa civil
INSERT INTO EmergencyEntities (Name, Type, Address, District, Phone, Lat, Lng)
VALUES 
    ('INDECI Lima Metropolitana', 'defensa_civil', 'Av. Salaverry 1151, Jesús María', 'Jesús María', '01-4720870', -12.0710, -77.0532),
    ('Defensa Civil San Isidro', 'defensa_civil', 'Av. Del Ejército 201, San Isidro', 'San Isidro', '01-5133333', -12.0976, -77.0365),
    ('Defensa Civil Miraflores', 'defensa_civil', 'Av. Larco 400, Miraflores', 'Miraflores', '01-6178000', -12.1196, -77.0365);

-- Insertar algunos contactos de emergencia
INSERT INTO EmergencyContacts (Name, Phone, EntityId)
VALUES 
    ('Central de Emergencias Policía', '105', 1),
    ('Central de Emergencias Bomberos', '116', 5),
    ('Central de Emergencias SAMU', '106', 5),
    ('Central de Serenazgo', '107', 9),
    ('INDECI Nacional', '115', 13);

-- Verificar que los datos se insertaron correctamente
SELECT 'Entidades insertadas:' as Info;
SELECT Type, COUNT(*) as Cantidad FROM EmergencyEntities GROUP BY Type;

SELECT 'Contactos insertados:' as Info;
SELECT COUNT(*) as Total FROM EmergencyContacts;
