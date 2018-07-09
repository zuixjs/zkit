/**
 * zUIx - Drawer Layout
 *
 * @version 1.0.0 (2018-07-09)
 * @author Gene
 *
 */

'use strict';

zuix.controller(function(cp) {
    let isDrawerOpen = true;
    let isDrawerLocked = false;
    let smallScreen = false;
    let firstCheck = true;

    let overlay = null;
    let drawerLayout = null;

    let drawerWidth = 280;
    let autoHideWidth = 960;

    cp.init = function() {
        this.options().html = false;
        this.options().css = false;
        if (!isNaN(this.options().drawerWidth)) {
            drawerWidth = parseInt(this.options().drawerWidth);
        }
        if (!isNaN(this.options().autoHideWidth)) {
            autoHideWidth = parseInt(this.options().autoHideWidth);
        }
    };

    cp.create = function() {
        drawerLayout = cp.view();
        // add overlay for small screens when menu is open
        overlay = zuix.$(document.createElement('div'));
        overlay.css({
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'bottom': 0,
            'right': 0,
            'z-index': 10,
            'background-color': 'rgba(0, 0, 0, 0.5)'
        }).on('click', function() {
            closeDrawer();
        }).hide();
        drawerLayout.parent().append(overlay.get());

        // set drawer style
        drawerLayout.css({
            'position': 'fixed',
            'overflow-y': 'auto',
            'left': 0, 'width': '320px', 'top': 0, 'bottom': 0,
            'z-index': 100,
            '-webkit-box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)',
            '-moz-box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)',
            'box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)'
        }).attr('tabindex', 0);

        let isDragging = false;
        // handle gesture to open/close the drawer menu
        zuix.load('@lib/controllers/gesture_helper', {
            view: document.documentElement,
            on: {
                'gesture:touch': function(e, tp) {
                    if (isDrawerLocked) return;
                    transitionOn();
                },
                'gesture:release': function(e, tp) {
                    if (isDrawerLocked) return;
                    if (isDragging) {
                        isDragging = false;
                        transitionOn();
                        if (tp.velocity > 0) {
                            openDrawer();
                        } else {
                            closeDrawer();
                        }
                    }
                },
                'gesture:pan': function(e, tp) {
                    if (isDrawerLocked) return;
                    if ((isDragging || isDrawerOpen) && tp.x < drawerWidth || (!isDragging && tp.x < 50)) {
                        if (!isDragging) {
                            isDragging = true;
                        }
                        transitionOn();
                        dragTo(tp.x);
                        transitionOff();
                    }
                }
            }
        });

        // public component methods
        cp.expose('toggle', toggleMenu);
        cp.expose('open', function() {
            transitionOn();
            return openDrawer();
        });
        cp.expose('close', function() {
            transitionOn();
            return closeDrawer();
        });
        cp.expose('isOpen', isOpen);
        // TODO: refactor to 'dragTo'
        cp.expose('dragTo', dragTo);
        cp.expose('lock', function(locked) {
            isDrawerLocked = locked;
        });

        // close drawer if ESC key is pressed
        drawerLayout.on('keydown', function(evt) {
            evt = evt || window.event;
            if (evt.keyCode === 27) {
                closeDrawer();
            }
        });

        // TODO: create cp.options().drawerWidth, with '280' as default value
        drawerWidth = 320; //drawerLayout.get().offsetWidth;

        // detect screen size and set large/small layout
        sizeCheck();
        firstCheck = false;

        // listen to window resize event to make layout responsive
        window.addEventListener('resize', function() {
            sizeCheck();
        });
    };

    function sizeCheck() {
        const width = document.body.clientWidth;
        if (width < autoHideWidth) {
            if (!smallScreen || firstCheck) {
                smallScreen = true;
                cp.trigger('drawer:autoHide', true);
            }
            closeDrawer();
        } else {
            if (smallScreen || firstCheck) {
                if (smallScreen) {
                    overlay.hide();
                    if (isDrawerOpen) {
                        closeDrawer();
                    }
                }
                smallScreen = false;
                cp.trigger('drawer:autoHide', false);
                openDrawer();
            }
        }
    }

    function openDrawer() {
        drawerLayout
            .visibility('initial')
            .css('left', 0)
            .get().focus();
        if (smallScreen) {
            drawerLayout.find('a').one('click', function() {
                closeDrawer();
            });
            overlay.css('opacity', 'initial');
            overlay.show();
        }
        if (!isDrawerOpen) {
            isDrawerOpen = true;
            cp.trigger('drawer:open', {smallScreen: smallScreen});
        }
    }

    function closeDrawer() {
        if (smallScreen) {
            transitionEnd(function() {
                if (!isDrawerOpen) {
                    drawerLayout.visibility('hidden');
                }
            });
            drawerLayout.css('left', -drawerWidth+'px');
            overlay.hide();
            if (isDrawerOpen) {
                isDrawerOpen = false;
                cp.trigger('drawer:close', {smallScreen: smallScreen});
            }
        }
        isDrawerOpen = false;
        drawerLayout.find('a').off('click');
    }

    function toggleMenu() {
        if (isDrawerOpen) {
            closeDrawer();
        } else {
            openDrawer();
        }
    }

    function dragTo(x) {
        if (x > 0 && x < drawerWidth) {
            x = -drawerWidth+x;
            if (drawerLayout.visibility() === 'hidden') {
                drawerLayout.visibility('initial');
            }
            drawerLayout.css('left', x + 'px');
            if (overlay.display() === 'none') {
                overlay.show();
            }
            overlay.css('opacity', (drawerWidth + x) / drawerWidth);
        }
    }

    function isOpen() {
        return isDrawerOpen;
    }

    let isTransitionOn = false;
    function transitionOn() {
        if (!isTransitionOn) {
            isTransitionOn = true;
            const transition = 'ease .15s';
            drawerLayout.css({
                'transition-property': 'left',
                '-webkit-transition': transition,
                '-moz-transition': transition,
                '-ms-transition': transition,
                '-o-transition': transition,
                'transition': transition
            });
            overlay.css({
                'transition-property': 'opacity',
                '-webkit-transition': transition,
                '-moz-transition': transition,
                '-ms-transition': transition,
                '-o-transition': transition,
                'transition': transition
            });
        }
    }
    function transitionOff() {
        if (isTransitionOn) {
            isTransitionOn = false;
            const transition = 'none';
            drawerLayout.css({
                '-webkit-transition': transition,
                '-moz-transition': transition,
                '-ms-transition': transition,
                '-o-transition': transition,
                'transition': transition
            });
            overlay.css({
                '-webkit-transition': transition,
                '-moz-transition': transition,
                '-ms-transition': transition,
                '-o-transition': transition,
                'transition': transition
            });
        }
    }

    function transitionEnd(callback) {
        drawerLayout.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
            callback();
        });
    }
});
