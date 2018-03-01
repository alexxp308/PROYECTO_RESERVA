use SALA_JUNTAS
Create Table UserProfile  
    (  
        UserId int primary key identity(1, 1),  
        UserName varchar(50),  
        [Password] varchar(50),
        Roles varchar(20),
        cargo varchar(20),
        NombreCompleto varchar(100),
        Email varchar(60),
        idSede int,  
        IsActive bit, -- 1:active,0:notactive
        firstTime bit
    )
    
    insert into UserProfile (UserName,[Password],Roles,cargo,NombreCompleto,Email,idSede,IsActive,firstTime) values ('admin','123456','Admin','Soporte','administrador','adm@gmail.com',2,1,0);
    insert into UserProfile (UserName,[Password],Roles,cargo,NombreCompleto,Email,idSede,IsActive,firstTime) values ('user','123456','User','Supervisor','usuario','usu@gmail.com',2,1,0);
    truncate table UserProfile
select * from UserProfile

CREATE procedure USP_LISTAR_USUARIOS
(
@PAIS varchar(10),
@sedeId int
)
AS
BEGIN
	if(@PAIS!='')
	begin
		select a.UserId,a.UserName,a.Roles,a.cargo,a.NombreCompleto,a.Email,a.idSede,a.IsActive 
	from UserProfile a,sede b where a.idSede = b.idSede and b.PAIS = @PAIS and Roles='Administrador'
	end
	else
	begin
		select a.UserId,a.UserName,a.Roles,a.cargo,a.NombreCompleto,a.Email,a.idSede,a.IsActive 
		from UserProfile a where idSede=@sedeId
	end
END

exec USP_LISTAR_USUARIOS 'PERU',0
select * from sede

exec USP_CREAR_USUARIO '12346','Administrador','soporte','a a, a','a@gmail.com',3
alter procedure USP_CREAR_USUARIO
(
	@username varchar(50),
	@roles varchar(20),
	@cargo varchar(10),
	@nombreCompleto varchar(100),
	@email varchar(60),
	@idSede int
)
AS
BEGIN
	declare @contador int;
	set @contador = (select COUNT(*) from UserProfile where UserName=@username)
	declare @contador2 int;
	set @contador2 = (select COUNT(*) from UserProfile where Roles=@roles and Roles='Administrador' and idSede=@idSede)
	if(@contador=0 and @contador2=0)
	begin
		insert into UserProfile (UserName,[Password],Roles,cargo,NombreCompleto,Email,idSede,IsActive,firstTime)
		values (@username,@username,@roles,@cargo,@nombreCompleto,@email,@idSede,1,1);
		declare @idUser int;
		set @idUser = @@IDENTITY;
		SELECT a.UserId,a.UserName,a.Roles,a.cargo,a.NombreCompleto,a.Email,a.idSede,IsActive 
		FROM UserProfile a WHERE a.UserId = @idUser
	end
END
exec USP_CREAR_USUARIO

select * from UserProfile

create procedure USP_ACTUALIZAR_ESTADO_USUARIO(
	@iduser int,
	@estado bit
)
as
begin
	update UserProfile set IsActive=@estado where UserId=@iduser
end

create procedure USP_LISTAR_USUARIOSXSEDE
(
@sedeId int
)
AS
BEGIN
select a.UserId,a.UserName,a.Roles,a.cargo,a.NombreCompleto,a.Email,a.idSede,IsActive 
	from UserProfile a,sede b where a.idSede = b.idSede and a.idSede = @sedeId
END

alter PROCEDURE USP_OBTENER_USUARIO
(
@iduser int
)
as
begin
select top 1 a.UserName,a.[Password],a.Roles,a.cargo,a.NombreCompleto,
a.Email,b.nombreSede ,a.firstTime,adm.NombreCompleto,b.PAIS
	from UserProfile a,sede b,UserProfile adm where a.idSede = b.idSede and a.UserId = @iduser and a.idSede = adm.idSede and adm.Roles='Administrador'
end
exec USP_OBTENER_USUARIO 7
(select idSede from UserProfile where UserId=7)


select * from UserProfile
select * from SALA
select * from Sede
select * from RESERVA
alter procedure USP_OBTENER_CORREOS
(
	@idSala int
)
as
begin
select top 1 a.nombreSala,a.tipo,a.ubicacion,b.nombreSede,b.PAIS,a.activos,(SELECT STUFF((SELECT distinct ','+Email FROM UserProfile where idSede=(select idSede from SALA where idSala=@idSala) FOR XML PATH('')),1,1, '')) correosSede
from SALA a,Sede b WHERE idSala=@idSala and b.idSede=a.idSede
end
exec USP_OBTENER_CORREOS 1

CREATE PROCEDURE USP_CAMBIAR_CONTRASENIA
(
@iduser int,
@password varchar(50)
)
as
begin
	update UserProfile set [Password]=@password,firstTime=0 where UserId=@iduser
end

exec USP_OBTENER_USUARIO 3

create procedure USP_OBTENER_SEDE(
	@idSede INT
)
AS
BEGIN
	select idSede,nombreSede from Sede where idSede=@idSede;
END

alter procedure USP_ACTUALIZAR_USUARIO
(
	@userId int,
	@username varchar(50),
	@roles varchar(20),
	@cargo varchar(10),
	@nombreCompleto varchar(100),
	@email varchar(60),
	@idSede int
)
AS
BEGIN
	update UserProfile set UserName=@username,Roles=@roles,cargo=@cargo,
	NombreCompleto=@nombreCompleto,Email=@email,idSede=@idSede where UserId=@userId
	
	SELECT a.UserId,a.UserName,a.Roles,a.cargo,a.NombreCompleto,a.Email,a.idSede,IsActive 
	FROM UserProfile a WHERE a.UserId = @userId
END

create procedure USP_REGISTER_USER
(
@userName varchar(50),
@password varchar(50),
@email varchar(60),
@idSede int,
@nombreCompleto varchar(100)
)
AS
BEGIN
insert into UserProfile (UserName,[Password],Roles,NombreCompleto,Email,idSede,IsActive) 
values (@userName,@password,'User',@nombreCompleto,@email,@idSede,1);-- podria empezar con cero, y ya ve el administrador si le da 1 o no
END

alter procedure USP_CHECK_LOGIN
(
	@userName varchar(50),
	@password varchar(50)
)AS
BEGIN
	declare @idSede int= (select IdSede from UserProfile where UserName=@userName and [Password]=@password);
	if(@idSede=0)
	begin
			select top 1 usu.UserId,usu.UserName,usu.Roles,usu.IdSede,adm.UserId AdminId,adm.UserName UserNameAdmin from UserProfile usu
	join UserProfile adm on usu.UserName=@userName and usu.[Password]=@password and usu.IsActive=1 and usu.idSede = adm.idSede and adm.Roles='Admin';
	end
	else
	begin
		select top 1 usu.UserId,usu.UserName,usu.Roles,usu.IdSede,adm.UserId AdminId,adm.UserName UserNameAdmin from UserProfile usu
	join UserProfile adm on usu.UserName=@userName and usu.[Password]=@password and usu.IsActive=1 and usu.idSede = adm.idSede and adm.Roles='Administrador';
	end
END
select * from UserProfile
select * from sala
exec USP_CHECK_LOGIN 'admin','123456'

exec USP_CHECK_LOGIN 'user','123456'

create procedure USP_RESETEAR_CONTRASENIA(
	@iduser int
)
AS
BEGIN
	update UserProfile set firstTime=1 ,[Password]=UserName where UserId=@iduser
END

create table SALA(
	idSala int primary key identity(1, 1),
	nombreSala varchar(40),
	estado bit,
	tipo varchar(12),
	horario varchar(200),
	activos varchar(500),
	ubicacion varchar(100),
	idSede int
)

create table Sede(
	idSede int primary key identity(1, 1),
	nombreSede varchar(50),
	torres int,
	pisos varchar(200),
	PAIS varchar(10),
	activos varchar(500),
)
    
alter procedure USP_CREAR_SEDE
(
	@nombreSede varchar(50),
	@torres int,
	@pisos varchar(200),
	@PAIS varchar(10),
	@activos varchar(500)
)
AS
BEGIN
	insert into Sede(nombreSede,torres,pisos,PAIS,activos) values (@nombreSede,@torres,@pisos,@PAIS,@activos);
	declare @idSede int;
	set @idSede = @@IDENTITY;
	select * from Sede where idSede=@idSede
END

truncate table Sede

create procedure USP_LISTAR_SEDES
AS
BEGIN
	select * from Sede
END

truncate table Sede

alter procedure USP_ACTUALIZAR_SEDE
(
	@idSede int,
	@nombreSede varchar(50),
	@torres int,
	@pisos varchar(200),
	@PAIS varchar(10),
	@activos varchar(500)
)
AS
BEGIN
	update Sede set nombreSede = @nombreSede,torres=@torres,pisos=@pisos,PAIS=@PAIS,activos=@activos where idSede=@idSede;
	select * from Sede where idSede=@idSede;
END

create procedure USP_ELIMINAR_SEDE
(
	@idSede int
)
AS
BEGIN
	DELETE FROM Sede where idSede=@idSede;
END

ALTER procedure USP_LISTAR_SEDEXPAIS
(
@PAIS VARCHAR(10)
)
AS
BEGIN
	SELECT idSede,nombreSede,torres,pisos,activos from Sede where PAIS=@PAIS
END

exec USP_LISTAR_SEDEXPAIS 'MEXICO'

alter procedure USP_CREAR_SALA
(
@nombre VARCHAR(40),
@horario VARCHAR(200),
@activos VARCHAR(500),
@ubicacion VARCHAR(100),
@tipo varchar(12),
@idSede INT
)
AS
BEGIN
	insert into SALA(nombreSala,estado,tipo,horario,activos,ubicacion,idSede)
	values (@nombre,1,@tipo,@horario,@activos,@ubicacion,@idSede);
	declare @idSala int;
	set @idSala = @@IDENTITY;
	SELECT * FROM SALA WHERE idSala = @idSala
END
truncate table SALA

alter PROCEDURE USP_LISTAR_SALA
(
	@pais varchar(10),
	@tipo varchar(12)
)
AS
BEGIN
	SELECT a.idSala,a.nombreSala,a.estado,a.tipo,a.horario,a.activos,a.ubicacion,a.idSede
	FROM SALA a,Sede b
	WHERE a.idSede = b.idSede and b.PAIS = @pais and a.tipo=@tipo;
END

exec USP_LISTAR_SALA 'PERU','CAPACITACION'

create procedure USP_ACTUALIZAR_ESTADO_SALA_JUNTAS
(
	@idSala int,
	@estado bit
)
AS
BEGIN
	update SALA_JUNTAS set estado=@estado where idSala = @idSala;
END

create procedure USP_ACTUALIZAR_SALA
(
	@idSala INT,
	@nombre VARCHAR(40),
	@horario VARCHAR(200),
	@activos VARCHAR(500),
	@ubicacion VARCHAR(100),
	@idSede INT,
	@tipo varchar(12)
)
AS
BEGIN
	update SALA set nombreSala=@nombre,horario=@horario,activos=@activos,ubicacion=@ubicacion,idSede=@idSede,tipo=@tipo
	where idSala = @idSala;
	select * from SALA where idSala = @idSala;
END

create procedure USP_ELIMINAR_SALA
(
	@idSala int
)
AS
BEGIN
	DELETE FROM SALA_JUNTAS where idSala=@idSala;
END

ALTER procedure [dbo].[USP_LISTAR_SALASXSEDE]
(
@SEDE int
)
AS
BEGIN
	SELECT idSala,nombreSala,tipo,horario,activos,ubicacion from SALA where idSede=@SEDE and estado=1
END

exec USP_LISTAR_SALASXSEDE 1

select DAY(GETDATE());

create table ejemplo(
 id varchar(20) primary key,
 nombre varchar(10),
 horaInicio varchar(10)
)

insert into ejemplo values ('r_2_2018-02-13_8_10','reserva1','08:00:00')
insert into ejemplo values ('r_2_2018-02-13_11_13','reserva2','11:00:00')

select * from ejemplo where CHARINDEX('r_2_2018-02-13',id)>0 order by horaInicio asc

alter PROCEDURE USP_OBTENER_SALA
(
@tipo varchar(12),
@idSede int,
@ubicacion varchar(100)
)
as
begin
	select a.idSala,a.nombreSala,a.tipo,a.horario,a.activos,b.UserId,b.UserName,b.NombreCompleto
	from SALA a,UserProfile b where a.tipo = @tipo and a.idSede=@idSede and a.ubicacion=@ubicacion and b.idSede=a.idSede and b.Roles='Administrador';
end
EXEC USP_OBTENER_SALA 'JUNTAS',1,'Torre: 2; Piso: 3'
SELECT * FROM SALA
SELECT * FROM UserProfile

create table Activos(
	idActivo int primary key identity(1, 1),
	nombreActivo varchar(100)
)

create procedure USP_CREAR_ACTIVO(
	@nombreActivo varchar(100)
)
AS
BEGIN
	insert into Activos(nombreActivo) values (@nombreActivo);
	declare @idActivo int;
	set @idActivo = @@IDENTITY;
	SELECT * FROM Activos WHERE idActivo = @idActivo
END

create procedure USP_LISTAR_ACTIVOS
AS
BEGIN
	SELECT * FROM Activos
END

alter PROCEDURE USP_ACTUALIZAR_ACTIVO
(
	@idActivo int,
	@nombreActivo varchar(100)
)
AS
BEGIN
	update Activos set nombreActivo= @nombreActivo where idActivo = @idActivo;
	select * from Activos where idActivo = @idActivo;
END

create table RESERVA(
	idReserva int primary key identity(1, 1),
	idSala int,
	descripcion varchar(200),
	fhinicio char(19),
	fhfin char(19),
	duracion char(8),
	idCreator int,
	UserNameCreator varchar(50),
	nombreCompletoCreator varchar(100),
	idCharge int,
	UserNameCharge varchar(50),
	nombreCompletoCharge varchar(100),
	checklist nvarchar(max)
)

select * from UserProfile
insert into RESERVA(idSala,descripcion,fhinicio,fhfin,duracion,idCreator,UserNameCreator,nombreCompletoCreator,
idCharge,UserNameCharge,nombreCompletoCharge,checklist)
values (2,'prueba1','2018-02-27T10:00:00','2018-02-27T11:30:00','01:30:00',2,'user','usuario',6,'456789','pru pru, pru','');

insert into RESERVA(idSala,descripcion,fhinicio,fhfin,duracion,idCreator,UserNameCreator,nombreCompletoCreator,
idCharge,UserNameCharge,nombreCompletoCharge,checklist)
values (2,'prueba2','2018-03-29T11:00:00','2018-03-29T13:00:00','02:00:00',2,'user','usuario',6,'456789','pru pru, pru','');

select * from RESERVA where fhinicio>'2018-02-22T08:00:00'

create procedure USP_OBTENER_RESERVAXSALA(
	@idSala int,
	@fhinicio char(19),
	@fhfin char(19)
)
AS
BEGIN
	select * from RESERVA where idSala = @idSala and fhinicio>@fhinicio and fhfin<@fhfin;
END

exec USP_OBTENER_RESERVAXSALA 1,'2018-03-11T23:59:00','2018-04-08T23:59:00'

alter procedure USP_GUARDAR_RESERVA(
	@idSala int,
	@descripcion varchar(200),
	@fhinicio char(19),
	@fhfin char(19),
	@idCreator int,
	@UserNameCreator varchar(50),
	@nombreCompletoCreator varchar(100),
	@idCharge int,
	@UserNameCharge varchar(50),
	@nombreCompletoCharge varchar(100)
)
AS
BEGIN
	INSERT INTO RESERVA(idSala,descripcion,fhinicio,fhfin,duracion,idCreator,UserNameCreator,nombreCompletoCreator,
	idCharge,UserNameCharge,nombreCompletoCharge,checklist)
	VALUES (@idSala,@descripcion,@fhinicio,@fhfin,'',@idCreator,@UserNameCreator,@nombreCompletoCreator,
	@idCharge,@UserNameCharge,@nombreCompletoCharge,'');
END

select * from RESERVA
select * from sala

alter PROCEDURE USP_OBTENER_RESERVASXUSUARIO(
	@idSala int,
	@userId int
)
AS
BEGIN
	declare @val int = @idSala;
	if(@val=0)
	begin
		select * from RESERVA where idCreator=@userId order by fhinicio desc
	end
	else
	begin
		select * from RESERVA where idSala=@idSala and idCreator=@userId order by fhinicio desc
	end
END

exec USP_OBTENER_RESERVASXUSUARIO 1,4
select * from UserProfile