use hiring_staff;
GO

CREATE OR ALTER PROCEDURE registry
  @p_email nvarchar(255),
  @p_password nvarchar(255),
  @p_role integer,
  @p_phone nvarchar(20)
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO [User] ([Email], [Password], [Role], [Phone], [Is_active])
  VALUES (@p_email, HASHBYTES('SHA2_256', @p_password), @p_role, @p_phone, 1);
  
  RETURN SCOPE_IDENTITY(); 
END;
exec registry
	@p_email = 'test@gmail.com',
	@p_password = '1515',
	@p_role = 1,
	@p_phone = '+375-29-111-11-11';
	

CREATE OR ALTER PROCEDURE add_vacancy
    @p_company_id INT,
    @p_job_title NVARCHAR(255),
    @p_requirement TEXT,
    @p_salary_range NVARCHAR(100) = NULL
AS
BEGIN
    INSERT INTO Vacancy (Company_id, Job_title, Requirement, Salary_range, Publication_date, Is_active)
    VALUES (@p_company_id, @p_job_title, @p_requirement, @p_salary_range, GETDATE(), 1);
END;
GO

CREATE OR ALTER PROCEDURE apply_for_job
    @p_vacancy_id INT,
    @p_resume_id INT
AS
BEGIN
    INSERT INTO Application (vacancy_id, resume_id, date_created, status)
    VALUES (@p_vacancy_id, @p_resume_id, GETDATE(), 'new');
END;
GO

CREATE OR ALTER PROCEDURE update_application_status
    @p_app_id INT,
    @p_status NVARCHAR(50) 
AS
BEGIN TRY
    UPDATE Application 
    SET status = @p_status 
    WHERE id = @p_app_id;

    IF @@ROWCOUNT = 0
        RAISERROR('Application not found', 16, 1);
END TRY
BEGIN CATCH
    DECLARE @Msg NVARCHAR(4000) = ERROR_MESSAGE();
    RAISERROR(@Msg, 16, 1);
END CATCH;
GO

CREATE OR ALTER PROCEDURE set_user_block_status
    @p_user_id INT,
    @p_is_active BIT
AS
BEGIN
    UPDATE [User] SET Is_active = @p_is_active WHERE ID = @p_user_id;
END;
GO

CREATE OR ALTER PROCEDURE create_company_profile
    @p_owner_id INT,
    @p_title NVARCHAR(255),
    @p_description TEXT,
    @p_address TEXT
AS
BEGIN
    INSERT INTO Company (Owner_id, Title, [Description], Address)
    VALUES (@p_owner_id, @p_title, @p_description, @p_address);
END;
GO