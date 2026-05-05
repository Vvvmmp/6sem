CREATE TABLE user_archive (
    arch_id NUMBER,
    arch_email VARCHAR2(100)
);

DECLARE
    v_k1 t_person_nt; 
BEGIN
    SELECT t_person(id, email, phone, t_trip_nt())
    BULK COLLECT INTO v_k1
    FROM "User"
    WHERE id <= 5; 

    FORALL i IN 1..v_k1.COUNT
        INSERT INTO user_archive (arch_id, arch_email)
        VALUES (v_k1(i).id, v_k1(i).email);
        
    COMMIT;
END;
/

SELECT * FROM user_archive;