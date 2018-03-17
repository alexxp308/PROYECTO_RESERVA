alter procedure USP_CHECK_LOGIN
(
	@userName varchar(50),
	@password varchar(50)
)AS
BEGIN
	declare @idSede int= (select IdSede from UserProfile where UserName=@userName and [Password]=@password);
	if(@idSede=0)
	begin
			select top 1 usu.UserId,usu.UserName,usu.Roles,usu.IdSede,adm.UserId AdminId,adm.UserName UserNameAdmin,'TODOS' PAIS from UserProfile usu,UserProfile adm
	where usu.UserName=@userName and usu.[Password]=@password and usu.IsActive=1 and usu.idSede = adm.idSede and adm.Roles='Admin';
	end
	else
	begin
		select top 1 usu.UserId,usu.UserName,usu.Roles,usu.IdSede,adm.UserId AdminId,adm.UserName UserNameAdmin,s.PAIS from UserProfile usu,UserProfile adm,Sede s
	where usu.UserName=@userName and usu.[Password]=@password and usu.IsActive=1 and usu.idSede = adm.idSede and adm.Roles='Administrador' and usu.idSede=s.idSede;
	end
END

alter PROCEDURE USP_LISTAR_SALA
(
	@pais varchar(10),
	@tipo varchar(12),
	@sedeId int
)
AS
BEGIN
	if(@sedeId = 0)
	begin
		SELECT a.idSala,a.nombreSala,a.estado,a.tipo,a.horario,a.activos,a.ubicacion,a.idSede
		FROM SALA a,Sede b
		WHERE a.idSede = b.idSede and b.PAIS = @pais and a.tipo=@tipo;
	end
	else
	begin
		SELECT a.idSala,a.nombreSala,a.estado,a.tipo,a.horario,a.activos,a.ubicacion,a.idSede
		FROM SALA a,Sede b
		WHERE a.idSede = b.idSede and b.PAIS = @pais and a.tipo=@tipo and a.idSede=@sedeId;
	end
END