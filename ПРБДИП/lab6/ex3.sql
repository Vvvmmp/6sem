WITH HR_Activity AS (
    SELECT 
        u.Email AS HR_Email,
        a.date_created,
        a.status
    FROM Application a
    JOIN Vacancy v ON a.vacancy_id = v.ID
    JOIN Company c ON v.Company_id = c.ID
    JOIN "User" u ON c.Owner_id = u.ID
),
Grouped_Status AS (
    SELECT 
        '1. Monthly' AS Report_Period,
        TO_CHAR(date_created, 'YYYY-MM') AS Period_Value,
        HR_Email,
        COUNT(*) AS Total_Applications,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS Approved_Count,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS Rejected_Count
    FROM HR_Activity
    GROUP BY TO_CHAR(date_created, 'YYYY-MM'), HR_Email
)
SELECT 
    Report_Period,
    Period_Value,
    HR_Email,
    CAST(Approved_Count AS INT) AS Hired_Count,
    ROUND(
        NVL(Approved_Count / NULLIF(SUM(Approved_Count) OVER (PARTITION BY Period_Value), 0) * 100, 0), 
        2
    ) AS Pct_Of_Total_Hired,
    ROUND(
        NVL(Approved_Count / NULLIF(Rejected_Count, 0) * 100, 0), 
        2
    ) AS Pct_Compared_To_Rejected
FROM Grouped_Status 
ORDER BY 
    Period_Value, 
    HR_Email;