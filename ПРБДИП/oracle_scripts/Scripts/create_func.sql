CREATE OR REPLACE FUNCTION get_application_count(p_vacancy_id IN NUMBER) 
RETURN NUMBER AS
    l_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO l_count FROM Application WHERE vacancy_id = p_vacancy_id;
    RETURN l_count;
END;
/

CREATE OR REPLACE FUNCTION is_user_active(p_user_id IN NUMBER) 
RETURN NUMBER AS
    l_active NUMBER;
BEGIN
    SELECT Is_active INTO l_active FROM "User" WHERE ID = p_user_id;
    RETURN l_active;
EXCEPTION
    WHEN NO_DATA_FOUND THEN RETURN 0;
END;
/

CREATE OR REPLACE FUNCTION get_avg_salary_by_city(p_city IN NVARCHAR2) 
RETURN NUMBER AS
    l_avg_salary NUMBER;
BEGIN
    SELECT AVG(Salary_Expectation) INTO l_avg_salary 
    FROM Resume 
    WHERE City = p_city;
    RETURN NVL(l_avg_salary, 0);
END;
/

CREATE OR REPLACE FUNCTION get_company_name_by_vacancy(p_vacancy_id IN NUMBER) 
RETURN NVARCHAR2 AS
    l_name NVARCHAR2(255);
BEGIN
    SELECT c.Title INTO l_name
    FROM Company c
    JOIN Vacancy v ON c.ID = v.Company_id
    WHERE v.ID = p_vacancy_id;
    RETURN l_name;
EXCEPTION
    WHEN NO_DATA_FOUND THEN RETURN 'Unknown';
END;
/

CREATE OR REPLACE FUNCTION count_active_vacancies(p_company_id IN NUMBER) 
RETURN NUMBER AS
    l_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO l_count 
    FROM Vacancy 
    WHERE Company_id = p_company_id AND Is_active = 1;
    RETURN l_count;
END;
/