SET ECHO OFF
SET VERIFY OFF
SET HEADING OFF
SET FEEDBACK OFF
SET PAGESIZE 0
SET LINESIZE 1000
SET TRIMSPOOL ON
SET TERMOUT OFF

SPOOL /opt/oracle/docs/ex6_export.csv

SELECT 
    email || ',' || 
    TO_CHAR(start_date, 'DD.MM.YYYY') || ',' || 
    TO_CHAR(end_date, 'DD.MM.YYYY') || ',' || 
    vac_type || ',' || 
    days
FROM TABLE(get_vacations(TO_DATE('01.01.2026', 'DD.MM.YYYY'), TO_DATE('31.12.2026', 'DD.MM.YYYY')));

SPOOL OFF
EXIT;