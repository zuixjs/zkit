'use strict';

zuix.using('component', '//genielabs.github.io/zkit/lib/extensions/animate_css');

var options_no_css = {
    css: false
};

let viewPager;
function init() {
    // load the view-pager controller on this document layout
    zuix.load('//genielabs.github.io/zkit/lib/controllers/view_pager', {
        view: zuix.$.find('main'),
        enablePaging: true,
        verticalLayout: true,
        ready: function() {
            viewPager = this;
            viewPager
                .on('page:change', pageChangeListener)
                .on('gesture:tap', function(e, tp) {
                    tp.cancel();
                });
            // use 'go()' method to route anchors with 'exit-link' class
            zuix.$.find('a.exit-link').each(function() {
                let link = this.attr('href');
                const t = this;
                t.attr('href', null);
                t.on('click', function() {
                    if (t.display() !== 'none') {
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
                viewPager.prev();
                break;
            case 38: // up
                viewPager.prev();
                break;
            case 39: // right
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
