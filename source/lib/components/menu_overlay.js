'use strict';

zuix.controller(function(cp) {
    let menuOverlayShowing = false;
    let menuButtonShowing = true;
    let menuButton;
    let menuButtonClose;
    let menuOverlay;
    let itemsWrapper;
    let menuItems;
    let scroller = null;
    let currentOffset = 0;

    cp.create = function() {
        menuButton = cp.field('menu_button').hide()
            .on('click', toggleMenu);
        menuButtonClose = cp.field('menu_button_close').hide()
            .on('click', toggleMenu);
        menuOverlay = cp.field('menu_overlay').visibility('hidden')
            .on('click', toggleMenu);
        itemsWrapper = cp.field('items_wrapper');

        const items = zuix.$(cp.model().items).children();
        items.each(function(i, el) {
            const wrapperDiv = zuix.$(document.createElement('div'))
                .addClass('menu-item')
                .attr('data-ui-transition-delay', (.3/(items.length()-i))+'s')
                .append(el.observableTarget || el);
            itemsWrapper.append(wrapperDiv.get());
        });
        menuItems = itemsWrapper.find('div[class*="menu-item"]');

        // apply custom color to menu button
        if (cp.view().attr('data-o-button-color') != null) {
            cp.view().find('.circle-button').css('background', cp.view().attr('data-o-button-color'));
        }
        if (cp.view().attr('data-o-icon-color') != null) {
            cp.view().find('.circle-button').css('fill', cp.view().attr('data-o-icon-color'));
        }

        const scrollerName = cp.view().attr('data-o-scroller');
        if (scrollerName != null) {
            scroller = zuix.field(scrollerName);
        } else {
            scroller = zuix.$(window);
        }
        if (scroller != null) {
            scroller.on('scroll', function(e) {
                const scrollTop = scroller.get() === window ? (document.documentElement.scrollTop || document.body.scrollTop) : scroller.get().scrollTop;
                if (menuButtonShowing) {
                    if ((currentOffset - scrollTop) < -2) hideButton();
                } else if (!menuButtonShowing) {
                    if ((currentOffset - scrollTop) > 2) showButton();
                }
                currentOffset = scrollTop;
                if (menuOverlayShowing) {
                    toggleMenu();
                }
            });
        }

        // Animate CSS extension
        zuix.using('component', '@lib/extensions/animate_css', function(res, ctx) {
            // show floating action button
            setTimeout(function() {
                menuButton.animateCss('slideInUp').show();
            }, 1000);
        });
        // Material Design Light integration - DOM upgrade
        if (typeof componentHandler !== 'undefined') {
            componentHandler.upgradeElements(cp.view().get());
        }

        cp.expose('show', function() {
            cp.view().show();
        });
        cp.expose('hide', function() {
            cp.view().hide();
        });
        cp.expose('toggleButton', toggleButton);
        cp.expose('showButton', showButton);
        cp.expose('hideButton', hideButton);
        cp.expose('showing', function() {
            return menuButtonShowing;
        });
    };

    function toggleButton() {
        if (menuButtonShowing) {
            hideButton();
        } else {
            showButton();
        }
    }

    function hideButton() {
        menuButtonShowing = false;
        menuButton.animateCss('fadeOutDown', {duration: '0.3s'}, function() {
            this.hide();
        });
        cp.trigger('hide');
    }

    function showButton() {
        menuButtonShowing = true;
        menuButton.animateCss('fadeInUp').show();
        cp.trigger('show');
    }

    function toggleMenu() {
        if (!menuOverlayShowing) {
            menuOverlayShowing = true;
            cp.trigger('open');
            menuButton.animateCss('rotateOut', {duration: '0.3s'});
            menuButtonClose.animateCss('rotateIn', {duration: '0.3s'}, function() {
                menuButton.hide();
            }).show();
            menuOverlay.animateCss('fadeIn', {duration: '0.5s'}).visibility('');
            menuItems.each(function(p, el) {
                let transitionDelay = '0';
                if (this.attr('data-ui-transition-delay') != null) {
                    transitionDelay = this.attr('data-ui-transition-delay');
                }
                this.animateCss('bounceInRight', {duration: '0.5s', delay: transitionDelay});
            });
        } else if (menuOverlayShowing) {
            menuOverlayShowing = false;
            cp.trigger('close');
            if (menuButtonShowing) {
                menuButtonClose.animateCss('rotateOut', {duration: '0.3s'}, function() {
                    this.hide();
                });
                menuButton.animateCss('rotateIn', {duration: '0.3s'});
            } else {
                menuButtonClose.animateCss('fadeOutDown', {duration: '0.3s'}, function() {
                    this.hide();
                });
            }
            menuOverlay.animateCss('fadeOut', {duration: '0.5s', delay: '0.2s'}, function() {
                this.visibility('hidden');
            });
            menuItems.each(function(p, el) {
                let transitionDelay = '0';
                if (this.attr('data-ui-transition-delay') != null) {
                    transitionDelay = this.attr('data-ui-transition-delay');
                }
                this.animateCss('fadeOutRight', {duration: '0.5s', delay: transitionDelay});
            });
            menuButton.show();
        }
    }
});
