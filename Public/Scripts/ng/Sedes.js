$(document).ready(function ()
{
	listarSedes();
	listarActivos();
});

var cantSedes = 0;
function listarSedes()
{
	$.ajax({
		method: "POST",
		url: "/Sedes/ListarSedes",
		contentType: "application/json",
		dataType: "text",
		success: function (response)
		{
			if (response.length > 0)
			{
				var data = response.split(";");
				var str = "";
				var fila = null;
				for (var i = 0; i < data.length; i++)
				{
					cantSedes++;
					fila = data[i].split("|");
					str += "<tr id='fila_" + fila[0] +"'>";
					str += "<th scope='row'><span style='display:none;' align='center'></span><p>" + cantSedes + "</p></th>";
					str += "<td align='center'>" + fila[1] + "</td>";
					str += "<td align='center'>" + fila[2] + "</td>";
                    str += "<td align='center'><button type='button' class='btn btn-default btn-sm' onclick='mostrarPisos(\"" + fila[3] + "\",\"" + fila[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
                    str += "<td align='center'><button type='button' class='btn btn-default btn-sm' onclick='mostrarActivos(\"" + JSON.parse(fila[5]) + "\",\"" + fila[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
					str += "<td align='center'>" + fila[4] + "</td>";
                    str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarSede(" + fila[0] + ",\"" + fila[1] + "\"," + fila[2] + ",\"" + fila[3] + "\",\"" + fila[4] + "\",\"" + JSON.parse(fila[5]) + "\",\"" + fila[6]+"\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
					str += "</tr>";
				}
				$("#listarSedes").html(str);
			}
		}
	});
}

//var activosA = [];
var selectActivos = "";
var activosXsede = [];
function listarActivos()
{
	$.ajax({
		method: "POST",
		url: "/Activos/ListarActivos",
		dataType: "text",
		success: function (response)
		{
			if (response.length > 0)
			{
				var data = response.split("#");
				var str = "<option value='0'>--SELECCIONAR--</option>";
				for (var j = 0; j < data.length; j++)
				{
					fila = data[j].split("|");
					//activosA.push(fila[1]);
					str += "<option value='"+fila[1].replace(" ","_")+"'>"+fila[1]+"</option>"
				}
				selectActivos = str;
				$("#activosS").html(str)
			}
		}
	});
}

var cantActivos=0;
function agregarActivo()
{
	cantActivos++;
	if (activosXsede.length == 0) document.getElementById("misActivos").style.display = "block";
	var str = "<tr id='fila_" + $("#activosS").val() +"'>";
	str += "<th scope='row'><span style='display:none;' align='center'></span><p>" + cantActivos + "</p></th>";
	str += "<td align='center'>" + $("#activosS").val().replace("_"," ") + "</td>";
	str += "<td align= 'center'><button type='button' class='btn btn-warning btn-sm' onclick='eliminarActivo(\"" + $("#activosS").val() + "\")'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td>";
	str += "</tr>";
	activosXsede.push($("#activosS").val());
	document.getElementById("activosS").remove(document.getElementById("activosS").selectedIndex);
    $("#tActivos").append(str);
    console.log(activosXsede);
}

function eliminarActivo(activo){
	cantActivos--;
    //document.getElementById("fila_" + activo).style.display = "none";
    $("#fila_" + activo).remove();
	$("#activosS").append("<option value='"+activo+"'>"+activo.replace("_"," ")+"</option>");
	activosXsede.splice(activosXsede.findIndex((x)=>x == activo),1);
}

function limpiar()
{
    cantActivos = 0;
	$("#nombreS").val("");
	$("#paisS").val("0");
	$("#torresS").val("");
	$("#misTorres").html("");
	guardeTorre = false;
	objPisos = [];
	activosXsede = [];
	document.getElementById("misActivos").style.display = "none";
	$("#tActivos").html("");
    $("#activosS").html(selectActivos);
    $("#service").val("");
}

function crearSede()
{
	limpiar();
	$('#dvCrearSede').modal();
	$('#verifica').html('0');
}

var objPisos = [];
function guardarSede()
{
	var verifica = $("#verifica").html();
	if ($("#nombreS").val() != "" && $("#paisS").val() != "0" && $("#torresS").val() != "" && $("#torresS").val() != "0" && guardeTorre && $("#service").val()!="")
	{
		if(activosXsede.length==0){
			alert("falta agregar activos a la sede!");
			return;
		}
		var data = {};
		data.nombreSede = $("#nombreS").val().toUpperCase();
		data.paisSede = $("#paisS").val();
		data.torres = $("#torresS").val() * 1;
        data.activos = JSON.stringify(activosXsede);
        data.service = $("#service").val();

		for (var i = 1; i <= data.torres; i++)
		{
			if ($("#mitorre_" + i).val() != "" && $("#mitorre_" + i).val() != "0")
			{
				objPisos.push($("#mitorre_" + i).val() * 1);
			} else
			{
				objPisos = {};
				alert("Debes completar los pisos de la torre " + (i + 1));
				return;
			}
		}
		data.pisos = JSON.stringify(objPisos);
		console.log(data);
		
		if (verifica == "0")
		{
			$.ajax({
				method: "POST",
				url: "/Sedes/Guardar",
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "text",
				success: function (response)
				{
					if (response.length > 0)
					{
						cantSedes++;
						var datos = response.split("|");
						var str = "<tr id='fila_" + datos[0] + "'>";
						str += "<th scope='row' align='center'><span style='display:none;'></span><p>" + cantSedes + "</p></th>";
						str += "<td align='center'>" + datos[1].toUpperCase() + "</td>";
						str += "<td align='center'>" + datos[2] + "</td>";
						str += "<td align='center'><button type='button' class='btn btn-default btn-sm' onclick='mostrarPisos(\"" + datos[3] + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
                        str += "<td align='center'><button type='button' class='btn btn-default btn-sm' onclick='mostrarActivos(\"" + JSON.parse(datos[5]) + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button></td>";
						str += "<td align='center'>" + datos[4] + "</td>";
                        str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarSede(" + datos[0] + ",\"" + datos[1] + "\"," + datos[2] + ",\"" + datos[3] + "\",\"" + datos[4] + "\",\"" + JSON.parse(datos[5])+"\",\""+datos[6]+"\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
						str += "</tr>";
						$("#listarSedes").append(str);
						$("#dvCrearSede").modal("hide");
					}
				}
			});
		} else //editar
		{
			data.idSede = verifica*1;
			$.ajax({
				method: "POST",
				url: "/Sedes/Actualizar",
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "text",
				success: function (response)
				{
					if (response.length > 0)
					{
						var datos = response.split("|");
						var ubicacion = document.getElementById("fila_" + datos[0]).getElementsByTagName("td");
						ubicacion[0].innerHTML = datos[1];
						ubicacion[1].innerHTML = datos[2];
						ubicacion[2].innerHTML = "<button type='button' class='btn btn-default btn-sm' onclick='mostrarPisos(\"" + datos[3] + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
						ubicacion[3].innerHTML = "<button type='button' class='btn btn-default btn-sm' onclick='mostrarActivos(\"" + JSON.parse(datos[5]) + "\",\"" + datos[1] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
						ubicacion[4].innerHTML = datos[4];
                        ubicacion[5].innerHTML = "<button type='button' class='btn btn-success btn-sm' onclick='editarSede(" + datos[0] + ",\"" + datos[1] + "\"," + datos[2] + ",\"" + datos[3] + "\",\"" + datos[4] + "\",\"" + JSON.parse(datos[5]) + "\",\"" + datos[6] +"\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>";
						$("#dvCrearSede").modal("hide");
					}
				}
			});
		}
		
	} else
	{
		alert("falta completar campos");
	}
}

function mostrarActivos(activos, nombre) {
	$("#nameActivo").html("SEDE: " + nombre.toUpperCase());
	var losActivos = activos.split(",");
	var str = "";
	for (var i = 0; i < losActivos.length; i++)
	{
		str += "<tr><td align='center'>" + (i + 1) + "</td><td align='center'>" + losActivos[i].replace("_"," ")+"</td></tr>";
	}
	$("#listActivos").html(str);
	$("#dvMisActivos").modal();
}

function editarSede(id,nombre,torres,pisos,pais,activos,service)
{
	limpiar();
	$("#nombreS").val(nombre);
	$("#paisS").val(pais);
	$("#torresS").val(torres);
    $("#verifica").html(id);
    $("#service").val(service);
	guardeTorre = true;
	var mispisos = JSON.parse(pisos);

	document.getElementById("misActivos").style.display = "block";
	var strA = "";
	var misActivos = activos.split(",");
	var selecActivos = document.getElementById("activosS");
	activosXsede =misActivos;
    cantActivos = misActivos.length;
    var strA = "";
	for(var i=0;i<misActivos.length;i++){
		strA += "<tr id='fila_" + misActivos[i] +"'>";
		strA += "<th scope='row'><span style='display:none;' align='center'></span><p>" + (i+1) + "</p></th>";
		strA += "<td align='center'>" + misActivos[i].replace("_"," ") + "</td>";
		strA += "<td align= 'center'><button type='button' class='btn btn-warning btn-sm' onclick='eliminarActivo(\"" + misActivos[i] + "\")'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></button></td>";
		strA += "</tr>";
		for (var z = 0; z < selecActivos.length; z++)
		{
			if (selecActivos.options[z].value == misActivos[i]) selecActivos.remove(z);
		}
	}
    $("#tActivos").html(strA);

	$("#misTorres").html('<fieldset id="listarTorres" class="border:solid 1px;padding:10px;"><legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Número de pisos</legend></fieldset>');
	var str = "";
	for (var i = 0; i < torres; i++)
	{
		str += '<div class="form-group">';
		str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="mitorre_' + (i + 1) + '" style="padding-top:10px;padding-left:10px;">Torre ' + (i + 1) + ':</label>';
		str += '<div class="col-sm-12 col-md-8 col-lg-8">';
		str += '<input type="number" placeholder="pisos de la torre ' + (i + 1) + '" id="mitorre_' + (i + 1) + '" class="form-control" value="' + mispisos[i]+'"/>';
		str += '</div></div><br/><br/>'
	}
	$("#listarTorres").append(str);

	$("#dvCrearSede").modal();
}

function mostrarPisos(pisos,nombre)
{
	$("#nameTowel").html("SEDE: " + nombre.toUpperCase());
	var lospisos = JSON.parse(pisos);
	var str = "";
	for (var i = 0; i < lospisos.length; i++)
	{
		str += "<tr><td align='center'>Torre " + (i + 1) + "</td><td align='center'>" + lospisos[i]+"</td></tr>";
	}
	$("#misPisos").html(str);
	$("#dvMisPisos").modal();
}

var guardeTorre = false;
function guardarTorres()
{
	if ($("#torresS").val() != "" && $("#torresS").val() != "0")
	{
		guardeTorre = true;
		$("#misTorres").html("");
		$("#misTorres").html('<fieldset id="listarTorres" class="border:solid 1px;padding:10px;"><legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Número de pisos</legend></fieldset>');
		var cantTorres = $("#torresS").val();
		var str = "";
		for (var i = 0; i < cantTorres; i++)
		{
			str += '<div class="form-group">';
			str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="mitorre_' + (i+1) + '" style="padding-top:10px;padding-left:10px;">Torre ' + (i + 1) + ':</label>';
			str += '<div class="col-sm-12 col-md-8 col-lg-8">';
			str += '<input type="number" placeholder="pisos de la torre ' + (i + 1) + '" id="mitorre_' + (i+1) + '" class="form-control" />';
			str += '</div></div><br/><br/>'
		}
		$("#listarTorres").append(str);
	} else
	{
		guardeTorre = false;
		alert("Debe ingresar el numero de torres");
	}
	
}

/*function eliminarSede(id)
{
	var question = confirm("¿Esta seguro que desea eliminar esta sede?");
	if (question === true)
	{
		var data = {};
		data.idSede = id;

		$.ajax({
			method: "POST",
			url: "/Sedes/Eliminar",
			contentType: "application/json",
			data: JSON.stringify(data),
			dataType: "text",
			success: function (response)
			{
				if (response*1 > 0)
				{
					cantSedes--;
					var ubicacion = document.getElementById("col_" + id).parentNode.parentNode;
					var copy = ubicacion.nextSibling;
					while (copy != null)
					{
						copy.firstChild.lastChild.innerHTML = copy.firstChild.lastChild.innerHTML * 1 - 1;
						copy = copy.nextSibling;
					}
					document.getElementById("listarSedes").removeChild(ubicacion);
				}
			}
		});
	}
}*/