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

    let youtubeApiCallbacks = [];
    let youtubeApiReady = false;

    cp.create = function() {

        // export public component methods
        cp.expose('open', openBrowser)
            .expose('close', closeBrowser)
            //.expose('items', setItems)
            .expose('youtubeApi', function(callback){
                if (youtubeApiReady) callback();
                else youtubeApiCallbacks.push(callback);
            }).expose('current', setCurrent);

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

        // add youtube API
        // This code loads the IFrame Player API code asynchronously.
        window.onYouTubeIframeAPIReady = function() {
            zuix.$.each(youtubeApiCallbacks, function () {
                this();
            });
            youtubeApiCallbacks = [];
            youtubeApiReady = true;
        };
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = cp.view().find('script').get();
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Main ViewPager
        zuix.context(cp.field('media'), function () {
            fullView = this
                .on('gesture:tap', toggleControls)
                .on('page:change', function (e, page) {
                    listView.page(page.in);
                    cp.trigger('page:change', page);
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
                    let preview = this.find('[data-ui-field="preview"]');
                    if (preview.length() > 0) {
                        cp.field('carousel')
                            .append(preview.detach().get());
                    } else {
                        // TODO: add a button or something if preview thumbnail not specified
                        cp.field('carousel')
                            .append(document.createElement('div'));
                    }
                });
            cp.field('media').children().each(function (i, el) {
                const v = this.get();
                let type = this.attr('data-type');
                if (type == null) type= 'image'; // default type
                this.attr('data-ui-load', cp.context.componentId+'/'+type);
                this.attr('data-index', i);
                zuix.context(v, function () {
                    this.host(cp.view());
                });
            });
            zuix.componentize(cp.field('media'));
            // TODO: should wait for 'componentize' to end
            cp.field('media')
                .removeClass('hidden');
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
        // Keyboard navigation handling
        cp.view().attr('tabindex', 0).get().focus();
        document.onkeydown = function(e) {
            switch (e.keyCode) {
                case 27: // esc
                    closeBrowser();
                    break;
                case 32: // space
                    toggleControls();
                    break;
                case 37: // left
                    fullView.prev();
                    break;
                case 38: // up
                    showControls();
                    break;
                case 39: // right
                    fullView.next();
                    break;
                case 40: // down
                    hideControls();
                    break;
            }
        };
    };

    /*
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
    */

    function pageChanged(e, page) {
        currentPage = page.in;
        listView.get(page.in).children().eq(0).addClass('page-active');
        if (page.out !== -1)
            listView.get(page.out).children().eq(0).removeClass('page-active');
        updateButtons();
    }

    function setCurrent(current) {
        return fullView.page(current);
    }

    function openBrowser() {
        // hide navigation buttons
        buttonClose.animateCss('rotateIn', { duration: '0.75s' });
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
        buttonClose.animateCss('rotateOut', { duration: '0.5s' });
        cp.view().animateCss('zoomOut', { duration: '0.5s', delay: '0.15s' }, function () {
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
        if (buttonClose.display() === 'none')
            buttonClose.animateCss('fadeInDown', { duration: '0.35s', delay:'0.5s' }).show();
    }

    function toggleControls(e, tp) {
        if (tp == null || !zuix.$(tp.event.target).hasClass('capture-touch')) {
            if (cp.field('controls').display() !== 'none') {
                hideControls();
            } else {
                showControls();
            }
            if (tp != null)
                tp.cancel();
        }
    }
    function hideControls() {
        if (cp.field('controls').display() !== 'none') {
            cp.field('controls').animateCss('fadeOutDown', function () {
                this.hide();
            });
            cp.trigger('controls:hide');
        }
        if (buttonPrev.display() !== 'none')
            buttonPrev.animateCss('fadeOutLeft', function () {
                this.hide();
            });
        if (buttonNext.display() !== 'none')
            buttonNext.animateCss('fadeOutRight', function () {
                this.hide();
            });
        if (buttonClose.display() !== 'none')
            buttonClose.animateCss('fadeOutUp', {duration: '0.35s'}, function () {
                this.hide();
            });
    }
    function showControls() {
        if (cp.field('controls').display() === 'none') {
            cp.field('controls').animateCss('fadeInUp').show();
            listView.page(fullView.page());
            cp.trigger('controls:show');
        }
        updateButtons();
    }
});