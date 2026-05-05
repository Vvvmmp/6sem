CREATE TABLE xml_report (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    xml_doc XMLTYPE
);



CREATE OR REPLACE PROCEDURE p_generate_xml (p_result_xml OUT XMLTYPE) 
IS
BEGIN
    SELECT XMLELEMENT("RecruitmentReport",
               XMLATTRIBUTES(SYSTIMESTAMP AS "GeneratedAt"),
               XMLELEMENT("Candidates",
                   XMLAGG(
                       XMLELEMENT("Candidate",
                           XMLATTRIBUTES(u.email AS "Email", COUNT(a.id) AS "TotalApps"),
                           XMLELEMENT("Applications",
                               XMLAGG(
                                   XMLELEMENT("Application",
                                       XMLATTRIBUTES(TO_CHAR(a.date_created, 'YYYY-MM-DD') AS "Date", a.status AS "Status")
                                   )
                               )
                           )
                       )
                   )
               )
           )
    INTO p_result_xml
    FROM "User" u
    JOIN resume r ON u.id = r.user_id
    JOIN application a ON r.id = a.resume_id
    GROUP BY u.email;
END;
/



CREATE OR REPLACE PROCEDURE p_insert_xml (p_xml_data IN XMLTYPE) 
IS
BEGIN
    INSERT INTO xml_report (xml_doc) VALUES (p_xml_data);
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('success!');
END;
/

DECLARE
    v_my_xml XMLTYPE;
BEGIN
    p_generate_xml(v_my_xml); 
    p_insert_xml(v_my_xml);   
END;
/

select * from xml_report;
delete from XML_REPORT;


CREATE INDEX idx_xml_report_data 
ON xml_report(xml_doc) 
INDEXTYPE IS XDB.XMLINDEX;


CREATE OR REPLACE PROCEDURE p_extract_from_xml (p_target_email IN VARCHAR2) 
IS
    v_found NUMBER := 0;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Статусы откликов для: ' || p_target_email);
    
    FOR rec IN (
        SELECT xt.app_status, xt.app_date
        FROM xml_report r,
             XMLTABLE(
                 '/RecruitmentReport/Candidates/Candidate[@Email=$email_param]/Applications/Application'
                 PASSING r.xml_doc, p_target_email AS "email_param"
                 COLUMNS 
                     app_date VARCHAR2(20) PATH '@Date',
                     app_status VARCHAR2(50) PATH '@Status'
             ) xt
    ) LOOP
        DBMS_OUTPUT.PUT_LINE('Дата: ' || rec.app_date || ' | Статус: ' || rec.app_status);
        v_found := 1;
    END LOOP;

    IF v_found = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Кандидат не найден или у него нет откликов в отчете.');
    END IF;
END;
/

EXEC p_extract_from_xml('admin@global.com'); 
EXEC p_extract_from_xml('alex.qa@icloud.com'); 