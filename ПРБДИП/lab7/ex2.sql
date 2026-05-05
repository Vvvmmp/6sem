CREATE TABLE company_staff_history (
    id integer GENERATED ALWAYS as identity primary key,
    company_id int REFERENCES company(id),
    record_date DATE not null,
    staff_count int not null
);

select * from company_staff_history;
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.01.2025', 'DD.MM.YYYY'), 1000);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.02.2025', 'DD.MM.YYYY'), 950);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.03.2025', 'DD.MM.YYYY'), 900);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.04.2025', 'DD.MM.YYYY'), 930);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.05.2025', 'DD.MM.YYYY'), 980);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.06.2025', 'DD.MM.YYYY'), 960);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (2, TO_DATE('01.07.2025', 'DD.MM.YYYY'), 955);

INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (9, TO_DATE('01.01.2025', 'DD.MM.YYYY'), 500);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (9, TO_DATE('01.02.2025', 'DD.MM.YYYY'), 490);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (9, TO_DATE('01.03.2025', 'DD.MM.YYYY'), 510);
INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (9, TO_DATE('01.04.2025', 'DD.MM.YYYY'), 495);

INSERT INTO company_staff_history (company_id, record_date, staff_count) VALUES (9, TO_DATE('01.05.2025', 'DD.MM.YYYY'), 495);



SELECT 
    company_name AS "Наниматель",
    TO_CHAR(start_drop, 'DD.MM.YYYY') AS "Начало 1-го падения",
    staff_start AS "Кол-во (старт)",
    TO_CHAR(bottom1_date, 'DD.MM.YYYY') AS "Конец 1-го падения",
    staff_bottom1 AS "Кол-во (дно 1)",
    TO_CHAR(peak_date, 'DD.MM.YYYY') AS "Пик роста",
    staff_peak AS "Кол-во (пик)",
    TO_CHAR(bottom2_date, 'DD.MM.YYYY') AS "Конец 2-го падения",
    staff_bottom2 AS "Кол-во (дно 2)"
FROM (
    SELECT 
        c.title AS company_name, 
        h.record_date, 
        h.staff_count
    FROM company_staff_history h
    JOIN company c ON h.company_id = c.id
)
MATCH_RECOGNIZE (
    PARTITION BY company_name
    ORDER BY record_date 
    MEASURES
        FIRST(STRT.record_date) AS start_drop,
        LAST(DOWN_1.record_date) AS bottom1_date,
        LAST(UP.record_date) AS peak_date,
        LAST(DOWN_2.record_date) AS bottom2_date,
        FIRST(STRT.staff_count) AS staff_start,
        LAST(DOWN_1.staff_count) AS staff_bottom1,
        LAST(UP.staff_count) AS staff_peak,
        LAST(DOWN_2.staff_count) AS staff_bottom2
        
    ONE ROW PER MATCH 
    PATTERN (STRT DOWN_1+ UP+ DOWN_2+) 
    DEFINE
        DOWN_1 AS DOWN_1.staff_count < PREV(DOWN_1.staff_count),
        UP     AS UP.staff_count > PREV(UP.staff_count),
        DOWN_2 AS DOWN_2.staff_count < PREV(DOWN_2.staff_count)
);