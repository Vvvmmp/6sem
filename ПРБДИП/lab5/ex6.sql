WITH HR_Activity AS (
    SELECT 
        u.Email AS HR_Email,
        a.date_created,
        a.status
    FROM Application a
    JOIN Vacancy v ON a.vacancy_id = v.ID
    JOIN Company c ON v.Company_id = c.ID
    JOIN [User] u ON c.Owner_id = u.ID
    where DATEDIFF(month,a.date_created, getdate()) <= 6
)

select 
    CONCAT(YEAR(date_created), '-', RIGHT('0' + CAST(MONTH(date_created) AS VARCHAR(2)), 2)) AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS [Approved]
    from HR_Activity
    GROUP BY YEAR(date_created), MONTH(date_created), HR_Email
    ORDER BY 
    Period_Value;