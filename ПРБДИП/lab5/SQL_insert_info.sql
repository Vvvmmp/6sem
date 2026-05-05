
DELETE FROM Application;
DELETE FROM Vacancy;
DELETE FROM Company;
DELETE FROM Resume;
DELETE FROM [User];

DBCC CHECKIDENT ('[User]', RESEED, 0);
DBCC CHECKIDENT ('Resume', RESEED, 0);
DBCC CHECKIDENT ('Company', RESEED, 0);
DBCC CHECKIDENT ('Vacancy', RESEED, 0);
DBCC CHECKIDENT ('Application', RESEED, 0);
GO

INSERT INTO [User] (Email, [Password], Role, Phone, Is_active) VALUES
('admin@global.com', 0xABC123, 1, '+12025550100', 1),
('dmitry.dev@gmail.com', 0x111, 2, '+442079460123', 1),
('elena.hr@itechart.com', 0x222, 3, '+375292223344', 1),
('vlad.fullstack@yahoo.com', 0x333, 2, '+375293334455', 1),
('olga.recruiter@epam.com', 0x444, 3, '+375294445566', 1),
('ivan.eng@outlook.com', 0x555, 2, '+375295556677', 1),
('ceo@heavytech.com', 0x666, 3, '+375172221122', 1),
('kate.marketing@proton.me', 0x777, 2, '+375297778899', 1),
('hr@retailgiant.com', 0x888, 3, '+375441112233', 1),
('alex.qa@icloud.com', 0x999, 2, '+375259998877', 1),
('talent@telecom.by', 0x000, 3, '+375173334455', 1),
('maxim.sys@gmail.com', 0xAAA, 2, '+375291234567', 1),
('hr@brewery.com', 0xBBB, 3, '+375297654321', 1),
('sveta.fin@tut.by', 0xCCC, 2, '+375336001122', 1),
('hiring@bankgroup.com', 0xDDD, 3, '+375179998877', 1),
('pavel.design@behance.net', 0xEEE, 2, '+375298887766', 1),
('hr@tractorfactory.com', 0xFFF, 3, '+375174445566', 1),
('anna.sales@salesforce.com', 0x121, 2, '+375292220011', 1),
('recruitment@wargaming.net', 0x323, 3, '+375175556677', 1),
('igor.devops@linux.com', 0x424, 2, '+375257008090', 1);

INSERT INTO Company (Owner_id, Title, [Description], Address) VALUES
(3, N'iTechArt Group', N'Custom software development and high-growth dedicated teams.', N'8 Tolstogo St, Minsk'),
(5, N'EPAM Systems', N'Leading digital transformation and product engineering services.', N'1/1 Kuprevicha St, Minsk'),
(7, N'HeavyTech MAZ', N'Global manufacturer of heavy-duty trucks and buses.', N'2 Sotsialisticheskaya St, Minsk'),
(9, N'Retail Network Inc', N'The largest grocery and retail chain in the region.', N'2 Montazhnikov St, Minsk'),
(11, N'National Telecom', N'Primary telecommunications and internet service provider.', N'6 Engelsa St, Minsk'),
(13, N'Liberty Brewery', N'Historical brewing company with a global distribution.', N'30 Kiseleva St, Minsk'),
(15, N'Global Bank OAO', N'Universal commercial bank part of Raiffeisen Group.', N'38A Radialnaya St, Minsk'),
(17, N'AgroMach Factory', N'World-famous manufacturer of agricultural machinery.', N'29 Dolgobrodskaya St, Minsk'),
(19, N'Wargaming', N'Award-winning online game developer and publisher.', N'178 Partizanskiy Ave, Minsk'),
(5, N'LeverX Group', N'International IT company and SAP Gold Partner.', N'51 Klary Tsetkin St, Minsk');

INSERT INTO Resume (User_id, Desired_Position, Salary_Expectation, Skills, Work_Experience, City) VALUES
(2, N'Senior .NET Developer', 8500.00, N'C#, .NET Core, SQL Server, Azure, Microservices', N'8 years in Fintech and Banking systems', N'Minsk'),
(4, N'Fullstack JS Developer', 5000.00, N'Node.js, React, MongoDB, TypeScript', N'3 years in European startups', N'Minsk'),
(6, N'Mechanical Engineer', 2200.00, N'AutoCAD, SolidWorks, Equipment maintenance', N'10 years in heavy machinery production', N'Minsk'),
(8, N'Digital Marketer', 2800.00, N'Google Ads, SEO, Analytics, Content Strategy', N'4 years in international E-commerce', N'Minsk'),
(10, N'QA Manual Engineer', 1800.00, N'Test Plans, Bug Reports, Jira, API Testing', N'1 year of internship and junior role', N'Minsk'),
(12, N'System Administrator', 3000.00, N'Linux, Docker, Network Security, Bash', N'6 years of IT infrastructure support', N'Minsk'),
(14, N'Chief Accountant', 3500.00, N'IFRS, Tax Law, SAP, Financial Reporting', N'12 years in corporate finance', N'Minsk'),
(16, N'UI/UX Designer', 4200.00, N'Figma, Adobe XD, Prototyping, User Research', N'5 years in Web and Mobile design', N'Minsk'),
(18, N'Sales Manager', 2000.00, N'B2B Sales, CRM, Cold Calling, Negotiations', N'2 years in active software sales', N'Minsk'),
(20, N'DevOps Engineer', 7000.00, N'Kubernetes, Jenkins, AWS, Terraform', N'4 years of infrastructure automation', N'Minsk');

INSERT INTO Vacancy (Company_id, Job_title, Requirement, Salary_range, Publication_date, Is_active) VALUES
(1, N'.NET Developer', N'Strong C# skills and experience with Cloud.', N'4000 - 7000 BYN', GETDATE(), 1),
(2, N'Java Engineer', N'Senior level, Spring Boot, Microservices.', N'From 9000 BYN', GETDATE(), 1),
(3, N'Assembly Line Mechanic', N'Technical degree and experience in manufacturing.', N'1800 - 2500 BYN', GETDATE(), 1),
(4, N'Store Cashier', N'Reliability, basic math, and customer service.', N'1400 - 1700 BYN', GETDATE(), 1),
(5, N'Network Engineer', N'Higher technical education and CCNA.', N'1600 - 2200 BYN', GETDATE(), 1),
(6, N'Brewing Technologist', N'Experience in food or beverage production.', N'2500 - 3200 BYN', GETDATE(), 1),
(7, N'Loan Specialist', N'Knowledge of banking software and products.', N'2200 - 3500 BYN', GETDATE(), 1),
(8, N'Lather Machinist', N'5th category, ability to read blueprints.', N'2500 - 3000 BYN', GETDATE(), 1),
(9, N'Game Designer', N'Experience with game balance and mechanics.', N'Negotiable', GETDATE(), 1),
(10, N'SAP Consultant', N'ABAP knowledge is a strong advantage.', N'From 5000 BYN', GETDATE(), 1),
(2, N'DevOps Engineer', N'Expert in CI/CD pipelines.', N'7000 - 10000 BYN', GETDATE(), 1),
(1, N'Project Manager', N'Agile, Scrum, Fluent English.', N'4500 - 6000 BYN', GETDATE(), 1),
(4, N'Warehouse Worker', N'Physical stamina and punctuality.', N'1500 BYN', GETDATE(), 1),
(7, N'Business Analyst', N'Experience in Fintech domain.', N'4000 - 5500 BYN', GETDATE(), 1),
(9, N'Python Developer', N'Django/FastAPI proficiency.', N'From 6000 BYN', GETDATE(), 1);

DELETE FROM Application;
DBCC CHECKIDENT ('Application', RESEED, 0);

INSERT INTO Application (vacancy_id, resume_id, date_created, status) VALUES
(1, 1, DATEADD(day, -360, GETDATE()), 'approved'),
(2, 2, DATEADD(day, -355, GETDATE()), 'rejected'),
(3, 3, DATEADD(day, -350, GETDATE()), 'rejected'),
(4, 4, DATEADD(day, -345, GETDATE()), 'approved'),
(5, 5, DATEADD(day, -342, GETDATE()), 'rejected'),
(6, 6, DATEADD(day, -330, GETDATE()), 'rejected'),
(7, 7, DATEADD(day, -325, GETDATE()), 'approved'),
(8, 8, DATEADD(day, -320, GETDATE()), 'rejected'),
(9, 9, DATEADD(day, -315, GETDATE()), 'rejected'),
(10, 10, DATEADD(day, -305, GETDATE()), 'approved'),

(11, 1, DATEADD(day, -295, GETDATE()), 'rejected'),
(12, 2, DATEADD(day, -290, GETDATE()), 'rejected'),
(13, 3, DATEADD(day, -285, GETDATE()), 'approved'),
(14, 4, DATEADD(day, -280, GETDATE()), 'rejected'),
(15, 5, DATEADD(day, -275, GETDATE()), 'approved'),
(1, 6, DATEADD(day, -270, GETDATE()), 'rejected'),
(2, 7, DATEADD(day, -265, GETDATE()), 'rejected'),
(3, 8, DATEADD(day, -260, GETDATE()), 'approved'),
(4, 9, DATEADD(day, -255, GETDATE()), 'rejected'),
(5, 10, DATEADD(day, -252, GETDATE()), 'rejected'),

(6, 1, DATEADD(day, -245, GETDATE()), 'approved'),
(7, 2, DATEADD(day, -240, GETDATE()), 'rejected'),
(8, 3, DATEADD(day, -235, GETDATE()), 'rejected'),
(9, 4, DATEADD(day, -230, GETDATE()), 'approved'),
(10, 5, DATEADD(day, -225, GETDATE()), 'rejected'),
(11, 6, DATEADD(day, -220, GETDATE()), 'rejected'),
(12, 7, DATEADD(day, -215, GETDATE()), 'approved'),
(13, 8, DATEADD(day, -210, GETDATE()), 'rejected'),
(14, 9, DATEADD(day, -205, GETDATE()), 'rejected'),
(15, 10, DATEADD(day, -200, GETDATE()), 'approved'),

(1, 10, DATEADD(day, -195, GETDATE()), 'rejected'),
(2, 9, DATEADD(day, -190, GETDATE()), 'approved'),
(3, 8, DATEADD(day, -185, GETDATE()), 'rejected'),
(4, 7, DATEADD(day, -180, GETDATE()), 'rejected'),
(5, 6, DATEADD(day, -175, GETDATE()), 'approved'),
(6, 5, DATEADD(day, -170, GETDATE()), 'rejected'),
(7, 4, DATEADD(day, -165, GETDATE()), 'rejected'),
(8, 3, DATEADD(day, -160, GETDATE()), 'approved'),
(9, 2, DATEADD(day, -155, GETDATE()), 'rejected'),
(10, 1, DATEADD(day, -150, GETDATE()), 'rejected'),

(11, 2, DATEADD(day, -145, GETDATE()), 'approved'),
(12, 3, DATEADD(day, -140, GETDATE()), 'rejected'),
(13, 4, DATEADD(day, -135, GETDATE()), 'rejected'),
(14, 5, DATEADD(day, -130, GETDATE()), 'approved'),
(15, 6, DATEADD(day, -125, GETDATE()), 'rejected'),
(1, 7, DATEADD(day, -120, GETDATE()), 'rejected'),
(2, 8, DATEADD(day, -115, GETDATE()), 'approved'),
(3, 9, DATEADD(day, -110, GETDATE()), 'rejected'),
(4, 10, DATEADD(day, -105, GETDATE()), 'rejected'),
(5, 1, DATEADD(day, -100, GETDATE()), 'approved'),

(6, 2, DATEADD(day, -95, GETDATE()), 'in consideration'),
(7, 3, DATEADD(day, -90, GETDATE()), 'rejected'),
(8, 4, DATEADD(day, -85, GETDATE()), 'approved'),
(9, 5, DATEADD(day, -80, GETDATE()), 'rejected'),
(10, 6, DATEADD(day, -75, GETDATE()), 'rejected'),
(11, 7, DATEADD(day, -70, GETDATE()), 'in consideration'),
(12, 8, DATEADD(day, -68, GETDATE()), 'rejected'),
(13, 9, DATEADD(day, -65, GETDATE()), 'approved'),
(14, 10, DATEADD(day, -62, GETDATE()), 'rejected'),
(15, 1, DATEADD(day, -60, GETDATE()), 'in consideration'),

(1, 3, DATEADD(day, -58, GETDATE()), 'rejected'),
(2, 4, DATEADD(day, -55, GETDATE()), 'in consideration'),
(3, 5, DATEADD(day, -52, GETDATE()), 'approved'),
(4, 6, DATEADD(day, -50, GETDATE()), 'rejected'),
(5, 7, DATEADD(day, -48, GETDATE()), 'rejected'),
(6, 8, DATEADD(day, -45, GETDATE()), 'in consideration'),
(7, 9, DATEADD(day, -42, GETDATE()), 'approved'),
(8, 10, DATEADD(day, -40, GETDATE()), 'rejected'),
(9, 1, DATEADD(day, -38, GETDATE()), 'rejected'),
(10, 2, DATEADD(day, -35, GETDATE()), 'in consideration'),

(11, 4, DATEADD(day, -30, GETDATE()), 'new'),
(12, 5, DATEADD(day, -28, GETDATE()), 'in consideration'),
(13, 6, DATEADD(day, -26, GETDATE()), 'rejected'),
(14, 7, DATEADD(day, -25, GETDATE()), 'new'),
(15, 8, DATEADD(day, -22, GETDATE()), 'in consideration'),
(1, 9, DATEADD(day, -20, GETDATE()), 'approved'),
(2, 10, DATEADD(day, -19, GETDATE()), 'new'),
(3, 1, DATEADD(day, -18, GETDATE()), 'in consideration'),
(4, 2, DATEADD(day, -16, GETDATE()), 'rejected'),
(5, 3, DATEADD(day, -15, GETDATE()), 'new'),

(6, 5, DATEADD(day, -14, GETDATE()), 'new'),
(7, 6, DATEADD(day, -13, GETDATE()), 'in consideration'),
(8, 7, DATEADD(day, -12, GETDATE()), 'new'),
(9, 8, DATEADD(day, -11, GETDATE()), 'new'),
(10, 9, DATEADD(day, -10, GETDATE()), 'in consideration'),
(11, 10, DATEADD(day, -9, GETDATE()), 'new'),
(12, 1, DATEADD(day, -8, GETDATE()), 'rejected'),
(13, 2, DATEADD(day, -7, GETDATE()), 'new'),
(14, 3, DATEADD(day, -7, GETDATE()), 'in consideration'),
(15, 4, DATEADD(day, -7, GETDATE()), 'new'),

(1, 6, DATEADD(day, -6, GETDATE()), 'new'),
(2, 7, DATEADD(day, -5, GETDATE()), 'new'),
(3, 8, DATEADD(day, -4, GETDATE()), 'in consideration'),
(4, 9, DATEADD(day, -4, GETDATE()), 'new'),
(5, 10, DATEADD(day, -3, GETDATE()), 'new'),
(6, 1, DATEADD(day, -2, GETDATE()), 'new'),
(7, 2, DATEADD(day, -2, GETDATE()), 'new'),
(8, 3, DATEADD(day, -1, GETDATE()), 'in consideration'),
(9, 4, DATEADD(day, 0, GETDATE()), 'new'),
(10, 5, DATEADD(day, 0, GETDATE()), 'new');
GO

--select * FROM Application;
--select * FROM Vacancy;
--select * FROM Company;
--select * FROM Resume;
--select * FROM [User];