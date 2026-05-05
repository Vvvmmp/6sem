DELETE FROM Application;
DELETE FROM Resume;
DELETE FROM Vacancy;
DELETE FROM Company;
DELETE FROM [User];

--DBCC CHECKIDENT ('[User]', RESEED, 0);
--DBCC CHECKIDENT ('Company', RESEED, 0);
GO

INSERT INTO [User] (Email, [Password], Role, Phone)
VALUES ('admin@corp.com', 0x123456, 1, '+37529-111-11-11');

DECLARE @AdminID INT = SCOPE_IDENTITY();

INSERT INTO Company (Owner_id, Title, [Description], Address, Node)
VALUES (@AdminID, 'head_title', 'Head office', 'Minsk, Octyabrskaya', hierarchyid::GetRoot());

GO
--check AddSubordinate
DECLARE @RootID INT = (SELECT ID FROM Company WHERE Node = hierarchyid::GetRoot());

EXEC AddSubordinate @RootID, @AdminID, 'filial East', 'office in Mogilev', 'Mogilev, lenina 1';
DECLARE @AdminID INT = (SELECT ID FROM [User] WHERE Email = 'admin@corp.com');
EXEC AddSubordinate 1071, @AdminID, '1.1.1 sub sub filial West', 'office in Brest', 'Brest, paradnaya 23';

DECLARE @EastID INT = (SELECT ID FROM Company WHERE Title = 'filial East');
EXEC AddSubordinate @EastID, @AdminID, 'IT-department East', 'Development', 'Mogilev, lenina 52, fl.10, kab 1065';

DECLARE @ITID INT = (SELECT ID FROM Company WHERE Title = 'IT-department East');
EXEC AddSubordinate @ITID, @AdminID, 'Testing group', 'QA Team', 'kab 12';


GO
--check GetSubordinates
DECLARE @RootID INT = (SELECT ID FROM Company WHERE Node = hierarchyid::GetRoot());
PRINT '--- structure ---';
EXEC GetSubordinates @RootID;

GO
--check MoveSubordinates
DECLARE @EastBranchID INT = (SELECT ID FROM Company WHERE Title = 'filial East');
DECLARE @WestBranchID INT = (SELECT ID FROM Company WHERE Title = 'sub sub filial West');

PRINT '--- move IT-department from east to west ---';

EXEC MoveSubordinates @EastBranchID, @WestBranchID;

DECLARE @RootID INT = (SELECT ID FROM Company WHERE Node = hierarchyid::GetRoot());
EXEC GetSubordinates @RootID;
GO
