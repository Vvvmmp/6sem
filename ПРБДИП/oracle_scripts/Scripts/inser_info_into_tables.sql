INSERT ALL
  INTO "User" (ID, EMAIL, PASSWORD, ROLE, PHONE, IS_ACTIVE) 
  VALUES (1, 'admin@jobportal.com', UTL_RAW.CAST_TO_RAW('hash_pass_1'), 1, '+79001112233', 1)
  
  INTO "User" (ID, EMAIL, PASSWORD, ROLE, PHONE, IS_ACTIVE) 
  VALUES (2, 'hr_manager@techcorp.ru', UTL_RAW.CAST_TO_RAW('hash_pass_2'), 2, '+79004445566', 1)
  
  INTO "User" (ID, EMAIL, PASSWORD, ROLE, PHONE, IS_ACTIVE) 
  VALUES (3, 'ivanov@mail.ru', UTL_RAW.CAST_TO_RAW('hash_pass_3'), 3, '+79007778899', 1)
SELECT * FROM dual;

INSERT ALL
  INTO COMPANY (ID, OWNER_ID, TITLE, DESCRIPTION, ADDRESS) 
  VALUES (1, 2, 'TechCorp', 'Ведущая IT компания', 'Москва, ул. Ленина, 10')
  INTO COMPANY (ID, OWNER_ID, TITLE, DESCRIPTION, ADDRESS) 
  VALUES (2, 1, 'Global Hire', 'Кадровое агентство', 'Санкт-Петербург, пр. Мира, 5')
SELECT * FROM dual;

INSERT ALL
  INTO VACANCY (ID, COMPANY_ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE)
  VALUES (1, 1, 'Java Developer', 'Experience 3+ years, Spring Boot', '200k-300k', TO_DATE('2023-10-01', 'YYYY-MM-DD'), 1)
  INTO VACANCY (ID, COMPANY_ID, JOB_TITLE, REQUIREMENT, SALARY_RANGE, PUBLICATION_DATE, IS_ACTIVE)
  VALUES (2, 1, 'QA Engineer', 'Manual and Auto testing', '120k-180k', TO_DATE('2023-10-05', 'YYYY-MM-DD'), 1)
SELECT * FROM dual;


INSERT ALL
  INTO RESUME (ID, USER_ID, DESIRED_POSITION, SALARY_EXPECTATION, SKILLS, WORK_EXPERIENCE, CITY)
  VALUES (1, 3, 'Java Developer', 250000, 'Java, SQL, Docker', '5 years at Sber', 'Moscow')
  INTO RESUME (ID, USER_ID, DESIRED_POSITION, SALARY_EXPECTATION, SKILLS, WORK_EXPERIENCE, CITY)
  VALUES (2, 3, 'Team Lead', 400000, 'Management, Architecture', '10 years total', 'Moscow')
SELECT * FROM dual;



INSERT ALL
  INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS)
  VALUES (1, 1, 1, TO_DATE('2023-10-10', 'YYYY-MM-DD'), 'new')
  INTO APPLICATION (ID, VACANCY_ID, RESUME_ID, DATE_CREATED, STATUS)
  VALUES (2, 2, 1, TO_DATE('2023-10-11', 'YYYY-MM-DD'), 'approved')
SELECT * FROM dual;

SELECT * FROM resume;
DECLARE
    v_result NUMBER;
BEGIN
    v_result := get_avg_salary_by_city('Moscow');
    DBMS_OUTPUT.PUT_LINE('Средняя зарплата: ' || v_result);
END;

SELECT * FROM "User" U ;
BEGIN
	set_user_block_status(1,1);
END;












