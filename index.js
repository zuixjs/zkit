"use strict";

var options_no_css = {
    css: false
};
var viewPager;

zuix.using('component', '//genielabs.github.io/zkit/lib/extensions/animate_css');

function init() {
    // load the view-pager controller on this document layout
    zuix.load('//genielabs.github.io/zkit/lib/controllers/view_pager', {
        view: zuix.$.find('main'),
        enablePaging: true,
        verticalLayout: true,
        ready: function() {
            viewPager = this;
            viewPager.on('page:change', pageChangeListener);
        }
    });
    // use 'go()' method to route anchors with 'exit-link' class
    zuix.$.find('a.exit-link').each(function () {
        let link = this.attr('href');
        this.attr('href', null);
        this.on('click', function () { go(link); })
    });
}
function go(url) {
    // animate and open link
    zuix.$(document.body).animateCss('fadeOut', { duration: '0.3s' });
    setTimeout(function () { document.location.href = url; }, 250);
}
function pageChangeListener(e, page) {
    zuix.$.find('article').removeClass('page-active');
    const pin = viewPager.get(page.in);
    pin.addClass('page-active');
}
