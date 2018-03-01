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
            console.log(event);
            //rs.createUpdateNuevoEvento(event.start._i, event.end._i, event.title, event.id);
        },
        events: []
    });
});

function listarSedes(pais) {
    $.ajax({
        method: "POST",
        url: "/Reserva/listarSedesxPais",
        data: { pais: pais },
        dataType: "text",
        success: function (response) {
            var sedes = response.split(";");
            var sede = null;
            var str = "<option value='0'>--SELECCIONAR--</option>";
            for (var i = 0; i < sedes.length; i++) {
                sede = sedes[i].split("|");
                str += "<option value='" + sede[0] + "'>" + sede[1] + "</option>";
            }
            $("#sede").html(str);
        }
    });
}

var salasArray=[];
function listarSalas(elem) {
    salasArray = [];
    $.ajax({
        method: "POST",
        url: "/MisReservas/listarSalasxSede",
        data: { sede: elem.value*1 },
        dataType: "text",
        success: function (response) {
            var salas = response.split("#");
            var sala = null;
            var descrpt = "";
            var str = "<option value='0'>--SELECCIONAR--</option>";
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

function buscarReservas() {
    if ($("#sede").val != "0") {
        $(".loader").toggle(true);
        $.ajax({
            method: "POST",
            url: "/MisReservas/obtenerReservaxUsuario",
            data: { idSala: $("#sala").val() * 1, idUser: window.cookie.getCookie()["userId"]*1},
            dataType: "json",
            success: function (data) {
                $("#result").html("");
                $(".loader").toggle(false);
                if (data.length > 0) {
                    document.getElementById("content").style.display = "block";
                    var str = "";
                    var campos = "";
                    if ($("#sala").val() != "0") {

                        for (var i = 0; i < data.length; i++) {
                            campos += "<tr id='tr_" + data[i].idReserva + "'></tr>";
                            campos += "<th scope='row' align='center'><span style='display:none;' id='col_" + data[i].idReserva + "'></span><p>" + (i + 1) + "</p></th>";
                            campos += "<td align='center'>" + data[i].fhinicio.replace("T"," ") + "</td>";
                            campos += "<td align='center'>" + data[i].fhfin.replace("T", " ") + "</td>";
                            campos += "<td align='center'>estado</td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='realizar checklist' onclick='realizarCheckList(\"" + data[i].idReserva + "\")'><span class='glyphicon glyphicon-list-alt' aria-hidden='true'></span></button></td>";
                            campos += "<td align='center'><button type='button' class='btn btn-default' title='detalles reserva' onclick='detallesReserva(\"" + data[i].idReserva + "\")'><span class='glyphicon glyphicon-search' aria-hidden='true'></span></button>&nbsp;&nbsp;<button type='button' class='btn btn-info' title='cancelar reserva' onclick='eliminarReserva(\"" + data[i].idReserva + "\")'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></button></td>";
                        }
                        str += "<div class='panel panel-default'>";
                        str += "<div class='panel-heading'>";
                        str += "<h5 class='panel-title'>";
                        str += "<div class='row'>";
                        str += "<div class='col-sm-12 col-md-6 col-lg-6' style='padding-top: 10px;'>";
                        str += "<a data-toggle='collapse' data-parent='#result' href='#tabla1'><span style='font-weight:bold'>SALA:</span> " + $("#sala option[value='" + data[0].idSala + "']").text() + "</a></div>";
                        str += "<button type='button' class='btn btn-default col-sm-6 col-md-1 col-lg-1' style='font-size:15px;float:right;margin-right:10px;' title='ver activos' onclick='mostrarActivos(\"" + data[0].idSala + "\")'><span class='glyphicon glyphicon-th-list' aria-hidden='true'></span></button>";
                        str += "<button type='button' class='btn btn-default col-sm-6 col-md-1 col-lg-1' style='font-size:15px;float:right;margin-right:10px;' title='reservas de la sala' onclick='mostrarReservas(\"" + data[0].idSala + "\")'><span class='glyphicon glyphicon-calendar' aria-hidden='true'></span></button>";
                        str += "</div>";
                        str += "</h5>";
                        str += "</div>";
                        str += ' <div id="tabla1" class="panel-collapse collapse in">';
                        str += '<div class="panel-body">';
                        str += createTable(campos);
                        str += "</div></div></div>"
                        $("#result").html(str);
                    }

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
    var d = new Date(array[0], (array[1] * 1)+1, 0);
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


function mostrarReservas(idSala) {
    $("#miSalaM").html($("#sala option[value='" + idSala + "']").text());

    var data = {};
    data.idSala = idSala*1;
    data.fhinicio = getFirstDayMonth();
    data.fhfin = getLastDayMonth(getFirstDayMonth());
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
                    visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + " \n Solicitante: " + data[i].UserNameCreator, start: data[i].fhinicio, end: data[i].fhfin, editable: false };
                    //o.myevents.push(visualEvent);
                    $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                }
            }
        }
    });
    console.log(data);
    $("#dvCalendario").modal();
}

function createTable(cadena) {
    var my = "";
    my += '<table class="table">';
    my += '<thead class="blue-grey lighten-4">';
    my += '<tr>';
    my += '<th align="center">#</th>';
    my += '<th align="center">Fecha inicio</th>';
    my += '<th align="center">Fecha fin</th>';
    my += '<th align="center">Estado</th>';
    my += '<th align="center">CheckList</th>';
    my += '<th align="center">Acción</th>';
    my += '</tr>';
    my += '</thead>';
    my += '<tbody>';
    my += cadena;
    my += '</tbody>';
    my += '</table>';
    return my;
}

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