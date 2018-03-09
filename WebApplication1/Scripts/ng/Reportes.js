$(document).ready(function ()
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
    obtenerCampañas();
});

var misCampanias = [];
function obtenerCampañas()
{
    var datos = {}
    datos.idSede = window.cookie.getCookie()["sedeId"] * 1;
    $.ajax({
        method: "POST",
        url: "/Campanias/listarCampanias",
        contentType: "application/json",
        data: JSON.stringify(datos),
        dataType: "text",
        success: function (response)
        {
            var campanias = response.split("#");
            var campania = null;
            for (var i = 0; i < campanias.length; i++)
            {
                campania = campanias[i].split("|");
                misCampanias.push({ id: campania[0]*1, nombre: campania[1] });
            }
        }
    });
}

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

function listarSalas(elem)
{
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

function buscarCampania(idCampania)
{
    var miIndex = misCampanias.findIndex((x) => x.id == (idCampania * 1));
    if (miIndex > -1) return misCampanias[miIndex]["nombre"];
    else return "NOCAMPANIA";
}

function cambiarFormato(fecha)
{
    return fecha.substring(0, fecha.length - 3).replace("T", " ");
}

function DarNombreEstado(idEstado)
{
    var result = "";
    if (idEstado == 0)
    {
        result = "Cancelada";
    } else if (idEstado == 1)
    {
        result = "Vigente";
    } else if (idEstado == 2)
    {
        result = "En reserva";
    } else
    {
        result = "Finalizada"
    }

    return result;
}

function getcurrentDate()
{
    var midate = new Date();
    var dd = midate.getDate();
    var mm = midate.getMonth() + 1;
    var yyyy = midate.getFullYear();
    dd = (dd < 10) ? '0' + dd : dd;
    mm = (mm < 10) ? '0' + mm : mm;
    var hh = midate.getHours();
    var min = midate.getMinutes();
    var ss = midate.getSeconds();
    hh = (hh < 10) ? '0' + hh : hh;
    min = (min < 10) ? '0' + min : min;
    ss = (ss < 10) ? '0' + ss : ss;
    return yyyy + '_' + mm + '_' + dd + "T" + hh + "_" + min+"_"+ss;
}

function contarDetalles(array,param)
{
    var cont = 0;
    for (var n = 0; n < array.length; n++)
    {
        if (param == 0)
        {
            if (array[n] == "funcional")
            {
                cont++;
            } 
            else if (array[n] == "") {
                return "NO SE HIZO";
            }
        } else
        {
            if (array[n] == "no_funcional")
            {
                cont++;
            }
            else if (array[n] == "")
            {
                return "NO SE HIZO";
            }
        }
    }
    return cont;
}

function traerReporte(elem)
{
    if ($("#tipo").val() != "0" && $("#fechaI").val() != "" && $("#fechaF").val() != "" && $("#sede").val() != "0" && $("#pais").val() != "0" && $("#sala").val()!="0")
    {
        if ($("#tipo").val() == "DETALLADO")
        {
            var reservasXsala = {};
            $.ajax({
                method: "POST",
                url: "/Reportes/reporteDetallado",
                data: { sedeId: $("#sede").val() * 1, salaId: $("#sala").val() * 1, fechaI: $("#fechaI").val(), fechaF: $("#fechaF").val() },
                dataType: "text",
                success: function (response)
                {
                    elem.download = "";
                    elem.href = "#";
                    var datos = response.split("#");
                    var dato = datos[0].split("|");
                    reservasXsala = {
                        pais: dato[0],
                        sede: dato[1],
                        sala: dato[2],
                        tipo: dato[3],
                        activos: JSON.parse(dato[4]),
                        administrador: dato[13],
                        reservas: []
                    }
                    var campos = null;
                    for (var i = 0; i < datos.length; i++)
                    {
                        campos = datos[i].split("|");
                        reservasXsala["reservas"].push({
                            nombreUsuario: campos[5],
                            campania: buscarCampania(campos[6]),
                            fechaCreacion: campos[7],
                            fechaInicio: cambiarFormato(campos[8]),
                            fechaFin: cambiarFormato(campos[9]),
                            estadoReserva: DarNombreEstado(campos[10] * 1),
                            chechListInicial: JSON.parse(campos[11]),
                            chechListFinal: JSON.parse(campos[12]),
                        });
                    }
                    var styleCabecera = "style='background:#FFFF00;border:1px solid #000000;text-align:center'";
                    var styleSubCabecera = "style='background:#FFB900;border:1px solid #000000;text-align:center'";
                    var celdaComun = "style='border:1px solid #000000;text-align:center;vertical-align:middle;'"
                    var keys = Object.keys(reservasXsala["activos"]);
                    var table = "<table>";
                    table += "<tr><td colspan='6' style='font-size:24px;font-weight:bold'>REPORTE DETALLADO DEL " + $("#fechaI").val() + " AL " + $("#fechaF").val() + "</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td colspan=" +keys.length+" style='text-align:center;font-weight:bold;'>CANTIDAD DE ACTIVOS</td></tr></table>";
                    table += "<table>";
                    table += "<tr><td></td><td " + styleCabecera + ">PAIS</td><td " + styleCabecera + ">SEDE</td><td " + styleCabecera + ">SALA</td><td " + styleCabecera +">TIPO</td><td></td>";
                    for (var i = 0; i < keys.length; i++)
                    {
                        table += "<td " + styleCabecera+">" + keys[i] + "</td>";
                    }
                    table += "</tr>"
                    table += "<tr><td></td><td " + celdaComun + ">" + reservasXsala["pais"] + "</td><td " + celdaComun + ">" + reservasXsala["sede"] + "</td><td " + celdaComun + ">" + reservasXsala["sala"] + "</td><td " + celdaComun +">" + reservasXsala["tipo"] + "</td><td></td>";
                    for (var i = 0; i < keys.length; i++)
                    {
                        table += "<td " + celdaComun+">" + reservasXsala["activos"][keys[i]] + "</td>";
                    }
                    table += "</tr><tr></tr>"
                    table += "</table>"
                    table += "<table>";
                    table += "<tr><td></td><td " + styleCabecera + ">Nombre del Usuario</td>" + ((reservasXsala["tipo"] == "CAPACITACION") ? ("<td " + styleCabecera + ">Campaña</td>") : "") + "<td " + styleCabecera + ">Fecha creación</td><td " + styleCabecera + ">Inicio reserva</td><td " + styleCabecera + ">Fin reserva</td><td " + styleCabecera + ">Estado</td><td " + styleCabecera + " colspan='5'>Checklist inicial</td><td " + styleCabecera + " colspan='5'>Checklist final</td></tr>";
                    var misReservas = reservasXsala["reservas"];
                    var checkIni = null;
                    var checkFin = null;
                    var keysIni = null;
                    var keysFin = null;
                    for (var j = 0; j < misReservas.length; j++)
                    {
                        table += "<tr>";
                        table += "<td rowspan='" + (keys.length+1) +"'></td>";
                        table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun+">" + misReservas[j]["nombreUsuario"]+"</td>";
                        table += ((reservasXsala["tipo"] == "CAPACITACION") ? "<td rowspan='" + (keys.length + 1) + "'>" + misReservas[j]["campania"] + "</td>":"");
                        table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun +">" + misReservas[j]["fechaCreacion"] + "</td>";
                        table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun +">" + misReservas[j]["fechaInicio"] + "</td>";
                        table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun +">" + misReservas[j]["fechaFin"] + "</td>";
                        table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun +">" + misReservas[j]["estadoReserva"] + "</td>";
                        table += "<td " + styleSubCabecera +">Activos</td>";
                        table += "<td " + styleSubCabecera + ">Buen estado</td>";
                        table += "<td " + styleSubCabecera + ">Mal estado</td>";
                        table += "<td " + styleSubCabecera +">Descripción</td>";
                        table += "<td " + styleSubCabecera +">Evidencia</td>";
                        table += "<td " + styleSubCabecera +">Activos</td>";
                        table += "<td " + styleSubCabecera + ">Buen estado</td>";
                        table += "<td " + styleSubCabecera + ">Mal estado</td>";
                        table += "<td " + styleSubCabecera +">Descripción</td>";
                        table += "<td " + styleSubCabecera +">Evidencia</td>";
                        table += "</tr>";
                        checkIni = misReservas[j]["chechListInicial"]["activos"];
                        checkFin = misReservas[j]["chechListFinal"]["activos"];
                        var keysIni = Object.keys(checkIni);
                        for (var z = 0; z < keysIni.length; z++)
                        {
                            table += "<tr>";
                            table += "<td " + celdaComun +">" + keysIni[z] + "</td>";
                            table += "<td " + celdaComun + ">" + contarDetalles(checkIni[keysIni[z]]["Detalle"], 0) + "</td>";
                            table += "<td " + celdaComun +">" + contarDetalles(checkIni[keysIni[z]]["Detalle"],1) + "</td>";
                            table += "<td " + celdaComun +">" + checkIni[keysIni[z]]["descripcion"] + "</td>";
                            table += "<td " + celdaComun +">" + ((checkIni[keysIni[z]]["img"] == "") ? "NO" : "SI") + "</td>";

                            table += "<td " + celdaComun +">" + keysIni[z] + "</td>";
                            table += "<td " + celdaComun +">" + contarDetalles(checkFin[keysIni[z]]["Detalle"], 0) + "</td>";
                            table += "<td " + celdaComun +">" + contarDetalles(checkFin[keysIni[z]]["Detalle"], 1) + "</td>";
                            table += "<td " + celdaComun +">" + checkFin[keysIni[z]]["descripcion"] + "</td>";
                            table += "<td " + celdaComun +">" + ((checkFin[keysIni[z]]["img"] == "") ? "NO" : "SI") + "</td>";

                            table += "</tr>";
                        }
                    }
                    table += "</table>";
                    
                    var nombreExcel = "Reporte_Detallado_" + $("#sala option:selected").text() + "_" + getcurrentDate() + ".xls";
                    generarExcel(table, nombreExcel, $("#sala option:selected").text(), elem);
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
//xmlns="http://www.w3.org/TR/REC-html40"
function generarExcel(excelData, nombre,hoja,elem)
{
    var excel = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>';
    excel += hoja;
    excel += '</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>';
    excel += "<body>";
    excel += excelData;
    excel += "</body></html>";
    var blob = new Blob([excel], { type: 'data:application/vnd.ms-excel;base64,' });
    if (navigator.appVersion.toString().indexOf('.NET') > 0)
    {
        window.navigator.msSaveBlob(blob, nombre);
    } else
    {
        elem.download = nombre;
        elem.href = window.URL.createObjectURL(blob);
    }
}