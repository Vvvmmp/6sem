LOAD DATA
INFILE '/opt/oracle/docs/import_vac.csv'
INTO TABLE vacation
APPEND  
FIELDS TERMINATED BY ','
(
    user_id,
    start_date DATE "DD.MM.YYYY",
    end_date DATE "DD.MM.YYYY",
    vacation_type "UPPER(:vacation_type)",
    days_count "ROUND(TO_NUMBER(:days_count, '99.99'), 1)"
)