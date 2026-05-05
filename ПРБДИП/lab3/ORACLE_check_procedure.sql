TRUNCATE TABLE Application;
TRUNCATE TABLE Vacancy;
TRUNCATE TABLE Resume;
DELETE FROM Company;
DELETE FROM "User";



DECLARE
    v_AdminID INT;
    v_RootID  INT;
    v_EastID  INT;
    v_ITID    INT;
BEGIN
    INSERT INTO "User" (Email, Password, Role, Phone)
    VALUES ('admin@corp.com', HEXTORAW('123456'), 1, '+37529-111-11-11')
    RETURNING ID INTO v_AdminID;

    INSERT INTO Company (Owner_id, Title, Description, Address, Parent_id)
    VALUES (v_AdminID, 'head_title', 'Head office', 'Minsk, Octyabrskaya', NULL)
    RETURNING ID INTO v_RootID;

    AddSubordinate(v_RootID, v_AdminID, 'filial East', 'office in Mogilev', 'Mogilev, lenina 1');
    SELECT ID INTO v_EastID FROM Company WHERE Title = 'filial East' AND Parent_id = v_RootID;

    AddSubordinate(v_RootID, v_AdminID, 'filial West', 'office in Brest', 'Brest, paradnaya 23');

    AddSubordinate(v_EastID, v_AdminID, 'IT-department East', 'Development', 'Mogilev, lenina 52, fl.10, kab 1065');
    
    SELECT ID INTO v_ITID FROM Company WHERE Title = 'IT-department East' AND Parent_id = v_EastID;

    AddSubordinate(v_ITID, v_AdminID, 'Testing group', 'QA Team', 'kab 12');

    COMMIT;
    DBMS_OUTPUT.PUT_LINE('all complete');
END;
/

DECLARE
    v_RootID INT;
BEGIN
    SELECT ID INTO v_RootID FROM Company WHERE Parent_id IS NULL AND Title = 'head_title';
    
    GetSubordinates(v_RootID);
END;
/

DECLARE
    v_EastID INT;
    v_WestID INT;
    v_RootID INT;
BEGIN
    SELECT ID INTO v_EastID FROM Company WHERE Title = 'filial East';
    SELECT ID INTO v_WestID FROM Company WHERE Title = 'filial West';
    SELECT ID INTO v_RootID FROM Company WHERE Parent_id IS NULL;

    DBMS_OUTPUT.PUT_LINE('--- before moving ---');
    GetSubordinates(v_RootID);

    MoveSubordinates(v_EastID, v_WestID);

    DBMS_OUTPUT.PUT_LINE('--- after moving ---');
    GetSubordinates(v_RootID);
    
END;
/