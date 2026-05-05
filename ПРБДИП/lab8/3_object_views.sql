CREATE OR REPLACE VIEW view_person OF t_person
WITH OBJECT IDENTIFIER (id) AS
SELECT 
    id, 
    CAST(email AS VARCHAR2(100)), 
    CAST(phone AS VARCHAR2(50))
FROM "User";

SELECT 
    v.id, 
    v.get_contact_info() AS contact_info 
FROM view_person v
WHERE v.id <= 5;