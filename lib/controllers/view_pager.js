"use strict";
// Basic image carousel
zuix.controller(function (cp) {
    var DEFAULT_PAGE_TRANSITION = '0.3s ease';
    var currentPage = -1, oldPage = 0;
    var slideTimeout = null, slideInterval = 3000;
    var LAYOUT_HORIZONTAL = 1, LAYOUT_VERTICAL = 2;
    var SLIDE_DIRECTION_FORWARD = 1, SLIDE_DIRECTION_BACKWARD = -1;
    var slideDirection = SLIDE_DIRECTION_FORWARD;
    // options
    var layoutType = LAYOUT_HORIZONTAL;
    var enableAutoSlide = false;
    var enablePaging = false;
    /** @typedef {ZxQuery} */
    var pageList = null;

    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
        enablePaging = (cp.options().enablePaging === true);
        enableAutoSlide = (cp.options().autoSlide === true);
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
        // gestures handling - load gesture_helper controller
        zuix.load('//genielabs.github.io/zkit/lib/controllers/gesture_helper', {
            view: cp.view(),
            on: {
                'gesture:touch': function (e, tp) {
                    stopAutoSlide();
                    dragStart();
                },
                'gesture:release': function (e, tp) {
                    dragStop(tp);
                    resetAutoSlide();
                },
                'gesture:tap': handleTap,
                'gesture:pan': handlePan,
                'gesture:swipe': handleSwipe
            }
        });
        // public component methods
        cp.expose('page', function (number) {
            if (number == null)
                return currentPage;
            else setPage(number, DEFAULT_PAGE_TRANSITION);
        }).expose('get', function (number) {
            return pageList.eq(number);
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
                'top': 0
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
        var offset = 0;
        pageList.each(function (i, el) {
            var size = getSize(el);
            if (layoutType === LAYOUT_HORIZONTAL) {
                translate(this, offset, 0, '');
                offset += size.width;
            } else {
                translate(this, 0, offset, '');
                offset += size.height;
            }
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
        var page = parseInt(currentPage)+1;
        if (page >= pageList.length())
            page = pageList.length()-1;
        setPage(page, DEFAULT_PAGE_TRANSITION);
    }
    function prev() {
        slideDirection = SLIDE_DIRECTION_BACKWARD;
        var page = parseInt(currentPage)-1;
        if (page < 0)
            page = 0;
        setPage(page, DEFAULT_PAGE_TRANSITION);
    }

    function slideNext() {
        setPage(currentPage+slideDirection, DEFAULT_PAGE_TRANSITION);
        resetAutoSlide();
    }

    function resetAutoSlide() {
        stopAutoSlide();
        if (enableAutoSlide === true)
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
                || (layoutType === LAYOUT_VERTICAL && (rect.y > y || rect.y+rect.h > y))) {
                return false;
            }
        });
        return focusedPage;
    }

    function focusPageAt(tp, transition) {
        var vp = cp.view().position();
        var page = getItemIndexAt(tp.x-vp.x, tp.y-vp.y);
        setPage(page, transition != null ? transition : DEFAULT_PAGE_TRANSITION);
    }

    function setPage(n, transition) {
        oldPage = currentPage;
        if (n < 0) {
            slideDirection = SLIDE_DIRECTION_FORWARD;
            n = 0;
        } else if (n >= pageList.length()) {
            slideDirection = SLIDE_DIRECTION_BACKWARD;
            n = pageList.length() - 1;
        }
        currentPage = n;
        if (currentPage !== oldPage)
            cp.trigger('page:change', { in: currentPage, out: oldPage });
        var el = pageList.eq(n);
        var data = getData(el);
        var elSize = getSize(el.get());
        var viewSize = getSize(cp.view().get());
        var focusPoint = {
            x: (viewSize.width - elSize.width) / 2 - data.transform.translate.x,
            y: (viewSize.height - elSize.height) / 2 - data.transform.translate.y
        };
        flyTo(focusPoint, transition);
        resetAutoSlide();
    }

    function flyTo(targetPoint, transition) {
        var viewSize = getSize(cp.view().get());
        var spec = getFrameSpec();
        var firstData = getData(pageList.eq(0));
        var lastPage = pageList.eq(pageList.length() - 1);
        var lastData = getData(lastPage);
        dragStart();
        if (layoutType === LAYOUT_HORIZONTAL) {
            if (firstData.transform.translate.x + targetPoint.x > 0) {
                targetPoint.x = -firstData.transform.translate.x;
            } else {
                if (lastData.transform.translate.x + lastPage.get().offsetWidth + targetPoint.x < viewSize.width) {
                    targetPoint.x = -spec.marginLeft*2 + viewSize.width - (lastData.transform.translate.x + lastPage.get().offsetWidth);
                }
            }
            dragShift(targetPoint.x, 0, transition);
        } else {
            if (firstData.transform.translate.y + targetPoint.y > 0) {
                targetPoint.y = -firstData.transform.translate.y;
            } else {
                if (lastData.transform.translate.y + lastPage.get().offsetWidth + targetPoint.y < viewSize.width) {
                    targetPoint.y = -spec.marginLeft*2 + viewSize.width - (lastData.transform.translate.x + lastPage.get().offsetWidth);
                }
            }
            dragShift(0, targetPoint.y, transition);
        }
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
            var frameSpec = getFrameSpec();
            data.dragStart = { x: frameSpec.marginLeft+data.transform.translate.x, y: frameSpec.marginTop+data.transform.translate.y };
            if (i == currentPage)
                this.css('z-index', 1);
            else
                this.css('z-index', 0);
        });
    }

    function getFrameSpec() {
        var spec = {
            w: 0,
            h: 0,
            marginLeft: 0,
            marginTop:0
        };
        var viewSize = getSize(cp.view().get());
        pageList.each(function (i,el) {
            var size = getSize(el);
            spec.w += size.width;
            spec.h += size.height;
        });
        if (layoutType === LAYOUT_HORIZONTAL && spec.w < viewSize.width) {
            spec.marginLeft = (viewSize.width - spec.w) / 2;
        } else if (layoutType === LAYOUT_VERTICAL && spec.h < viewSize.height) {
            spec.marginTop = (viewSize.height - spec.h) / 2;
        }
        return spec;
    }

    function dragShift(x, y, transition) {
        pageList.each(function (i,el) {
            var data = getData(this);
            translate(this, data.dragStart.x+x, data.dragStart.y+y, transition);
        });
    }

    function dragStop(tp) {
        if (enablePaging)
            setPage(currentPage, DEFAULT_PAGE_TRANSITION);
        tp.done = true;
    }

    // Gesture handling

    function handlePan(e, tp) {
        if (tp.done)
            return;
        var spec = getFrameSpec();
        if (layoutType === LAYOUT_HORIZONTAL)
            dragShift(tp.shiftX-spec.marginLeft, 0);
        else
            dragShift(0, tp.shiftY-spec.marginTop);
    }

    function handleTap(e, tp) {
        focusPageAt(tp);
        cp.trigger('page:tap', currentPage, tp);
        tp.cancel();
    }

    function handleSwipe(e, tp) {
        var decelerateEasing = '0.75s cubic-bezier(.1, .2, .15, 1.15)';
        var fly = function() {
            if (enablePaging) {
                if (layoutType === LAYOUT_HORIZONTAL) {
                    focusPageAt({
                        x: tp.x - ap.x,
                        y: tp.y
                    }, decelerateEasing);
                } else {
                    focusPageAt({
                        x: tp.x,
                        y: tp.y - ap.y
                    }, decelerateEasing);
                }
            } else {
                flyTo(ap, decelerateEasing);
            }
        };
        var fastSwipe = Math.abs(tp.velocity) > 0.5;
        var ap = {
            x: (tp.velocity * 1000),
            y: (tp.velocity * 1000)
        };
        switch (tp.direction) {
            case 'left':
                if (fastSwipe)
                    fly();
                else if (enablePaging && layoutType === LAYOUT_HORIZONTAL)
                    prev();
                else dragStop(tp);
                break;
            case 'right':
                if (fastSwipe)
                    fly();
                else if (enablePaging && layoutType === LAYOUT_HORIZONTAL)
                    next();
                else dragStop(tp);
                break;
            case 'up':
                if (fastSwipe)
                    fly();
                else if (enablePaging && layoutType === LAYOUT_VERTICAL)
                    prev();
                else dragStop(tp);
                break;
            case 'down':
                if (fastSwipe)
                    fly();
                else if (enablePaging && layoutType === LAYOUT_VERTICAL)
                    next();
                else dragStop(tp);
                break;
        }
        tp.cancel();
        resetAutoSlide();
    }

    // Translate / Animations

    function translate(el, x, y, t) {
        transition(el, t);
        var data = getData(el);
        data.transform.translate = { 'x': x, 'y': y };
        var transform = 'translate('+x+'px,'+y+'px)';
        el.css({
            '-webkit-transform': transform,
            '-moz-transform': transform,
            '-ms-transform': transform,
            '-o-transform': transform,
            'transform': transform
        });
    }

    function transition(el, transition) {
        if (transition == null) {
            transition = 'none';
        }
        el.css({
            '-webkit-transition': transition,
            '-moz-transition': transition,
            '-ms-transition': transition,
            '-o-transition': transition,
            'transition': transition
        });
    }

});