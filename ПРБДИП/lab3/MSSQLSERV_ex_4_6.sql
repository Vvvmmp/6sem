
ALTER TABLE Company 
ADD Node HIERARCHYID;

INSERT INTO Company (Owner_id, Title, [Description], Address, Node)
VALUES (1, 'Global Corp', 'Main Office', 'Street 1', hierarchyid::GetRoot());

GO

CREATE PROCEDURE GetSubordinates
    @ParentID INT
AS
BEGIN
    DECLARE @ParentNode HIERARCHYID;
    SELECT @ParentNode = Node FROM Company WHERE ID = @ParentID;

    SELECT 
        Node.GetLevel() AS Level,
        ID,
        Title,
        Node.ToString() AS NodePath
    FROM Company
    WHERE Node.IsDescendantOf(@ParentNode) = 1
    ORDER BY Node;
END;

go

CREATE PROCEDURE AddSubordinate
    @ParentID INT,
    @OwnerID INT,
    @Title NVARCHAR(255),
    @Desc TEXT,
    @Address TEXT
AS
BEGIN
    DECLARE @ParentNode HIERARCHYID;
    DECLARE @LastChildNode HIERARCHYID;

    SELECT @ParentNode = Node FROM Company WHERE ID = @ParentID;

    SELECT @LastChildNode = MAX(Node) 
    FROM Company 
    WHERE Node.GetAncestor(1) = @ParentNode;

    INSERT INTO Company (Owner_id, Title, [Description], Address, Node)
    VALUES (
        @OwnerID, 
        @Title, 
        @Desc, 
        @Address, 
        @ParentNode.GetDescendant(@LastChildNode, NULL)
    );
END;

GO

ALTER PROCEDURE MoveSubordinates
    @NodeToMoveID INT,   
    @NewParentID INT     
AS
BEGIN
    DECLARE @OldNode HIERARCHYID, @NewParentNode HIERARCHYID, @LastChild HIERARCHYID;

    SELECT @OldNode = Node FROM Company WHERE ID = @NodeToMoveID;
    SELECT @NewParentNode = Node FROM Company WHERE ID = @NewParentID;

    SELECT @LastChild = MAX(Node) FROM Company WHERE Node.GetAncestor(1) = @NewParentNode;
    DECLARE @NewNodePath HIERARCHYID = @NewParentNode.GetDescendant(@LastChild, NULL);

    UPDATE Company
    SET Node = Node.GetReparentedValue(@OldNode, @NewNodePath)
    WHERE Node.IsDescendantOf(@OldNode) = 1;
END;

GO
