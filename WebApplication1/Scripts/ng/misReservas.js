$(document).ready(function () {
    var my = setInterval(function () {
        if ($("#pais-profile").html() != "") {
            clearInterval(my);
            var pais = $("#pais-profile").html();
            $("#pais").val(pais);
            listarSedes(pais);
        }
    }, 0);

    $(window).load(function () {
        $(".loader").fadeOut("slow");
    });

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        selectable: true,
        eventRender: function (event, element) {
            element.attr('title', event.tip);
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

function showDetailEvent(inicio, fin, title, id) {
    var hdinicio = inicio.split("T");
    var hdfin = fin.split("T");
    $("#tituloR").val(title.substring(title.indexOf(":") + 2, title.indexOf("\n")));
    $("#creadorR").val(title.substring(title.indexOf("\n") + 14, title.length));
    $("#dinicioR").val(hdinicio[0]);
    $("#dfinR").val(hdfin[0]);
    $("#hinicioR").val(hdinicio[1]);
    $("#hfinR").val(hdfin[1]);
    $("#dvMisEvents").modal("show");
}

function listarSedes(pais) {
    $.ajax({
        method: "POST",
        url: "/Reserva/listarSedesxPais",
        data: { pais: pais },
        dataType: "text",
        success: function (response) {
            var sedes = response.split(";");
            var sede = null;
            var str = "<option value='0'>--SELEC--</option>";
            for (var i = 0; i < sedes.length; i++) {
                sede = sedes[i].split("|");
                str += "<option value='" + sede[0] + "'>" + sede[1] + "</option>";
            }
            $("#sede").html(str);
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
    if ($("#sede").val != "0") {
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
                    var keys = Object.keys(salas)
                    var reservas = null;
                    for (var z = 0; z < keys.length; z++) {
                        reservas = salas[keys[z]].reservas;
                        campos = "";
                        for (var i = 0; i < reservas.length; i++) {
                            campos += "<tr id='tr_" + reservas[i].idReserva + "'>";
                            campos += "<th scope='row' align='center'><span style='display:none;' id='col_" + reservas[i].idReserva + "'></span><p>" + (i + 1) + "</p></th>";
                            campos += "<td align='center'>" + reservas[i].fhCreacion + "</td>";
                            campos += "<td align='center'>" + reservas[i].fhinicio.substring(0, 16).replace("T", " ") + "</td>";
                            campos += "<td align='center'>" + reservas[i].fhfin.substring(0,16).replace("T", " ") + "</td>";
                            campos += "<td align='center'><div class='esfera " + ((reservas[i].estadoReserva == 0) ? "cancelada' title='cancelada'" : ((reservas[i].estadoReserva == 1) ? "espera' title='vigente'" : ((reservas[i].estadoReserva == 2) ? "reserva' title='en reserva'" : "terminada' title='terminada'")))+"'></div></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='realizar checklist inicial' onclick='realizarCheckList(\"" + reservas[i].idReserva + "\"," + keys[z] + ",0)' " + ((reservas[i].estadoReserva == 0)?"disabled":"")+"><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='realizar checklist final' onclick='realizarCheckList(\"" + reservas[i].idReserva + "\"," + keys[z] + ",1)' " + ((reservas[i].estadoReserva == 0) ? "disabled" : "") +"><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-info' title='cancelar reserva' onclick='eliminarReserva(" + reservas[i].idReserva + ",\"" + reservas[i].fhinicio + "\",this)' " + ((reservas[i].estadoReserva == 0 || getcurrentDate() > reservas[i].fhinicio)?"disabled":"")+"><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>";
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
                        str += ' <div id="tabla' + z + '" class="panel-collapse collapse'+((z==0)?' in':'')+'">';
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

function eliminarReserva(id,fechaIni,elem) {
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
            $("#miCheck").attr("disabled", "disabled");
            arrayCheck = JSON.parse(checkList);
        } else {
            if (actual < reserva["fhinicio"]) {
                $("#miCheck").attr("disabled", "disabled");
                $("#advertencia").html(" -- Aun no comienza su reserva");
            } else if (actual > reserva["fhfin"]) {
                alert("ya termino su reserva y ya no puede realizar el checkList inicial");
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
            if (reserva["checkListInicial"] == "") {
                alert("Debe realizar primero el Checklist inicial");
                return;
            }
            if (actual > reserva["fhfin"]) {
                alert("ya termino su reserva y ya no puede realizar el checkList final");
                return;
            } /*else if (actual > reserva["fhfin"]) {
                $("#miCheck").attr("disabled", "disabled");
                $("#advertencia").html(" -- Ya termino tu reserva");
            }*/
        }
    }

    var activos = salasArray.find((x) => x.id == idSala)["activos"];
    var keys = Object.keys(activos);
    var str = "";
    var detalle = [];
    for (var i = 0; i < keys.length; i++) {//si se modifican los activos esto no va a funcionar!!!!!! ya que se cambiaria la estructura .. seria mejor que cuando no esta vacio se cree un checklist con la estructura guardada en reserva?
        str += '<fieldset style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;">';
        str += '<legend class="ng-binding" style="width:auto;border-bottom:0;margin-bottom:10px;font-size:16px;font-style:italic;color:#B7B7B7;" id="nameSala">'+keys[i]+'</legend>';
        str += '<div class="form-group">';
        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="detalle_' + keys[i]+'" style="padding-top:10px;padding-left:10px;">Detalle:</label>';
        str += '<div class="col-sm-12 col-md-8 col-lg-8">';
        str += '<textarea class="form-control checkDetalle" rows="3" id="detalle_' + keys[i] + '"' + (jQuery.isEmptyObject(arrayCheck) ? (((actual < reserva["fhinicio"]) || (actual > reserva["fhfin"]))?"disabled >":">") : "disabled >"+arrayCheck[keys[i]]["descripcion"])+'</textarea>';
        str += '</div></div><br><br><br><br>';
        if (!jQuery.isEmptyObject(arrayCheck)) detalle = arrayCheck[keys[i]]["Detalle"];
        for (var j = 0; j < activos[keys[i]]; j++) {
            str += '<div class="form-group">';
            str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" for="' + keys[i]+(j+1) +'" style="padding-top:10px;padding-left:10px;">' + keys[i]+' '+(j+1)+':</label>';
            str += '<div class="col-sm-12 col-md-8 col-lg-8">';
            str += '<select class="form-control checkSelect" id="' + keys[i] + (j + 1) + '" ' + ((jQuery.isEmptyObject(arrayCheck) && !((actual < reserva["fhinicio"]) || (actual > reserva["fhfin"])))?"":"disabled")+'>';
            str += '<option value="0">--SELECCIONAR--</option>';
            str += '<option value="funcional" ' + (jQuery.isEmptyObject(arrayCheck) ? "" : ((detalle[j] == "funcional")?"selected":""))+'>funcional</option>';
            str += '<option value="no_funcional" ' + (jQuery.isEmptyObject(arrayCheck) ? "" : ((detalle[j] == "no_funcional") ? "selected" : "")) +'>no funcional</option>';
            str += '</select></div></div><br><br>';
        }
        str += '</fieldset>';
    }
    $("#bodyCheck").html(str);
    document.getElementById("idReserva").innerHTML = idReserva;
    document.getElementById("iniFin").innerHTML = param;
    $("#idSala").html(idSala);
    $("#dvCheck").modal();
}

function guardarCheck() {
    var validarDet = true;
    var validarSel = true;
    var detalles = document.getElementsByClassName("checkDetalle");
    var select = document.getElementsByClassName("checkSelect");
    for (var i = 0; i < detalles.length; i++) {
        if (detalles[i].value == "") {
            validarDet = false;
            break;
        }
    }
    for (var i = 0; i < select.length; i++) {
        if (select[i].value == "0") {
            validarSel = false;
            break;
        }
    }

    if (validarDet && validarSel) {
        var checkList = {};
        var idSala = $("#idSala").html() * 1;
        var activos = salasArray.find((x) => x.id == idSala)["activos"];
        var keys = Object.keys(activos);
        for (var i = 0; i < keys.length; i++) {
            checkList[keys[i]] = {};
            checkList[keys[i]]["descripcion"] = $("#detalle_" + keys[i]).val();
            checkList[keys[i]]["Detalle"] = [];
            for (var j = 0; j < activos[keys[i]]; j++) {
                checkList[keys[i]]["Detalle"].push($("#"+keys[i] + (j + 1)).val());
            }
        }
        
        var idReserva = document.getElementById("idReserva").innerHTML*1;
        var iniFin = document.getElementById("iniFin").innerHTML*1;
        debugger;
        $.ajax({
            method: "POST",
            url: "/MisReservas/CheckList",
            data: { idReserva: idReserva, iniFin: iniFin , check: JSON.stringify(checkList) },
            dataType: "text",
            success: function (response) {
                if (response.length > 0) {
                    var datos = response.split("|");
                    if (iniFin == 0) {
                        debugger;
                        document.getElementById("tr_" + idReserva).children[4].firstChild.setAttribute("class", "esfera reserva");
                        document.getElementById("tr_" + idReserva).children[4].firstChild.setAttribute("title", "en reserva");
                        salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["checkListInicial"] = datos[0];
                        salas[idSala + ""].reservas.find((x) => x.idReserva == idReserva)["fhCheckInicial"] = datos[1];
                    } else {
                        document.getElementById("tr_" + idReserva).children[4].firstChild.setAttribute("class", "esfera terminada");
                        document.getElementById("tr_" + idReserva).children[4].firstChild.setAttribute("title", "terminada");
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

//var myevents = [];
function mostrarReservas(idSala,nombreAdmin) {
    $("#miSalaM").html($("#sala option[value='" + idSala + "']").text());
    $("#miAdmin").html(nombreAdmin);
    var data = {};
    data.idSala = idSala * 1;
    data.fhinicio = getFirstDayMonth();
    data.fhfin = getLastDayMonth(getFirstDayMonth());
    $("#paramInicio").val(data.fhfin);
    $("#salaSelect").val(idSala);
    //myevents = [];
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
                        if (data[i].idCreator == window.cookie.getCookie()["userId"] * 1) visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin, color: "#5cb85c" };
                        else visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + "\n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin };
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
//hola
   /*<div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">Collapsible Group 1</a>
            </h4>
        </div>
        <div id="collapse1" class="panel-collapse collapse in">
            <div class="panel-body">
                hola1.
            </div>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h4 class="panel-title">
                <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">Collapsible Group 2</a>
            </h4>
        </div>
        <div id="collapse2" class="panel-collapse collapse">
            <div class="panel-body">
                hola2
            </div>
        </div>
    </div>

   <div class="panel panel-default">
       <div class="panel- heading row">
           <div>
               <h5 class="col-sm-12 col-md-6 col-lg-6 panel-title">
                   <a data-toggle="collapse" data-parent="#result" href="#tabla1" class="">
                       <span style="font-weight:bold">SALA:</span> TR984
                       </a>
               </h5>
               <div>
                   <button type="button" class="btn btn-default col-sm-6 col-md-1 col-lg-1" style="font-size:15px;float:right;margin-right:10px;" title="ver activos" onclick="mostrarActivos(&quot;2&quot;)"><span class="glyphicon glyphicon-th-list" aria-hidden="true"></span></button><button type="button" class="btn btn-default col-sm-6 col-md-1 col-lg-1" style="font-size:15px;float:right;margin-right:10px;" title="reservas de la sala" onclick="mostrarReservas(&quot;2&quot;)"><span class="glyphicon glyphicon-calendar" aria-hidden="true"></span></button></div></div> <div id="tabla1" class="panel-collapse in" style="height: auto;"><div class="panel-body"></div></div></div></div>
*/