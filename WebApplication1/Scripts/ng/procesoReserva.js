(function () {
    "use strict";
    var rs = (function (o) {
        o.id = function id(id) {
            return document.getElementById(id);
        }
        o.name = function name(name) {
            return document.getElementsByClassName(name);
        }

        $('#navegacion a').click(function (e) {
            e.preventDefault()
        });

        o.actualDate = function () {
            var midate = new Date();
            var dd = midate.getDate();
            var mm = midate.getMonth() + 1;
            var yyyy = midate.getFullYear();
            dd = (dd < 10) ? '0' + dd : dd;
            mm = (mm < 10) ? '0' + mm : mm;
            var today = yyyy + '-' + mm + '-' + dd;
            document.getElementById("dinicioR").setAttribute("min", today);
        }

        o.getcurrentDate = function () {
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

        o.getcurrentDatequitDays = function (day) {
            var midate = new Date();
            midate.setDate(midate.getDate() - day);
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

        o.cargarHoras = function (elem) {
            var str = "<option value='0'>--SELECCIONAR--</option>";
            //var cd = o.getcurrentDate().split("T")[1];
            //console.log(o.getcurrentDate());
            //var valInicio = cd.split(":")[0] * 100 + cd.split(":")[1] * 1;
            for (var i = 0; i < 24; i++) {
                if (i >= o.restrictHour[0] && i < o.restrictHour[1]) {
                    str += "<option value='" + ((i < 10) ? "0" + i : i) + ":00'>" + ((i < 10) ? "0" + i : i) + ":00</option>";
                    str += "<option value='" + ((i < 10) ? "0" + i : i) + ":30'>" + ((i < 10) ? "0" + i : i) + ":30</option>";
                }
                /*if ((i * 100) + 30 > valInicio && i < o.restrictHour[1]) {
                    str += "<option value='" + ((i < 10) ? "0" + i : i) + ":30'>" + ((i < 10) ? "0" + i : i) + ":30</option>";
                }*/
            }

            elem.innerHTML = str;
        }

        o.id("hinicioR").onchange = function () {
            var elfin = o.id("hfinR");
            var str = "<option value='0'>--SELECCIONAR--</option>";
            if (this.value != "") {
                var elInicio = this.value;
                var valInicio = elInicio.split(":")[0] * 100 + elInicio.split(":")[1] * 1;
                for (var z = 0; z < 24; z++) {
                    if (z * 100 > valInicio && z < o.restrictHour[1]) {
                        str += "<option value='" + ((z < 10) ? "0" + z : z) + ":00'>" + ((z < 10) ? "0" + z : z) + ":00</option>";
                    }

                    if ((z * 100) + 30 > valInicio && z < o.restrictHour[1]) {
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

        o.id("dinicioR").onchange = function () {
            if (this.value != "") {
                if ((this.value.substring(8, 10) * 1) > (o.id("dfinR").value.substring(8, 10) * 1)) o.id("dfinR").value = "";
                o.id("dfinR").setAttribute("min", this.value);
                o.id("dfinR").removeAttribute("disabled");
            } else {
                o.id("dfinR").removeAttribute("min");
                o.id("dfinR").setAttribute("disabled", "disabled");
            }
        }

        o.myBussinessHour = function (micadena) {
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
            /*
            idea para poner las horas no disponibles en rojo!!!!!
            var inihn = horas[0].split(":")[0] * 1;
            var finhn = horas[1].split(":")[0] * 1;
            var horastotales = [];
            for (var j = 0; j < 24; j++) {
                horastotales.push(j);
            }*/
            if (find > inid) {
                for (var i = inid; i <= find; i++) {
                    my.push(i);
                    //myn.splice(myn.findIndex((x) => x == i), 1);
                }
            } else {
                var d = 0;
                for (var i = find; i <= inid + 7; i++) {
                    d = i % 7;
                    my.push(i);
                    //myn.splice(myn.findIndex((x) => x == i), 1);
                }
            }

            return { dow: my, start: inih, end: finh, days: hd[0], hours: hd[1] };
        }

        o.activos = {};
        o.restrictHour = [];

        o.getLastDayMonth = function (mydate) {
            var myday = mydate.split("T")[0];
            var array = myday.split("-");
            var d = new Date(array[0], (array[1] * 1), 0);
            d.setDate(d.getDate() + 14 - d.getDay());
            return o.formatdatetoString([d.getFullYear(), d.getMonth(), d.getDate(), 23, 59]);
        }

        o.addDays = function (mydate, days) {
            var myday = mydate.split("T")[0];
            var array = myday.split("-");
            var d = new Date(array[0], (array[1] * 1)-1, array[2]);
            d.setDate(d.getDate() + days);
            return o.formatdatetoString([d.getFullYear(), d.getMonth(), d.getDate(), 23, 59]);
        }

        o.volverAconsultar = 0;
        o.id("inicioButton").onclick = function () {
            if (o.id("paisR").value != "0" && o.id("sedeR").value != "0" && o.id("tipoR").value != "0" && o.id("torreR").value != "0" && o.id("pisoR").value != "0" && o.id("salaR").value != "0") {
                var data = {};
                data.idSala = $("#salaR").val()*1;
                data.fhinicio = o.getcurrentDate();
                data.fhfin = o.getLastDayMonth(o.getcurrentDate());//last day of the calendar
                o.id("hdnfi").value = data.fhfin;
                o.id("liInicio").parentNode.setAttribute("class", "disabledli");
                o.id("liInicio").style.color = "#A5A5A5";
                o.id("liSeleccion").parentNode.removeAttribute("class");
                o.id("liSeleccion").click();
                o.id("liSeleccion").style.color = "#398CD3";
                $(".loader").toggle(true);
                //debugger;
                if (data.idSala != o.volverAconsultar) {
                    o.volverAconsultar = data.idSala;
                    $.ajax({
                        method: "POST",
                        url: "/Reserva/reservaXsalaEvents",
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        dataType: "json",
                        success: function (data) {
                            if (o.myevents.length > 0) {
                                for (var j = 0; j < o.myevents.length; j++) {
                                    $('#calendar').fullCalendar('removeEvents', [o.myevents[j].id]);
                                }
                                o.myevents = [];
                            }

                            if (data.length > 0) {
                                var visualEvent = {};
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].estadoReserva != 0) {
                                        visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + " \n Solicitante: " + data[i].nombreCompletoCreator, start: data[i].fhinicio, end: data[i].fhfin, editable: false };
                                        o.myevents.push(visualEvent);
                                        $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                                    }
                                }
                            }

                            var mihorario = salaCand.find((x) => x.idSala = (o.id("salaR").value * 1))["horario"];
                            var mbh = o.myBussinessHour(mihorario);
                            o.restrictHour = [];
                            o.restrictHour.push(mbh.hours.split("-")[0].split(":")[0] * 1)
                            o.restrictHour.push(mbh.hours.split("-")[1].split(":")[0] * 1)
                            o.id("daysHours").innerHTML = mbh.days + ";" + mbh.hours;
                            $('#calendar').fullCalendar('option', {
                                businessHours: [{
                                    start: mbh.start,
                                    end: mbh.end,
                                    dow: mbh.dow
                                }]
                            });
                            $(".loader").toggle(false);
                            //idea para poner las horas no diponibles en rojo
                            //var myevent = { start: mbh.start, end: mbh.end, color: "green", rendering: "background", dow: mbh.dow};
                            //$('#calendar').fullCalendar('renderEvent', myevent, true);
                        }
                    });
                } else {
                    $(".loader").toggle(false);
                }
            } else {
                alert("Faltan completar campos!");
            }

        };

        var sedesArray = [];
        o.id("paisR").onchange = function () {
            sedesArray = [];
            var str = "<option value='0'>--SELECCIONAR--</option>";
            $("#salaR").html(str);
            $("#pisosR").html(str);
            $("#torreR").html(str);
            $(".loader").toggle(true);
            if (this.value != 0) {
                $.ajax({
                    method: "POST",
                    url: "/Reserva/listarSedesxPais",
                    data: { pais: rs.id("paisR").value },
                    dataType: "text",
                    success: function (response) {
                        $(".loader").toggle(false);
                        var sedes = response.split(";");
                        var sede = null;
                        var verifica = "";
                        for (var i = 0; i < sedes.length; i++) {
                            sede = sedes[i].split("|");
                            verifica = "";
                            if (window.cookie.getCookie()["role"] == "User" && (o.id("rol-profile").innerHTML == "Supervisor" || o.id("rol-profile").innerHTML == "ejecutivo" || o.id("rol-profile").innerHTML == "Jefe")) {
                                if (sede[1] == o.id("sede-profile").innerHTML) {
                                    verifica = "selected";
                                }
                            }
                            str += "<option value='" + sede[0] + "' "+verifica+">" + sede[1] + "</option>";
                            sedesArray.push({
                                id: sede[0] * 1,
                                nombreSede: sede[1],
                                torres: sede[2] * 1,
                                pisos: JSON.parse(sede[3])
                            });
                        }
                        $("#sedeR").html(str);
                        if (window.cookie.getCookie()["role"] == "User" && (o.id("rol-profile").innerHTML == "Supervisor" || o.id("rol-profile").innerHTML == "ejecutivo" || o.id("rol-profile").innerHTML == "Jefe")) {
                            o.id("sedeR").setAttribute("disabled", "disabled");
                            o.id("sedeR").onchange();
                        }
                    }
                });
            } else {
                $("#sedeR").html(str);
            }
        };

        o.id("sedeR").onchange = function () {
            var mistorres = sedesArray[sedesArray.findIndex((x) => x.id == this.value)].torres;
            var str = "<option value='0'>--SELECCIONAR--</option>";
            $("#pisosR").html(str);
            $("#salaR").html(str);
            for (var i = 1; i <= mistorres; i++) {
                str += "<option value='" + i + "'>" + i + "</option>";
            }
            $("#torreR").html(str);
        };

        o.id("tipoR").onchange = function () {
            o.id("torreR").value = "0";
            o.id("pisoR").value = "0";
            o.id("pisoR").innerHTML = "<option value='0'>--SELECCIONAR--</option>";
            o.id("salaR").innerHTML = "<option value='0'>--SELECCIONAR--</option>";
            if (this.value == "CAPACITACION") {
                o.id("divCampania").style.display = "block";
                //listarCampañasxSede();
            } else {
                o.id("divCampania").style.display = "none";
            } 
        }

        o.id("torreR").onchange = function () {
            if (this.value != "0") {
                var mispisos = sedesArray[sedesArray.findIndex((x) => x.id == (document.getElementById("sedeR").value * 1))]["pisos"][(this.value * 1 - 1)];
                console.log(mispisos);
                $("#salaR").html(str);
                var str = "<option value='0'>--SELECCIONAR--</option>";
                for (var i = 1; i <= mispisos; i++) {
                    str += "<option value='" + i + "'>" + i + "</option>";
                }
                $("#pisoR").html(str);
            }
        };

        var salaCand = [];
        o.id("pisoR").onchange = function () {
            if (this.value != "0") {
                var data = {};
                data.tipo = $("#tipoR").val();
                data.idSede = $("#sedeR").val();
                data.ubicacion = "Torre: " + $("#torreR").val() + "; Piso: " + $("#pisoR").val();
                $(".loader").toggle(true);
                $.ajax({
                    method: "POST",
                    url: "/Reserva/obtenerSala",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "text",
                    success: function (response) {
                        $(".loader").toggle(false);
                        if (response.length > 0) {
                            salaCand = [];
                            var str = "<option value='0'>--SELECCIONAR--</option>";
                            var datos = response.split("#");
                            var jActivos = null;
                            var activos = "";
                            var fila = null;
                            var keys = null;
                            o.id("hdnuserId").value = datos[0].split("|")[5];
                            o.id("hdnuserName").value = datos[0].split("|")[6];
                            o.id("hdnuserNc").value = datos[0].split("|")[7];
                            for (var i = 0; i < datos.length; i++) {
                                fila = datos[i].split("|");
                                jActivos = JSON.parse(fila[4]);
                                console.log(jActivos);
                                keys = Object.keys(jActivos);
                                activos = "";
                                for (var j = 0; j < keys.length; j++) {
                                    // if (j % 2 != 0) activos += keys[j] + ": " + jActivos[keys[j]] + "\t";
                                    //else activos += "\n"+keys[j] + ": " + jActivos[keys[j]];
                                    activos += keys[j] + ": " + jActivos[keys[j]] + "; \n";
                                }
                                str += "<optgroup label='" + activos + "'><option value='" + fila[0] + "'>" + fila[1] + "</option></optgroup>";
                                salaCand.push({
                                    idSala: fila[0] * 1,
                                    nombreSala: fila[1],
                                    tipo: fila[2],
                                    horario: fila[3],
                                    activos: JSON.parse(fila[4]),
                                });
                            }
                            $("#salaR").html(str);
                            console.log(salaCand);
                        } else {
                            alert("No hay salas en dicha ubicación");
                        }

                    }
                });
            }
        }

        o.limpiarcune = function () {
            o.id("dinicioR").value = "0";
            o.id("dfinR").value = "0";
            o.id("hinicioR").value = "0";
            o.id("hfinR").value = "0";
            o.id("tituloR").removeAttribute("disabled");
            o.id("dinicioR").removeAttribute("disabled");
            o.id("dfinR").removeAttribute("disabled");
            o.id("hinicioR").removeAttribute("disabled");
            o.id("hfinR").removeAttribute("disabled");
            o.id("btncue").removeAttribute("disabled");
        }

        o.formatdatetoString = function (array) {
            return array[0] + "-" + (((array[1] + 1) > 9) ? (array[1] + 1) : "0" + (array[1] + 1)) + "-" + (((array[2]) > 9) ? array[2] : "0" + array[2]) + "T" + (((array[3]) > 9) ? array[3] : "0" + array[3]) + ":" + (((array[4]) > 9) ? array[4] : "0" + array[4]) + ":00";
        }

        o.changelimits = function (event) {
            var buscador = o.myevents.find((x) => x.id == event.id);
            buscador.start = rs.formatdatetoString(event.start._i);
            buscador.end = rs.formatdatetoString(event.end._i);
            console.log(o.myevents);
        }

        o.createUpdateNuevoEvento = function (inicio, fin, title, id) {
            o.limpiarcune();
            o.cargarHoras(o.id("hinicioR"));
            var hdinicio = [];
            if (Array.isArray(inicio)) {
                var strIni = o.formatdatetoString(inicio);
                hdinicio = strIni.split("T");
            } else {
                hdinicio = inicio.split("T");
            }
            var hdfin = [];
            if (Array.isArray(fin)) {
                var strfin = o.formatdatetoString(fin);
                hdfin = strfin.split("T");
            } else {
                hdfin = fin.split("T");
            }
            console.log(hdinicio);
            console.log(hdfin);
            o.id("tituloR").value = (title != "") ? title.substring(title.indexOf(":") + 2, title.indexOf("\n")) : title;
            o.id("idcue").innerHTML = id;//(id=="actual")?(id + Math.floor((Math.random() * 10) + 1)):id;
            o.id("dinicioR").value = hdinicio[0];
            o.id("dinicioR").onchange();
            o.id("dfinR").value = (title != "") ? hdfin[0] : hdinicio[0];
            if (hdinicio.length > 1) {
                o.id("hinicioR").value = hdinicio[1].substring(0, 5);
                o.id("hinicioR").onchange();
                o.id("hfinR").value = hdfin[1].substring(0, 5);
            }
            if (id!=99999 && Math.trunc(id / 100) != 99999) {
                o.id("tituloR").setAttribute("disabled", "disabled");
                o.id("dinicioR").setAttribute("disabled", "disabled");
                o.id("dfinR").setAttribute("disabled", "disabled");
                o.id("hinicioR").setAttribute("disabled", "disabled");
                o.id("hfinR").setAttribute("disabled", "disabled"); 
                o.id("btncue").setAttribute("disabled", "disabled");
            }
            o.id("solicitante").value = (title != "") ? title.substring(title.indexOf("\n") + 14, title.length) : o.id("nombre-profile").innerHTML;
            $("#dvMisEvents").modal("show");

        }

        o.myevents = [];

        o.id("btncue").onclick = function () {
            if (o.id("tituloR").value != "" && o.id("dinicioR").value != "" && o.id("dfinR").value != "" && o.id("hinicioR").value != "0" && o.id("hfinR").value != "0") {
                var elevent = {};
                elevent.start = o.id("dinicioR").value + "T" + o.id("hinicioR").value + ":00";
                elevent.end = o.id("dfinR").value + "T" + o.id("hfinR").value + ":00";
                elevent.id = o.id("idcue").innerHTML * 1;
                if (!o.isOverlapping(elevent)) {
                    if ((o.id("idcue").innerHTML * 1) == 99999) {
                        o.myevents.push({
                            id: o.id("idcue").innerHTML * 100 + Math.floor((Math.random() * 100) + 1),
                            title: "Titulo: " + o.id("tituloR").value + "\n Solicitante: " + o.id("nombre-profile").innerHTML,
                            start: elevent.start,
                            end: elevent.end,
                            editable: true
                        });
                        var last = o.myevents[o.myevents.length - 1];
                        console.log(last);
                        var visualEvent = { id: last.id, title: last.title, start: last.start, end: last.end, editable: last.editable, color: "#5cb85c" };
                        $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                    } else {
                        var buscador = o.myevents.find((x) => x.id == (o.id("idcue").innerHTML * 1));
                        buscador.title = "Titulo: " + o.id("tituloR").value + "\n Solicitante: " + window.cookie.getCookie().userName;
                        buscador.start = elevent.start;
                        buscador.end = elevent.end;
                        buscador.color = "#5cb85c";
                        $('#calendar').fullCalendar('removeEvents', [(o.id("idcue").innerHTML * 1)]);

                        $('#calendar').fullCalendar('renderEvent', buscador, true);
                    }
                    $("#dvMisEvents").modal("hide");
                } else {
                    alert("hay un cruce de reserva en el horario seleccionado");
                }
            } else {
                alert("se deben completar todos los campos!");
            }
            console.log(o.myevents);
        }

        o.isOverlapping = function (event) {
            var array = o.myevents;//deberia usar este o el clientEvents???????????
            for (var i in array) {
                if (array[i].id != event.id) {
                    if (event.end >= array[i].start && event.start <= array[i].end) {
                        return true;
                    }
                }
            }
            return false;
        }

        var datafinal = {};
        o.nuevasReservas = [];
        o.id("irAresumen").onclick = function () {

            var buscador = o.myevents.findIndex((x) => Math.trunc(x.id / 100) == 99999);
            if (buscador > -1) {
                o.id("salaSelect").innerHTML = o.id("salaR").options[o.id("salaR").selectedIndex].text;
                o.id("paisSelect").value = o.id("paisR").value;
                o.id("sedeSelect").value = o.id("sedeR").options[o.id("sedeR").selectedIndex].text;
                o.id("tipoSelect").value = o.id("tipoR").value;
                o.id("ubiSelect").value = "torre: " + o.id("torreR").value + "; Piso:" + o.id("pisoR").value;
                var obj = salaCand.find((x) => x.idSala = (o.id("salaR").value * 1))["activos"];
                var keys = Object.keys(obj);
                var str = "";
                for (var i = 0; i < keys.length; i++) {
                    str += "<tr><td align='center'>" + keys[i] + "</td><td align='center'>" + obj[keys[i]] + "</td></tr>";
                }
                o.id("listActivos").innerHTML = str;

                str = "";
                var cont = 0;
                var descripcion = "";
                o.nuevasReservas = [];
                for (var j = 0; j < o.myevents.length; j++) {
                    if (Math.trunc(o.myevents[j].id / 100) == 99999) {
                        descripcion = o.myevents[j].title.substring(o.myevents[j].title.indexOf(":") + 2, o.myevents[j].title.indexOf("\n"))

                        o.nuevasReservas.push({//se guardan las posibles nuevas reservas
                            idSala: (o.id("salaR").value * 1),
                            descripcion: descripcion,
                            fhinicio: o.myevents[j].start,
                            fhfin: o.myevents[j].end,
                            idCreator: window.cookie.getCookie().userId,
                            userNameCreator: window.cookie.getCookie().userName,
                            nombreCompletoCreator: o.id("nombre-profile").innerHTML,
                            idCharge: o.id("hdnuserId").value*1,
                            userNameCharge: o.id("hdnuserName").value,
                            nombreCompletoCharge: o.id("hdnuserNc").value
                        });

                        cont++;
                        str += '<div class="card-block">';
                        str += '<h4 class="card-title">Reserva #' + (cont) + '</h4>';
                        str += '<ul class="list-group list-group-flush">';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Titulo:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + descripcion + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Fecha inicio:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.myevents[j].start.split("T")[0] + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Fecha fin:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.myevents[j].end.split("T")[0] + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Día inicio:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.myevents[j].start.split("T")[1] + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Día fin:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.myevents[j].end.split("T")[1] + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Solicitante:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.id("nombre-profile").innerHTML + '"/>';
                        str += '</div></div></li>';
                        str += '<li class="list-group-item">'
                        str += '<div class="row">';
                        str += '<label class="col-sm-12 col-md-4 col-lg-4 control-label" style="padding-top:8px;padding-left:15px;">Encargado:</label>';
                        str += '<div class="col-sm-12 col-md-8 col-lg-8" style="padding-left:0px;">';
                        str += '<input type="text" class="form-control" readonly value="' + o.id("hdnuserNc").value+'"/>';
                        str += '</div></div></li></ul></div>';
                    }
                }

                o.id("listReservas").innerHTML = str;

                o.id("liSeleccion").parentNode.setAttribute("class", "disabledli");
                o.id("liSeleccion").style.color = "#A5A5A5";
                o.id("liResumen").parentNode.removeAttribute("class");
                o.id("liResumen").click();
                o.id("liResumen").style.color = "#398CD3";
            } else {
                alert("debes hacer una reservación para continuar!");
            }
        }

        o.id("guardarReserva").onclick = function () {
            var question = confirm("¿Esta seguro que desea realizar esta reserva?");
            if (question) {
                $(".loader").toggle(true);
                $.ajax({
                    method: "POST",
                    url: "/Reserva/guardarReserva",
                    contentType: "application/json",
                    data: JSON.stringify(o.nuevasReservas),
                    dataType: "text",
                    success: function (response) {
                        $(".loader").toggle(false);
                        var datos = response.split("|");
                        if (datos[0] == "1" && datos[1] == "1") {
                            alert("Se ha realizado la reserva exitosamente!");
                        } else if (datos[0] == "0" && datos[1] == "1") {
                            alert("Se envio correctamente al correo pero no a la base");
                        } else if (datos[1] == "0" && datos[0] == "1") {
                            alert("Se guardo en la base pero no se envio al correo");
                        } else {
                            alert("error!");
                        }
                        location.reload();
                    }
                });
            }
        }

        o.id("volverSelec").onclick = function () {
            o.id("liResumen").parentNode.setAttribute("class", "disabledli");
            o.id("liResumen").style.color = "#A5A5A5";
            o.id("liSeleccion").parentNode.removeAttribute("class");
            o.id("liSeleccion").click();
            o.id("liSeleccion").style.color = "#398CD3";
        }

        o.id("volverInicio").onclick = function () {
            o.id("liSeleccion").parentNode.setAttribute("class", "disabledli");
            o.id("liSeleccion").style.color = "#A5A5A5";
            o.id("liInicio").parentNode.removeAttribute("class");
            o.id("liInicio").click();
            o.id("liInicio").style.color = "#398CD3";
        }

        return o;
    }(rs || {}));

    rs.actualDate();
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
        //se deberia ver las reservas pasadas???? en ese calendar o en otro lado
        validRange: {
            start: rs.getcurrentDatequitDays(1),
            end: '2040-02-20'
        },
        /*loading: function (bool) {
            $(".loader").toggle(bool);
        },*/
        eventOverlap: false,
        selectable: true,
        //editable: false,
        selectConstraint: 'businessHours',
        eventConstraint: 'businessHours',
        businessHours: [],
        select: function (start, end, jsEvent, view) {
            //var allDay = !start.hasTime && !end.hasTime;
            rs.createUpdateNuevoEvento(moment(start).format(), moment(end).format(), "", 99999);
            /*alert(["Event Start date: " + moment(start).format(),
            "Event End date: " + moment(end).format(),
            "AllDay: " + allDay].join("\n"));*/
        },
        eventClick: function (event) {
            console.log(event);
            rs.createUpdateNuevoEvento(event.start._i, event.end._i, event.title, event.id);
            //if(Math.trunc(event.id/100) !== 99999)

            /*
            o.id("tituloR").value = (title != "") ? title.substring(title.indexOf(":") + 2, title.indexOf("\n") - 1) : title;
            o.id("idcue").innerHTML = id;//(id=="actual")?(id + Math.floor((Math.random() * 10) + 1)):id;
            o.id("dinicioR").value = hdinicio[0];
            o.id("dinicioR").onchange();
            o.id("dfinR").value = (title != "") ? hdfin[0] : hdinicio[0];
             o.id("hinicioR").onchange();
                o.id("hfinR").value = hdfin[1].substring(0, 5);

            Math.trunc(o.myevents[j].id / 100) == 99999
            */
        },
        eventDrop: function (event) {
            rs.changelimits(event);
        },
        eventResize: function (event) {
            rs.changelimits(event);
        },
        eventRender: function (event, element) {
            if (event.editable) {
                element.append("<span class='closeon' title='eliminar reserva'>X</span>");
                element.find(".closeon").click(function (e) {
                    var question = confirm("¿Esta seguro que desea eliminar esta reserva?");
                    if (question) {
                        rs.myevents.splice(rs.myevents.findIndex((x) => x.id == event.id), 1)
                        $('#calendar').fullCalendar('removeEvents', event._id);
                    } else {
                        e.stopPropagation();
                    }
                });
            }
        },
        events: []
    });

    rs.myevents = [];
    /*rs.name("fc-prev-button")[0].onclick = function () {
    } parece que no sera necesario*/
    rs.name("fc-next-button")[0].onclick = function () {
        var data = {};
        debugger;
        data.idSala = $("#salaR").val() * 1;
        data.fhinicio = rs.id("hdnfi").value;
        data.fhfin = rs.addDays(data.fhinicio, 28);
        rs.id("hdnfi").value = data.fhfin;
        $(".loader").toggle(true);
        $.ajax({
            method: "POST",
            url: "/Reserva/reservaXsalaEvents",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json",
            success: function (data) {
                debugger;
                $(".loader").toggle(false);
                if (data.length > 0) {
                    var visualEvent = {};
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].estadoReserva != 0) {
                            visualEvent = { id: data[i].idReserva, title: "Titulo: " + data[i].descripcion + " \n Solicitante: " + data[i].UserNameCreator, start: data[i].fhinicio, end: data[i].fhfin, editable: false };
                            rs.myevents.push(visualEvent);
                            $('#calendar').fullCalendar('renderEvent', visualEvent, true);
                        }
                    }
                }
            }
        });
    }

    if (window.cookie.getCookie()["role"] != "Admin") {
        rs.id("paisR").setAttribute("disabled", "disabled");
        var interval = setInterval(function () {
            if (rs.id("pais-profile").innerHTML != "" && rs.id("sede-profile").innerHTML != "") {
            clearInterval(interval);
            rs.id("paisR").value = rs.id("pais-profile").innerHTML;
            rs.id("paisR").onchange();
    }
    }, 0);
    }
    

})();