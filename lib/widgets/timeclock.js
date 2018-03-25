zuix.controller(function (cp) {
    var updateTimeout = null;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    cp.create = function () {
        refresh();
    };

    cp.destroy = function () {
        if (updateTimeout != null)
            clearTimeout(updateTimeout);
    };

    function refresh() {
        var now = new Date();
        var day = days[ now.getDay() ];
        var month = months[ now.getMonth() ];
        cp.field('info').html(day);
        cp.field('date').html(month+' '+now.getDate()+', '+now.getFullYear());
        cp.field('time').html(now.toLocaleTimeString());
        updateTimeout = setTimeout(refresh, 1000);
    }
});