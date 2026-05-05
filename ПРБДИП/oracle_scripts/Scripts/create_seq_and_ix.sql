CREATE SEQUENCE Vac_seq 
	START WITH 1
	INCREMENT by 1
	NOCACHE;

CREATE INDEX INX_Vacancy_IsActive 
ON vacancy(Is_Active, Job_title, Salary_range);

CREATE INDEX IX_Resume_City 
ON Resume(City);

CREATE UNIQUE INDEX IX_User_Email 
ON "User"(Email);

--5 процедур, 5 функций, 1 индекс, 1 триггер, 1 представление