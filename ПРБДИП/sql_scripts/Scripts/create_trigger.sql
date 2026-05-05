CREATE TRIGGER trg_check_vacancy_active
ON Application
INSTEAD OF INSERT
AS
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM inserted i
        JOIN Vacancy v ON i.vacancy_id = v.ID
        WHERE v.Is_active = 0
    )
    BEGIN
        RAISERROR (N'Ошибка: Нельзя подать заявку на неактивную вакансию.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    INSERT INTO Application (vacancy_id, resume_id, date_created, status)
    SELECT vacancy_id, resume_id, ISNULL(date_created, GETDATE()), status
    FROM inserted;
END;
GO