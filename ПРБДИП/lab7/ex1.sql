select table_name from user_tables;

select * from COMPANY;

create table company_departments(
    department_id integer GENERATED ALWAYS as identity primary key,
    department_name NVARCHAR2(100) not null,
    capacity int not null,
    company_id int REFERENCES company(id)
);

ALTER TABLE VACANCY ADD department_id INT REFERENCES company_departments(department_id);

UPDATE VACANCY SET department_id = 2 WHERE ID IN (1, 2);

UPDATE VACANCY SET department_id = 3 WHERE ID = 9;

UPDATE VACANCY SET department_id = 6 WHERE ID = 4;

UPDATE VACANCY SET department_id = 7 WHERE ID = 7;

UPDATE VACANCY SET department_id = 1 WHERE ID = 10;

select * from company_departments;

INSERT INTO VACANCY (ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE, DEPARTMENT_ID) 
VALUES (11, '3D Animator', 'Blender, Maya', '3k-5k', CURRENT_TIMESTAMP, 1, 
        (SELECT department_id FROM company_departments WHERE department_name = '3D Animation'));

INSERT INTO VACANCY (ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE, DEPARTMENT_ID) 
VALUES (12, 'Lead Game Designer', 'Unreal Engine 5', '6k+', CURRENT_TIMESTAMP, 1, 
        (SELECT department_id FROM company_departments WHERE department_name = 'Game Design'));

INSERT INTO VACANCY (ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE, DEPARTMENT_ID) 
VALUES (13, 'Store Manager', 'Retail exp 5+ years', '2k-4k', CURRENT_TIMESTAMP, 1, 
        (SELECT department_id FROM company_departments WHERE department_name = 'Retail Management'));

INSERT INTO VACANCY (ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE, DEPARTMENT_ID) 
VALUES (14, 'Senior React Dev', 'React, TypeScript', '5k-8k', CURRENT_TIMESTAMP, 1, 
        (SELECT department_id FROM company_departments WHERE department_name = 'Frontend Development'));

COMMIT;


INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Frontend Development', 50, 2);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Backend Development', 120, 2);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Game Design', 40, 9);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('3D Animation', 70, 9);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Logistics & Supply', 200, 4);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Retail Management', 30, 4);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Core Banking IT', 150, 7);
INSERT INTO company_departments (department_name, capacity, company_id) VALUES ('Customer Support', 300, 5);


select * from RESUME;
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (101, 11, 1, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (102, 11, 2, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (103, 11, 3, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (104, 11, 4, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (105, 11, 5, CURRENT_TIMESTAMP, 'approved');

INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (106, 12, 6, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (107, 12, 7, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (108, 12, 8, CURRENT_TIMESTAMP, 'approved');

INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (109, 13, 9, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (110, 13, 10, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (111, 13, 1, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (112, 13, 2, CURRENT_TIMESTAMP, 'approved');

INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (113, 14, 3, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (114, 14, 4, CURRENT_TIMESTAMP, 'approved');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (115, 14, 5, CURRENT_TIMESTAMP, 'approved');

INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (116, 11, 6, CURRENT_TIMESTAMP, 'rejected');
INSERT INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS) VALUES (117, 12, 7, CURRENT_TIMESTAMP, 'in consideration');

select * from VACANCY;
select * from APPLICATION;


WITH dept_stats AS (
    SELECT 
        cd.department_name,
        cd.capacity AS current_capacity,
        EXTRACT(YEAR FROM SYSDATE) AS actual_year,
        0 AS year_idx,
        COUNT(CASE WHEN a.status = 'approved' THEN 1 END) AS expected_new_hires
    FROM company_departments cd
    LEFT JOIN vacancy v ON cd.department_id = v.department_id
    LEFT JOIN application a ON v.id = a.vacancy_id
    GROUP BY 
        cd.department_name, 
        cd.capacity
)
SELECT 
    department_name,
    actual_year,
    current_employees,
    room_capacity,
    expansion_needed 
FROM (
    SELECT 
        department_name,
        actual_year,
        year_idx,
        current_capacity AS room_capacity,
        current_capacity AS current_employees, 
        expected_new_hires,
        0 AS expansion_needed
    FROM dept_stats
)
MODEL
    PARTITION BY (department_name)
    DIMENSION BY (year_idx)
    MEASURES (actual_year, current_employees, room_capacity, expected_new_hires, expansion_needed)
    
    RULES (
        actual_year[1] = actual_year[0] + 1,
        
        current_employees[1] = current_employees[0] + expected_new_hires[0],
        
        room_capacity[1] = room_capacity[0],
        
        expansion_needed[1] = GREATEST(current_employees[1] - room_capacity[0], 0)
    )
ORDER BY department_name, actual_year;