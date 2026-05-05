
CREATE FUNCTION dbo.get_application_count(@vacancy_id INT)
RETURNS INT
AS
BEGIN
    DECLARE @cnt INT;
    SELECT @cnt = COUNT(*) FROM Application WHERE vacancy_id = @vacancy_id;
    RETURN @cnt;
END;
GO


CREATE FUNCTION dbo.is_user_active(@user_id INT)
RETURNS TINYINT
AS
BEGIN
    DECLARE @active TINYINT;
    SELECT @active = Is_active FROM [User] WHERE ID = @user_id;
    RETURN ISNULL(@active, 0);
END;
GO


CREATE FUNCTION dbo.get_avg_salary_by_city(@city NVARCHAR(100))
RETURNS DECIMAL(18, 2)
AS
BEGIN
    DECLARE @avg_sal DECIMAL(18, 2);
    SELECT @avg_sal = AVG(Salary_Expectation) FROM Resume WHERE City = @city;
    RETURN ISNULL(@avg_sal, 0);
END;
GO


CREATE FUNCTION dbo.get_company_name_by_vacancy(@vacancy_id INT)
RETURNS NVARCHAR(255)
AS
BEGIN
    DECLARE @name NVARCHAR(255);
    SELECT @name = c.Title 
    FROM Company c 
    JOIN Vacancy v ON c.ID = v.Company_id 
    WHERE v.ID = @vacancy_id;
    RETURN ISNULL(@name, N'Unknown');
END;
GO


CREATE FUNCTION dbo.count_active_vacancies(@company_id INT)
RETURNS INT
AS
BEGIN
    DECLARE @cnt INT;
    SELECT @cnt = COUNT(*) FROM Vacancy WHERE Company_id = @company_id AND Is_active = 1;
    RETURN @cnt;
END;
GO

select * from COMPANY C ;
SELECT dbo.count_active_vacancies(1) AS count_active;

select * from application;
exec update_application_status  @p_app_id = 1,
    @p_status = 'approved';


