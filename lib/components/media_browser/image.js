zuix.controller(function (cp) {
    let host;
    cp.create = function () {
        cp.expose('host', setHost);
    };

    function setHost(h) {
        host = h;
        const showTitleBox = cp.field('title').html().length > 0;
        if (showTitleBox) {
            h.on('controls:hide', function () {
                cp.view('.info-box').animateCss('fadeOutUp', { delay: '0.1s' }, function () {
                    this.hide();
                });
            }).on('controls:show', function () {
                cp.view('.info-box').animateCss('fadeInDown').show();
            }).on('page:change', function (e, page) {
                // TODO: ...
            });
        } else cp.view('.info-box').hide();
    }
});