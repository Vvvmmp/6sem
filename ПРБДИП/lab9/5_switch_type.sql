CREATE OR REPLACE TYPE t_email_list AS TABLE OF VARCHAR2(100);
/

DECLARE
    v_k1 t_person_nt;      
    v_emails t_email_list; 
BEGIN
    v_k1 := t_person_nt(
        t_person(1, 'admin@global.com', '+12025550100', t_trip_nt(t_trip(101, 'London', 5, NULL))),
        t_person(2, 'dmitry.dev@gmail.com', '1111', t_trip_nt())
    );

    SELECT CAST(
        MULTISET(
            SELECT p.email FROM TABLE(v_k1) p
        ) AS t_email_list
    )
    INTO v_emails
    FROM DUAL;

    FOR i IN 1..v_emails.COUNT LOOP
        DBMS_OUTPUT.PUT_LINE('Извлеченный Email: ' || v_emails(i));
    END LOOP;
END;
/
