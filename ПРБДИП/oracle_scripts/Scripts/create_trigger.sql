CREATE OR REPLACE TRIGGER trg_check_vacancy_active
BEFORE INSERT ON Application
FOR EACH ROW
DECLARE
    l_active NUMBER;
BEGIN
    SELECT Is_active INTO l_active FROM Vacancy WHERE ID = :NEW.vacancy_id;
    
    IF l_active = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'Нельзя подать заявку на архивную вакансию.');
    END IF;
END;
/