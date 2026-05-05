CREATE TABLE employee_profiles (
    emp_id NUMBER PRIMARY KEY,
    full_name VARCHAR2(100)
);

ALTER TABLE employee_profiles 
ADD (
    foto BLOB,
    doc BFILE
)
LOB (foto) STORE AS (TABLESPACE lob_data_tbs);


--insert
INSERT INTO employee_profiles (emp_id, full_name, foto, doc)
VALUES (
    1, 
    'Test Empl', 
    EMPTY_BLOB(), 
    BFILENAME('EXT_DOCS_DIR', 'word.doc') 
);
COMMIT;

INSERT INTO employee_profiles (emp_id, full_name, foto, doc)
VALUES (
    2, 
    'Test Empl2', 
    BFILENAME('EXT_DOCS_DIR', 'photo.png'),
    BFILENAME('EXT_DOCS_DIR', 'word.doc') 
);
COMMIT;

DECLARE
    v_bfile BFILE;
    v_blob  BLOB;
BEGIN
    v_bfile := BFILENAME('EXT_DOCS_DIR', 'photo.png');

    SELECT foto INTO v_blob
    FROM employee_profiles
    WHERE emp_id = 1
    FOR UPDATE;

    DBMS_LOB.FILEOPEN(v_bfile, DBMS_LOB.FILE_READONLY);
    
    DBMS_LOB.LOADFROMFILE(
        dest_lob => v_blob,
        src_lob  => v_bfile,
        amount   => DBMS_LOB.GETLENGTH(v_bfile)
    );
    
    DBMS_LOB.FILECLOSE(v_bfile);
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('success!');
END;
/


select * from EMPLOYEE_PROFILES;

SELECT 
    emp_id, 
    full_name,
    DBMS_LOB.GETLENGTH(foto) as foto_size, 
    DBMS_LOB.GETLENGTH(doc) as doc_size    
FROM employee_profiles;

