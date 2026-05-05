CREATE TABLE FACULTY (
    FACULTY      NVARCHAR(10)  NOT NULL PRIMARY KEY, -- Было CHAR
    FACULTY_NAME NVARCHAR(100) NULL
);

CREATE TABLE PULPIT (
    PULPIT      NVARCHAR(10)  NOT NULL PRIMARY KEY, -- Было CHAR
    PULPIT_NAME NVARCHAR(100) NULL,
    FACULTY     NVARCHAR(10)  NOT NULL FOREIGN KEY REFERENCES FACULTY(FACULTY)
);

CREATE TABLE TEACHER (
    TEACHER      NVARCHAR(20)  NOT NULL PRIMARY KEY,
    TEACHER_NAME NVARCHAR(100) NULL,
    PULPIT       NVARCHAR(10)  NOT NULL FOREIGN KEY REFERENCES PULPIT(PULPIT)
);

CREATE TABLE [SUBJECT] (
    [SUBJECT]    NVARCHAR(20)  NOT NULL PRIMARY KEY,
    SUBJECT_NAME NVARCHAR(100) NULL,
    PULPIT       NVARCHAR(10)  NOT NULL FOREIGN KEY REFERENCES PULPIT(PULPIT) ON DELETE CASCADE
);

CREATE TABLE AUDITORIUM_TYPE (
    AUDITORIUM_TYPE     NVARCHAR(10)  NOT NULL PRIMARY KEY,
    AUDITORIUM_TYPENAME NVARCHAR(100) NULL
);

CREATE TABLE AUDITORIUM (
    AUDITORIUM          NVARCHAR(20)  NOT NULL PRIMARY KEY,
    AUDITORIUM_NAME     NVARCHAR(100) NULL,
    AUDITORIUM_CAPACITY INT           NULL,
    AUDITORIUM_TYPE     NVARCHAR(10)  NOT NULL FOREIGN KEY REFERENCES AUDITORIUM_TYPE(AUDITORIUM_TYPE)
);

INSERT INTO FACULTY (FACULTY, FACULTY_NAME) VALUES 
(N'ФИТ', N'Факультет информационных технологий'),
(N'ХТиТ', N'Факультет химической технологии и техники'),
(N'ИЭФ', N'Инженерно-экономический факультет'),
(N'ТОВ', N'Факультет технологии органических веществ');

INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY) VALUES 
(N'ИСиТ', N'Кафедра информационных систем и технологий', N'ФИТ'),
(N'ПОИБМС', N'Кафедра программного обеспечения информационных технологий', N'ФИТ'),
(N'ВМ', N'Кафедра высшей математики', N'ФИТ'),
(N'ФизХим', N'Кафедра физической и коллоидной химии', N'ХТиТ'),
(N'Менеджмент', N'Кафедра менеджмента, технологий бизнеса и устойч. развития', N'ИЭФ');

INSERT INTO TEACHER (TEACHER, TEACHER_NAME, PULPIT) VALUES 
(N'Шиман', N'Шиман Дмитрий Васильевич', N'ИСиТ'),
(N'Урбанович', N'Урбанович Павел Павлович', N'ИСиТ'),
(N'Жигадло', N'Жигадло Анна Павловна', N'ПОИБМС'),
(N'Близняк', N'Близняк Николай Власович', N'ПОИБМС'),
(N'Асмыкович', N'Асмыкович Иван Кузьмич', N'ВМ'),
(N'Барковский', N'Барковский Евгений Викторович', N'ФизХим'),
(N'Новикова', N'Новикова Ирина Васильевна', N'Менеджмент');

INSERT INTO [SUBJECT] ([SUBJECT], SUBJECT_NAME, PULPIT) VALUES 
(N'СУБД', N'Системы управления базами данных', N'ИСиТ'),
(N'ОАиП', N'Основы алгоритмизации и программирования', N'ИСиТ'),
(N'КПиЯП', N'Конструирование программ и языки программирования', N'ПОИБМС'),
(N'КГ', N'Компьютерная геометрия', N'ПОИБМС'),
(N'МатАн', N'Математический анализ', N'ВМ'),
(N'ФизХимия', N'Физическая химия', N'ФизХим'),
(N'ЭконПред', N'Экономика предприятия', N'Менеджмент');

INSERT INTO AUDITORIUM_TYPE (AUDITORIUM_TYPE, AUDITORIUM_TYPENAME) VALUES 
(N'ЛК', N'Лекционная'),
(N'ЛБ-К', N'Компьютерный класс'),
(N'ЛБ-Х', N'Химическая лаборатория'),
(N'ПЗ', N'Аудитория для практических занятий');

INSERT INTO AUDITORIUM (AUDITORIUM, AUDITORIUM_NAME, AUDITORIUM_CAPACITY, AUDITORIUM_TYPE) VALUES 
(N'313-4', N'313-4', 60, N'ЛК'),
(N'106-4', N'106-4', 15, N'ЛБ-К'),
(N'324-1', N'324-1', 90, N'ЛК'),
(N'205-2', N'205-2', 20, N'ЛБ-Х'),
(N'415-3', N'415-3', 30, N'ПЗ'),
(N'134-4', N'134-4', 60, N'ЛК');
