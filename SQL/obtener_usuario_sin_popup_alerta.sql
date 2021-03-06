USE [PRUEBAS_SALA_JUNTAS]
GO
/****** Object:  StoredProcedure [dbo].[USP_OBTENER_USUARIO]    Script Date: 03/15/2018 15:59:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[USP_OBTENER_USUARIO]
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