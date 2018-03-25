ALTER PROCEDURE [dbo].[USP_OBTENER_RESERVASXUSUARIO](
	@idSala int,
	@userId int,
	@idSede int,
	@estado int
)
AS
BEGIN
	-- actualiza los estados a no utlizados cuando ya vencio su tiempo y no hizo checklist
	update RESERVA SET estadoReserva=5 WHERE (estadoReserva=1 or estadoReserva=2) and fhCheckFinal='' and fhfin<replace(CONVERT(varchar(19),getdate(),120),' ','T')

	declare @rol varchar(20)= (select Roles from UserProfile where UserId=@userId);
	declare @val int = @idSala;
	if(@val=0)
	begin
		if(@estado=9)
		begin
			if(@rol='Administrador' or @rol='Admin')
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where a.idSala=b.idSala and b.idSede=@idSede order by estadoReserva asc, fhinicio desc
			end
			else
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where idCreator=@userId and a.idSala=b.idSala and b.idSede=@idSede order by estadoReserva asc, fhinicio desc
			end
		end
		else
		begin
			if(@rol='Administrador' or @rol='Admin')
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where a.idSala=b.idSala and b.idSede=@idSede and a.estadoReserva=@estado order by estadoReserva asc, fhinicio desc
			end
			else
			begin
				select a.idReserva,a.estadoReserva,a.idSala,a.idCampania,a.descripcion,a.fhCreacion,a.fhinicio,a.fhfin,a.idCreator,
				a.UserNameCreator,a.nombreCompletoCreator,
				a.idCharge,a.UserNameCharge,a.nombreCompletoCharge,a.checklistInicial,a.fhCheckInicial,a.checklistFinal,a.fhCheckFinal from RESERVA a,SALA b 
				where idCreator=@userId and a.idSala=b.idSala and b.idSede=@idSede and a.estadoReserva=@estado order by estadoReserva asc, fhinicio desc
			end
		end
	end
	else
	begin
		if(@estado=9)
		begin
			if(@rol='Administrador' or @rol='Admin')
			begin
				select * from RESERVA where idSala=@idSala order by estadoReserva asc, fhinicio desc
			end
			else
			begin
				select * from RESERVA where idSala=@idSala and idCreator=@userId order by estadoReserva asc, fhinicio desc
			end
		end
		else
		begin
			if(@rol='Administrador' or @rol='Admin')
			begin
				select * from RESERVA where idSala=@idSala and estadoReserva=@estado order by estadoReserva asc, fhinicio desc
			end
			else
			begin
				select * from RESERVA where idSala=@idSala and idCreator=@userId and estadoReserva=@estado order by estadoReserva asc, fhinicio desc
			end
		end
	end
END


ALTER PROCEDURE [dbo].[USP_GUARDAR_CHECKLIST]
(
	@idReserva int,
	@iniFin int,
	@checkList nvarchar(max)
)
AS
BEGIN
update RESERVA SET estadoReserva=5 WHERE (estadoReserva=1 or estadoReserva=2) and fhCheckFinal='' and fhfin<replace(CONVERT(varchar(19),getdate(),120),' ','T')
declare @isUse INT = (select estadoReserva from RESERVA WHERE idReserva=@idReserva)
if(@isUse = 5)
begin
	if(@iniFin=0)
	begin
		update RESERVA set checklistInicial=@checkList,fhCheckInicial= CONVERT(nvarchar(16), getdate(), 120) where idReserva=@idReserva
		select checklistInicial,fhCheckInicial,estadoReserva from RESERVA where idReserva=@idReserva;
	end
	else
	begin
		update RESERVA set checklistFinal=@checkList,fhCheckFinal= CONVERT(nvarchar(16), getdate(), 120) where idReserva=@idReserva
		select checklistFinal,fhCheckFinal,estadoReserva from RESERVA where idReserva=@idReserva;
	end
end
else
begin
	if(@iniFin=0)
	begin
		declare @EcheckIni char(19) = (select fhCheckInicial from RESERVA where idReserva=@idReserva);
		if(@EcheckIni!='')
		begin
		update RESERVA set checklistInicial=@checkList,fhCheckInicial= CONVERT(nvarchar(16), getdate(), 120) where idReserva=@idReserva
		select checklistInicial,fhCheckInicial,estadoReserva from RESERVA where idReserva=@idReserva;
		end
		else
		begin
		update RESERVA set checklistInicial=@checkList,fhCheckInicial= CONVERT(nvarchar(16), getdate(), 120),estadoReserva=2 where idReserva=@idReserva
		select checklistInicial,fhCheckInicial,estadoReserva from RESERVA where idReserva=@idReserva;
		end
	end
	else
	begin
	update RESERVA set checklistFinal=@checkList,fhCheckFinal= CONVERT(nvarchar(16), getdate(), 120),estadoReserva=3 where idReserva=@idReserva
	select checklistFinal,fhCheckFinal,estadoReserva from RESERVA where idReserva=@idReserva;
	end
end
END