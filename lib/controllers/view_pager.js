"use strict";
// Basic image carousel
zuix.controller(function (cp) {
    const DEFAULT_PAGE_TRANSITION = '0.3s ease';
    const LAYOUT_HORIZONTAL = 1;
    const LAYOUT_VERTICAL = 2;
    const SLIDE_DIRECTION_FORWARD = 1;
    const SLIDE_DIRECTION_BACKWARD = -1;
    // state vars
    let currentPage = -1;
    let oldPage = 0;
    let slideTimeout = null;
    let slideInterval = 3000;
    let slideDirection = SLIDE_DIRECTION_FORWARD;
    let updateLayoutTimeout = null;
    // options
    let layoutType = LAYOUT_HORIZONTAL;
    let enableAutoSlide = false;
    let enablePaging = false;
    let holdTouch = false;
    /** @typedef {ZxQuery} */
    let pageList = null;

    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
        enablePaging = (cp.options().enablePaging === true || (cp.view().attr('data-o-paging') === 'true'));
        enableAutoSlide = (cp.options().autoSlide === true || (cp.view().attr('data-o-slide') === 'true'));
        holdTouch = (cp.options().holdTouch === true || (cp.view().attr('data-o-hold') === 'true'));
        if (cp.options().verticalLayout === true || (cp.view().attr('data-o-layout') === 'vertical'))
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
                    if (holdTouch)
                        tp.cancel();
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
            });
        });
        // measure
        const viewSize = getSize(cp.view().get());
        if (viewSize.width === 0 || viewSize.height === 0) {
            // cannot measure view, try again later
            updateLayout();
            return;
        }
        // position elements
        let offset = 0;
        pageList.each(function (i, el) {
            let size = getSize(el);
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
        let page = parseInt(currentPage)+1;
        if (page >= pageList.length())
            page = pageList.length()-1;
        setPage(page, DEFAULT_PAGE_TRANSITION);
    }
    function prev() {
        slideDirection = SLIDE_DIRECTION_BACKWARD;
        let page = parseInt(currentPage)-1;
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
        let focusedPage = 0;
        pageList.each(function (i,el) {
            let data = getData(this);
            focusedPage = i;
            const size = getSize(el);
            const rect = {
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
        let vp = cp.view().position();
        let page = getItemIndexAt(tp.x-vp.x, tp.y-vp.y);
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
        const el = pageList.eq(n);
        const data = getData(el);
        const elSize = getSize(el.get());
        const viewSize = getSize(cp.view().get());
        const focusPoint = {
            x: (viewSize.width - elSize.width) / 2 - data.transform.translate.x,
            y: (viewSize.height - elSize.height) / 2 - data.transform.translate.y
        };
        flyTo(focusPoint, transition);
        resetAutoSlide();
    }

    function flyTo(targetPoint, transition) {
        const viewSize = getSize(cp.view().get());
        const spec = getFrameSpec();
        const firstData = getData(pageList.eq(0));
        const lastPage = pageList.eq(pageList.length() - 1);
        const lastData = getData(lastPage);
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
                if (lastData.transform.translate.y + lastPage.get().offsetHeight + targetPoint.y < viewSize.height) {
                    targetPoint.y = -spec.marginTop*2 + viewSize.height - (lastData.transform.translate.y + lastPage.get().offsetHeight);
                }
            }
            dragShift(0, targetPoint.y, transition);
        }
    }

    function getSize(el) {
        const width = el.clientWidth || el.getBoundingClientRect().width;
        const height = el.clientHeight || el.getBoundingClientRect().height;
        return { width: width, height: height };
    }

    function getData(el) {
        const data = el.get().data = el.get().data || {};
        const transform = data.transform = data.transform || {};
        transform.translate = transform.translate || { x: 0, y: 0 };
        return data;
    }

    function dragStart() {
        pageList.each(function (i,el) {
            const data = getData(this);
            const frameSpec = getFrameSpec();
            data.dragStart = { x: frameSpec.marginLeft+data.transform.translate.x, y: frameSpec.marginTop+data.transform.translate.y };
            if (i == currentPage)
                this.css('z-index', 1);
            else
                this.css('z-index', 0);
        });
    }

    function getFrameSpec() {
        const spec = {
            w: 0,
            h: 0,
            marginLeft: 0,
            marginTop:0
        };
        const viewSize = getSize(cp.view().get());
        pageList.each(function (i,el) {
            const size = getSize(el);
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
            const data = getData(this);
            translate(this, data.dragStart.x+x, data.dragStart.y+y, transition);
        });
    }

    function dragStop(tp) {
        if (enablePaging)
            setPage(currentPage, DEFAULT_PAGE_TRANSITION);
        if (tp != null) tp.done = true;
    }

    // Gesture handling

    function handlePan(e, tp) {
        if (tp.scrollMode === 0 || tp.done)
            return;
        const spec = getFrameSpec();
        if (layoutType === LAYOUT_HORIZONTAL && tp.scrollMode === 1)
            dragShift(tp.shiftX-spec.marginLeft, 0);
        else if (layoutType === LAYOUT_VERTICAL && tp.scrollMode === 2)
            dragShift(0, tp.shiftY-spec.marginTop);
    }

    function handleTap(e, tp) {
        if (enablePaging) focusPageAt(tp);
        cp.trigger('page:tap', currentPage, tp);
        tp.cancel();
    }

    function handleSwipe(e, tp) {
        const fastSwipe = (!enablePaging && Math.abs(tp.velocity) > 0.1) || Math.abs(tp.velocity) > 1.0;
        const decelerateEasing = (0.5+(1/Math.abs(tp.velocity)))+'s cubic-bezier(.1, .2, .15, 1.15)';
        const ap = {
            x: (tp.velocity * 1000),
            y: (tp.velocity * 1000)
        };
        const fly = function(destination, shift) {
            if (enablePaging) {
                if (layoutType === LAYOUT_HORIZONTAL) {
                    focusPageAt({
                        x: destination.x - shift.x,
                        y: destination.y
                    }, decelerateEasing);
                } else {
                    focusPageAt({
                        x: destination.x,
                        y: destination.y - shift.y
                    }, decelerateEasing);
                }
            } else {
                flyTo(shift, decelerateEasing);
            }
        };
        switch (tp.direction) {
            case 'left':
                if (layoutType === LAYOUT_HORIZONTAL) {
                    if (fastSwipe) fly(tp,ap);
                    else if (enablePaging) prev();
                    else dragStop(tp);
                }
                break;
            case 'right':
                if (layoutType === LAYOUT_HORIZONTAL) {
                    if (fastSwipe) fly(tp,ap);
                    else if (enablePaging) next();
                    else dragStop(tp);
                }
                break;
            case 'up':
                if (layoutType === LAYOUT_VERTICAL) {
                    if (fastSwipe) fly(tp,ap);
                    else if (enablePaging) prev();
                    else dragStop(tp);
                }
                break;
            case 'down':
                if (layoutType === LAYOUT_VERTICAL) {
                    if (fastSwipe) fly(tp,ap);
                    else if (enablePaging) next();
                    else dragStop(tp);
                }
                break;
        }
        //tp.cancel();
        resetAutoSlide();
    }

    // Translate / Animations

    function translate(el, x, y, t) {
        transition(el, t);
        const data = getData(el);
        data.transform.translate = { 'x': x, 'y': y };
        const transform = 'translate('+x+'px,'+y+'px)';
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