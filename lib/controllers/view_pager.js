// Basic image carousel
zuix.controller(function (cp) {
    var DEFAULT_PAGE_TRANSITION = '0.3s ease';
    var currentPage = -1, oldPage = 0;
    var slideTimeout = null, slideInterval = 3000;
    var LAYOUT_HORIZONTAL = 1, LAYOUT_VERTICAL = 2;
    var layoutType = LAYOUT_HORIZONTAL;
    var SLIDE_DIRECTION_FORWARD = 1, SLIDE_DIRECTION_BACKWARD = -1;
    var slideDirection = SLIDE_DIRECTION_FORWARD;
    var gestureHelper;
    /** @typedef {ZxQuery} */
    var pageList = null;

    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
        if (cp.options().verticalLayout === true)
            layoutType = LAYOUT_VERTICAL;
        if (cp.options().slideInterval != null)
            slideInterval = cp.options().slideInterval;
    };

    cp.create = function () {
        // enable absolute positioning for items in this view
        cp.view().css({
            'position': 'relative',
            'overflow': 'hidden'
        });
        // get child items (pages)
        pageList = cp.view().children();
        // loading of images could change elements size, so layout update might be required
        cp.view().find('img').each(function (i, el) {
            this.one('load', updateLayout);
        });
        // re-arrange view on layout changes
        zuix.$(window).on('orientationchange', function () {
            updateLayout();
        });
        updateLayout();
        // set starting page
        setPage(0);
        // gestures handling
        zuix.load('//genielabs.github.io/zkit/lib/controllers/gesture_helper', {
            view: cp.view(),
            on: {
                'gesture:touch': function (e, tp) {
                    stopAutoSlide();
                    dragStart();
                },
                'gesture:pan': function (e, tp) {
                    if (layoutType === LAYOUT_HORIZONTAL)
                        dragShift(tp.shiftX, 0);
                    else
                        dragShift(0, tp.shiftY);
                },
                'gesture:release': function (e, tp) {
                    resetAutoSlide();
                    dragStop(tp);
                },
                'gesture:tap': function (e, tp) {
                    focusPageAt(tp);
                    cp.trigger('page:tap', currentPage, tp);
                    tp.cancel();
                },
                'gesture:swipe': function (e, tp) {
                    if (Math.abs(tp.velocity) > 1) {
                        var animationEndHandler = function () {
                            var viewSize = getSize(cp.view().get());
                            setPage(getItemIndexAt(viewSize.width / 2, viewSize.height / 2), DEFAULT_PAGE_TRANSITION);
                        };
                        if (layoutType == LAYOUT_HORIZONTAL)
                            dragShift(tp.velocity * 1200, 0, '0.5s cubic-bezier(0.2,0.5,0.3,1)');
                        else
                            dragShift(0, tp.velocity * 1200, '0.5s cubic-bezier(0.2,0.5,0.3,1)');
                        pageList.eq(0)
                            .one('webkitAnimationEnd', animationEndHandler)
                            .one('oanimationend', animationEndHandler)
                            .one('msAnimationEnd', animationEndHandler)
                            .one('animationend', animationEndHandler)
                            .one('webkitTransitionEnd', animationEndHandler)
                            .one('transitionend', animationEndHandler);
                    } else switch(tp.direction) {
                        case 'left':
                            if (layoutType === LAYOUT_HORIZONTAL)
                                prev();
                            break;
                        case 'right':
                            if (layoutType === LAYOUT_HORIZONTAL)
                                next();
                            break;
                        case 'up':
                            if (layoutType === LAYOUT_VERTICAL)
                                prev();
                            break;
                        case 'down':
                            if (layoutType === LAYOUT_VERTICAL)
                                next();
                            break;
                    }
                    tp.cancel();
                    resetAutoSlide();
                }
            }
        });
        // public component methods
        cp.expose('page', function (number) {
            if (number == null)
                return currentPage;
            else setPage(number, DEFAULT_PAGE_TRANSITION);
        }).expose('slide', function (activate) {
            if (activate === true)
                resetAutoSlide();
            else stopAutoSlide();
        }).expose('layout', function (mode) {
            if (mode == null)
                return layoutType;
            else if (mode === 'vertical')
                layoutType = LAYOUT_VERTICAL;
            else layoutType = LAYOUT_HORIZONTAL;
            updateLayout();
        }).expose('refresh', function () {
            updateLayout();
        }).expose('gesture', function () {
            return gestureHelper;
        }).expose('next', next)
          .expose('prev', prev);
    };

    var updateLayoutTimeout = null;
    function updateLayout() {
        if (updateLayoutTimeout != null)
            clearTimeout(updateLayoutTimeout);
        updateLayoutTimeout = setTimeout(layoutElements, 250);
    }
    function layoutElements() {
        // init elements
        pageList.each(function (i, el) {
            this.css({
                'position': 'absolute',
                'left': 0,
                'top': 0,
                'right': 0,
                'bottom': 0
            }).css('max-width', '100%')
              .css('max-height', '100%');
        });
        // measure
        var viewSize = getSize(cp.view().get());
        if (viewSize.width === 0 || viewSize.height === 0) {
            // cannot measure view, try again later
            updateLayout();
            return;
        }
        // position elements
        pageList.each(function (i, el) {
            var size = getSize(el);
            if (layoutType === LAYOUT_HORIZONTAL)
                translate(this, i * size.width, 0, '');
            else
                translate(this, 0, i * size.height, '');
        });
        // focus to current page
        setPage(currentPage);
        // start automatic slide
        if (pageList.length() > 1) {
            resetAutoSlide();
        }
    }

    function next() {
        slideDirection = SLIDE_DIRECTION_FORWARD;
        var viewSize = getSize(cp.view().get());
        setPage(getItemIndexAt(viewSize.width/2, viewSize.height/2)+1, DEFAULT_PAGE_TRANSITION);
    }
    function prev() {
        slideDirection = SLIDE_DIRECTION_BACKWARD;
        var viewSize = getSize(cp.view().get());
        setPage(getItemIndexAt(viewSize.width/2, viewSize.height/2)-1, DEFAULT_PAGE_TRANSITION);
    }

    function slideNext() {
        setPage(currentPage+slideDirection, DEFAULT_PAGE_TRANSITION);
        resetAutoSlide();
    }

    function resetAutoSlide() {
        stopAutoSlide();
        if (cp.options().autoSlide !== false)
            slideTimeout = setTimeout(slideNext, slideInterval);
    }
    function stopAutoSlide() {
        if (slideTimeout != null)
            clearTimeout(slideTimeout);
    }

    function getItemIndexAt(x, y) {
        var focusedPage = 0;
        pageList.each(function (i,el) {
            var data = getData(this);
            focusedPage = i;
            var size = getSize(el);
            var rect = {
                x: data.transform.translate.x,
                y: data.transform.translate.y,
                w: size.width,
                h: size.height
            };
            if ((layoutType === LAYOUT_HORIZONTAL && (rect.x > x || rect.x+rect.w > x))
                || (layoutType === LAYOUT_VERTICAL && (rect.y > y || rect.y+rect.h > y)))
                return false;
        });
        return parseInt(focusedPage);
    }

    function focusPageAt(tp) {
        var vp = cp.view().position();
        currentPage = getItemIndexAt(tp.x-vp.x, tp.y-vp.y);
        setPage(currentPage, DEFAULT_PAGE_TRANSITION);
    }

    function setPage(n, transition) {
        oldPage = currentPage;
        if (n < 0) {
            slideDirection = SLIDE_DIRECTION_FORWARD;
            n = 0;
        } else if (n >= pageList.length()) {
            slideDirection = SLIDE_DIRECTION_BACKWARD;
            n = pageList.length()-1;
        }
        currentPage = n;
        var el = pageList.eq(n);
        var data = getData(el);
        var elSize = getSize(el.get());
        var viewSize = getSize(cp.view().get());
        dragStart();
        if (layoutType === LAYOUT_HORIZONTAL)
            dragShift((viewSize.width-elSize.width)/2-data.transform.translate.x, -data.transform.translate.y, transition);
        else
            dragShift(-data.transform.translate.x, (viewSize.height-elSize.height)/2-data.transform.translate.y, transition);
        resetAutoSlide();
        if (currentPage !== oldPage)
            cp.trigger('page:change', currentPage);
    }

    function getSize(el) {
        var width = el.clientWidth || el.getBoundingClientRect().width;
        var height = el.clientHeight || el.getBoundingClientRect().height;
        return { width: width, height: height };
    }

    function getData(el) {
        var data = el.get().data = el.get().data || {};
        var transform = data.transform = data.transform || {};
        transform.translate = transform.translate || { x: 0, y: 0 };
        return data;
    }

    function dragStart() {
        pageList.each(function (i,el) {
            var data = getData(this);
            data.dragStart = { x: data.transform.translate.x, y: data.transform.translate.y };
            if (i == currentPage)
                this.css('z-index', 1);
            else
                this.css('z-index', 0);
        });
    }

    function dragShift(x, y, transition) {
        pageList.each(function (i,el) {
            var data = getData(this);
            translate(this, data.dragStart.x+x, data.dragStart.y+y, transition);
        });
    }

    function dragStop(tp) {
        //focusPageAt(tp);
        setPage(currentPage, DEFAULT_PAGE_TRANSITION);
    }

    function translate(el, x, y, t) {
        transition(el, t);
        var data = getData(el);
        data.transform.translate = { 'x': x, 'y': y };
        var translation = 'translate('+x+'px,'+y+'px)';
        el.css({
            '-webkit-transform': translation,
            '-moz-transform': translation,
            '-ms-transform': translation,
            '-o-transform': translation,
            'transform': translation
        });
    }

    function transition(el, transition) {
        el.css({
            '-webkit-transition': transition,
            '-moz-transition': transition,
            '-ms-transition': transition,
            '-o-transition': transition,
            'transition': transition
        });
    }

});