DECLARE @PageNumber INT = 2; 
DECLARE @RowsPerPage INT = 5;
select * from(
SELECT 
        u.Email AS HR_Email,
        a.date_created,
        a.status,
        ROW_NUMBER() over(ORDER BY u.Email) as Row_Num
    FROM Application a
    JOIN Vacancy v ON a.vacancy_id = v.ID
    JOIN Company c ON v.Company_id = c.ID
    JOIN [User] u ON c.Owner_id = u.ID
) as pages
where Row_Num > ((@PageNumber -1 ) * @RowsPerPage) AND 
    Row_Num <= (@PageNumber * @RowsPerPage);