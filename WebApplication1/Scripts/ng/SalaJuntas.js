(function ()
{
    strActivos = {};
    listarSedes();
	listarHoras();
	listarSalas();
})();

function listarSedes()
{
	if ($("#hdnSedes").val().length > 0)
	{
		var sedes = $("#hdnSedes").val().split(";");
        var sede = null;
		var str = "<option value='0'>--SELECCIONAR--</option>";
		for (var i = 0; i < sedes.length; i++)
		{
			sede = sedes[i].split("|");
            str += "<option value='" + sede[0] + "'>" + sede[1] + "</option>";
		}
		$("#SedeS").html(str);
    }
}

function listarTorres(elem)
{
	var str = "<option value='0'>--SELECCIONAR--</option>";
	if (elem.value != "0")
	{
		var sedes = $("#hdnSedes").val().split(";");
		var sede = null;
		for (var i = 0; i<sedes.length; i++)
		{
			sede = sedes[i].split("|");
			if (elem.value == (sede[0]*1))
			{
				for (var j = 1; j <= (sede[2] * 1); j++)
				{
					str += "<option value='" + j + "'>" + j + "</option>";
				}
				break;
			}
		}
	}
	$("#torreS").html(str);
	$("#pisoS").html("<option value='0'>--SELECCIONAR--</option>");
}

function listarPisos(elem)
{
	var str = "<option value='0'>--SELECCIONAR--</option>";
	if (elem.value != "0")
	{
		var sedes = $("#hdnSedes").val().split(";");
		var sede = null;
		for (var i = 0; i < sedes.length; i++)
		{
			sede = sedes[i].split("|");
			if ($("#SedeS").val() == sede[0])
			{
				var pisos = JSON.parse(sede[3]);
				var elpiso = $("#torreS").val()*1;
				for (var j = 1; j <= pisos[elpiso-1]; j++)
				{
					str += "<option value='" + j + "'>" + j + "</option>";
				}
				break;
			}
		}
	}
	$("#pisoS").html(str);
}

function crearSala()
{
	limpiar();
	$('#dvCrearSala').modal();
    $('#verifica').html('0');
    var sedeId = window.cookie.getCookie()["sedeId"];
    if ((sedeId * 1) > 0)
    {
        $("#SedeS").val(sedeId);
        var elemSede = document.getElementById("SedeS");
        listarTorres(elemSede); listarActivos(elemSede);
    }
}

var activos = {};
var elFieldset = true;
function agregarActivo()
{
    if ($("#ActivosS").val() == "0")
	{
		alert("Escoja un activo");
	} else
	{
        var replace = $("#ActivosS").val();
		var miactivo = replace.replace(" ","_");
		var claves = Object.keys(activos);
		var seagrega = true;
		for (var z = 0; z < claves.length; z++)
		{
			if (miactivo.toLowerCase() == claves[z].toLowerCase())
			{
				seagrega = false;
				break;
			}
		}
		if (seagrega)
		{
			if (Object.keys(activos).length == 0 && elFieldset)
			{
				$("#misActivos").html('<fieldset id="listarActivos" class="border:solid 1px;padding:10px;"><legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Lista de activos</legend></fieldset>');
			} else
			{
				document.getElementById("listarActivos").style.display = "block";
			}

			//var miactivo = $("#ActivosS").val();
			var str = "";
			str += '<div class="form-group" id="div_' + miactivo + '">';
            str += '<label class="col-sm-12 col-md-5 col-lg-5 control-label" for="activo_' + miactivo + '" style="padding-top:10px;padding-left:10px;">' + replace.replace("_", " ") + ': </label>';
			str += '<div class="col-sm-12 col-md-7 col-lg-7">';
			str += '<div class="input-group">';
			str += "<input type='number' id='activo_" + miactivo + "' class='form-control' onkeyup='cambiarActivo(\"" + miactivo + "\")' onmouseup='cambiarActivo(\"" + miactivo + "\")'/>";
			str += '<div class="input-group-btn">';
			str += "<button class='btn btn-contact btn-warning' title='Eliminar' type='button' style='padding:6px 6px;' onclick='eliminarActivo(\"" + miactivo + "\");'>";
			str += '<span class="glyphicon glyphicon-minus" style="font-size:10px;"></span>';
			str += '</button></div></div></div><br/><br/></div>';
			$("#listarActivos").append(str);
			activos[miactivo] = 1;
			console.log(activos);
			if (Object.keys(activos).length > 0)
			{
				var key = Object.keys(activos);
				for (var j = 0; j < key.length; j++)
				{
					$("#activo_" + key[j]).val(activos[key[j]]);
				}
			}

		} else
		{
			alert("No puedes agregar activos repetidos!");
		}
		document.getElementById("ActivosS").remove(document.getElementById("ActivosS").selectedIndex);
	}
}

function cambiarActivo(miactivo)
{
	activos[miactivo] = $("#activo_" + miactivo).val()*1;
	console.log(activos);
}

function eliminarActivo(miactivo)
{
	delete activos[miactivo];
	var parent = document.getElementById("listarActivos");
	var child = document.getElementById("div_" + miactivo);
	parent.removeChild(child);
	if (Object.keys(activos).length == 0){
		document.getElementById("listarActivos").style.display = "none";
		elFieldset = false;
	}
	$("#ActivosS").append("<option value='" + miactivo + "'>" + miactivo.replace("_"," ") + "</option>");
}

function listarHoras()
{
	var str = "<option value='0'>--SELECCIONAR--</option>";
	for (var i = 1; i <= 24; i++)
	{
		str += "<option value='" + ((i < 10) ? "0" + i : i)+":00'>" + ((i<10)?"0"+i:i)+ ":00</option>";
	}
	$("#horai").html(str);
	$("#horaf").html(str);
}

function listarActivos(elem)
{
    var sedes = $("#hdnSedes").val().split(";");
    var sede = null;
    var activos = null;
    var str = "<option value='0'>--SELECCIONAR--</option>";
    for (var i = 0; i < sedes.length; i++) {
        sede = sedes[i].split("|");
        activos = JSON.parse(sede[4]);
        if (sede[0] == elem.value) {
            for (var j = 0; j < activos.length; j++) {
                str += "<option value='" + activos[j] + "'>" + activos[j].replace("_", " ") + "</option>";
            }
        }
    }
    $("#ActivosS").html(str);
}

function limpiar()
{
	$("#nombreS").val("");
	$("#SedeS").val("0");
	$("#torreS").val("0");
	$("#pisoS").val("0");
	$("#ActivosS").val("0");
	$("#horai").val("0");
	$("#diai").val("0");
	$("#horaf").val("0");
	$("#diaf").val("0");
	$("#misActivos").html("");
	//listarActivos();
	$("#iActivosS").val("");
	activos = {};
	elFieldset = true;
}

var cantSalas = 0;
function guardarSala()
{
	var verifica = $("#verifica").html();
	if ($("#nombreS").val() != "" && $("#SedeS").val() != "0" && $("#torreS").val != "0" && $("#pisoS").val != "0" && $("#horai").val() != "0" && $("#diai").val() != "0" && $("#horaf").val() != "0" && $("#diaf").val() != "0" && Object.keys(activos).length>0){
		var data = {};
		data.nombreSala = $("#nombreS").val().toUpperCase();
		data.idSede = $("#SedeS").val()*1;
		data.ubicacion = "Torre: " + $("#torreS").val() + "; Piso: " + $("#pisoS").val();
		data.activos = JSON.stringify(activos);
		data.tipo = $("#tipoS").val();
		data.horario = $("#diai").val() + "-" + $("#diaf").val() + ";" + $("#horai").val() + "-" + $("#horaf").val();
		if (verifica == "0")
		{
			$.ajax({
				method: "POST",
				url: "/SalaJuntas/GuardarSala",
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "text",
				success: function (response)
				{
					if (response.length > 0)
					{
						cantSalas++;
						var datos = response.split("|");
						var activos = JSON.parse(datos[5]);
						var keys = Object.keys(activos);
						var paramActivos = "";
						for (var i = 0; i < keys.length; i++)
						{
							paramActivos += keys[i] + ":" + activos[keys[i]] + ";";
						}

						var str = "<tr id='tr_"+datos[0]+"'>";
						str += "<th scope='row' align='center'><span style='display:none;' id='col_" + datos[0] + "'></span><p>" + cantSalas + "</p></th>";
						str += "<td  align='center'>" + datos[1] + "</td>";
						//str += "<td  align='center'>" + datos[3] + "</td>";
						str += "<td align='center'>" + datos[4] + "</td>";
						str += "<td align='center'><button type='button' class='btn btn-default btn-sm' title='ver activos' onclick='mostrarActivos(\"" + paramActivos.substring(0, paramActivos.length - 1) + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
						str += "<td align='center' >" + datos[6] + "</td>";
						str += "<td align='center'>" + $("#SedeS option[value='"+datos[7]+"']").text() + "</td>";
						str += "<td align='center'><label class='switch'><input type='checkbox' id='switch_"+datos[0]+"' checked onchange='cambioEstado(this)'/><span class='slider round'></span></label></td>";
                        str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarSala(" + datos[0] + "," + "\"" + datos[1] + "\"" + "," + "\"" + datos[3] + "\"" + "," + "\"" + datos[4] + "\"," + "\"" + paramActivos.substring(0, paramActivos.length - 1) + "\"" + "," + "\"" + datos[6] + "\"" + "," + "\"" + datos[7] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
						str += "</tr>";

						$("#listarSala").append(str);
						$("#dvCrearSala").modal("hide");
					}
				}
			});
		} else
		{
			data.idSala = verifica * 1;
			$.ajax({
				method: "POST",
				url: "/SalaJuntas/ActualizarSala",
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "text",
				success: function (response)
				{
					if (response.length > 0)
					{
						var datos = response.split("|");
						var keys = Object.keys(activos);
						var paramActivos = "";
						for (var i = 0; i < keys.length; i++)
						{
							paramActivos += keys[i] + ":" + activos[keys[i]] + ";";
						}
						
						var columna = document.getElementById("tr_"+datos[0]).getElementsByTagName("td");

						columna[0].innerHTML = datos[1];
						//columna[1].innerHTML = datos[3];
						columna[1].innerHTML = datos[4];
						columna[2].innerHTML = "<button type='button' class='btn btn-default btn-sm' title='ver activos' onclick='mostrarActivos(\"" + paramActivos.substring(0, paramActivos.length - 1) + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
						columna[3].innerHTML = datos[6];
						columna[4].innerHTML = $("#SedeS option[value='" + datos[7] + "']").text();
						columna[6].innerHTML = "<button type='button' class='btn btn-success btn-sm' onclick='editarSala(" + datos[0] + "," + "\"" + datos[1] + "\"" + "," + "\"" + datos[3] + "\"" + "," + "\"" + datos[4] + "\"," + "\"" + paramActivos.substring(0, paramActivos.length - 1) + "\"" + "," + "\"" + datos[6] + "\"" + "," + "\"" + datos[7] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>";

						$("#dvCrearSala").modal("hide");
					}
				}
			});
		}
		
	} else
	{
		alert("Falta completar campos!");
	}
}

function mostrarActivos(sactivos,nombre)
{
	$("#nameSala").html("SALA: " + nombre);

	var tran = sactivos.split(";");
	var camp = null;
	var str = "";
	for (var i = 0; i < tran.length; i++)
	{
		camp = tran[i].split(":");
		str += "<tr><td align='center'>" + camp[0].replace("_"," ") + "</td><td align='center'>" + camp[1] + "</td></tr>";
	}
	$("#listActivos").html(str);
	$("#dvMisActivos").modal();
}

function listarSalas()
{
    var sedeId = window.cookie.getCookie()["sedeId"];
	$.ajax({
		method: "POST",
		url: "/SalaJuntas/ListarSalas",
        data: { param: $("#hdnPais").val() + "|" + $("#hdnTipo").val() + "|" + sedeId},
		dataType: "text",
		success: function (response)
		{
			if (response.length > 0)
			{
				var data = response.split("#");
				var str = "";
				var fila = null;
				var activos = "";
				var keys = null;
				for (var j = 0; j < data.length; j++)
				{
					cantSalas++;
					fila = data[j].split("|");
					activos = JSON.parse(fila[5]);
					keys = Object.keys(activos);
					paramActivos = "";

					for (var i = 0; i < keys.length; i++)
					{
						paramActivos += keys[i] + ":" + activos[keys[i]] + ";";
					}

					str += "<tr id='tr_" + fila[0] +"'>";
					str += "<th scope='row' align='center'><span style='display:none;' id='col_" + fila[0] + "'></span><p>" + cantSalas + "</p></th>";
					str += "<td align='center'>" + fila[1] + "</td>";
					//str += "<td align='center'>" + fila[3] + "</td>";
					str += "<td align='center'>" + fila[4] + "</td>";
					str += "<td align='center'><button type='button' class='btn btn-default btn-sm' title='ver activos' onclick='mostrarActivos(\"" + paramActivos.substring(0, paramActivos.length - 1) + "\",\"" + fila[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
					str += "<td align='center' >" + fila[6] + "</td>";
					str += "<td align='center'>" + $("#SedeS option[value='" + fila[7] + "']").text() + "</td>";
					str += "<td align='center'><label class='switch'><input type='checkbox' id='switch_" + fila[0] + "' " + (fila[2]=="True" ? "checked" : "")+" onchange='cambioEstado(this)'/><span class='slider round'></span></label></td>";
                    str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarSala(" + fila[0] + "," + "\"" + fila[1] + "\"" + "," + "\"" + fila[3] + "\"" + "," + "\"" + fila[4] + "\"," + "\"" + paramActivos.substring(0, paramActivos.length - 1) + "\"" + "," + "\"" + fila[6] + "\"" + "," + "\"" + fila[7] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
					str += "</tr>";
				}
				$("#listarSala").html(str);
			}
		}
	});
}

function cambioEstado(elem)
{
	var data = {};
	data.idSala = elem.id.substring(7,elem.id.length) * 1;
	data.estado = elem.checked;
	$.ajax({
		method: "POST",
		url: "/SalaJuntas/ActualizarEstado",
		contentType: "application/json",
		data: JSON.stringify(data),
		dataType: "text",
		success: function (response)
		{
			if ((response * 1) > 0)
			{
				alert("Estado actualizado correctamente");
			} else
			{
				alert("Error en actualizar el estado de la Sala de juntas");
			}
		}
	});
}

function editarSala(id,nombre,tipo,horario,misactivos,ubicacion,sede)
{
    limpiar();

	$("#nombreS").val(nombre);

	var inifin = horario.split(";");
	var dias = inifin[0].split("-");
	$("#diai").val(dias[0]);
	$("#diaf").val(dias[1]);
	var horas = inifin[1].split("-");
	$("#horai").val(horas[0]);
	$("#horaf").val(horas[1]);

	$("#tipoS").val(tipo);

	$("#SedeS").val(sede);
    listarTorres(document.getElementById("SedeS"));
    listarActivos(document.getElementById("SedeS"));

	var tp = ubicacion.split(";");
	var torre = tp[0].split(":");
	$("#torreS").val(torre[1] * 1);
	listarPisos(document.getElementById("torreS"));

	var piso = tp[1].split(":");
	$("#pisoS").val(piso[1]*1);

	activos = {};
	var tran = misactivos.split(";");
	var camp = null;
	for (var i = 0; i < tran.length; i++)
	{
		camp = tran[i].split(":");
		activos[camp[0]] = camp[1] * 1;
	}
	var keys = Object.keys(activos);
	$("#misActivos").html('<fieldset id="listarActivos" class="border:solid 1px;padding:10px;"><legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Lista de activos</legend></fieldset>');
	var str = "";
	var selecActivos = null;
	for (var j = 0; j < keys.length; j++)
	{
		str += '<div class="form-group" id="div_' + keys[j] + '">';
		str += '<label class="col-sm-12 col-md-5 col-lg-5 control-label" for="activo_' + keys[j] + '" style="padding-top:10px;padding-left:10px;">' + keys[j].replace("_"," ")+ ': </label>';
		str += '<div class="col-sm-12 col-md-7 col-lg-7">';
		str += '<div class="input-group">';
		str += "<input type='number' id='activo_" + keys[j] + "' class='form-control' onkeyup='cambiarActivo(\"" + keys[j] + "\")' onmouseup='cambiarActivo(\"" + keys[j] + "\")' value='" + activos[keys[j]]+"'/>";
		str += '<div class="input-group-btn">';
		str += "<button class='btn btn-contact btn-warning' title='Eliminar' type='button' style='padding:6px 6px;' onclick='eliminarActivo(\"" + keys[j] + "\");'>";
		str += '<span class="glyphicon glyphicon-minus" style="font-size:10px;"></span>';
		str += '</button></div></div></div><br/><br/></div>';
		selecActivos = document.getElementById("ActivosS");
		for (var z = 0; z < selecActivos.length; z++)
		{
			if (selecActivos.options[z].value == keys[j]) selecActivos.remove(z);
		}
	}

	$("#listarActivos").append(str);
	$("#verifica").html(id);
	$('#dvCrearSala').modal();
}

function eliminarSala(id)
{
	var question = confirm("¿Esta seguro que desea eliminar esta Sala?");
	if (question === true)
	{
		var data = {};
		data.idSala = id;

		$.ajax({
			method: "POST",
			url: "/SalaJuntas/EliminarSala",
			contentType: "application/json",
			data: JSON.stringify(data),
			dataType: "text",
			success: function (response)
			{
				console.log(response);
				if (response*1 > 0)
				{
					cantSalas--;
					var ubicacion = document.getElementsByClassName("tr_" + id);
					for (var i = 0; i < ubicacion.length; i++)
					{
						ubicacion[i].style.display = "none";
					}
				}
			}
		});
	}
}