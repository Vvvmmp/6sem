select * from "User";


-- create object
CREATE OR REPLACE TYPE t_person AS OBJECT (
    id NUMBER,
    email VARCHAR2(100),
    phone VARCHAR2(50),
    
    CONSTRUCTOR FUNCTION t_person(p_id NUMBER, p_email VARCHAR2) RETURN SELF AS RESULT,
    
    MAP MEMBER FUNCTION get_id RETURN NUMBER,
    
    MEMBER FUNCTION get_contact_info RETURN VARCHAR2 DETERMINISTIC,
    
    MEMBER PROCEDURE update_phone(p_new_phone VARCHAR2)
);
/

CREATE OR REPLACE TYPE BODY t_person AS
    CONSTRUCTOR FUNCTION t_person(p_id NUMBER, p_email VARCHAR2) RETURN SELF AS RESULT IS
    BEGIN
        SELF.id := p_id;
        SELF.email := p_email;
        SELF.phone := 'Телефон не указан';
        RETURN;
    END;

    MAP MEMBER FUNCTION get_id RETURN NUMBER IS
    BEGIN
        RETURN SELF.id;
    END;

    MEMBER FUNCTION get_contact_info RETURN VARCHAR2 DETERMINISTIC IS
    BEGIN
        RETURN SELF.email || ' (Тел: ' || NVL(SELF.phone, 'Не указан') || ')';
    END;

    MEMBER PROCEDURE update_phone(p_new_phone VARCHAR2) IS
    BEGIN
        SELF.phone := p_new_phone;
    END;
END;
/

CREATE OR REPLACE TYPE t_trip AS OBJECT (
    trip_id NUMBER,
    destination VARCHAR2(100),
    days_count NUMBER,
    person_ref REF t_person
);
/



