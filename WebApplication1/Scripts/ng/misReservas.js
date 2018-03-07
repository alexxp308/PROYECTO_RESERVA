$(document).ready(function () {
    var my = setInterval(function () {
        if ($("#pais-profile").html() != "" && $("#rol-profile").html() != "" && $("#sede-profile").html() != "") {
            clearInterval(my);
            var pais = $("#pais-profile").html();
            var rol = $("#rol-profile").html();
            var sede = $("#sede-profile").html();
            $("#pais").val(pais);
            listarSedes(pais, rol, sede);
        }
    }, 0);

    $(window).load(function () {
        $(".loader").fadeOut("slow");
    });

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listWeek'
        },
        selectable: true,
        eventRender: function (event, element) {
            element.attr('title', event.tip);
        },
        eventDrop: function (event) {
            changelimits(event);
        },
        /*validRange: {
            start: rs.getcurrentDatequitDays(1),
            end: '2040-02-20'
        },*/
        eventOverlap: false,
        selectable: true,
        editable: false,
        selectConstraint: 'businessHours',
        eventConstraint: 'businessHours',
        businessHours: [],
        select: function (start, end, jsEvent, view) {
            //rs.createUpdateNuevoEvento(moment(start).format(), moment(end).format(), "", 99999);
        },
        eventClick: function (event) {
            //console.log(event);
            showDetailEvent(event.start._i, event.end._i, event.title, event.id);
        },
        events: []
    });
    $(".fc-next-button")[0].onclick = function () {
        var data = {};
        data.idSala = $("#salaSelect").val();
        data.fhinicio = $("#paramInicio").val();
        data.fhfin = addDays(data.fhinicio, 28);
        $("#paramInicio").val(data.fhfin);
        console.log(data);
        $(".loader").toggle(true);
        $.ajax({
            method: "POST",
            url: "/Reserva/reservaXsalaEvents",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                $(".loader").toggle(false);
                if (data.length > 0) {
                    var visualEvent = {};
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].estadoReserva != 0) {
                            if (data[i].idCreator == window.cookie.getCookie()["userId"] * 1) visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin, color: "#5cb85c" };
                            else visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin };
                            $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                        }
                    }
                }
            }
        });
    }
});

function cambioInicio(elem) {
    if (elem.value != "") {
        if ((elem.value.substring(8, 10) * 1) > (document.getElementById("dfinR").value.substring(8, 10) * 1)) document.getElementById("dfinR").value = "";
        document.getElementById("dfinR").setAttribute("min", elem.value);
        document.getElementById("dfinR").removeAttribute("disabled");
    } else {
        document.getElementById("dfinR").removeAttribute("min");
        document.getElementById("dfinR").setAttribute("disabled", "disabled");
    }
}

function changelimits(event) {
    var buscador = myevents.find((x) => x.id == event.id);
    if (formatdatetoString(event.start._i) > getcurrentDate()) {
        buscador.start = formatdatetoString(event.start._i);
        buscador.end = formatdatetoString(event.end._i);
        buscador.update = true;
        //updateBBDD(buscador);
    } else {
        $('#calendar').fullCalendar('removeEvents', [buscador.id]);
        var visualEvent = {};
        visualEvent = {
            id: buscador.id,
            title: buscador.title,
            start: buscador.start,
            end: buscador.end,
            //color: ((buscador.idCreator == window.cookie.getCookie()["userId"] * 1) ? "#5cb85c" : "#2a6496"),
            editable: true
        };
        $('#calendar').fullCalendar('renderEvent', visualEvent, true);
        alert("No puedes cambiar la reserva a dias pasados")
    }

    console.log(myevents);
}

function cerrarModal() {
    var sePuedeCerrar = true;
    for (var i = 0; i < myevents.length; i++) {
        if (myevents[i].update !== undefined) {
            sePuedeCerrar = false;
            break;
        }
    }
    if (sePuedeCerrar) {
        $("#dvCalendario").modal("hide")
    }
    else {
        var question = confirm("¿Esta seguro que no desea guardar los cambios de la reserva?");
        if (question) {
            $("#dvCalendario").modal("hide");
        }
    }
}

function guardarAllUpdates() {
    $("#dvCalendario").modal("hide");

    var cont = 0;
    var str = "";
    for (var j = 0; j < myevents.length; j++) {
        if (myevents[j].update == true) {
            cont++;
            str += '<div class="card-block">';
            str += '<h4 class="card-title">Reserva #' + (cont) + '</h4>';
            str += '<ul class="list-group list-group-flush">';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Titulo:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].title.substring(myevents[j].title.indexOf(":") + 2, myevents[j].title.indexOf("\n")) + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Fecha inicio:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].start.split("T")[0] + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Fecha fin:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].end.split("T")[0] + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Día inicio:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].start.split("T")[1] + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Día fin:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].end.split("T")[1] + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '<div class="row">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Solicitante:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
            str += '<input type="text" class="form-control" readonly value="' + myevents[j].title.substring(myevents[j].title.indexOf("\n") + 15, myevents[j].length) + '"/>';
            str += '</div></div></li>';
            str += '<li class="list-group-item">'
            str += '</div></li></ul></div>';
        }
    }
    $("#listReservas").html(str);
    if (str != "") $("#dvUpdateEvents").modal();
    else alert("No se ha alterado ninguna reserva");
}

function cerrarModalUpdate() {
    $("#dvUpdateEvents").modal("hide");
    $("#listReservas").html("");
    $("#dvCalendario").modal();
}

function EnviarUpdates() {
    var arrayUpdate = [];
    for (var j = 0; j < myevents.length; j++) {
        if (myevents[j].update == true) {
            arrayUpdate.push({
                idReserva: myevents[j].id,
                descripcion: myevents[j].title.substring(myevents[j].title.indexOf(":") + 2, myevents[j].title.indexOf("\n")),
                fhinicio: myevents[j].start + ":00",
                fhfin: myevents[j].end + ":00",
            });
        }
    }

    $(".loader").toggle(true);
    $.ajax({
        method: "POST",
        url: "/MisReservas/actualizarReserva",
        contentType: "application/json",
        data: JSON.stringify(arrayUpdate),
        dataType: "text",
        success: function (response)
        {
            $(".loader").toggle(false);
            var datos = response.split("|");
            alert("se actualizaron " + datos[0] + " reservas y se enviaron " + datos[1] + " correos");
            $("#dvUpdateEvents").modal("hide");
        }
    });
}

function getcurrentDate() {
    var midate = new Date();
    var dd = midate.getDate();
    var mm = midate.getMonth() + 1;
    var yyyy = midate.getFullYear();
    dd = (dd < 10) ? '0' + dd : dd;
    mm = (mm < 10) ? '0' + mm : mm;
    var hh = midate.getHours();
    var min = midate.getMinutes();
    hh = (hh < 10) ? '0' + hh : hh;
    min = (min < 10) ? '0' + min : min;
    return yyyy + '-' + mm + '-' + dd + "T" + hh + ":" + min + ":00";
}

function addDays(mydate, days) {
    var myday = mydate.split("T")[0];
    var array = myday.split("-");
    var d = new Date(array[0], (array[1] * 1) - 1, array[2]);
    d.setDate(d.getDate() + days);
    return formatdatetoString([d.getFullYear(), d.getMonth(), d.getDate(), 23, 59]);
}

function cargarHoras(elem) {
    var str = "<option value='0'>--SELECCIONAR--</option>";
    for (var i = 0; i < 24; i++) {
        if (i >= restrictHour[0] && i < restrictHour[1]) {
            str += "<option value='" + ((i < 10) ? "0" + i : i) + ":00'>" + ((i < 10) ? "0" + i : i) + ":00</option>";
            str += "<option value='" + ((i < 10) ? "0" + i : i) + ":30'>" + ((i < 10) ? "0" + i : i) + ":30</option>";
        }
    }
    elem.innerHTML = str;
}

function showDetailEvent(inicio, fin, title, id) {

    if (window.cookie.getCookie()["role"] == "Administrador") {
        $("#tituloR").removeAttr("disabled");
        $("#dinicioR").removeAttr("disabled");
        $("#dfinR").removeAttr("disabled");
        $("#hinicioR").removeAttr("disabled");
        $("#hfinR").removeAttr("disabled");
    }
    cargarHoras(document.getElementById("hinicioR"));
    var hdinicio = [];
    if (Array.isArray(inicio)) {
        var strIni = formatdatetoString(inicio);
        hdinicio = strIni.split("T");
    } else {
        hdinicio = inicio.split("T");
    }
    var hdfin = [];
    if (Array.isArray(fin)) {
        var strfin = formatdatetoString(fin);
        hdfin = strfin.split("T");
    } else {
        hdfin = fin.split("T");
    }

    $("#tituloR").val(title.substring(title.indexOf(":") + 2, title.indexOf("\n")));
    $("#creadorR").val(title.substring(title.indexOf("\n") + 14, title.length));
    $("#dinicioR").val(hdinicio[0]);
    $("#dfinR").val(hdfin[0]);
    $("#hinicioR").val(hdinicio[1].substring(0, 5));
    changeHinicio(document.getElementById("hinicioR"));
    $("#hfinR").val(hdfin[1].substring(0, 5));
    $("#dvMisEvents").modal("show");
    $("#idcue").html(id);
}

function updateEvent() {
    if ($("#tituloR").val() != "" && $("#dinicioR").val() != "" && $("#dfinR").val() != "" && $("#hinicioR").val() != "0" && $("#hfinR").val() != "0") {
        debugger;
        var elevent = {};
        elevent.start = $("#dinicioR").val() + "T" + $("#hinicioR").val();
        elevent.end = $("#dfinR").val() + "T" + $("#hfinR").val();
        elevent.id = $("#idcue").html() * 1;
        if (!isOverlapping(elevent)) {
            var buscador = myevents.find((x) => x.id == (document.getElementById("idcue").innerHTML * 1));
            buscador.title = "Titulo: " + $("#tituloR").val() + "\n Solicitante: " + $("#creadorR").val();
            buscador.start = elevent.start;
            buscador.end = elevent.end;
            buscador.update = true;
            $('#calendar').fullCalendar('removeEvents', [($("#idcue").html() * 1)]);
            $('#calendar').fullCalendar('renderEvent', buscador, true);
            $("#dvMisEvents").modal("hide");
        } else {
            alert("hay un cruce de reserva en el horario seleccionado");
        }
    } else {
        alert("se deben completar todos los campos!");
    }
}

function isOverlapping(event) {
    var array = myevents;
    for (var i in array) {
        if (array[i].id != event.id) {
            if (event.end >= array[i].start && event.start <= array[i].end) {
                return true;
            }
        }
    }
    return false;
}

function listarSedes(pais, rol, sedep) {
    $.ajax({
        method: "POST",
        url: "/Reserva/listarSedesxPais",
        data: { pais: pais },
        dataType: "text",
        success: function (response) {
            var sedes = response.split(";");
            var sede = null;
            var str = "<option value='0'>--SELEC--</option>";
            var isRol = (window.cookie.getCookie()["role"] == "Administrador" || (rol == "Supervisor" || rol == "ejecutivo" || rol == "Jefe")) ? false : true;
            for (var i = 0; i < sedes.length; i++) {
                sede = sedes[i].split("|");
                str += "<option value='" + sede[0] + "' " + ((!isRol && (sedep == sede[1])) ? 'selected' : '') + " >" + sede[1] + "</option>";
            }
            $("#sede").html(str);
            if (!isRol) {
                listarSalas(document.getElementById("sede"));
                $("#sede").attr("disabled", "disabled");
            }
        }
    });
}

var salasArray = [];
function listarSalas(elem) {
    salasArray = [];
    $.ajax({
        method: "POST",
        url: "/MisReservas/listarSalasxSede",
        data: { sede: elem.value * 1 },
        dataType: "text",
        success: function (response) {
            var salas = response.split("#");
            var sala = null;
            var descrpt = "";
            var str = "<option value='0'>--SELEC--</option>";
            for (var i = 0; i < salas.length; i++) {
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

var salas = {};
function buscarReservas() {
    if ($("#sede").val() != "0") {
        $(".loader").toggle(true);
        $.ajax({
            method: "POST",
            url: "/MisReservas/obtenerReservaxUsuario",
            data: { idSala: $("#sala").val() * 1, idUser: window.cookie.getCookie()["userId"] * 1, idSede: $("#sede").val() * 1, estado: $("#estado").val() * 1 },
            dataType: "json",
            success: function (data) {
                $("#result").html("");
                $(".loader").toggle(false);
                if (data.length > 0) {
                    document.getElementById("content").style.display = "block";
                    var str = "";
                    var campos = "";
                    salas = {};
                    for (var j = 0; j < data.length; j++) {
                        if (jQuery.isEmptyObject(salas[data[j].idSala])) {
                            console.log(data[j].idSala);
                            salas[data[j].idSala] = { nombreSala: salasArray.find((x) => x.id == data[j].idSala)["nombreSala"], activos: salasArray.find((x) => x.id == data[j].idSala)["activos"], reservas: [] };
                            salas[data[j].idSala]["reservas"].push(data[j]);
                        } else {
                            salas[data[j].idSala]["reservas"].push(data[j]);
                        }
                    }
                    console.log(salas);
                    var keys = Object.keys(salas)
                    var reservas = null;
                    for (var z = 0; z < keys.length; z++) {
                        reservas = salas[keys[z]].reservas;
                        campos = "";
                        for (var i = 0; i < reservas.length; i++) {
                            campos += "<tr id='tr_" + reservas[i].idReserva + "'>";
                            campos += "<th scope='row' align='center'><span style='display:none;' id='col_" + reservas[i].idReserva + "'></span><p>" + (i + 1) + "</p></th>";
                            campos += "<td align='center'>" + reservas[i].nombreCompletoCreator + "</td>";
                            campos += "<td align='center'>" + reservas[i].fhCreacion + "</td>";
                            campos += "<td align='center'>" + reservas[i].fhinicio.substring(0, 16).replace("T", " ") + "</td>";
                            campos += "<td align='center'>" + reservas[i].fhfin.substring(0, 16).replace("T", " ") + "</td>";
                            campos += "<td align='center'><div class='esfera " + ((reservas[i].estadoReserva == 0) ? "cancelada' title='cancelada'" : ((reservas[i].estadoReserva == 1) ? "espera' title='vigente'" : ((reservas[i].estadoReserva == 2) ? "reserva' title='en reserva'" : "terminada' title='terminada'"))) + "'></div></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='realizar checklist inicial' onclick='realizarCheckList(\"" + reservas[i].idReserva + "\"," + keys[z] + ",0)' " + ((reservas[i].estadoReserva == 0) ? "disabled" : "") + "><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='realizar checklist final' onclick='realizarCheckList(\"" + reservas[i].idReserva + "\"," + keys[z] + ",1)' " + ((reservas[i].estadoReserva == 0) ? "disabled" : "") + "><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-info' title='cancelar reserva' onclick='eliminarReserva(" + reservas[i].idReserva + ",\"" + reservas[i].fhinicio + "\",this)' " + ((reservas[i].estadoReserva == 0 || getcurrentDate() > reservas[i].fhinicio) ? "disabled" : "") + "><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>";
                            campos += "</tr>";
                        }

                        str += "<div class='panel panel-default'>";
                        str += "<div class='panel-heading'>";
                        str += "<h5 class='panel-title'>";
                        str += "<div class='row'>";
                        str += "<div class='col-sm-12 col-md-6 col-lg-6' style='padding-top: 10px;'>";
                        str += "<a data-toggle='collapse' data-parent='#result' href='#tabla" + z + "'><span style='font-weight:bold'>SALA:</span> " + salas[keys[z]].nombreSala + "</a></div>";
                        str += "<button type='button' class='btn btn-default col-sm-6 col-md-1 col-lg-1' style='font-size:15px;float:right;margin-right:10px;' title='ver activos' onclick='mostrarActivos(\"" + keys[z] + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
                        str += "<button type='button' class='btn btn-default col-sm-6 col-md-1 col-lg-1' style='font-size:15px;float:right;margin-right:10px;' title='reservas de la sala' onclick='mostrarReservas(\"" + keys[z] + "\",\"" + salas[keys[z]]["reservas"][0]["nombreCompletoCharge"] + "\")'><span class='glyphicon glyphicon-calendar' aria-hidden='true'></span></button>";
                        str += "</div>";
                        str += "</h5>";
                        str += "</div>";
                        str += ' <div id="tabla' + z + '" class="panel-collapse collapse' + ((z == 0) ? ' in' : '') + '">';
                        str += '<div class="panel-body">';
                        str += createTable(campos);
                        str += "</div></div></div>"
                    }
                    $("#result").html(str);
                    console.log(salas);
                }
                else {
                    alert("No se han hecho reservas");
                }
            }
        });
    } else {
        alert("Debes seleccionar una sede");
    }
}

function eliminarReserva(id, fechaIni, elem) {
    if (getcurrentDate() < fechaIni) {
        var info = confirm("¿Esta seguro que deseas cancelar esta reserva?");
        if (info) {
            $.ajax({
                method: "GET",
                url: "/MisReservas/eliminarReserva",
                contentType: "application/json",
                data: { idReserva: id },
                dataType: "text",
                success: function (response) {
                    if (response * 1 > 0) {
                        elem.setAttribute("disabled", "disabled");
                        elem.parentNode.previousSibling.firstChild.setAttribute("disabled", "disabled");
                        elem.parentNode.previousSibling.previousSibling.firstChild.setAttribute("disabled", "disabled");
                        elem.parentNode.previousSibling.previousSibling.previousSibling.firstChild.setAttribute("class", "esfera cancelada");
                        elem.parentNode.previousSibling.previousSibling.previousSibling.firstChild.setAttribute("title", "cancelada");
                        elem.parentNode.parentNode.style.opacity = "0.65";
                        alert("Cancelada correctamente");
                    } else {
                        alert("Error");
                    }
                }
            });
        }
    }
    else {
        alert("No puede eliminar esta reserva");
    }
}

function limpiarCheck() {
    $("#checkList").html("");
    $("#checkRealizado").html("");
    $("#bodyCheck").html("");
    $("#miCheck").removeAttr("disabled");
    $("#idReserva").html("");
    $("#idSala").html("");
    $("#iniFin").html("");
    $("#advertencia").html("");
}

function realizarCheckList(idReserva, idSala, param) {
    limpiarCheck();
    var checkList = "";
    var arrayCheck = {};
    var actual = getcurrentDate();
    var reserva = salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva);
    if (param == 0) { //deberia mostrarse el checklist cuando ya acabo la reserva? o antes de que empieze?
        $("#checkList").html("Checklist inicial");
        checkList = reserva["checkListInicial"];
        if (checkList != "") {
            $("#checkRealizado").html(" - " + reserva["fhCheckInicial"]);
            if(window.cookie.getCookie()["role"] != "Administrador") $("#miCheck").attr("disabled", "disabled");
            arrayCheck = JSON.parse(checkList);
        } else {
            if (actual < reserva["fhinicio"]) {
                $("#miCheck").attr("disabled", "disabled");
                $("#advertencia").html(" -- Aun no comienza su reserva");
            } else if (actual > reserva["fhfin"]) {
                alert("ya termino la reserva y ya no puede realizar el checkList inicial");
                return;
                /*$("#miCheck").attr("disabled", "disabled");
                $("#advertencia").html(" -- Ya termino su reserva");*/
            }
        }
    }
    else {
        $("#checkList").html("Checklist final");
        checkList = reserva["checkListFinal"];
        if (checkList != "") {
            $("#checkRealizado").html("- " + reserva["fhCheckFinal"]);
            $("#miCheck").attr("disabled", "disabled");
            arrayCheck = JSON.parse(checkList);
        } else {
            if (reserva["checkListInicial"] == "" || window.cookie.getCookie()["role"] != "Administrador") {
                alert("Debe realizar primero el Checklist inicial");
                return;
            }
            if (actual > reserva["fhfin"] || window.cookie.getCookie()["role"] != "Administrador") {
                alert("ya termino la reserva y ya no puede realizar el checkList final");
                return;
            } /*else if (actual > reserva["fhfin"]) {
                $("#miCheck").attr("disabled", "disabled");
                $("#advertencia").html(" -- Ya termino tu reserva");
            }*/
        }
    }
    var str = "";
    if (jQuery.isEmptyObject(arrayCheck))
    {
        var activos = salasArray.find((x) => x.id == idSala)["activos"];
        var keys = Object.keys(activos);
        var isAdmin = (window.cookie.getCookie()["role"] == "Administrador");
        str += '<fieldset style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;">';
        str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Detalles de la sala:</legend>';
        str += '<div class="form-group">';
        str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="ticket" style="padding-top:10px;padding-left:10px;">Ticket ServiceDesk:</label>';
        str += '<div class="col-sm-12 col-md-9 col-lg-9">';
        str += '<div class="input-group">';
        str += '<input type="text" class="form-control" id="ticket" ' + (!isAdmin || ((actual < reserva["fhinicio"]) || (actual > reserva["fhfin"])) ? "disabled >" : ">");
        str += '<span class="input-group-addon" id="basic-addon1" style="cursor:pointer;background:#39b3d7;"><a style="color:#fff">Ir a ServiceDesk</a></span>';
        str += '</div></div></div><br><br>';
        str += '<div class="form-group">';
        str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="detalle_sala" style="padding-top:10px;padding-left:10px;">Descripción:</label>';
        str += '<div class="col-sm-12 col-md-9 col-lg-9">';
        str += '<textarea class="form-control checkDetalle" rows="3" id="detalle_sala" ' + (!isAdmin || ((actual < reserva["fhinicio"]) || (actual > reserva["fhfin"])) ? "disabled >" : ">")+'</textarea>';
        str += '</div></div>';
        str += '</fieldset>';
        str += '<fieldset style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;">';
        str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Activos:</legend>';
        for (var i = 0; i < keys.length; i++)
        {
            str += '<fieldset style="padding-left:25px;padding-right:25px;padding-top:10px;padding-bottom:10px;">';
            str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;" id="nameSala">' + keys[i] + '</legend>';
            str += '<div class="col-lg-12 col-sm-12 col-12">';
            str += '<div class="input-group">';
            str += '<label class="input-group-btn">';
            str += '<span class="btn btn-info">';
            str += 'Imagen&hellip; <input type="file" style="display: none;" multiple id="img_' + keys[i] + '" onchange="cambioFile(this)">';
            str += '</span></label><input type="text" class="form-control" readonly></div></div><br>';
            str += '<div class="form-group">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="detalle_' + keys[i] + '" style="padding-top:10px;padding-left:10px;">Detalle:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8">';
            str += '<textarea class="form-control checkDetalle" rows="3" id="detalle_' + keys[i] + '"' + ((!isAdmin || (actual < reserva["fhinicio"]) || (actual > reserva["fhfin"])) ? "disabled >" : ">")  + '</textarea>';
            str += '</div></div><br><br><br><br>';
            for (var j = 0; j < activos[keys[i]]; j++)
            {
                str += '<div class="form-group">';
                str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="' + keys[i] + (j + 1) + '" style="padding-top:10px;padding-left:10px;">' + keys[i] + ' ' + (j + 1) + ':</label>';
                str += '<div class="col-sm-12 col-md-8 col-lg-8">';
                str += '<select class="form-control checkSelect" id="' + keys[i] + (j + 1) + '" ' + ((!isAdmin || (actual < reserva["fhinicio"]) || (actual > reserva["fhfin"])) ? "disabled" : "") + '>';
                str += '<option value="0">--SELECCIONAR--</option>';
                str += '<option value="funcional">funcional</option>';
                str += '<option value="no_funcional">no funcional</option>';
                str += '</select></div></div><br><br>';
            }
            str += '</fieldset>';
        }
        str += "</fieldset>";
    } else
    {
        str += '<fieldset style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;">';
        str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Detalles de la sala:</legend>';
        str += '<div class="form-group">';
        str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="ticket" style="padding-top:10px;padding-left:10px;">Ticket ServiceDesk:</label>';
        str += '<div class="col-sm-12 col-md-9 col-lg-9">';
        str += '<div class="input-group">';
        str += '<input type="text" class="form-control" id="ticket" value="'+arrayCheck["ticket"]+'" disabled>';
        str += '<span class="input-group-addon" id="basic-addon1" style="cursor:pointer;background:#39b3d7;"><a style="color:#fff">Ir a ServiceDesk</a></span>';
        str += '</div></div></div><br><br>';
        str += '<div class="form-group">';
        str += '<label class="col-sm-12 col-md-3 col-lg-3 control-label" for="detalle_sala" style="padding-top:10px;padding-left:10px;">Descripción:</label>';
        str += '<div class="col-sm-12 col-md-9 col-lg-9">';
        str += '<textarea class="form-control checkDetalle" rows="3" id="detalle_sala">'+arrayCheck["detalle_sala"]+'</textarea>';
        str += '</div></div>';
        str += '</fieldset>';
        str += '<fieldset style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;">';
        str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;">Activos:</legend>';
        var checkKey = Object.keys(arrayCheck["activos"]);
        var detalle = [];
        for (var i = 0; i < checkKey.length; i++)
        {//si se modifican los activos esto no va a funcionar!!!!!! ya que se cambiaria la estructura .. seria mejor que cuando no esta vacio se cree un checklist con la estructura guardada en reserva?
            str += '<fieldset style="padding-left:25px;padding-right:25px;padding-top:10px;padding-bottom:10px;text-align:center;">';
            str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;" id="nameSala">' + checkKey[i] + '</legend>';
            (arrayCheck["activos"][checkKey[i]]["img"] == "") ? "" : (str += '<img id="myImg_' + checkKey[i] + '" src="/Img/' + arrayCheck["activos"][checkKey[i]]["img"] + '" width="150" height="150" style="margin-bottom:10px;" path="' + arrayCheck["activos"][checkKey[i]]["img"] +'">');
            if (window.cookie.getCookie()["role"] == "Administrador") {
                str += '<div class="col-lg-12 col-sm-12 col-12">';
                str += '<div class="input-group">';
                str += '<label class="input-group-btn">';
                str += '<span class="btn btn-info">';
                str += 'Imagen&hellip; <input type="file" style="display: none;" multiple id="img_' + checkKey[i] + '" onchange="cambioFile(this)">';
                str += '</span></label><input type="text" class="form-control" readonly></div></div><br>';
            }
            str += '<div class="form-group">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="detalle_' + checkKey[i] + '" style="padding-top:10px;padding-left:10px;">Detalle:</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8">';
            str += '<textarea class="form-control checkDetalle" rows="3" id="detalle_' + checkKey[i] + '"' + ((window.cookie.getCookie()["role"] == "Administrador") ? ">" : "disabled >") + '' + arrayCheck["activos"][checkKey[i]]["descripcion"]+'</textarea>';
            str += '</div></div><br><br><br><br>';
            detalle = arrayCheck["activos"][checkKey[i]]["Detalle"];
            for (var j = 0; j < detalle.length; j++)
            {
                str += '<div class="form-group">';
                str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="' + checkKey[i] + (j + 1) + '" style="padding-top:10px;padding-left:10px;">' + checkKey[i] + ' ' + (j + 1) + ':</label>';
                str += '<div class="col-sm-12 col-md-8 col-lg-8">';
                str += '<select class="form-control checkSelect" id="' + checkKey[i] + (j + 1) + '" ' + ((window.cookie.getCookie()["role"] == "Administrador") ? ">" : "disabled >");
                str += '<option value="0">--SELECCIONAR--</option>';
                str += '<option value="funcional" ' +  ((detalle[j] == "funcional") ? "selected" : "") + '>funcional</option>';
                str += '<option value="no_funcional" ' + ((detalle[j] == "no_funcional") ? "selected" : "") + '>no funcional</option>';
                str += '</select></div></div><br><br>';
            }
            str += '</fieldset>';
        }
        str += "</fieldset>";
    }
    $("#bodyCheck").html(str);
    document.getElementById("idReserva").innerHTML = idReserva;
    document.getElementById("iniFin").innerHTML = param;
    $("#idSala").html(idSala);
    $("#dvCheck").modal();
}

function cambioFile(elem) {
    var extension = elem.value.substring(elem.value.length - 3, elem.value.length);
    if (extension == "png" || extension == "jpg" || elem.value === "") {
        elem.parentNode.parentNode.nextSibling.value = elem.value;
    }
    else {
        elem.value = "";
        alert("Debes escoger un archivo con extension png o jpg");
    }
}

function guardarCheck() {
    //var validarDet = true;
    var validarSel = true;
    //var detalles = document.getElementsByClassName("checkDetalle");
    var select = document.getElementsByClassName("checkSelect");
    /*for (var i = 0; i < detalles.length; i++) {
        if (detalles[i].value == "") {
            validarDet = false;
            break;
        }
    }*/
    for (var i = 0; i < select.length; i++) {
        if (select[i].value == "0") {
            validarSel = false;
            break;
        }
    }

    if ($("#ticket").val() != "" && $("#detalle_sala").val()!="" && validarSel) {
        var checkList = {
            ticket: $("#ticket").val(), detalle_sala: $("#detalle_sala").val(), activos: {}
        };

        var idReserva = document.getElementById("idReserva").innerHTML * 1;
        var iniFin = document.getElementById("iniFin").innerHTML * 1;
        var idSala = $("#idSala").html() * 1;
        
        var activos = salasArray.find((x) => x.id == idSala)["activos"];
        var keys = Object.keys(activos);
        var file = null;
        var formData = new FormData();
        for (var i = 0; i < keys.length; i++) {
            if (document.getElementById("img_" + keys[i]).value != "") {
                file = document.getElementById("img_" + keys[i]).files[0];
                formData.append("file_" + i, file);
            }
            checkList["activos"][keys[i]] = {};
            checkList["activos"][keys[i]]["descripcion"] = $("#detalle_" + keys[i]).val();
            checkList["activos"][keys[i]]["img"] = ((document.getElementById("myImg_" + keys[i]) == undefined) ? "" : document.getElementById("myImg_" + keys[i]).getAttribute("path"));
            checkList["activos"][keys[i]]["Detalle"] = [];
            for (var j = 0; j < activos[keys[i]]; j++) {
                checkList["activos"][keys[i]]["Detalle"].push($("#" + keys[i] + (j + 1)).val());
            }
        }
        debugger;
        $.ajax({
            url: "api/MisReservas/Upload",
            type: "POST",
            data: formData,
            dataType: "json",
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.length > 0)
                {
                    console.log(response.replace("\\\\", "\\"));//pero en el for;
                    var data = response.split("|");
                    var z = 0;
                    for (var j = 0; j < keys.length; j++)
                    {
                        if (document.getElementById("img_" + keys[j]).value != "")
                        {
                            checkList["activos"][keys[j]]["img"] = data[z].replace("\\\\", "\\");
                            z++;
                        }
                    }
                }
                $.ajax({
                    method: "POST",
                    url: "/MisReservas/CheckList",
                    data: { idReserva: idReserva, iniFin: iniFin, check: JSON.stringify(checkList) },
                    dataType: "text",
                    success: function (response) {
                        if (response.length > 0) {
                            var datos = response.split("|");
                            if (iniFin == 0) {
                                document.getElementById("tr_" + idReserva).children[((window.cookie.getCookie()["role"]=="Administrador")?5:4)].firstChild.setAttribute("class", "esfera reserva");
                                document.getElementById("tr_" + idReserva).children[((window.cookie.getCookie()["role"] == "Administrador") ? 5 : 4)].firstChild.setAttribute("title", "en reserva");
                                salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["checkListInicial"] = datos[0];
                                salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["fhCheckInicial"] = datos[1];
                            } else {
                                document.getElementById("tr_" + idReserva).children[((window.cookie.getCookie()["role"] == "Administrador") ? 5 : 4)].firstChild.setAttribute("class", "esfera terminada");
                                document.getElementById("tr_" + idReserva).children[((window.cookie.getCookie()["role"] == "Administrador") ? 5 : 4)].firstChild.setAttribute("title", "terminada");
                                salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["checkListFinal"] = datos[0];
                                salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["fhCheckFinal"] = datos[1];
                            }
                            alert("El checklist se guardo correctamente");
                            $("#dvCheck").modal("hide");
                        } else {
                            alert("Error");
                            $("#dvCheck").modal("hide");
                        }
                    }
                });
            }
        });
    } else {
        alert("falta completar campos");
    }
}

function formatdatetoString(array) {
    return array[0] + "-" + (((array[1] + 1) > 9) ? (array[1] + 1) : "0" + (array[1] + 1)) + "-" + (((array[2]) > 9) ? array[2] : "0" + array[2]) + "T" + (((array[3]) > 9) ? array[3] : "0" + array[3]) + ":" + (((array[4]) > 9) ? array[4] : "0" + array[4]) + ":00";
}

function getFirstDayMonth() {
    var midate = new Date();
    var d = new Date(midate.getFullYear(), midate.getMonth(), 0);
    return formatdatetoString([d.getFullYear(), d.getMonth(), d.getDate(), 23, 59]);
}

function getLastDayMonth(mydate) {
    var myday = mydate.split("T")[0];
    var array = myday.split("-");
    var d = new Date(array[0], (array[1] * 1) + 1, 0);
    d.setDate(d.getDate() + 14 - d.getDay());
    return formatdatetoString([d.getFullYear(), d.getMonth(), d.getDate(), 23, 59]);
}

function mostrarActivos(idSala) {
    $("#nameSala").html("SALA: " + $("#sala option[value='" + idSala + "']").text());
    var misActivos = salasArray.find((x) => x.id == idSala)["activos"];
    var keys = Object.keys(misActivos);
    var str = "";
    for (var i = 0; i < keys.length; i++) {
        str += "<tr><td align='center'>" + keys[i].replace("_", " ") + "</td><td align='center'>" + misActivos[keys[i]] + "</td></tr>";
    }
    $("#listActivos").html(str);
    $("#dvMisActivos").modal();
}

var myevents = [];

function myBussinessHour(micadena) {
    var dia = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    var hd = micadena.split(";")
    var dias = hd[0].split("-");
    var my = [];
    var myn = [0, 1, 2, 3, 4, 5, 6, 7];
    var inid = dia.findIndex((x) => x == dias[0].toLowerCase());
    var find = dia.findIndex((x) => x == dias[1].toLowerCase());
    var horas = hd[1].split("-");
    var inih = horas[0];
    var finh = horas[1];
    if (find > inid) {
        for (var i = inid; i <= find; i++) {
            my.push(i);
        }
    } else {
        var d = 0;
        for (var i = find; i <= inid + 7; i++) {
            d = i % 7;
            my.push(i);
        }
    }

    return { dow: my, start: inih, end: finh, days: hd[0], hours: hd[1] };
}


function changeHinicio(elem) {
    var elfin = document.getElementById("hfinR");
    var str = "<option value='0'>--SELECCIONAR--</option>";
    if (elem.value != "") {
        var elInicio = elem.value;
        var valInicio = elInicio.split(":")[0] * 100 + elInicio.split(":")[1] * 1;
        for (var z = 0; z < 24; z++) {
            if (z * 100 > valInicio && z < restrictHour[1]) {
                str += "<option value='" + ((z < 10) ? "0" + z : z) + ":00'>" + ((z < 10) ? "0" + z : z) + ":00</option>";
            }

            if ((z * 100) + 30 > valInicio && z < restrictHour[1]) {
                str += "<option value='" + ((z < 10) ? "0" + z : z) + ":30'>" + ((z < 10) ? "0" + z : z) + ":30</option>";
            }
        }
        elfin.innerHTML = str;
        elfin.value = "0";
        elfin.removeAttribute("disabled");
    } else {
        elfin.setAttribute("disabled", "disabled");
    }
}

restrictHour = [];
function mostrarReservas(idSala, nombreAdmin) {
    $("#miSalaM").html($("#sala option[value='" + idSala + "']").text());
    $("#miAdmin").html(nombreAdmin);
    var data = {};
    data.idSala = idSala * 1;
    data.fhinicio = getFirstDayMonth();
    data.fhfin = getLastDayMonth(getFirstDayMonth());
    $("#paramInicio").val(data.fhfin);
    $("#salaSelect").val(idSala);
    myevents = [];
    $(".loader").toggle(true);
    $.ajax({
        method: "POST",
        url: "/Reserva/reservaXsalaEvents",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            $(".loader").toggle(false);
            $('#calendar').fullCalendar('removeEvents');
            if (data.length > 0) {
                var visualEvent = {};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].estadoReserva != 0) {//deberia mostrar las eliminadas de rojo?

                        var mihorario = salasArray.find((x) => x.idSala = idSala)["horario"];
                        var mbh = myBussinessHour(mihorario);
                        restrictHour = [];
                        restrictHour.push(mbh.hours.split("-")[0].split(":")[0] * 1)
                        restrictHour.push(mbh.hours.split("-")[1].split(":")[0] * 1)
                        $('#calendar').fullCalendar('option', {
                            businessHours: [{
                                start: mbh.start,
                                end: mbh.end,
                                dow: mbh.dow
                            }]
                        });
                        if (data[i].idCreator == window.cookie.getCookie()["userId"] * 1) visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin, color: "#5cb85c", editable: ((window.cookie.getCookie()["role"] == "Administrador" && data[i].fhinicio > getcurrentDate()) ? true : false) };
                        else visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin, editable: ((window.cookie.getCookie()["role"] == "Administrador" && data[i].fhinicio > getcurrentDate()) ? true : false) };
                        if (window.cookie.getCookie()["role"] == "Administrador") myevents.push(visualEvent);
                        $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                    }
                }
            }
        }
    });
    $("#dvCalendario").modal();
}

function createTable(cadena) {
    var my = "";
    my += '<table class="table">';
    my += '<thead class="blue-grey lighten-4">';
    my += '<tr>';
    my += '<th align="center">Nro</th>';
    if (window.cookie.getCookie()["role"] == "Administrador" || window.cookie.getCookie()["role"] == "Admin") my += '<th align="center">Usuario</th>'
    my += '<th align="center">Fecha creación</th>';
    my += '<th align="center">Fecha inicio</th>';
    my += '<th align="center">Fecha fin</th>';
    my += '<th align="center">Estado</th>';
    my += '<th align="center">CheckList <br> inicial</th>';
    my += '<th align="center">CheckList <br> final</th>';
    my += '<th align="center">Acción</th>';
    my += '</tr>';
    my += '</thead>';
    my += '<tbody>';
    my += cadena;
    my += '</tbody>';
    my += '</table>';
    return my;
}