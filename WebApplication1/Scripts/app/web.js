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
                if (data[7] == "True") {
                    document.getElementById("obli").style.display = "block";
                    document.getElementById("cancelardvp").setAttribute("disabled", "disabled");
                    $("#dvPassword").modal("show");
                }
            }
        }
    });
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