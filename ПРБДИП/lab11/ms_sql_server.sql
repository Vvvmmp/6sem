select top 0 * from dbo.Application;
select top 0 * from dbo.Company;
select top 0 * from dbo.[Resume];
select top 0 * from dbo.[User];
select top 0 * from dbo.Vacancy;
GO

CREATE TABLE dbo.Vacation (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    User_id INT REFERENCES dbo.[User](ID),
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Vacation_Type NVARCHAR(50) NOT NULL, 
    Days_Count AS DATEDIFF(day, Start_Date, End_Date) + 1 
);

INSERT INTO dbo.Vacation (User_id, Start_Date, End_Date, Vacation_Type)
VALUES 
(1, '2026-06-01', '2026-06-14', N'Оплачиваемый'),
(2, '2026-07-10', '2026-07-20', N'Оплачиваемый'),
(3, '2026-05-01', '2026-05-05', N'Больничный');
GO

select * from dbo.Vacation;

GO
--создать табличную функцию для отбора необходимых данных 
--(аргументы – две даты: первая – начало периода выборки, 
--вторая – окончание периода выборки, данные взять из таблиц по варианту)
create or alter FUNCTION dbo.GetVacationByPeriod(
    @StartDay Date,
    @EndDay Date
)
RETURNS Table
AS
RETURN (
    select
        u.Email,
        u.Phone,
        v.Vacation_Type,
        v.Start_Date,
        v.End_Date,
        v.Days_Count
    from dbo.[User] u 
    join dbo.[Vacation] v on u.ID = v.[User_id] 
    where v.Start_Date >= @StartDay and v.End_Date <@EndDay
);
go

SELECT * FROM dbo.GetVacationByPeriod('2026-01-01', '2026-12-31');



--ex4
go
CREATE OR ALTER VIEW dbo.Vacation_Import AS
SELECT User_id, Start_Date, End_Date, Vacation_Type
FROM dbo.Vacation;

go
BULK INSERT dbo.Vacation_Import
FROM '/opt/mssql/ex3_import.csv' --save with utf-16le!
WITH (
    FORMAT = 'CSV',
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n'
);
GO

SELECT * FROM dbo.Vacation;
delete from dbo.Vacation where id > 3;



