WITH HR_Activity AS (
    SELECT 
        u.Email AS HR_Email,
        a.date_created,
        a.status
    FROM Application a
    JOIN Vacancy v ON a.vacancy_id = v.ID
    JOIN Company c ON v.Company_id = c.ID
    JOIN [User] u ON c.Owner_id = u.ID
)

SELECT 
    '1. Monthly' AS Report_Period,
    CONCAT(YEAR(date_created), '-', RIGHT('0' + CAST(MONTH(date_created) AS VARCHAR(2)), 2)) AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS [New],
    SUM(CASE WHEN status = 'in consideration' THEN 1 ELSE 0 END) AS [In_Consideration],
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS [Approved],
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS [Rejected]
FROM HR_Activity
GROUP BY YEAR(date_created), MONTH(date_created), HR_Email

UNION ALL

SELECT 
    '2. Quarterly' AS Report_Period,
    CONCAT(YEAR(date_created), '-Q', DATEPART(QUARTER, date_created)) AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS [New],
    SUM(CASE WHEN status = 'in consideration' THEN 1 ELSE 0 END) AS [In_Consideration],
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS [Approved],
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS [Rejected]
FROM HR_Activity
GROUP BY YEAR(date_created), DATEPART(QUARTER, date_created), HR_Email

UNION ALL

SELECT 
    '3. Half-Yearly' AS Report_Period,
    CONCAT(YEAR(date_created), '-H', CASE WHEN MONTH(date_created) <= 6 THEN 1 ELSE 2 END) AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS [New],
    SUM(CASE WHEN status = 'in consideration' THEN 1 ELSE 0 END) AS [In_Consideration],
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS [Approved],
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS [Rejected]
FROM HR_Activity
GROUP BY YEAR(date_created), CASE WHEN MONTH(date_created) <= 6 THEN 1 ELSE 2 END, HR_Email

UNION ALL

SELECT 
    '4. Yearly' AS Report_Period,
    CAST(YEAR(date_created) AS VARCHAR(4)) AS Period_Value,
    HR_Email,
    COUNT(*) AS Total_Applications,
    SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS [New],
    SUM(CASE WHEN status = 'in consideration' THEN 1 ELSE 0 END) AS [In_Consideration],
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS [Approved],
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS [Rejected]
FROM HR_Activity
GROUP BY YEAR(date_created), HR_Email

ORDER BY Report_Period, Period_Value, HR_Email;