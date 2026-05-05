CREATE OR REPLACE PROCEDURE registry(
  p_email    IN NVARCHAR2,
  p_password IN NVARCHAR2,
  p_role     IN INTEGER,
  p_phone    IN NVARCHAR2,
  p_id       OUT NUMBER 
) AS
BEGIN
  INSERT INTO "User" (Email, Password, Role, Phone, Is_active)
  VALUES (
    p_email, 
    STANDARD_HASH(p_password, 'SHA256'), 
    p_role, 
    p_phone, 
    1
  )
  RETURNING ID INTO p_id; 
  
  COMMIT; 
END;
/

CREATE OR REPLACE PROCEDURE add_vacancy (
    p_company_id   IN NUMBER,
    p_job_title    IN NVARCHAR2,
    p_requirement  IN CLOB, 
    p_salary_range IN NVARCHAR2 DEFAULT NULL
) AS
BEGIN
    INSERT INTO Vacancy (Company_id, Job_title, Requirement, Salary_range, Publication_date, Is_active)
    VALUES (p_company_id, p_job_title, p_requirement, p_salary_range, SYSDATE, 1);
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE apply_for_job (
    p_vacancy_id IN NUMBER,
    p_resume_id  IN NUMBER
) AS
BEGIN
    INSERT INTO Application (vacancy_id, resume_id, date_created, status)
    VALUES (p_vacancy_id, p_resume_id, SYSDATE, 'new');
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE update_application_status (
    p_app_id IN NUMBER,
    p_status IN NVARCHAR2
) AS
BEGIN
    UPDATE Application 
    SET status = p_status 
    WHERE id = p_app_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Application not found');
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE; 
END;
/

CREATE OR REPLACE PROCEDURE set_user_block_status (
    p_user_id   IN NUMBER,
    p_is_active IN NUMBER 
) AS
BEGIN
    UPDATE "User" SET Is_active = p_is_active WHERE ID = p_user_id;
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE create_company_profile (
    p_owner_id    IN NUMBER,
    p_title       IN NVARCHAR2,
    p_description IN CLOB,
    p_address     IN CLOB
) AS
BEGIN
    INSERT INTO Company (Owner_id, Title, Description, Address)
    VALUES (p_owner_id, p_title, p_description, p_address);
    COMMIT;
END;
/