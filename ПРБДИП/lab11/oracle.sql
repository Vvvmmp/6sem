CREATE TABLE vacation (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER REFERENCES "User"(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    vacation_type VARCHAR2(50) NOT NULL,
    days_count NUMBER(5,2) 
);

INSERT INTO vacation (user_id, start_date, end_date, vacation_type, days_count) 
VALUES (1, TO_DATE('01.06.2026', 'DD.MM.YYYY'), TO_DATE('14.06.2026', 'DD.MM.YYYY'), 'ОПЛАЧИВАЕМЫЙ', 14.0);

INSERT INTO vacation (user_id, start_date, end_date, vacation_type, days_count) 
VALUES (3, TO_DATE('10.01.2026', 'DD.MM.YYYY'), TO_DATE('10.02.2026', 'DD.MM.YYYY'), 'ОПЛАЧИВАЕМЫЙ', 30.0);
COMMIT;



CREATE OR REPLACE TYPE t_vac_rec AS OBJECT (
    email VARCHAR2(100),
    start_date DATE,
    end_date DATE,
    vac_type VARCHAR2(50),
    days NUMBER
);


CREATE OR REPLACE TYPE t_vac_tab AS TABLE OF t_vac_rec;

CREATE OR REPLACE FUNCTION get_vacations (
    p_start DATE,
    p_end DATE
) RETURN t_vac_tab PIPELINED 
AS
BEGIN
    FOR r IN (
        SELECT u.email, v.start_date, v.end_date, v.vacation_type, v.days_count
        FROM "User" u
        JOIN vacation v ON u.id = v.user_id
        WHERE v.start_date >= p_start AND v.end_date <= p_end
    ) LOOP
        PIPE ROW(t_vac_rec(r.email, r.start_date, r.end_date, r.vacation_type, r.days_count));
    END LOOP;
    RETURN;
END;


SELECT * FROM TABLE(get_vacations(TO_DATE('01.01.2026', 'DD.MM.YYYY'), TO_DATE('31.12.2026', 'DD.MM.YYYY')));


--docker exec -e NLS_LANG=AMERICAN_AMERICA.AL32UTF8 -it oracle sqlplus admin_hiring_app/pass@localhost:1521/hiring_staff_app @/opt/oracle/docs/export.sql


--docker exec -it oracle sqlldr userid=admin_hiring_app/pass@localhost:1521/hiring_staff_app control=/opt/oracle/docs/vacation.ctl log=/opt/oracle/docs/vacation.log bad=/opt/oracle/docs/vacation.bad