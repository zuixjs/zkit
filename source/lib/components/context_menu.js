'use strict';

zuix.controller(function(cp){
    let menu;
    let view;

    cp.create = function() {
        menu = cp.field('menu');
        menu.css('bottom', -(menu.position().rect.height)+'px');
        view = cp.view();
        view.css('opacity', 0)
            .hide()
            .on('click', function() {
                hideMenu();
            })
            .on('keypress', function() {

            });
        zuix.load('@lib/controllers/gesture_helper', {
            view: view,
            on: {
                'gesture:pan': function(e, tp) {
                    if (!menu.hasClass('no-transition')) {
                        menu.addClass('no-transition');
                    }
                    if (tp.shiftY > 0) {
                        menu.css('bottom', -tp.shiftY + 'px');
                    }
                },
                'gesture:release': function(e, tp) {
                    menu.removeClass('no-transition');
                    if (tp.velocity <= 0 && tp.direction === 'up') {
                        menu.css('bottom', 0);
                    } else if (tp.direction === 'down') {
                        hideMenu();
                    }
                }
            }
        });
        cp.expose('show', showMenu);
        cp.expose('hide', hideMenu);
    };

    function showMenu() {
        view.show();
        // animation will not work without this delay =/
        setTimeout(function() {
            view.css('opacity', 1);
            menu.css('bottom', 0);
        }, 100);
    }

    function hideMenu() {
        view.one('transitionend', function() {
                this.hide();
            })
            .css('opacity', 0);
        menu.css('bottom', -(menu.position().rect.height)+'px');
    }
});
