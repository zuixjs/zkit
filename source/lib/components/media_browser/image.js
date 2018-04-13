'use strict';

zuix.controller(function(cp) {
    cp.create = function() {
        cp.expose('host', setHost);
        cp.field('full-image').on('load', function() {
            cp.view().find('.loader').hide();
        }).attr('src', cp.field('full').attr('href'));
    };

    function setHost(h) {
        const showTitleBox = cp.field('title').html().length > 0;
        if (showTitleBox) {
            h.on('controls:hide', function() {
                cp.view('.info-box').animateCss('fadeOutUp', {delay: '0.1s'}, function() {
                    this.hide();
                });
            }).on('controls:show', function() {
                cp.view('.info-box').animateCss('fadeInDown').show();
            }).on('page:change', function(e, page) {
                if (mediaBrowser.current() == cp.view().attr('data-index')) {
                    mediaBrowser.showControls();
                }
            });
        } else cp.view('.info-box').hide();
    }
});
