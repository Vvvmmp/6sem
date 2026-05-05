DECLARE
    v_trips_admin t_trip_nt := t_trip_nt(
        t_trip(101, 'London', 5, NULL), 
        t_trip(102, 'Minsk', 3, NULL)
    );
    v_trips_empty t_trip_nt := t_trip_nt();
    
    v_p1 t_person := t_person(1, 'admin@global.com', '+12025550100', v_trips_admin);
    
    v_p2 t_person := t_person(2, 'arseniy.dev@gmail.com');
    
    v_k1 t_person_nt := t_person_nt(v_p1, v_p2);
    v_k1_empty t_person_nt := t_person_nt(); 
    
    v_target t_person := t_person(1, 'admin@global.com', '+12025550100', v_trips_admin);

BEGIN
    IF v_target MEMBER OF v_k1 THEN
        DBMS_OUTPUT.PUT_LINE('1. admin@global.com находится в коллекции K1.');
    END IF;

    IF v_k1_empty IS EMPTY THEN
        DBMS_OUTPUT.PUT_LINE('2. Найдена пустая коллекция сотрудников K1.');
    END IF;

    FOR i IN 1..v_k1.COUNT LOOP
        IF v_k1(i).trips IS EMPTY THEN
            DBMS_OUTPUT.PUT_LINE('3. У сотрудника ' || v_k1(i).email || ' нет командировок.');
        END IF;
    END LOOP;
END;
/



--others
--ALTER INDEX idx_obj_person_method REBUILD;
INSERT INTO OBJ_PERSON VALUES (
    t_person(
        21, 
        'arseniy.dev@gmail.com', 
        '+12025550100', 
        t_trip_nt( 
            t_trip(101, 'London', 5, NULL),
            t_trip(102, 'Minsk', 3, NULL)
        )
    )
);
COMMIT;


select * from OBJ_PERSON, table(OBJ_PERSON.TRIPS);