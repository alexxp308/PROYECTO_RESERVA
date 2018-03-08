﻿$(document).ready(function ()
{
    var my = setInterval(function ()
    {
        if ($("#pais-profile").html() != "" && $("#rol-profile").html() != "" && $("#sede-profile").html() != "")
        {
            clearInterval(my);
            var pais = $("#pais-profile").html();
            var rol = $("#rol-profile").html();
            var sede = $("#sede-profile").html();
            $("#pais").val(pais);
            listarSedes(pais, rol, sede);
        }
    }, 0);
});

function listarSedes(pais, rol, sedep)
{
    $.ajax({
        method: "POST",
        url: "/Reserva/listarSedesxPais",
        data: { pais: pais },
        dataType: "text",
        success: function (response)
        {
            var sedes = response.split(";");
            var sede = null;
            var str = "<option value='0'>--SELEC--</option>";
            var isRol = (window.cookie.getCookie()["role"] == "Administrador" || (rol == "Supervisor" || rol == "ejecutivo" || rol == "Jefe")) ? false : true;
            for (var i = 0; i < sedes.length; i++)
            {
                sede = sedes[i].split("|");
                str += "<option value='" + sede[0] + "' " + ((!isRol && (sedep == sede[1])) ? 'selected' : '') + " >" + sede[1] + "</option>";
            }
            $("#sede").html(str);
            if (!isRol)
            {
                listarSalas(document.getElementById("sede"));
                $("#sede").attr("disabled", "disabled");
            }
        }
    });
}

var salasArray = [];
function listarSalas(elem)
{
    salasArray = [];
    $.ajax({
        method: "POST",
        url: "/MisReservas/listarSalasxSede",
        data: { sede: elem.value * 1 },
        dataType: "text",
        success: function (response)
        {
            var salas = response.split("#");
            var sala = null;
            var descrpt = "";
            var str = "<option value='0'>--SELECCIONAR--</option>";
            for (var i = 0; i < salas.length; i++)
            {
                sala = salas[i].split("|");
                descrpt = "Tipo: " + sala[2] + "; " + sala[5];
                str += "<optgroup label='" + descrpt + "'><option value='" + sala[0] + "'>" + sala[1] + "</option></optgroup>";
                salasArray.push({
                    id: sala[0] * 1,
                    nombreSala: sala[1],
                    tipo: sala[2],
                    horario: sala[3],
                    activos: JSON.parse(sala[4]),
                    ubicacion: sala[5]
                });
            }
            $("#sala").html(str);
        }
    });
}

function cambiarFecha(elem)
{
    var fechaFin = document.getElementById("fechaF");
    if (elem.value != "")
    {
        if ((elem.value.substring(8, 10) * 1) > (fechaFin.value.substring(8, 10) * 1)) fechaFin.value = "";
        fechaFin.setAttribute("min", elem.value);
        fechaFin.removeAttribute("disabled");
    } else
    {
        fechaFin.removeAttribute("min");
        fechaFin.setAttribute("disabled", "disabled");
    }
}

function traerReporte()
{
    if ($("#tipo").val() != "0" && $("#fechaI").val() != "" && $("#fechaF").val() != "" && $("#sede").val() != "0" && $("#pais").val() != "0")
    {
        if ($("#tipo").val() == "DETALLADO")
        {
            $.ajax({
                method: "POST",
                url: "/Reportes/reporteDetallado",
                data: {sedeId: $("#sede").val()*1,salaId:$("#sala").val()*1,fechaI: $("#fechaI").val(), fechaF: $("#fechaF").val()},
                dataType: "json",
                success: function (response)
                {
                    alert(response);
                }
            });
        }
        else
        {
            alert("faltan estos reportes");
        }
    } else
    {
        alert("falta completar campos");
    }
}