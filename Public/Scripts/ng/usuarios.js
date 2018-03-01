$(document).ready(function () {
    listarSedes()
    getSede();
});

var cantUsuarios = 0;

var miSede = [];
function listarSedes() {
    if ($("#hdnSedes").val().length > 0) {
        var sedes = $("#hdnSedes").val().split(";");
        var sede = null;
        var str = "<option value='0'>--SELECCIONAR--</option>";
        for (var i = 0; i < sedes.length; i++) {
            sede = sedes[i].split("|");
            miSede.push({ idSede: sede[0], nombreSede: sede[1] });
            str += "<option value='" + sede[0] + "'>" + sede[1] + "</option>";
        }
        $("#descr").html($("#hdnPais").val());
        $("#sede").html(str);
        document.getElementById("role").setAttribute("disabled", "disabled");
        listarUsuarios();
    }
}

function getSede() {
    if ($("#hdnSede").val() * 1 > 0) {
        var data = {};
        data.idSede = $("#hdnSede").val() * 1;
        $.ajax({
            method: "POST",
            url: "/Sedes/getSede",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "text",
            success: function (response) {
                if (response.length > 0) {
                    var datos = response.split("|");
                    var str = "<option value='" + datos[0] + "'>" + datos[1] + "</option>";
                    miSede.push({ idSede: datos[0], nombreSede: datos[1] })
                    $("#sede").html(str);
                    document.getElementById("sede").setAttribute("disabled", "disabled");
                    $("#descr").html(datos[1]);
                    document.getElementById("role").setAttribute("disabled", "disabled");
                    listarUsuarios();
                }
            }
        });
    }
}

function listarUsuarios() {
    console.log(miSede);
    $.ajax({
        method: "POST",
        url: "/Usuarios/listarUsuarios",
        data: { pais: $("#hdnPais").val(), sedeId: ($("#hdnSede").val() == null) ? 0 : $("#hdnSede").val()*1},
        dataType: "text",
        success: function (response) {
            if (response.length > 0) {
                var data = response.split("#");
                var str = "";
                var fila = null;
                for (var j = 0; j < data.length; j++) {
                    cantUsuarios++;
                    fila = data[j].split("|");
                    str += "<tr id='tr_" + fila[0] + "'>";
                    str += "<th scope='row' align='center'><span style='display:none;' id='col_" + fila[0] + "'></span><p>" + cantUsuarios + "</p></th>";
                    str += "<td align='center'>" + fila[1] + "</td>";
                    str += "<td align='center'>" + fila[4] + "</td>";
                    str += "<td align='center'>" + fila[2] + "</td>";
                    str += "<td align='center'>" + miSede.find((x) => x.idSede == fila[6])["nombreSede"] + "</td>";
                    str += "<td align='center'><label class='switch'><input type='checkbox' id='switch_" + fila[0] + "' " + (fila[7] == "True" ? "checked" : "") + " onchange='cambioEstado(this)'/><span class='slider round'></span></label></td>";
                    str += "<td align='center'><button title='editar usuario' type='button' class='btn btn-primary btn-sm' onclick='editarUsuario(" + fila[0] + "," + "\"" + fila[1] + "\"" + "," + "\"" + fila[2] + "\"" + "," + "\"" + fila[3] + "\"," + "\"" + fila[4] + "\"" + "," + "\"" + fila[5] + "\"," + "\"" + fila[6] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>&nbsp;&nbsp;<button title='resetear contraseña' type='button' class='btn btn-info btn-sm' onclick='resetear(\"" + fila[0] +"\")'><i class='fa fa-undo'></i></button></td>";
                    str += "</tr>";
                }
                $("#listarUsuarios").html(str);
            }
        }
    });
}

function limpiar() {
    $("#apellidos").val("");
    $("#nombre").val("");
    $("#userName").val("");
    $("#email").val("");
    $("#cargo").val("");
    ($("#hdnSede").val() * 1 > 0) ? $("#sede").val($("#hdnSede").val()) : $("#sede").val("0");
    ($("#hdnSedes").val().length > 0) ? $("#role").val("Administrador") : $("#role").val("User");
}

function crearUsuario() {
    limpiar();
    $('#dvCrearUser').modal();
    $('#verifica').html('0');
}

function editarUsuario(id, userName, roles, cargo, nombreCompleto, email, idsede) {
    $("#apellidos").val(nombreCompleto.split(", ")[0]);
    $("#nombre").val(nombreCompleto.split(", ")[1]);
    $("#userName").val(userName);
    $("#email").val(email);
    $("#role").val(roles);
    $("#cargo").val(cargo);
    $("#sede").val(idsede);

    $("#verifica").html(id);
    $('#dvCrearUser').modal();
}

function guardarUsuario() {
    if ($("#apellidos").val() != "" && $("#nombre").val() != "" && $("#userName").val() != "" && $("#email").val() != "" && $("#role").val() != "" && $("#cargo").val() != "" && $("#sede").val() != "0") {
        var verifica = $("#verifica").html();
        var data = {};
        data.userName = $("#userName").val();
        data.roles = $("#role").val();
        data.cargo = $("#cargo").val();
        data.nombreCompleto = $("#apellidos").val() + ", " + $("#nombre").val();
        data.email = $("#email").val();
        data.idSede = $("#sede").val()*1;

        if (verifica == "0") {
            $.ajax({
                method: "POST",
                url: "/Usuarios/guardarUsuario",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "text",
                success: function (response) {
                    if (response.length > 0) {
                        cantUsuarios++;
                        var fila = response.split("|");
                        var str = "";
                        str += "<tr id='tr_" + fila[0] + "'>";
                        str += "<th scope='row' align='center'><span style='display:none;' id='col_" + fila[0] + "'></span><p>" + cantUsuarios + "</p></th>";
                        str += "<td align='center'>" + fila[1] + "</td>";
                        str += "<td align='center'>" + fila[4] + "</td>";
                        str += "<td align='center'>" + fila[2] + "</td>";
                        str += "<td align='center'>" + miSede.find((x) => x.idSede == fila[6])["nombreSede"] + "</td>";
                        str += "<td align='center'><label class='switch'><input type='checkbox' id='switch_" + fila[0] + "' " + (fila[7] == "True" ? "checked" : "") + " onchange='cambioEstado(this)'/><span class='slider round'></span></label></td>";
                        str += "<td align='center'><button title='editar usuario' type='button' class='btn btn-primary btn-sm' onclick='editarUsuario(" + fila[0] + "," + "\"" + fila[1] + "\"" + "," + "\"" + fila[2] + "\"" + "," + "\"" + fila[3] + "\"," + "\"" + fila[4] + "\"" + "," + "\"" + fila[5] + "\"," + "\"" + fila[6] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>&nbsp;&nbsp;<button title='resetear contraseña' type='button' class='btn btn-info btn-sm' onclick='resetear(\"" + fila[0] + "\")'><i class='fa fa-undo'></i></button></td>";
                        str += "</tr>";

                        $("#listarUsuarios").append(str);
                        $("#dvCrearUser").modal("hide");
                    } else {
                        if (window.cookie.getCookie()["role"] == "Admin") alert("Solo puede haber un administrador por sede!");
                        else alert("el usuario que desea crear ya existe!");
                    }
                }
            });
        } else {
            data.userId = verifica * 1;
            $.ajax({
                method: "POST",
                url: "/Usuarios/actualizarUsuario",
                contentType: "application/json",
                data: JSON.stringify(data),
                dataType: "text",
                success: function (response) {
                    if (response.length > 0) {
                        var datos = response.split("|");
                        var columna = document.getElementById("tr_" + datos[0]).getElementsByTagName("td");

                        columna[0].innerHTML = datos[1];
                        columna[1].innerHTML = datos[4];
                        columna[2].innerHTML = datos[2];
                        columna[3].innerHTML = miSede.find((x) => x.idSede == datos[6])["nombreSede"]; 
                        columna[5].innerHTML = "<button title='editar usuario' type='button' class='btn btn-primary btn-sm' onclick='editarUsuario(" + datos[0] + "," + "\"" + datos[1] + "\"" + "," + "\"" + datos[2] + "\"" + "," + "\"" + datos[3] + "\"," + "\"" + datos[4] + "\"" + "," + "\"" + datos[5] + "\"," + "\"" + datos[6] + "\"" + ")'><span class='glyphicon glyphicon-pencil' aria-hidden='true'></span></button>&nbsp;&nbsp;<button title='resetear contraseña' type='button' class='btn btn-info btn-sm' onclick='resetear(\"" + datos[0] + "\")'><i class='fa fa-undo'></i></button>";

                        $("#dvCrearUser").modal("hide");
                    }
                }
            });
        }
    }
}

function cambioEstado(elem) {
    var data = {};
    data.UserId = elem.id.substring(7, elem.id.length) * 1;
    data.IsActive = elem.checked;
    $.ajax({
        method: "POST",
        url: "/Usuarios/actualizarEstado",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "text",
        success: function (response) {
            if ((response * 1) > 0) {
                alert("Estado actualizado correctamente");
            } else {
                alert("Error en actualizar el estado de la Sala de juntas");
            }
        }
    });
}

function resetear(userId) {
    var question = confirm("¿Esta seguro que desea resetear la contraseña del usuario?");
    if (question) {
        var data = {};
        data.UserId = userId * 1;
        $.ajax({
            method: "POST",
            url: "/Usuarios/resetearContrasenia",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "text",
            success: function (response) {
                if ((response * 1) > 0) {
                    alert("se reseteo la contraseña correctamente");
                } else {
                    alert("Error en resetear la contraseña");
                }
            }
        });
    }

}