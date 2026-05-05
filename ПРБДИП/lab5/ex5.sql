with Dublicates as(
    SELECT 
      id, 
      vacancy_id, 
      resume_id,
      date_created,
      ROW_NUMBER() OVER (
          PARTITION BY vacancy_id, resume_id 
          ORDER BY date_created ASC
      ) as row_num
   FROM Application
)
delete from Application
where id in (
  select id from Dublicates where row_num > 1
);