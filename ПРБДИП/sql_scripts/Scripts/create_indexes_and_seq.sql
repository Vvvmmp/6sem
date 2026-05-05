use hiring_staff;

CREATE INDEX IX_Vacancy_IsActive ON Vacancy(Is_active) INCLUDE (Job_title, Salary_range);
CREATE INDEX IX_Resume_City ON Resume(City);

CREATE UNIQUE INDEX IX_User_Email ON [User](Email);




--sequence
CREATE SEQUENCE Vacancy_Seq START WITH 1 INCREMENT BY 1;