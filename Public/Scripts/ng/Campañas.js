$(document).ready(function () {
    listarCampañas(window.cookie.getCookie()["sedeId"]);
});

var cantCampañas = 0;
function listarCampañas(sedeId) {
    var data = {};
    data.idSede = sedeId * 1;
    $.ajax({
        method: "POST",
        url: "/Campanias/ListarCampanias",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "text",
        success: function (response) {
            if (response.length > 0) {
                var data = response.split("#");
                var str = "";
                for (var j = 0; j < data.length; j++) {
                    cantCampañas++;
                    fila = data[j].split("|");
                    str += "<tr id='tr_" + fila[0] + "'>";
                    str += "<th scope='row' align='center'><span style='display:none;' id='col_" + fila[0] + "'></span><p>" + cantCampañas + "</p></th>";
                    str += "<td  align='center'>" + fila[1] + "</td>";
                    str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarCampaña(" + fila[0] + "," + "\"" + fila[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
                    str += "</tr>";
                }
                $("#listarCampañas").html(str);
            }
        }
    });
}

function limpiar() {
    $("#campania").val("");
}

function crearCampaña() {
    limpiar();
    $("#verifica").html("0");
    $("#dvCampañas").modal();
}

function editarCampaña(id, nombre) {
    $("#campania").val(nombre);
    $("#verifica").html(id);
    $("#dvCampañas").modal();
}

function guardarCampaña() {
    var data = {}
    data.nombreCampania = $("#campania").val();
    data.idSede = window.cookie.getCookie()["sedeId"] * 1
    var verifica = $("#verifica").html();
    if (verifica == "0") {
        $.ajax({
            method: "POST",
            url: "/Campanias/guardarCampania",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "text",
            success: function (response) {
                if (response.length > 0) {
                    cantCampañas++;
                    var datos = response.split("|");
                    var str = "<tr id='tr_" + datos[0] + "'>";
                    str += "<th scope='row' align='center'><span style='display:none;' id='col_" + datos[0] + "'></span><p>" + cantCampañas + "</p></th>";
                    str += "<td  align='center'>" + datos[1] + "</td>";
                    str += "<td align='center'><button type='button' class='btn btn-success btn-sm' onclick='editarCampaña(" + datos[0] + "," + "\"" + datos[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button></td>";
                    str += "</tr>";
                    $("#listarCampañas").append(str);
                    $("#dvCampañas").modal("hide");
                } else {
                    alert("El nombre de la campaña ya existe");
                }
            }
        });

    } else {
        data.idCampania = verifica * 1;
        $.ajax({
            method: "POST",
            url: "/Campanias/actualizarCampania",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "text",
            success: function (response) {
                if (response.length > 0) {
                    cantCampañas++;
                    var datos = response.split("|");
                    var columna = document.getElementById("tr_" + datos[0]).getElementsByTagName("td");
                    columna[0].innerHTML = datos[1];
                    columna[1].innerHTML = "<button type='button' class='btn btn-success btn-sm' onclick='editarCampaña(" + datos[0] + "," + "\"" + datos[1] + "\")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>";
                    $("#dvCampañas").modal("hide");
                } else {
                    alert("El nombre ya existe");
                }
            }
        });
    }
}