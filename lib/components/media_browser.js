zuix.controller(function(cp){
    var currentPage = 0, loadProgress = 0;
    var viewPager;
    /** @typedef {ZxQuery} */
    var imageList;
    /** @typedef {ZxQuery} */
    var buttonNext;
    /** @typedef {ZxQuery} */
    var buttonPrev;
    /** @typedef {ZxQuery} */
    var buttonClose;

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
        zuix.using('component', 'https://genielabs.github.io/zuix/kit/extensions/animate_css');
        // load view-pager
        zuix.load('https://genielabs.github.io/zuix/kit/controllers/view_pager', {
            view: cp.field('media'),
            ready: function (ctx) {
                viewPager = this.on('gesture:tap', toggleControls);
                buttonPrev = cp.field('nav-prev').on('click', viewPager.prev);
                buttonNext = cp.field('nav-next').on('click', viewPager.next);
                buttonClose = cp.field('nav-close').on('click', closeBrowser);
            },
            autoSlide: false,
            on: {
                'page:change': function (e, page) {
                    currentPage = page;
                    updateButtons();
                }
            }
        });
        // export public component methods
        cp.expose('open', openBrowser)
            .expose('close', closeBrowser)
            .expose('items', setItems)
            .expose('current', setCurrent);
    };

    function setItems(itemList, current) {
        // remove any existing image
        cp.field('media').find('div').each(function (idx,el) {
            this.detach();
        });
        // initial loading progress state
        loadProgress = 0;
        cp.field('load-progress').html('1%');
        cp.field('progress-container').show();
        // add provided itemList
        zuix.$.each(itemList, function (idx,el) {
            var img = document.createElement('img');
            var wrapperDiv = zuix.$(document.createElement('div'));
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
        viewPager.refresh();
        if (current != null) {
            viewPager.page(current);
        }
        return cp.context;
    }

    function setCurrent(current) {
        viewPager.page(current);
        return cp.context;
    }

    function openBrowser() {
        // hide navigation buttons
        buttonClose.animateCss('bounceInUp', { duration: '2s' });
        buttonNext.hide();
        buttonPrev.hide();
        // show the media browser and update buttons
        cp.view().animateCss('zoomIn', function () {
            updateButtons();
        }).show();
        return cp.context;
    }

    function closeBrowser() {
        cp.view().animateCss('zoomOut', function () {
            this.hide();
        }).trigger('close');
        return cp.context;
    }

    function updateButtons() {
        // show navigation buttons as needed
        if (currentPage < imageList.length() - 1) {
            if (buttonNext.display() === 'none') {
                buttonNext.animateCss('rotateIn').show();
            }
        } else {
            if (buttonNext.display() !== 'none') {
                buttonNext.animateCss('rotateOut', function () {
                    this.hide();
                });
            }
        }
        if (currentPage > 0 && imageList.length() > 1) {
            if (buttonPrev.display() === 'none') {
                buttonPrev.animateCss('rotateIn').show();
            }
        } else {
            if (buttonPrev.display() !== 'none') {
                buttonPrev.animateCss('rotateOut', function () {
                    this.hide();
                });
            }
        }
    }

    function toggleControls(e, tp) {
        var controls = cp.field('controls');
        if (controls.display() !== 'none') {
            controls.animateCss('fadeOutDown', function () {
                this.hide();
            });
        } else {
            controls.animateCss('fadeInUp').show();
        }
        if (tp != null)
            tp.cancel();
    }
});