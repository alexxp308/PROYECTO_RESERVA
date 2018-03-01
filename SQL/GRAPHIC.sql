Create Table UserProfile  
    (  
        UserId int primary key identity(1, 1),  
        UserName varchar(50),  
        [Password] varchar(50),
        Roles varchar(20),
        NombreCompleto varchar(100),
        Email varchar(60),
        idSede int FOREIGN KEY REFERENCES Sede(idSede),  
        IsActive bit -- 1:active,0:notactive
    )
    
    create table SALA_JUNTAS(
	idSala int primary key identity(1, 1),
	nombreSala varchar(40),
	estado bit,
	horario varchar(200),
	activos varchar(500),
	ubicacion varchar(100),
	idSede int FOREIGN KEY REFERENCES Sede(idSede),
)

create table Sede(
	idSede int primary key identity(1, 1),
	nombreSede varchar(50),
	PAIS varchar(10)
)

create table RESERVA(
	idReserva int primary key identity(1, 1),
	idEncargado int FOREIGN KEY REFERENCES UserProfile(UserId),
	NombreEncargado varchar(100),
	idUsuario int FOREIGN KEY REFERENCES UserProfile(UserId),
	NombreUsuario varchar(100),
	idSala int FOREIGN KEY REFERENCES SALA_JUNTAS(idSala),
	nombreSala varchar(20),
	fechaInicio varchar(10),
	horaInicio varchar(8),
	duracion varchar(8),
	fechaFin varchar(10),
	horaFin VARCHar(10),
	idEstadoReserva int FOREIGN KEY REFERENCES EstadoReserva(idEstadoReserva),
	CheckList nvarchar(max) 
)

create table EstadoReserva(
	idEstadoReserva int primary key identity(1, 1),
	descripcion varchar(30),
)