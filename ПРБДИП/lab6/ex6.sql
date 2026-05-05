WITH HR_Activity AS (
    SELECT 
        u.Email AS HR_Email,
        a.date_created,
        a.status
    FROM Application a
    JOIN Vacancy v ON a.vacancy_id = v.ID
    JOIN Company c ON v.Company_id = c.ID
    JOIN "User" u ON c.Owner_id = u.ID
    where MONTHS_BETWEEN(sysdate, a.date_created) <= 6
)

    SELECT 
    TO_CHAR(date_created, 'YYYY-MM') AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS Approved
FROM HR_Activity
GROUP BY TO_CHAR(date_created, 'YYYY-MM'), HR_Email
ORDER BY Period_Value;
