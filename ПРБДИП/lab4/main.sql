-- Active: 1771928464965@@127.0.0.1@5432@qgis_db
--create DATABASE qgis_db;

--CREATE EXTENSION IF NOT EXISTS postgis;

--6
select DISTINCT ST_GeometryType(geom) as geom_type
from inwatera_lva; 

--7
select DISTINCT ST_SRID(geom) as srid
from inwatera_lva;

--8
select column_name, data_type
from information_schema.columns
where table_name = 'inwatera_lva';

--9
SELECT id, ST_AsText(geom) AS wkt_geometry 
FROM inwatera_lva
limit 10;

--10.1
SELECT t1.id, t2.id, ST_AsText(ST_Intersection(t1.geom, t2.geom))
FROM polbnda_lva t1, inwatera_lva t2
WHERE ST_Intersects(t1.geom, t2.geom);

--10.2
SELECT id, ST_AsText((ST_DumpPoints(geom)).geom) AS vertex_point
FROM inwatera_lva 
LIMIT 10;

--10.3
SELECT id, ST_Area(geom::geography) AS area_sq_meters 
FROM inwatera_lva;

--11
SELECT ST_GeomFromText('POINT(12.12 12.12)', 4326);

SELECT ST_GeomFromText('LINESTRING(30 10, 10 30, 40 40)', 4326);

SELECT ST_GeomFromText('POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))', 4326);

--12
SELECT id 
FROM inwatera_lva
WHERE ST_Contains(geom, ST_GeomFromText('POINT(12.12 12.12)', 4326));

SELECT id 
FROM inwatera_lva
WHERE ST_Contains(geom, ST_GeomFromText('LINESTRING(30 10, 10 30, 40 40)', 4326))

SELECT id 
FROM inwatera_lva
WHERE ST_Contains(geom, ST_GeomFromText('LINESTRING(30 10, 10 30, 40 40)', 4326));

--13
CREATE INDEX inwatera_lva_geom_idx ON inwatera_lva USING GIST (geom);

--14
CREATE OR REPLACE FUNCTION find_object_by_coords(lon FLOAT, lat FLOAT)
RETURNS TABLE(object_id INT, object_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id::INT,           
        nam::TEXT          
    FROM inwatera_lva
    WHERE ST_Within(
        ST_SetSRID(ST_Point(lon, lat), 4326),
        geom
    )
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM find_object_by_coords(27.44, 56.32);