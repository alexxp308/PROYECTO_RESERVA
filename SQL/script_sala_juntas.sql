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
    
    insert into UserProfile (UserName,[Password],Roles,cargo,NombreCompleto,Email,idSede,IsActive,firstTime) values ('admin','123456','Admin','Soporte','administrador','adm@gmail.com',0,1,0);
    insert into UserProfile (UserName,[Password],Roles,cargo,NombreCompleto,Email,idSede,IsActive,firstTime) values ('user','123456','User','Supervisor','usuario','usu@gmail.com',2,1,0);
    truncate table UserProfile
select * from UserProfile

create procedure USP_LISTAR_USUARIOS
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

exec USP_LISTAR_USUARIOS 'PERU',1
select * from sede

exec USP_CREAR_USUARIO '12346','Administrador','Coordinador','a a, a','a@gmail.com',3
alter procedure USP_CREAR_USUARIO
(
	@username varchar(50),
	@roles varchar(20),
	@cargo varchar(20),
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
BEGIN
declare @sede int = (select idSede from UserProfile where UserId=@iduser)
declare @sql nvarchar(max);
declare @cont int;
if(@sede!=0)
begin
	set @cont = (select COUNT(*) from RESERVA where fhinicio between replace(CONVERT(nvarchar(16), GETDATE(), 120)+':00',' ','T')
	and replace(CONVERT(nvarchar(16),DATEADD([MINUTE],10,GETDATE()), 120)+':00',' ','T') and idCreator=@iduser);
	if(@cont>0)
	begin
		select top 1 a.UserName,a.[Password],a.Roles,a.cargo,a.NombreCompleto,
		a.Email,b.nombreSede ,a.firstTime,adm.NombreCompleto,b.PAIS,s.nombreSala ,substring(r.fhinicio,12,5) fhinicio
		from UserProfile a,sede b,UserProfile adm, RESERVA r,SALA s
		where a.idSede = b.idSede and a.UserId = @iduser and a.idSede = adm.idSede and adm.Roles='Administrador'
		and r.idSala = s.idSala and a.idSede = s.idSede and r.idCreator = @iduser and 
		fhinicio between replace(CONVERT(nvarchar(16), GETDATE(), 120)+':00',' ','T')
		and replace(CONVERT(nvarchar(16),DATEADD([MINUTE],10,GETDATE()), 120)+':00',' ','T')
	end
	else
	begin
		select top 1 a.UserName,a.[Password],a.Roles,a.cargo,a.NombreCompleto,
		a.Email,b.nombreSede ,a.firstTime,adm.NombreCompleto,b.PAIS,'0' nombreSala,'0' fhinicio
		from UserProfile a,sede b,UserProfile adm where a.idSede = b.idSede and a.UserId = @iduser and a.idSede = adm.idSede and adm.Roles='Administrador'
	end
end
else
begin
	select top 1 a.UserName,a.[Password],a.Roles,a.cargo,a.NombreCompleto,
	a.Email,'TODOS' nombreSede ,a.firstTime,a.NombreCompleto,'TODOS' PAIS,'0','0'
	from UserProfile a where a.UserId = @iduser
end
END

exec USP_OBTENER_USUARIO 7

select COUNT(*) from RESERVA where fhinicio between replace(CONVERT(nvarchar(16), GETDATE(), 120)+':00',' ','T')
and replace(CONVERT(nvarchar(16),DATEADD([MINUTE],10,GETDATE()), 120)+':00',' ','T') and idCreator=4
select replace(CONVERT(nvarchar(16), DATEADD([MINUTE],-10,GETDATE()), 120)+':00',' ','T')



select *  from UserProfile



select * from UserProfile
select * from SALA
select * from Sede
select * from RESERVA
alter procedure USP_OBTENER_CORREOS
(
	@idSala int,
	@idCreator int
)
as
begin
select top 1 a.nombreSala,a.tipo,a.ubicacion,b.nombreSede,b.PAIS,a.activos,(SELECT Email from UserProfile WHERE UserId=@idCreator) correosSede
from SALA a,Sede b WHERE idSala=@idSala and b.idSede=a.idSede
end

alter procedure USP_OBTENER_CORREOSXID
(
	@idReserva int
)
as
begin
	select a.fhinicio,a.fhfin,a.nombreCompletoCreator,a.nombreCompletoCharge,
b.nombreSala,b.tipo,b.ubicacion,b.activos,
c.nombreSede,c.PAIS,d.email,a.descripcion
from RESERVA a,SALA b,Sede c,Userprofile d
where a.idReserva=@idReserva and a.idSala=b.idSala and b.idSede=c.idSede and a.idCreator=d.UserId
end

exec USP_OBTENER_CORREOSXID 2

exec USP_OBTENER_CORREOSXID 1
-- (SELECT STUFF((SELECT distinct ','+Email FROM UserProfile where idSede=(select idSede from SALA where idSala=@idSala) FOR XML PATH('')),1,1, ''))

exec USP_OBTENER_CORREOS 1,1

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

ALTER procedure [dbo].[USP_ACTUALIZAR_USUARIO]
(
	@userId int,
	@username varchar(50),
	@roles varchar(20),
	@cargo varchar(20),
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
	[service] nvarchar(100)
)
    
alter procedure USP_CREAR_SEDE
(
	@nombreSede varchar(50),
	@torres int,
	@pisos varchar(200),
	@PAIS varchar(10),
	@activos varchar(500),
	@service nvarchar(100)
)
AS
BEGIN
	insert into Sede(nombreSede,torres,pisos,PAIS,activos,[service]) values (@nombreSede,@torres,@pisos,@PAIS,@activos,@service);
	declare @idSede int;
	set @idSede = @@IDENTITY;
	select * from Sede where idSede=@idSede
END

truncate table Sede

alter procedure USP_LISTAR_SEDES
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
	@activos varchar(500),
	@service nvarchar(100)
)
AS
BEGIN
	update Sede set nombreSede = @nombreSede,torres=@torres,pisos=@pisos,PAIS=@PAIS,activos=@activos,[service]=@service where idSede=@idSede;
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
	SELECT idSede,nombreSede,torres,pisos,activos,[service] from Sede where PAIS=@PAIS
END

exec USP_LISTAR_SEDEXPAIS 'PERU'

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

alter procedure USP_ACTUALIZAR_ESTADO_SALA_JUNTAS
(
	@idSala int,
	@estado bit
)
AS
BEGIN
	update SALA_JUNTAS set estado=@estado where idSala = @idSala;
END

alter procedure USP_ACTUALIZAR_SALA
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
	estadoReserva int, --0:cancelada, 1: en espera, 2: en reserva, 3: finalizada
	idSala int,
	idCampania int,
	descripcion varchar(200),
	fhCreacion char(16), -- hora de creacion de la reserva
	fhinicio char(19),
	fhfin char(19),
	idCreator int,
	UserNameCreator varchar(50),
	nombreCompletoCreator varchar(100),
	idCharge int,
	UserNameCharge varchar(50),
	nombreCompletoCharge varchar(100),
	checklistInicial nvarchar(max),
	fhCheckInicial char(16),
	checklistFinal nvarchar(max),
	fhCheckFinal char(16),
)
drop table RESERVA
select CONVERT(nvarchar(16), getdate(), 120)
select * from UserProfile
insert into RESERVA(estadoReserva,idSala,descripcion,fhCreacion,fhinicio,fhfin,idCreator,
UserNameCreator,nombreCompletoCreator,
idCharge,UserNameCharge,nombreCompletoCharge,checklistInicial,fhCheckInicial,checklistFinal,fhCheckFinal)
values (1,2,'prueba1','2018-03-01 09:00','2018-03-02T10:00:00','2018-03-02T11:30:00',2,'user','usuario',
6,'456789','pru pru, pru','','','','');

insert into RESERVA(idSala,descripcion,fhinicio,fhfin,duracion,idCreator,UserNameCreator,nombreCompletoCreator,
idCharge,UserNameCharge,nombreCompletoCharge,checklist)
values (2,'prueba2','2018-03-29T11:00:00','2018-03-29T13:00:00','02:00:00',2,'user','usuario',6,'456789','pru pru, pru','');

select * from RESERVA where fhinicio>'2018-02-22T08:00:00'

alter procedure USP_OBTENER_RESERVAXSALA(
	@idSala int,
	@fhinicio char(19),
	@fhfin char(19)
)
AS
BEGIN
	select * from RESERVA where idSala = @idSala and fhinicio>SUBSTRING(@fhinicio,1,11)+'00:00:00' and fhfin<@fhfin;
END

exec USP_OBTENER_RESERVAXSALA 1,'2018-03-11T23:59:00','2018-04-08T23:59:00'
select SUBSTRING('2018-03-11T23:59:00',1,11)+'00:00:00'
alter procedure USP_GUARDAR_RESERVA(
	@idSala int,
	@idCampania int,
	@descripcion varchar(200),
	@fhinicio char(19),
	@fhfin char(19),
	@idCreator int,
	@UserNameCreator varchar(50),
	@nombreCompletoCreator varchar(100),
	@idCharge int,
	@UserNameCharge varchar(50),
	@nombreCompletoCharge varchar(100),
	@checkListInicial nvarchar(max),
	@checkListFinal nvarchar(max)
)
AS
BEGIN
	INSERT INTO RESERVA(estadoReserva,idSala,idCampania,descripcion,fhCreacion,fhinicio,fhfin,idCreator,UserNameCreator,nombreCompletoCreator,
	idCharge,UserNameCharge,nombreCompletoCharge,checklistInicial,fhCheckInicial,checklistFinal,fhCheckFinal)
	VALUES (1,@idSala,@idCampania,@descripcion,CONVERT(nvarchar(16), getdate(), 120),@fhinicio,@fhfin,@idCreator,@UserNameCreator,@nombreCompletoCreator,
	@idCharge,@UserNameCharge,@nombreCompletoCharge,@checkListInicial,'',@checkListFinal,'');
END

exec USP_GUARDAR_RESERVA 2,'prueba2','2018-03-02T12:00:00','2018-03-02T14:30:00',2,'user','usuario',
6,'456789','pru pru, pru'

insert into RESERVA(estadoReserva,idSala,descripcion,fhCreacion,fhinicio,fhfin,duracion,idCreator,
UserNameCreator,nombreCompletoCreator,
idCharge,UserNameCharge,nombreCompletoCharge,checklistInicial,fhCheckInicial,checklistFinal,fhCheckFinal)
values (1,2,'prueba1','2018-03-01 09:00','2018-03-02T10:00:00','2018-03-02T11:30:00','',2,'user','usuario',
6,'456789','pru pru, pru','','','','');

select * from RESERVA
select * from sala
select * from Sede

alter PROCEDURE USP_OBTENER_RESERVASXUSUARIO(
	@idSala int,
	@userId int,
	@idSede int,
	@estado int
)
AS
BEGIN
	declare @rol varchar(20)= (select Roles from UserProfile where UserId=@userId);
	declare @val int = @idSala;
	if(@val=0)
	begin
		if(@estado=9)
		begin
			if(@rol='Administrador')
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where a.idSala=b.idSala and b.idSede=@idSede order by fhinicio desc
			end
			else
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where idCreator=@userId and a.idSala=b.idSala and b.idSede=@idSede order by fhinicio desc
			end
		end
		else
		begin
			if(@rol='Administrador')
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where a.idSala=b.idSala and b.idSede=@idSede and a.estadoReserva=@estado order by fhinicio desc
			end
			else
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where idCreator=@userId and a.idSala=b.idSala and b.idSede=@idSede and a.estadoReserva=@estado order by fhinicio desc
			end
		end
	end
	else
	begin
		if(@estado=9)
		begin
			if(@rol='Administrador')
			begin
				select * from RESERVA where idSala=@idSala order by fhinicio desc
			end
			else
			begin
				select * from RESERVA where idSala=@idSala and idCreator=@userId order by fhinicio desc
			end
		end
		else
		begin
			if(@rol='Administrador')
			begin
				select * from RESERVA where idSala=@idSala and estadoReserva=@estado order by fhinicio desc
			end
			else
			begin
				select * from RESERVA where idSala=@idSala and idCreator=@userId and estadoReserva=@estado order by fhinicio desc
			end
		end
	end
END

create procedure USP_ELIMINAR_RESERVA(
	@idReserva int
)
as
begin
	update RESERVA set estadoReserva=0 where idReserva=@idReserva
end

exec USP_OBTENER_RESERVASXUSUARIO 0,2,1
select * from RESERVA

alter PROCEDURE USP_GUARDAR_CHECKLIST
(
	@idReserva int,
	@iniFin int,
	@checkList nvarchar(max)
)
AS
BEGIN 
	if(@iniFin=0)
	begin
		declare @EcheckIni char(19) = (select fhCheckInicial from RESERVA where idReserva=@idReserva);
		if(@EcheckIni!='')
		begin
		update RESERVA set checklistInicial=@checkList,fhCheckInicial= CONVERT(nvarchar(16), getdate(), 120) where idReserva=@idReserva
		select checklistInicial,fhCheckInicial from RESERVA where idReserva=@idReserva;
		end
		else
		begin
		update RESERVA set checklistInicial=@checkList,fhCheckInicial= CONVERT(nvarchar(16), getdate(), 120),estadoReserva=2 where idReserva=@idReserva
		select checklistInicial,fhCheckInicial from RESERVA where idReserva=@idReserva;
		end
	end
	else
	begin
	update RESERVA set checklistFinal=@checkList,fhCheckFinal= CONVERT(nvarchar(16), getdate(), 120),estadoReserva=3 where idReserva=@idReserva
	select checklistFinal,fhCheckFinal from RESERVA where idReserva=@idReserva;
	end
END

exec USP_GUARDAR_CHECKLIST 4,0,'hola'

alter procedure USP_ACTUALIZAR_RESERVA
(
	@idReserva int,
	@descripcion varchar(200),
	@fhinicio char(19),
	@fhfin char(19)
)
as
begin
	update RESERVA SET descripcion = @descripcion,fhinicio=@fhinicio,fhfin=@fhfin where idReserva=@idReserva;
	select a.fhinicio,a.fhfin,a.nombreCompletoCreator,a.nombreCompletoCharge,
	b.nombreSala,b.tipo,b.ubicacion,b.activos,
	c.nombreSede,c.PAIS,d.email,a.descripcion
	from RESERVA a,SALA b,Sede c,Userprofile d
	where a.idReserva=@idReserva and a.idSala=b.idSala and b.idSede=c.idSede and a.idCreator=d.UserId
end

create table CAMPANIA(
	idCampania int primary key identity(1, 1),
	nombreCampania varchar(100),
	idSede int
)
truncate table CAMPANIA


alter procedure USP_CREAR_CAMPANIA(
	@nombreCampania varchar(100),
	@idSede int
)
as
BEGIN
	DECLARE @CONT INT = (SELECT COUNT(*) FROM CAMPANIA WHERE nombreCampania=@nombreCampania and idSede=@idSede)
	if(@CONT=0)
	begin
			INSERT INTO CAMPANIA (nombreCampania,idSede) VALUES (@nombreCampania,@idSede)
			declare @idCampania int= @@IDENTITY;
			SELECT * FROM CAMPANIA WHERE idCampania = @idCampania
	end
END
exec USP_CREAR_CAMPANIA 'hola',1

alter procedure USP_ACTUALIZAR_CAMPANIA(
	@nombreCampania varchar(100),
	@idSede int,
	@idCampania INT
)
as
begin
	DECLARE @CONT INT = (SELECT COUNT(*) FROM CAMPANIA WHERE nombreCampania=@nombreCampania and idSede=@idSede)
	if(@CONT=0)
	begin
		update CAMPANIA SET nombreCampania=@nombreCampania where idCampania = @idCampania
		SELECT * FROM CAMPANIA WHERE idCampania = @idCampania
	end
end

alter procedure USP_LISTAR_CAMPANIAS
(
	@idSede int
)
AS
BEGIN
	SELECT * FROM CAMPANIA WHERE idSede = @idSede;
END

select * from RESERVA

ALTER PROCEDURE USP_REPORTE_DETALLADO
(
@sedeId int,
@salaId int,
@fechaI char(16),
@fechaF char(16)
)
AS
BEGIN
 SELECT a.PAIS,a.nombreSede,b.nombreSala,b.tipo,b.activos,c.nombreCompletoCreator,
 c.idCampania,c.fhCreacion,c.fhinicio,c.fhfin,c.estadoReserva,c.checklistInicial,c.checklistFinal,c.nombreCompletoCharge,c.idSala 
 FROM Sede a,SALA b,RESERVA c
 WHERE c.idSala=b.idSala and b.idSede = a.idSede and b.idSede = @sedeId and c.idSala=@salaId and
  c.fhCreacion between @fechaI and @fechaF
END

exec USP_REPORTE_DETALLADO 1,2,'2018-03-07 00:00','2018-03-09 23:59'
exec USP_OBTENER_RESERVASXUSUARIO 0,3,1,9

select * from RESERVA
select * from sede

select DATEDIFF(minute,convert(datetime,REPLACE('2018-03-13T12:30:00','T',' ')),convert(datetime,REPLACE('2018-03-13T14:30:00','T',' ')))


select idSala,SUM(DATEDIFF(minute,convert(datetime,REPLACE(fhinicio,'T',' ')),convert(datetime,REPLACE(fhfin,'T',' ')))) 
from reserva where fhfin between '2018-03-08T00:30:00' and '2018-03-10T23:59:59'  group by idSala

ALTER procedure USP_REPORTE_OCUPACION(
@sedeId int,
@fechaI varchar(19),
@fechaF varchar(19)
)
AS
BEGIN
	select a.idSala,
	SUM(DATEDIFF(minute,convert(datetime,REPLACE(a.fhinicio,'T',' ')),convert(datetime,REPLACE(a.fhfin,'T',' ')))) HORAS_RESERVADAS 
	from reserva a,SALA b where a.idSala=b.idSala and b.idSede=@sedeId and fhfin between @fechaI and @fechaF  group by a.idSala
END


exec USP_REPORTE_OCUPACION 1,'2018-03-07T00:00:00','2018-03-09T23:59:59'

create procedure USP_REPORTE_RESUMEN( -- solo considera los estado reserva = 3
 @fini varchar(10),
 @ffin varchar(10),
 @sedeId int
)
AS
BEGIN
	declare @fechaInicio datetime = convert(datetime,@fini,120);
	declare @fechaFin datetime = convert(datetime,@ffin,120);
	declare @contDias int = (select DATEDIFF(day,@fechaInicio,@fechaFin))+1;
	declare @busFecha varchar(10);
	DECLARE @Reservas TABLE (reservasId int)
	while(@contDias>0)
	begin
		set @busFecha = convert(varchar(10),DATEADD(DAY,@contDias-1,@fechaInicio),120);
		declare @sql nvarchar(max)= (select (SELECT STUFF((SELECT ' select top 1 idReserva from RESERVA where SUBSTRING(fhfin,1,10) = '''+@busFecha+''' and estadoReserva=3 and idSala='''+(convert(varchar(10),idSala)+''' order by fhfin desc;')FROM SALA where idSede=@sedeId FOR XML PATH('')),1,1, '')))
		INSERT @Reservas exec(@sql)
		set @contDias=@contDias-1;
	end
	declare @SQLF nvarchar(max) = 'select idSala,fhfin,checklistFinal from RESERVA WHERE '+(select (SELECT STUFF((SELECT (' idReserva='+ (convert(varchar(10),reservasId))+' or') FROM @Reservas FOR XML PATH('')),1,1, '')))
	set @SQLF = SUBSTRING(@SQLF,1,LEN(@SQLF)-3)
	EXEC(@SQLF)
END

exec USP_REPORTE_RESUMEN '2018-03-08','2018-03-09',1

declare @sql1 nvarchar(max)= (select (SELECT STUFF((SELECT ' select top 1 idReserva from RESERVA where idSala='''+(convert(varchar(10),idSala)+''';')FROM SALA where idSede=1 FOR XML PATH('')),1,1, '')))

DECLARE @siteId TABLE (reservasId int)
declare @sql nvarchar(max)= 'select top 1 idReserva from RESERVA where SUBSTRING(fhfin,1,10) = ''2018-03-09'' and idSala=2 order by fhfin desc';
INSERT @siteId exec(@sql)
select * from @siteId
	
select top 1 * from RESERVA where SUBSTRING(fhfin,1,10) = '2018-03-09' and idSala=2 order by fhfin desc
Union
select top 1 * from RESERVA where SUBSTRING(fhfin,1,10) = '2018-03-09' and idSala=7 order by fhfin desc

select (select top 1 * from RESERVA where SUBSTRING(fhfin,1,10) = '2018-03-09' and idSala=2 order by fhfin desc),
(select top 1 * from RESERVA where SUBSTRING(fhfin,1,10) = '2018-03-09' and idSala=7 order by fhfin desc)


select * from SALA