--CREATE pluggable DATABASE hiring_staff_app
--admin USER admin_hiring_app identified BY pass
--FILE_NAME_CONVERT = ('/pdbseed/', '/hiring_staff_app/');

--ALTER PLUGGABLE DATABASE hiring_staff_app OPEN;
--ALTER PLUGGABLE DATABASE hiring_staff_app SAVE STATE;


ALTER SESSION SET container = hiring_staff_app;

GRANT dba TO  admin_hiring_app;
GRANT CREATE TABLE TO admin_hiring_app;
GRANT CREATE SEQUENCE TO admin_hiring_app;

CREATE TABLESPACE ts_hiring_data
DATAFILE 'hiring_data01.dbf' SIZE 100M;

ALTER USER admin_hiring_app DEFAULT TABLESPACE ts_hiring_data;
ALTER USER admin_hiring_app QUOTA UNLIMITED ON ts_hiring_data;


