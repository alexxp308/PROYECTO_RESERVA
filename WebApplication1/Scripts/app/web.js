$(function () {
    obtenerDatos();
});

function obtenerDatos() {
    var data = {}
    data.UserId = window.cookie.getCookie()["userId"];
    $.ajax({
        method: "POST",
        url: "/Usuarios/getUser",
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "text",
        success: function (response) {
            if (response.length > 0) {
                var data = response.split("|");
                $("#sede-profile").html(data[6]);
                $("#email-profile").html(data[5]);
                $("#nombre-profile").html(data[4]);
                $("#rol-profile").html(data[3]);
                $("#administrador-profile").html(data[8]);
                $("#pais-profile").html(data[9]);
                var nombreSala = data[10];
                var fhinicio = data[11];
                if (data[7] == "True") {
                    document.getElementById("obli").style.display = "block";
                    document.getElementById("cancelardvp").setAttribute("disabled", "disabled");
                    $("#dvPassword").modal("show");
                }
                if (nombreSala != "0")
                {
                    mostrarAlertaWindow(nombreSala, fhinicio);
                } else
                {
                    localStorage.setItem("alert", "0");
                }
            }
        }
    });
}

function mostrarAlertaWindow(nombreSala, fhinicio)
{
    var verifica = setInterval(function ()
    {
        var fhInicio = new Date(fhinicio);
        var actual = new Date();
        var timeDiff = Math.abs(fhInicio.getTime() - actual.getTime());
        var diffDays = Math.ceil(timeDiff / (1000));
        if (diffDays < 600)
        {
            clearInterval(verifica);
            if (localStorage.getItem("alert") == null || localStorage.getItem("alert") == "0")
            {
                var myWindow = window.open("", "Reserva proxima", "width=300,height=70")
                var str = "<style>.alert{padding: 20px;background-color: #ff9800;color: white;}</style>";
                str += "<div class='alert'>";
                str += "<strong>Alerta: </strong>Su reserva esta por iniciar.<br />";
                str += "Sala: " + nombreSala + "; Hora: " + fhinicio.substring(11, 16);
                str += "</div>";
                myWindow.document.write(str);
                localStorage.setItem("alert", "1");
            } else
            {
                var div = document.getElementById("divAlert");
                if (div != null)
                {
                    div.style.opacity = "0.00";
                    document.getElementById("roomName").innerHTML = nombreSala;
                    document.getElementById("hourReservation").innerHTML = fhinicio.substring(10, 16);
                    var my = setInterval(function ()
                    {
                        if (div.style.opacity == "1")
                        {
                            clearInterval(my);
                        } else
                        {
                            div.style.opacity = div.style.opacity * 1 + 0.05;
                        }
                    }, 50);
                }
            }
            var iniciarAlert = setInterval(function ()
            {
                clearInterval(iniciarAlert);
                localStorage.setItem("alert", "0");
            }, 610000);

        } else
        {
            localStorage.setItem("alert", "0");
        }
    }, 1000);
}

function quitarAlerta(elem) {
    var div = elem.parentElement;
    div.style.opacity = "0";
    setTimeout(function () { div.style.display = "none"; }, 600);
}

function mostrardvContra() {
    $("#password").val("")
    $("#repeatPassword").val("")
    $("#dvPassword").modal("show");
    document.getElementById("cancelardvp").removeAttribute("disabled");
}

function guardarPassword() {
    if ($("#password").val() != "" && $("#repeatPassword").val() != ""){
        if ($("#password").val() == $("#repeatPassword").val()) {
            if ($("#password").val().length > 5) {
                var data = {};
                data.password = $("#password").val();
                data.UserId = window.cookie.getCookie()["userId"];
                $.ajax({
                    method: "POST",
                    url: "/Usuarios/cambiarContrasenia",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    dataType: "text",
                    success: function (response) {
                        if (response.length * 1 > 0) {
                            alert("contraseña actualizada correctamente");
                            $("#dvPassword").modal("hide");
                        } else {
                            alert("error");
                        }
                    }
                });
            } else {
                alert("la contraseña debe tener por lo menos 6 caracteres")
            }
            
        } else {
            alert("las contraseñas deben coincidir");
        }
    }else{
        alert("debes completar todos los campos");
    }
}