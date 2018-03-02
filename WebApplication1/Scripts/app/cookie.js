(function () {//hola
    "use strict";
    var cookie = (function (o) {
        o.getCookie = function () {
            var myCookie = {};
            var mystring = document.cookie;
            var groups = mystring.split(";");
            for (var i = 0; i < groups.length; i++) {
                var idValue = groups[i].split("=");
                myCookie[(idValue[0].replace(" ", ""))] = idValue[1];
            }
            return myCookie;
        };
        return o;
    }(cookie || {}));

    window.cookie = cookie;
})();