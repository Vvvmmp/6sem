--1 exercise
create table Employees(
    Employee_Id int not null IDENTITY(1,1) PRIMARY KEY,
    First_name varchar(50) not null,
    Last_name varchar(50) not null
);

create table Equipments(
    Equipment_Id int not null IDENTITY(1,1) PRIMARY KEY,
    name varchar(50) not null
);

create table Equipment_Assignments(
    Assignment_Id int not null IDENTITY(1,1) PRIMARY KEY,
    Employee_Id int not null REFERENCES Employees(Employee_Id),
    Equipment_Id int not null REFERENCES Equipments(Equipment_Id),
    Issue_Date date not null,
    Return_Date date
);


--2 exercise
create table Assembly_Hall(
    Hall_Id int not null IDENTITY(1,1) PRIMARY KEY,
    Capacity int not null,
    Name_Hall varchar(50)
);

create table Session(
    Session_Id int not null IDENTITY(1,1) PRIMARY KEY,
    Title varchar(150) not null
)

create table Speaker(
    Speaker_id int not null IDENTITY(1,1) PRIMARY KEY,
    First_Name varchar(50) not null,
    Last_Name varchar(50) not null,
    Description varchar(250)
)

create table Audit_Sessions(
    Audit_Id int not null IDENTITY(1,1) PRIMARY KEY,
    Session_Id int not null REFERENCES [Session](Session_Id),
    Speaker_id int not null REFERENCES Speaker(Speaker_id),
    Start_Time DATETIME not null,
    End_Time DATETIME
);

CREATE TABLE Session_Halls(
    Booking_Id int not null IDENTITY(1,1) PRIMARY KEY,
    Audit_Id int not null REFERENCES Audit_Sessions(Audit_Id),
    Hall_Id int not null REFERENCES Assembly_Hall(Hall_Id)
);