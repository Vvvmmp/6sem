CREATE INDEX idx_obj_person_email ON obj_person(email);

--created with alias (we can create index with function result via DETERMINISTIC parameter)
CREATE INDEX idx_obj_person_method ON obj_person p (p.get_contact_info());