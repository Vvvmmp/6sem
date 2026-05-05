SELECT 
    p.id AS person_id, 
    p.email, 
    t.destination AS trip_city,
    t.days_count
FROM TABLE(
    t_person_nt(
        t_person(1, 'admin@global.com', '+12025550100', t_trip_nt(t_trip(1, 'Minsk', 2, NULL))),
        t_person(2, 'arseniy.dev@gmail.com', '1111', t_trip_nt())
    )
) p
LEFT JOIN TABLE(p.trips) t ON 1=1;

