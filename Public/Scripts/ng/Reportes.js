$(document).ready(function ()
{
    var my = setInterval(function ()
    {
        if ($("#pais-profile").html() != "" && $("#rol-profile").html() != "" && $("#sede-profile").html() != "")
        {
            clearInterval(my);
            if (window.cookie.getCookie()["role"] != "Admin")
            {
                var pais = $("#pais-profile").html();
                var rol = $("#rol-profile").html();
                var sede = $("#sede-profile").html();
                $("#pais").val(pais);
                listarSedes(pais, rol, sede);
            }
        }
    }, 0);
    obtenerCampañas();
});

function listarAdmin(elem)
{
    listarSedes(elem.value, "Admin", "0");
}

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
                misCampanias.push({ id: campania[0] * 1, nombre: campania[1] });
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
            var str = "<option value='0'>--SELECCIONAR--</option>";
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
var misSalas = [];
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
                misSalas.push({
                    idSala: sala[0] * 1,
                    nombreSala: sala[1],
                    tipo: sala[2],
                    horario: sala[3],
                    activos: JSON.parse(sala[4]),
                });
            }
            $("#sala").html(str);
        }
    });
}

function cambiarReporte(elem)
{
    var ini = document.getElementById("fechaI");
    var fin = document.getElementById("fechaF");
    if (elem.value == "OCUPACION" || elem.value == "ACTIVOS")
    {
        ini.value = "";
        fin.value = "";
        ini.setAttribute("max", atributosFecha());
        fin.setAttribute("max", atributosFecha());
        document.getElementById("divsala").style.visibility = "hidden";
    } else
    {
        ini.setAttribute("max", "2040-02-20");
        fin.removeAttribute("max", "2040-02-20");
        document.getElementById("divsala").style.visibility = "visible";
    }
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
    if (idEstado == 4)
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

function atributosFecha()
{
    var midate = new Date();
    var dd = midate.getDate();
    var mm = midate.getMonth() + 1;
    var yyyy = midate.getFullYear();
    dd = (dd < 10) ? '0' + dd : dd;
    mm = (mm < 10) ? '0' + mm : mm;
    return yyyy + '-' + mm + '-' + dd;
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
    return yyyy + '_' + mm + '_' + dd + "T" + hh + "_" + min + "_" + ss;
}

function contarDetalles(array, param)
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
            else if (array[n] == "")
            {
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

function diferenciaDias(ini, fin)
{
    var dateI = new Date(ini).getTime();
    var dateF = new Date(fin).getTime();
    var diff = dateF - dateI;
    return diff / (1000 * 60 * 60 * 24);
}

function horasTotales(horario, dias)
{
    var dh = horario.split(";")[1];
    var hi = dh.split("-")[0].split(":")[0] * 1;
    var hf = dh.split("-")[1].split(":")[0] * 1;

    return (hf - hi) * dias;
}

function toFixed(num, fixed)
{
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function traerReporte()
{

    if ($("#tipo").val() == "DETALLADO")
    {
        if ($("#tipo").val() != "0" && $("#fechaI").val() != "" && $("#fechaF").val() != "" && $("#sede").val() != "0" && $("#pais").val() != "0" && $("#sala").val() != "0")
        {
            var reservasXsala = {};
            $.ajax({
                method: "POST",
                url: "/Reportes/reporteDetallado",
                data: { sedeId: $("#sede").val() * 1, salaId: $("#sala").val() * 1, fechaI: $("#fechaI").val(), fechaF: $("#fechaF").val() },
                dataType: "text",
                success: function (response)
                {
                    //elem.download = "";
                    //elem.href = "#";
                    if (response.length > 0)
                    {
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
                        var celdaComun = "style='border:1px solid #000000;text-align:center;vertical-align:middle;'";
                        var keys = Object.keys(reservasXsala["activos"]);
                        var table = "<table>";
                        table += "<tr><td colspan='6' style='font-size:24px;font-weight:bold'>REPORTE DETALLADO DEL " + $("#fechaI").val() + " AL " + $("#fechaF").val() + "</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td colspan=" + keys.length + " style='text-align:center;font-weight:bold;'>CANTIDAD DE ACTIVOS</td></tr></table>";
                        table += "<table>";
                        table += "<tr><td></td><td " + styleCabecera + ">PAIS</td><td " + styleCabecera + ">SEDE</td><td " + styleCabecera + ">SALA</td><td " + styleCabecera + ">TIPO</td><td></td>";
                        for (var i = 0; i < keys.length; i++)
                        {
                            table += "<td " + styleCabecera + ">" + keys[i] + "</td>";
                        }
                        table += "</tr>"
                        table += "<tr><td></td><td " + celdaComun + ">" + reservasXsala["pais"] + "</td><td " + celdaComun + ">" + reservasXsala["sede"] + "</td><td " + celdaComun + ">" + reservasXsala["sala"] + "</td><td " + celdaComun + ">" + reservasXsala["tipo"] + "</td><td></td>";
                        for (var i = 0; i < keys.length; i++)
                        {
                            table += "<td " + celdaComun + ">" + reservasXsala["activos"][keys[i]] + "</td>";
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
                            table += "<td rowspan='" + (keys.length + 1) + "'></td>";
                            table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun + ">" + misReservas[j]["nombreUsuario"] + "</td>";
                            table += ((reservasXsala["tipo"] == "CAPACITACION") ? "<td rowspan='" + (keys.length + 1) + "'>" + misReservas[j]["campania"] + "</td>" : "");
                            table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun + ">" + misReservas[j]["fechaCreacion"] + "</td>";
                            table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun + ">" + misReservas[j]["fechaInicio"] + "</td>";
                            table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun + ">" + misReservas[j]["fechaFin"] + "</td>";
                            table += "<td rowspan='" + (keys.length + 1) + "' " + celdaComun + ">" + misReservas[j]["estadoReserva"] + "</td>";
                            table += "<td " + styleSubCabecera + ">Activos</td>";
                            table += "<td " + styleSubCabecera + ">Buen estado</td>";
                            table += "<td " + styleSubCabecera + ">Mal estado</td>";
                            table += "<td " + styleSubCabecera + ">Descripción</td>";
                            table += "<td " + styleSubCabecera + ">Evidencia</td>";
                            table += "<td " + styleSubCabecera + ">Activos</td>";
                            table += "<td " + styleSubCabecera + ">Buen estado</td>";
                            table += "<td " + styleSubCabecera + ">Mal estado</td>";
                            table += "<td " + styleSubCabecera + ">Descripción</td>";
                            table += "<td " + styleSubCabecera + ">Evidencia</td>";
                            table += "</tr>";
                            checkIni = misReservas[j]["chechListInicial"]["activos"];
                            checkFin = misReservas[j]["chechListFinal"]["activos"];
                            var keysIni = Object.keys(checkIni);
                            for (var z = 0; z < keysIni.length; z++)
                            {
                                table += "<tr>";
                                table += "<td " + celdaComun + ">" + keysIni[z] + "</td>";
                                table += "<td " + celdaComun + ">" + contarDetalles(checkIni[keysIni[z]]["Detalle"], 0) + "</td>";
                                table += "<td " + celdaComun + ">" + contarDetalles(checkIni[keysIni[z]]["Detalle"], 1) + "</td>";
                                table += "<td " + celdaComun + ">" + checkIni[keysIni[z]]["descripcion"] + "</td>";
                                table += "<td " + celdaComun + ">" + ((checkIni[keysIni[z]]["img"] == "") ? "NO" : "SI") + "</td>";

                                table += "<td " + celdaComun + ">" + keysIni[z] + "</td>";
                                table += "<td " + celdaComun + ">" + contarDetalles(checkFin[keysIni[z]]["Detalle"], 0) + "</td>";
                                table += "<td " + celdaComun + ">" + contarDetalles(checkFin[keysIni[z]]["Detalle"], 1) + "</td>";
                                table += "<td " + celdaComun + ">" + checkFin[keysIni[z]]["descripcion"] + "</td>";
                                table += "<td " + celdaComun + ">" + ((checkFin[keysIni[z]]["img"] == "") ? "NO" : "SI") + "</td>";

                                table += "</tr>";
                            }
                        }
                        table += "</table>";

                        var nombreExcel = "Reporte_Detallado_" + $("#sala option:selected").text() + "_" + getcurrentDate() + ".xls";
                        generarExcel(table, nombreExcel, $("#sala option:selected").text());
                    } else
                    {
                        alert("No hay datos para descargar");
                    }
                }
            });
        } else
        {
            alert("faltan completar campos");
        }
    }
    else if ($("#tipo").val() == "OCUPACION")
    {
        if ($("#tipo").val() != "0" && $("#fechaI").val() != "" && $("#fechaF").val() != "" && $("#sede").val() != "0" && $("#pais").val() != "0")
        {
            $.ajax({
                method: "POST",
                url: "/Reportes/reporteOcupacion",
                data: { sedeId: $("#sede").val() * 1, fechaI: $("#fechaI").val(), fechaF: $("#fechaF").val() },
                dataType: "text",
                success: function (response)
                {
                    if (response.length > 0)
                    {
                        var cantDias = diferenciaDias($("#fechaI").val(), $("#fechaF").val()) + 1;
                        console.log(cantDias);
                        var datos = response.split("#");
                        var styleCabecera = "style='background:#FFFF00;border:1px solid #000000;text-align:center'";
                        var celdaComun = "style='border:1px solid #000000;text-align:center;vertical-align:middle;'";
                        var table = "<table>";
                        table += "<tr><td colspan='6' style='font-size:24px;font-weight:bold'>REPORTE DE OCUPACIÓN DEL " + $("#fechaI").val() + " AL " + $("#fechaF").val() + "</td></tr>";
                        table += "</table>";
                        table += "<table>";
                        table += "<tr></tr><tr><td></td><td " + styleCabecera + ">PAIS</td><td " + styleCabecera + ">SEDE</td></tr>";
                        table += "<tr><td></td><td " + celdaComun + ">" + $("#pais option:selected").text() + "</td><td " + celdaComun + ">" + $("#sede option:selected").text() + "</td></tr><tr></tr>";
                        table += "</table>";
                        table += "<table>";
                        table += "<tr><td></td><td " + styleCabecera + ">TIPO</td><td " + styleCabecera + ">SALA</td><td " + styleCabecera + ">HORARIO</td><td " + styleCabecera + ">HORAS TOTALES</td><td " + styleCabecera + ">HORAS RESERVADAS</td><td " + styleCabecera + ">OCUPACIÓN (%)</td></tr>";
                        var lasala = null;
                        var data = null;
                        var ht = 0;
                        var hr = 0;
                        var result = 0;
                        var copy = misSalas.slice();
                        for (var i = 0; i < datos.length; i++)
                        {
                            debugger;
                            data = datos[i].split("|");
                            lasala = misSalas.find((x) => x.idSala == (data[0] * 1));
                            index = copy.findIndex((x) => x.idSala == (data[0] * 1));
                            if (index > -1) copy.splice(index, 1);
                            ht = horasTotales(lasala["horario"], cantDias);
                            hr = (data[1] / 60) * 1;
                            result = hr / ht;
                            table += "<tr>";
                            table += "<td></td>";
                            table += "<td " + celdaComun + ">" + lasala["tipo"] + "</td>";
                            table += "<td " + celdaComun + ">" + lasala["nombreSala"] + "</td>";
                            table += "<td " + celdaComun + ">" + lasala["horario"] + "</td>";
                            table += "<td " + celdaComun + ">" + ht + "</td>";
                            table += "<td " + celdaComun + ">" + hr + "</td>";
                            table += "<td " + celdaComun + ">" + toFixed((result * 100), 2) + "</td>";
                            table += "</tr>";
                        }
                        for (var j = 0; j < copy.length; j++)//las salas q no fueron usadas .. si es q ubieran
                        {
                            table += "<tr>";
                            table += "<td></td>";
                            table += "<td " + celdaComun + ">" + copy[j]["tipo"] + "</td>";
                            table += "<td " + celdaComun + ">" + copy[j]["nombreSala"] + "</td>";
                            table += "<td " + celdaComun + ">" + copy[j]["horario"] + "</td>";
                            table += "<td " + celdaComun + ">" + horasTotales(copy[j]["horario"], cantDias) + "</td>";
                            table += "<td " + celdaComun + ">0</td>";
                            table += "<td " + celdaComun + ">0</td>";
                            table += "</tr>";
                        }

                        table += "</table>";

                        var nombreExcel = "Reporte_OCUPACION_" + $("#sede option:selected").text() + "_" + getcurrentDate() + ".xls";
                        generarExcel(table, nombreExcel, $("#sede option:selected").text());
                    } else
                    {
                        alert("No hay datos para descargar");
                    }
                }
            });
        } else
        {
            alert("faltan completar campos");
        }
    }
    else if ($("#tipo").val() == "ACTIVOS")
    {
        if ($("#tipo").val() != "0" && $("#fechaI").val() != "" && $("#fechaF").val() != "" && $("#sede").val() != "0" && $("#pais").val() != "0")
        {
            var cantDias = diferenciaDias($("#fechaI").val(), $("#fechaF").val()) + 1;
            var contActivos = {};
            var activos = null;
            var keys = null;
            for (var i = 0; i < misSalas.length; i++)
            {
                activos = misSalas[i]["activos"];
                keys = Object.keys(activos);
                for (var j = 0; j < keys.length; j++)
                {
                    if (contActivos[keys[j]] == undefined) contActivos[keys[j]] = activos[keys[j]];
                    else contActivos[keys[j]] += activos[keys[j]];
                }
            }

            console.log(contActivos);

            $.ajax({
                method: "POST",
                url: "/Reportes/reporteResumen",
                data: { sedeId: $("#sede").val() * 1, fechaI: $("#fechaI").val(), fechaF: $("#fechaF").val() },
                dataType: "text",
                success: function (response)
                {//que pasa si un dia no hay check en la sala.. se debe considerar todo correcto?
                    if (response.length > 0)
                    {
                        var data = response.split("#");
                        var reservas = null;
                        var find = null;
                        var json = null;
                        var keys = null;
                        var result = {}; // todos los activos en buen estado (funcionales)
                        var copy = misSalas.slice();
                        var index = 0;
                        for (var j = 0; j < data.length; j++)
                        {
                            reservas = data[j].split("|");
                            index = copy.findIndex((x) => x.idSala == (reservas[0] * 1));
                            if (index > -1) copy.splice(index, 1);
                            //find = misSalas.findIndex((x) => x.idSala == reservas[0] * 1);
                            //if (find > -1)
                            //{
                            json = JSON.parse(reservas[2]);
                            keys = Object.keys(json["activos"]);
                            for (var z = 0; z < keys.length; z++)
                            {
                                if (result[keys[z]] == undefined) result[keys[z]] = contarDetalles(json["activos"][keys[z]]["Detalle"], 0);
                                else result[keys[z]] += contarDetalles(json["activos"][keys[z]]["Detalle"], 0);
                            }
                            //} else
                        }

                        var jsonActivos = null;
                        var keysA = null;
                        //debugger;

                        for (var n = 0; n < copy.length; n++) // si no hay checklist final en un dia va hacer esto o si no se le ha hecho checklist a una sala
                        {
                            keysA = Object.keys(copy[n]["activos"]);
                            for (var m = 0; m < keysA.length; m++)
                            {
                                if (result[keysA[m]] == undefined) result[keysA[m]] = copy[n]["activos"][keysA[m]];
                                else result[keysA[m]] += copy[n]["activos"][keysA[m]];
                            }
                        }
                        var resultM = {};
                        var keysM = Object.keys(contActivos);
                        for (var i = 0; i < keysM.length; i++)
                        {
                            resultM[keysM[i]] = (contActivos[keysM[i]] * cantDias) - result[keysM[i]]
                        }

                        var styleCabecera = "style='background:#FFFF00;border:1px solid #000000;text-align:center'";
                        var celdaComun = "style='border:1px solid #000000;text-align:center;vertical-align:middle;'";

                        var table = "<table>";
                        table += "<tr><td colspan='6' style='font-size:24px;font-weight:bold'>REPORTE DETALLADO DEL " + $("#fechaI").val() + " AL " + $("#fechaF").val() + "</td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td colspan=" + keysM.length + " style='text-align:center;font-weight:bold;'>CANTIDAD DE ACTIVOS</td></tr></table>";
                        table += "<table>";
                        table += "<tr><td></td><td " + styleCabecera + ">PAIS</td><td " + styleCabecera + ">SEDE</td><td></td><td></td><td></td>";
                        for (var i = 0; i < keysM.length; i++)
                        {
                            table += "<td " + styleCabecera + ">" + keysM[i] + "</td>";
                        }
                        table += "</tr>";
                        table += "<tr><td></td><td " + celdaComun + ">" + $("#pais option:selected").text() + "</td><td " + celdaComun + ">" + $("#sede option:selected").text() + "</td><td></td><td></td><td></td>";
                        for (var i = 0; i < keysM.length; i++)
                        {
                            table += "<td " + celdaComun + ">" + contActivos[keysM[i]] + "</td>";
                        }
                        table += "</tr><tr></tr>";
                        table += "</table>";
                        table += "<table>";
                        table += "<tr><td></td><td " + styleCabecera + ">ACTIVOS</td><td " + styleCabecera + ">FUNCIONALES</td><td " + styleCabecera + ">NO FUNCIONALES</td></tr>";
                        var promB = 0;
                        for (var i = 0; i < keysM.length; i++)
                        {
                            promB = Math.round(result[keysM[i]] / cantDias);
                            table += "<tr><td></td><td " + celdaComun + ">" + keysM[i] + "</td>";
                            table += "<td " + celdaComun + ">" + promB + "</td>";
                            table += "<td " + celdaComun + ">" + (contActivos[keysM[i]] - promB) + "</td>";
                            table += "</tr>"
                        }

                        table += "</table>";

                        var nombreExcel = "Reporte_ACTIVOS_" + $("#sede option:selected").text() + "_" + getcurrentDate() + ".xls";
                        generarExcel(table, nombreExcel, $("#sede option:selected").text());
                    } else
                    {
                        alert("No hay datos para descargar");
                    }
                }
            });
        } else
        {
            alert("faltan completar campos");
        }
    } else
    {
        alert("Debes escoger un tipo de reporte");
    }
}
//xmlns="http://www.w3.org/TR/REC-html40"
function generarExcel(excelData, nombre, hoja)
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
        //debugger;
        var referencia = document.getElementById("referencia");
        referencia.download = nombre;
        referencia.href = window.URL.createObjectURL(blob);
        referencia.click();

        //elem.download = nombre;
        //elem.href = window.URL.createObjectURL(blob);
        //elem.click();
    }
}