DELETE FROM Application;
DELETE FROM Vacancy;
DELETE FROM Company;
DELETE FROM Resume;
DELETE FROM [User];

DBCC CHECKIDENT ('[User]', RESEED, 0);
DBCC CHECKIDENT ('Company', RESEED, 0);
DBCC CHECKIDENT ('Vacancy', RESEED, 0);
DBCC CHECKIDENT ('Resume', RESEED, 0);
DBCC CHECKIDENT ('Application', RESEED, 0);

DECLARE @OwnerID INT, @CandidateID INT, @CompID INT, @VacID INT, @ResID INT, @AppID INT;

-- Регистрация
EXEC @OwnerID = registry 'owner1@work.by', '123', 2, '111';
EXEC @CandidateID = registry 'candidate@work.by', 'pass', 1, '222';

-- Компания и вакансия
EXEC create_company_profile @OwnerID, N'Tech Solutions', N'IT Services', N'Minsk';
SET @CompID = (SELECT TOP 1 ID FROM Company WHERE Owner_id = @OwnerID);

EXEC add_vacancy @CompID, N'SQL Developer', N'TSQL Expert', N'2000$';
SET @VacID = (SELECT TOP 1 ID FROM Vacancy WHERE Company_id = @CompID);

-- Резюме и отклик
INSERT INTO Resume (User_id, Desired_Position, Salary_Expectation, City)
VALUES (@CandidateID, N'Junior Dev', 1000, N'Minsk');
SET @ResID = (SELECT TOP 1 ID FROM Resume WHERE User_id = @CandidateID);

EXEC apply_for_job @VacID, @ResID;
SET @AppID = (SELECT TOP 1 ID FROM Application WHERE resume_id = @ResID);

-- Статус и блокировка
EXEC update_application_status @AppID, N'approved';
EXEC set_user_block_status @CandidateID, 0;

-- Финальная проверка
SELECT * FROM [User];
SELECT * FROM Company;
SELECT * FROM Application;
SELECT * FROM RESUME;
SELECT * FROM VACANCY;




