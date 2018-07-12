window.menuButtonOptions = {
    on: {
        'menu:open': function() {
            zuix.context('drawer_panel', function() {
                this.open();
            });
        },
        'menu:close': function() {
            zuix.context('drawer_panel', function() {
                this.close();
            });
        }
    }
};

window.drawer_opts = {
    on: {
        'drawer:open': function() {
            zuix.context('menu_hamburger', function() {
                this.open();
            });
        },
        'drawer:close': function() {
            zuix.context('menu_hamburger', function() {
                this.close();
            });
        }
    }
};

let scrollHelper;
window.scroll_opts = {
    ready: function(ctx) {
        scrollHelper = this;
        this.on('scroll:change', function(e, data) {
            switch (data.event) {
                case 'hit-top':
                    // reached top of the page
                    showHeader();
                    break;
                case 'scroll':
                    // show/hide header when scrolling up/down
                    if (data.info.shift.y > 0) {
                        showHeader();
                    } else {
                        hideHeader();
                    }
                    break;
                case 'hit-bottom':
                    // reached end of the page
                    showHeader();
                    break;
            }
        });
    }
};

let headerVisible = true;
function showHeader() {
    if (!headerVisible) {
        headerVisible = true;
        zuix.field('header').animateCss('fadeInDown').show();
    }
}
function hideHeader() {
    if (headerVisible && !zuix.field('header').hasClass('animated')) {
        headerVisible = false;
        zuix.field('header').animateCss('fadeOutUp', function() {
            this.hide();
        });
    }
}
