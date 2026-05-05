CREATE TABLE obj_person OF t_person (
    id PRIMARY KEY
);

CREATE TABLE obj_trip OF t_trip (
    trip_id PRIMARY KEY
);

INSERT INTO obj_person 
SELECT t_person(id, email, phone) 
FROM "User";

INSERT INTO obj_person VALUES (t_person(99, 'new.guy@test.com'));
select * from obj_person;
COMMIT;