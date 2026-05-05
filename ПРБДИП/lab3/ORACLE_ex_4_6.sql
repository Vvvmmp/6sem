ALTER TABLE Company 
ADD Parent_id INT REFERENCES Company(ID);


CREATE OR REPLACE PROCEDURE GetSubordinates(p_ParentID IN INT) IS
BEGIN
    FOR r IN (
        SELECT LEVEL as lvl, ID, Title, Parent_id
        FROM Company
        START WITH ID = p_ParentID
        CONNECT BY PRIOR ID = Parent_id
        ORDER SIBLINGS BY Title
    ) LOOP
        DBMS_OUTPUT.PUT_LINE(LPAD(' ', (r.lvl-1)*4) || r.lvl || '. ' || r.Title || ' (ID: ' || r.ID || ')');
    END LOOP;
END;
/

CREATE OR REPLACE PROCEDURE AddSubordinate(
    p_ParentID IN INT,
    p_OwnerID IN INT,
    p_Title IN NVARCHAR2,
    p_Desc IN CLOB,
    p_Addr IN CLOB
) IS
BEGIN
    INSERT INTO Company (Owner_id, Title, Description, Address, Parent_id)
    VALUES (p_OwnerID, p_Title, p_Desc, p_Addr, p_ParentID);
    COMMIT;
END;
/

CREATE OR REPLACE PROCEDURE MoveSubordinates(
    p_OldParentID IN INT,
    p_NewParentID IN INT
) IS
BEGIN
    UPDATE Company
    SET Parent_id = p_NewParentID
    WHERE Parent_id = p_OldParentID;
    
    COMMIT;
END;
/