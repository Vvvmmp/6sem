CREATE TABLE dbo.Report (
    id INT IDENTITY(1,1) PRIMARY KEY,
    xml_doc XML
);
GO



CREATE OR ALTER PROCEDURE dbo.p_generate_xml 
    @result_xml XML OUTPUT
AS
BEGIN
    SET @result_xml = (
        SELECT 
            GETDATE() AS '@GeneratedAt',
            (
                SELECT 
                    u.Email AS '@Email',
                    COUNT(a.ID) AS '@TotalApps',
                    (
                        SELECT 
                            CAST(a2.date_created AS DATE) AS '@Date',
                            a2.status AS '@Status'
                        FROM dbo.[Resume] r2
                        JOIN dbo.Application a2 ON r2.ID = a2.resume_id
                        WHERE r2.User_id = u.ID
                        FOR XML PATH('Application'), TYPE
                    ) AS 'Applications'
                FROM dbo.[User] u
                JOIN dbo.[Resume] r ON u.ID = r.User_id
                JOIN dbo.Application a ON r.ID = a.resume_id
                GROUP BY u.ID, u.Email
                FOR XML PATH('Candidate'), TYPE
            ) AS 'Candidates'
        FOR XML PATH('RecruitmentReport'), TYPE
    );
END;
GO


CREATE OR ALTER PROCEDURE dbo.p_insert_xml 
    @xml_data XML
AS
BEGIN
    INSERT INTO dbo.Report (xml_doc) VALUES (@xml_data);
    PRINT 'success!';
END;
GO

DECLARE @my_xml XML;
EXEC dbo.p_generate_xml @result_xml = @my_xml OUTPUT;
EXEC dbo.p_insert_xml @xml_data = @my_xml;

SELECT * FROM dbo.Report;
--delete from dbo.Report;

CREATE PRIMARY XML INDEX idx_xml_report_data 
ON dbo.Report(xml_doc);
GO


CREATE OR ALTER PROCEDURE dbo.p_extract_from_xml 
    @target_email NVARCHAR(100)
AS
BEGIN
    SELECT 
        AppNode.value('(@Date)[1]', 'DATE') AS ApplicationDate,
        AppNode.value('(@Status)[1]', 'NVARCHAR(50)') AS ApplicationStatus
    FROM dbo.Report r
    CROSS APPLY r.xml_doc.nodes(
        '/RecruitmentReport/Candidates/Candidate[@Email=sql:variable("@target_email")]/Applications/Application'
    ) AS T(AppNode);
    
END;
GO

EXEC dbo.p_extract_from_xml @target_email = 'admin@global.com';
EXEC dbo.p_extract_from_xml @target_email = 'dmitry.dev@gmail.com';