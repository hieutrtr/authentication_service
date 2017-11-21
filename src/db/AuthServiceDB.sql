USE [master]
GO
/****** Object:  Database [AuthenticationService]    Script Date: 11/20/2017 2:55:38 AM ******/
CREATE DATABASE [AuthenticationService]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ClientService', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ClientService.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ClientService_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ClientService_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [AuthenticationService] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AuthenticationService].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AuthenticationService] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AuthenticationService] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AuthenticationService] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AuthenticationService] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AuthenticationService] SET ARITHABORT OFF 
GO
ALTER DATABASE [AuthenticationService] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [AuthenticationService] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AuthenticationService] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AuthenticationService] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AuthenticationService] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AuthenticationService] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AuthenticationService] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AuthenticationService] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AuthenticationService] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AuthenticationService] SET  DISABLE_BROKER 
GO
ALTER DATABASE [AuthenticationService] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AuthenticationService] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AuthenticationService] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AuthenticationService] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AuthenticationService] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AuthenticationService] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AuthenticationService] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AuthenticationService] SET RECOVERY FULL 
GO
ALTER DATABASE [AuthenticationService] SET  MULTI_USER 
GO
ALTER DATABASE [AuthenticationService] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AuthenticationService] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AuthenticationService] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AuthenticationService] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [AuthenticationService] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'AuthenticationService', N'ON'
GO
ALTER DATABASE [AuthenticationService] SET QUERY_STORE = OFF
GO
USE [AuthenticationService]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [AuthenticationService]
GO
/****** Object:  Table [dbo].[Action]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Action](
	[Id] [uniqueidentifier] NOT NULL,
	[FunctionId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Api] [nvarchar](250) NOT NULL,
 CONSTRAINT [PK_Action] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Client]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Client](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [text] NOT NULL,
	[Address] [text] NOT NULL,
 CONSTRAINT [PK_Client] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Function]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Function](
	[Id] [uniqueidentifier] NOT NULL,
	[ServiceId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Api] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Function] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Policy]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Policy](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Policy] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PolicyAction]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PolicyAction](
	[PolicyId] [uniqueidentifier] NOT NULL,
	[ActionId] [uniqueidentifier] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Service]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Service](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Url] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Service] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [uniqueidentifier] NOT NULL,
	[ClientId] [uniqueidentifier] NOT NULL,
	[Username] [nvarchar](50) NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[User] SET (LOCK_ESCALATION = AUTO)
GO
/****** Object:  Table [dbo].[UserPolicy]    Script Date: 11/20/2017 2:55:39 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserPolicy](
	[UserId] [uniqueidentifier] NOT NULL,
	[PolicyId] [uniqueidentifier] NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Action]  WITH CHECK ADD  CONSTRAINT [FK_Action_Function] FOREIGN KEY([FunctionId])
REFERENCES [dbo].[Function] ([Id])
GO
ALTER TABLE [dbo].[Action] CHECK CONSTRAINT [FK_Action_Function]
GO
ALTER TABLE [dbo].[Function]  WITH CHECK ADD  CONSTRAINT [FK_Function_Service] FOREIGN KEY([ServiceId])
REFERENCES [dbo].[Service] ([Id])
GO
ALTER TABLE [dbo].[Function] CHECK CONSTRAINT [FK_Function_Service]
GO
ALTER TABLE [dbo].[PolicyAction]  WITH CHECK ADD  CONSTRAINT [FK_PolicyAction_Action] FOREIGN KEY([ActionId])
REFERENCES [dbo].[Action] ([Id])
GO
ALTER TABLE [dbo].[PolicyAction] CHECK CONSTRAINT [FK_PolicyAction_Action]
GO
ALTER TABLE [dbo].[PolicyAction]  WITH CHECK ADD  CONSTRAINT [FK_PolicyAction_Policy] FOREIGN KEY([PolicyId])
REFERENCES [dbo].[Policy] ([Id])
GO
ALTER TABLE [dbo].[PolicyAction] CHECK CONSTRAINT [FK_PolicyAction_Policy]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_Client] FOREIGN KEY([ClientId])
REFERENCES [dbo].[Client] ([Id])
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_Client]
GO
ALTER TABLE [dbo].[UserPolicy]  WITH CHECK ADD  CONSTRAINT [FK_UserPolicy_Policy] FOREIGN KEY([PolicyId])
REFERENCES [dbo].[Policy] ([Id])
GO
ALTER TABLE [dbo].[UserPolicy] CHECK CONSTRAINT [FK_UserPolicy_Policy]
GO
ALTER TABLE [dbo].[UserPolicy]  WITH CHECK ADD  CONSTRAINT [FK_UserPolicy_User] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[UserPolicy] CHECK CONSTRAINT [FK_UserPolicy_User]
GO
USE [master]
GO
ALTER DATABASE [AuthenticationService] SET  READ_WRITE 
GO
