"use strict";
zuix.controller(function(cp){
    let currentPage = 0;
    let loadProgress = 0;
    let fullView;
    let listView;
    /** @typedef {ZxQuery} */
    let imageList;
    /** @typedef {ZxQuery} */
    let buttonNext;
    /** @typedef {ZxQuery} */
    let buttonPrev;
    /** @typedef {ZxQuery} */
    let buttonClose;

    cp.create = function() {
        cp.view().css({
            'position': 'fixed',
            'left': 0,
            'right': 0,
            'top': 0,
            'bottom': 0,
            'z-index': 20
        }).hide();
        // load Animate CSS extension
        zuix.using('component', '//genielabs.github.io/zkit/lib/extensions/animate_css');
        // Main ViewPager
        zuix.context(cp.field('media'), function () {
            fullView = this
                .on('gesture:tap', toggleControls)
                .on('page:change', function (e, page) {
                    listView.page(page.in);
                });
            buttonPrev = cp.field('nav-prev').on('click', function () {
                fullView.prev();
            });
            buttonNext = cp.field('nav-next').on('click', function () {
                fullView.next();
            });
            buttonClose = cp.field('nav-close').on('click', closeBrowser);
            imageList = cp.field('media')
                .children().each(function (i,el) {
                    let preview = this.find('[data-ui-field="preview"]')
                        .detach().get();
                    cp.field('carousel').append(preview);
                    this.find('[data-ui-field="full"]')
                        .removeClass('hidden');
                });
        });
        // Carousel ViewPager
        zuix.context(cp.field('carousel'), function () {
            listView = this;
            listView
                .on('page:change', pageChanged)
                .on('page:tap', function (e, page) {
                    fullView.page(page);
                });
        });
        // export public component methods
        cp.expose('open', openBrowser)
            .expose('close', closeBrowser)
            .expose('items', setItems)
            .expose('current', setCurrent);
    };

    function setItems(itemList, current) {
        // remove any existing image
        cp.field('media').children().each(function (idx,el) {
            this.detach();
        });
        // initial loading progress state
        loadProgress = 0;
        cp.field('load-progress').html('1%');
        cp.field('progress-container').show();
        // add provided itemList
        zuix.$.each(itemList, function (idx,el) {
            const img = document.createElement('img');
            const wrapperDiv = zuix.$(document.createElement('div'));
            wrapperDiv.css({
                'position': 'relative'
            });
            zuix.$(img)
                .attr({'src': this.url, 'title': this.description })
                .one('load', function () {
                    // update loading progress
                    loadProgress += Math.round(100/itemList.length);
                    if (loadProgress > 100) loadProgress = 100;
                    cp.field('load-progress').html(loadProgress+'%');
                    if (loadProgress === 100) {
                        cp.field('progress-container').animateCss('fadeOutUp', function () {
                            this.hide();
                        });
                    }
                }).css({
                    'position' :'absolute',
                    'margin': 'auto',
                    'top': 0, 'bottom': 0,
                    'left': 0, 'right': 0,
                    'max-width': '100%',
                    'max-height': '100%'
                });
            cp.field('media').append(wrapperDiv.get());
            wrapperDiv.append(img);
        });
        imageList = cp.field('media').children();
        fullView.refresh();
        if (current != null) {
            fullView.page(current);
        }
        return cp.context;
    }

    function pageChanged(e, page) {
        currentPage = page.in;
        listView.get(page.in).children().eq(0).addClass('page-active');
        if (page.out !== -1)
            listView.get(page.out).children().eq(0).removeClass('page-active');
        updateButtons();
    }

    function setCurrent(current) {
        fullView.page(current);
        return cp.context;
    }

    function openBrowser() {
        // hide navigation buttons
        buttonClose.animateCss('bounceInDown', { duration: '1.5s' });
        buttonNext.hide();
        buttonPrev.hide();
        // show the media browser and update buttons
        cp.view().animateCss('zoomIn', { duration: '0.5s' }, function () {
            // refresh ViewPager
            fullView.refresh();
            listView.refresh();
            updateButtons();
        }).show();
        return cp.context;
    }

    function closeBrowser() {
        cp.view().animateCss('zoomOut', { duration: '0.5s' }, function () {
            this.hide();
        }).trigger('close');
        return cp.context;
    }

    function updateButtons() {
        // show navigation buttons as needed no-gesture
        if (currentPage < imageList.length() - 1) {
            if (buttonNext.display() === 'none') {
                buttonNext.animateCss('fadeInRight').show();
            }
        } else {
            if (buttonNext.display() !== 'none') {
                buttonNext.animateCss('fadeOutRight', function () {
                    this.hide();
                });
            }
        }
        if (currentPage > 0 && imageList.length() > 1) {
            if (buttonPrev.display() === 'none') {
                buttonPrev.animateCss('fadeInLeft').show();
            }
        } else {
            if (buttonPrev.display() !== 'none') {
                buttonPrev.animateCss('fadeOutLeft', function () {
                    this.hide();
                });
            }
        }
    }

    function toggleControls(e, tp) {
        const controls = cp.field('controls');
        if (controls.display() !== 'none') {
            buttonPrev.animateCss('fadeOutLeft', function () {
                this.hide();
            });
            buttonNext.animateCss('fadeOutRight', function () {
                this.hide();
            });
            controls.animateCss('fadeOutDown', function () {
                this.hide();
            });
        } else {
            controls.animateCss('fadeInUp').show();
            listView.page(fullView.page());
            updateButtons();
        }
        if (tp != null)
            tp.cancel();
    }
});