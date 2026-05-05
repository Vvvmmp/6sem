use hiring_staff;

CREATE OR ALTER VIEW active_vacancies_view AS
SELECT 
    v.ID, 
    v.Job_title, 
    c.Title AS CompanyName, 
    v.Salary_range,
    v.Publication_date
FROM Vacancy v
JOIN Company c ON v.Company_id = c.ID
WHERE v.Is_active = 1;
