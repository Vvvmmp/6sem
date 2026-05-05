

INSERT INTO obj_person VALUES (t_person(21, 'testemaily@test.com'));
select * from obj_person;

DECLARE
    v_person t_person;
BEGIN
    SELECT VALUE(p) INTO v_person FROM obj_person p WHERE id = 21;
    
    v_person.update_phone('+375291231231');

    UPDATE obj_person p SET VALUE(p) = v_person WHERE id = 21;
    COMMIT;
END;
/

select * from obj_person;




--with plan

EXPLAIN PLAN FOR
select p.id, p.email FROM obj_person p WHERE p.get_contact_info() = 'admin@global.com (Тел: +12025550100)';

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);


