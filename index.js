'use strict';

zuix.using('component', '@lib/extensions/animate_css');

let viewPager;
let viewPager1;

// use 'var' or 'window.' for options (global object)
var options = {
    no_css: {
        css: false
    },
    no_css_lazy_container: {
        css: false,
        ready: function() {
            // This is the actual way of nesting components:
            // wait for the main component to become ready,
            // while child components are set to lazyLoad, and then,
            // when it become ready call zuix.componentize()
            zuix.$(this.view()).find('[data-ui-lazyload="true"]').each(function(i, el) {
                this.attr('data-ui-lazyload', false);
            });
            zuix.componentize(this.view());
        }
    },
    view_pager_1: {
        enablePaging: true,
        autoSlide: true,
        ready: function() {
            viewPager1 = this;
            const indicator = zuix.$.find('.pager-indicator');
            this.on('page:change', function(e, page) {
                indicator.find('a').eq(parseInt(page.in))
                    .addClass('page-active');
                indicator.find('a').eq(parseInt(page.out))
                    .removeClass('page-active');
            });
        }
    }
};

function init() {
    // load the view-pager controller on this document layout
    zuix.load('@lib/controllers/view_pager', {
        view: zuix.$.find('main'),
        enablePaging: true,
        verticalLayout: true,
        ready: function() {
            viewPager = this;
            viewPager.on('page:change', pageChangeListener);
            // use 'go()' method to route anchors with 'exit-link' class
            zuix.$.find('a.exit-link').each(function() {
                let link = this.attr('href');
                const t = this;
                t.attr('href', null);
                t.on('click', function(e) {
                    if (link != null && t.display() !== 'none') {
                        go(link);
                    }
                });
            });
        }
    });
    // keyboard navigation
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: // left
                if (viewPager.page() === 1 && viewPager1.prev()) {
                    break;
                }
                viewPager.prev();
                break;
            case 38: // up
                viewPager.prev();
                break;
            case 39: // right
                if (viewPager.page() === 1 && viewPager1.next()) {
                    break;
                }
                viewPager.next();
                break;
            case 40: // down
                viewPager.next();
                break;
        }
    };
}
function go(url) {
    // animate and open link
    zuix.$(document.body).animateCss('fadeOut', {duration: '0.3s'}, function() {
        document.location.href = url;
        const t = this.hide();
        setTimeout(function() {
            t.show();
        }, 1000);
    });
}
function pageChangeListener(e, page) {
    zuix.$.find('article').removeClass('page-active');
    viewPager
        .get(page.in)
        .addClass('page-active');
}
