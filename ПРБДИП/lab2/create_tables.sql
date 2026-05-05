USE hiring_staff;
GO

DROP TABLE IF EXISTS Application;
DROP TABLE IF EXISTS Vacancy;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS Resume;
DROP TABLE IF EXISTS [User];

CREATE TABLE [User] (
    ID INT PRIMARY KEY identity(1,1),
    Email NVARCHAR(255) NOT NULL, 
    [Password] VARBINARY(8000) NOT NULL,
    Role INT CHECK (Role >= 1 AND Role <= 3), 
    Phone NVARCHAR(20) NOT NULL,
    Is_active BIT DEFAULT 1
);
--ALTER TABLE [User] DROP COLUMN [Password];
--ALTER TABLE [User] ADD [Password] VARBINARY(8000) NOT NULL;
--ALTER TABLE [User] ALTER COLUMN [ID] INT PRIMARY KEY IDENTITY(1,1);


CREATE TABLE Resume (
    ID INT PRIMARY KEY identity(1,1),
    User_id INT FOREIGN KEY REFERENCES [User](ID),  
    Desired_Position NVARCHAR(255),
    Salary_Expectation DECIMAL(18, 2), 
    Skills TEXT, 
    Work_Experience TEXT,
    City NVARCHAR(100)
);

CREATE TABLE Company (
    ID INT PRIMARY KEY identity(1,1),
    Owner_id INT FOREIGN KEY REFERENCES [User](ID),
    Title NVARCHAR(255) NOT NULL,
    [Description] TEXT NOT NULL,
    Address TEXT NOT NULL
);

CREATE TABLE Vacancy (
    ID INT PRIMARY KEY identity(1,1),
    Company_id INT FOREIGN KEY REFERENCES Company(ID),
    Job_title NVARCHAR(255) NOT NULL,
    Requirement TEXT NOT NULL,
    Salary_range NVARCHAR(100),
    Publication_date DATETIME DEFAULT GETDATE(), 
    Is_active BIT DEFAULT 1
);

CREATE TABLE Application (
    id INT PRIMARY KEY identity(1,1), 
    vacancy_id INT FOREIGN KEY REFERENCES Vacancy(ID),
    resume_id INT FOREIGN KEY REFERENCES Resume(ID),
    date_created DATETIME DEFAULT GETDATE(),
    status NVARCHAR(50) CHECK (status IN ('new','approved','rejected','in consideration'))
);