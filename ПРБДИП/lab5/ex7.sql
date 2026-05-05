SELECT DISTINCT
    v.Job_title,
    COUNT(a.ID) OVER (PARTITION BY v.Job_title) AS Resumes_Count
FROM Vacancy v
LEFT JOIN Application a ON v.ID = a.vacancy_id
ORDER BY Resumes_Count desc;