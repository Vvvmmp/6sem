CREATE DATABASE [Celebrities];
GO

USE [Celebrities];
GO

CREATE TABLE [dbo].[Celebrities](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [FullName] [nvarchar](50) NOT NULL,
    [Nationality] [nvarchar](2) NOT NULL,
    [ReqPhotoPath] [nvarchar](200) NULL,
    CONSTRAINT [PK_Celebrities] PRIMARY KEY CLUSTERED ([Id] ASC)
);
GO