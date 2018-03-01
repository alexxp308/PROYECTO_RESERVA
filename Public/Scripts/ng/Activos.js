$(document).ready(function ()
{
	listarActivos();
});

var losActivos = [];
var cantActivos = 0;

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
				var str = "";
				for (var j = 0; j < data.length; j++)
				{
					cantActivos++;
					fila = data[j].split("|");
					str += "<tr id='tr_" + fila[0] + "'>";
					str += "<th scope='row' align='center'><span style='display:none;' id='col_" + fila[0] + "'></span><p>" + cantActivos + "</p></th>";
					str += "<td  align='center'>" + fila[1] + "</td>";
					str += "<td align='center'><button type='button' class='btn btn-primary btn-sm' onclick='editarActivo(" + fila[0] + "," + "\"" + fila[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
					str += "</tr>";
					losActivos.push(fila[1].toLowerCase());
				}
				$("#listarActivos").html(str);
			}
		}
	});
}

function limpiar()
{
	$("#miactivoA").val("");
}

function crearActivo()
{
	limpiar();
	$("#verifica").html("0");
	$("#dvMisActivos").modal();
}

function editarActivo(id,nombre)
{
	$("#miactivoA").val(nombre);
	$("#verifica").html(id);
	$("#dvMisActivos").modal();
}

function guardarActivo()
{
	var data = {}
	data.nombreActivo = $("#miactivoA").val();
	var verifica = $("#verifica").html();
	console.log(losActivos);
	if (verifica == "0")
	{
		var buscador = losActivos.findIndex((x) => x == data.nombreActivo.toLowerCase());
		if (buscador == -1)
		{
			$.ajax({
				method: "POST",
				url: "/Activos/GuardarActivo",
				contentType: "application/json",
				data: JSON.stringify(data),
				dataType: "text",
				success: function (response)
				{
					if (response.length > 0)
					{
						cantActivos++;
						var datos = response.split("|");

						var str = "<tr id='tr_" + datos[0] + "'>";
						str += "<th scope='row' align='center'><span style='display:none;' id='col_" + datos[0] + "'></span><p>" + cantActivos + "</p></th>";
						str += "<td  align='center'>" + datos[1] + "</td>";
						str += "<td align='center'><button type='button' class='btn btn-primary btn-sm' onclick='editarActivo(" + datos[0] + "," + "\"" + datos[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
						str += "</tr>";
						$("#listarActivos").append(str);
						$("#dvMisActivos").modal("hide");
					}
				}
			});
		} else
		{
			alert("ya existe un activo con el mismo nombre!");
		}
		
	} else
	{
		data.idActivo = verifica*1;
		$.ajax({
			method: "POST",
			url: "/Activos/ActualizarActivo",
			contentType: "application/json",
			data: JSON.stringify(data),
			dataType: "text",
			success: function (response)
			{
				if (response.length > 0)
				{
					cantActivos++;
					var datos = response.split("|");
					var columna = document.getElementById("tr_" + datos[0]).getElementsByTagName("td");
					columna[0].innerHTML = datos[1];
					columna[1].innerHTML = "<button type='button' class='btn btn-primary btn-sm' onclick='editarActivo(" + datos[0] + "," + "\"" + datos[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>";
					$("#dvMisActivos").modal("hide");
				}
			}
		});
	}
}