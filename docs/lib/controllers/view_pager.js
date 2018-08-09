/**
 * zUIx - ViewPager Component
 *
 * @version 1.0.4 (2018-06-29)
 * @author Gene
 *
 * @version 1.0.3 (2018-06-26)
 * @author Gene
 *
 * @version 1.0.1 (2018-02-12)
 * @author Gene
 *
 */

'use strict';

zuix.controller(function(cp) {
    const DEFAULT_PAGE_TRANSITION = {duration: 0.3, easing: 'ease'};
    const LAYOUT_HORIZONTAL = 'horizontal';
    const LAYOUT_VERTICAL = 'vertical';
    const SLIDE_DIRECTION_FORWARD = 1;
    const SLIDE_DIRECTION_BACKWARD = -1;
    // state vars
    let currentPage = -1;
    let oldPage = 0;
    let slideTimeout = null;
    let slideIntervalMs = 3000;
    let slideDirection = SLIDE_DIRECTION_FORWARD;
    let updateLayoutTimeout = null;
    let inputCaptured = false;
    // options
    let layoutType = LAYOUT_HORIZONTAL;
    let enableAutoSlide = false;
    let enablePaging = false;
    let holdTouch = false;
    let passiveMode = true;
    let hideOffViewElements = false;
    // status
    let isDragging = false;
    let wasVisible = false;
    // timers
    let componentizeInterval = null;
    let componentizeTimeout = null;
    /** @typedef {ZxQuery} */
    let pageList = null;
    // Create an observer instance to watch for child add/remove
    const domObserver = new MutationObserver(function(a, b) {
        // update child list and re-layout
        pageList = cp.view().children();
        // force update layout by canceling any pending 'componentize' request
        clearInterval(componentizeInterval);
        componentizeInterval = null;
        updateLayout();
    });

    cp.init = function() {
        let options = cp.options();
        let view = cp.view();
        options.html = false;
        options.css = false;
        enablePaging = (options.enablePaging === true || (view.attr('data-o-paging') === 'true'));
        enableAutoSlide = (options.autoSlide === true || (view.attr('data-o-slide') === 'true'));
        passiveMode = (options.passive !== false && (view.attr('data-o-passive') !== 'false'));
        holdTouch = (options.holdTouch === true || (view.attr('data-o-hold') === 'true'));
        if (options.verticalLayout === true || (view.attr('data-o-layout') === LAYOUT_VERTICAL)) {
            layoutType = LAYOUT_VERTICAL;
        }
        if (options.slideInterval != null) {
            slideIntervalMs = options.slideInterval;
        } else if (view.attr('data-o-slide-interval') != null) {
            slideIntervalMs = parseInt(view.attr('data-o-slide-interval'));
        }
        hideOffViewElements = (options.autohide === true || (view.attr('data-o-autohide') === 'true'));
    };

    cp.create = function() {
        // enable absolute positioning for items in this view
        const view = cp.view().css({
            'position': 'relative',
            'overflow': 'hidden'
        });
        // get child items (pages)
        pageList = view.children();
        // loading of images could change elements size, so layout update might be required
        view.find('img').each(function(i, el) {
            this.one('load', updateLayout);
        });
        // re-arrange view on layout changes
        zuix.$(window)
            .on('resize', function() {
                layoutElements(true);
            }).on('orientationchange', function() {
                layoutElements(true);
            });
        // Options for the observer (which mutations to observe)
        const config = {attributes: false, childList: true, subtree: false};
        // Register DOM mutation observer callback
        domObserver.observe(view.get(), config);
        updateLayout();
        // Set starting page
        setPage(0);
        let tapTimeout = null;
        // gestures handling - load gesture_helper controller
        zuix.load('@lib/controllers/gesture_helper', {
            view: view,
            passive: passiveMode,
            startGap: 36,
            on: {
                'gesture:touch': function(e, tp) {
                    inputCaptured = false;
                    stopAutoSlide();
                    dragStart();
                    if (holdTouch) tp.cancel();
                },
                'gesture:release': function(e, tp) {
                    dragStop(tp);
                    resetAutoSlide();
                },
                'gesture:tap': function(e, tp) {
                    if (tapTimeout != null) {
                        clearTimeout(tapTimeout);
                    }
                    tapTimeout = setTimeout(function() {
                        handleTap(e, tp);
                    }, 50);
                },
                'gesture:pan': handlePan,
                'gesture:swipe': handleSwipe
            }
        });
        // public component methods
        cp.expose('page', function(number) {
            if (number == null) {
                return parseInt(currentPage);
            } else setPage(number, DEFAULT_PAGE_TRANSITION);
        }).expose('get', function(number) {
            return pageList.eq(number);
        }).expose('slide', function(activate) {
            if (activate === true) {
                resetAutoSlide();
            } else stopAutoSlide();
        }).expose('layout', function(mode) {
            if (mode == null) {
                return layoutType;
            } else if (mode === LAYOUT_VERTICAL) {
                layoutType = LAYOUT_VERTICAL;
            } else layoutType = LAYOUT_HORIZONTAL;
            updateLayout();
        }).expose('refresh', function() {
            layoutElements(true);
        }).expose('next', next)
            .expose('prev', prev)
            .expose('last', last)
            .expose('first', first);
    };

    cp.destroy = function() {
        if (domObserver != null) {
            domObserver.disconnect();
        }
    };

    function updateLayout() {
        if (updateLayoutTimeout != null) {
            clearTimeout(updateLayoutTimeout);
        }
        updateLayoutTimeout = setTimeout(layoutElements, 250);
    }
    function layoutElements(force) {
        if (!force && (isDragging || componentizeInterval != null)) {
            updateLayout();
            return;
        }
        // init elements
        pageList.each(function(i, el) {
            this.css({
                'position': 'absolute',
                'left': 0,
                'top': 0
            });
        });
        // measure
        const viewSize = getSize(cp.view().get());
        if (viewSize.width === 0 || viewSize.height === 0) {
            if (viewSize.height === 0 && cp.view().position().visible) {
                let maxHeight = 0;
                // guess and set view_pager height
                pageList.each(function (i, el) {
                    let size = getSize(el);
                    if (size.height > maxHeight) {
                        maxHeight = size.height;
                    }
                });
                if (viewSize.height < maxHeight) {
                    cp.view().css('height', maxHeight + 'px');
                }
            }
            // cannot measure view, try again later
            updateLayout();
            return;
        }
        // position elements
        let offset = 0;
        pageList.each(function(i, el) {
            let size = getSize(el);
            if (layoutType === LAYOUT_HORIZONTAL) {
                let centerY = (viewSize.height-size.height)/2;
                if (centerY < 0) centerY = 0; // TODO: centering with negative offset was not working
                transition(this, DEFAULT_PAGE_TRANSITION);
                position(this, offset, centerY);
                offset += size.width;
            } else {
                let centerX = (viewSize.width-size.width)/2;
                if (centerX < 0) centerX = 0; // TODO: centering with negative offset was not working
                transition(this, DEFAULT_PAGE_TRANSITION);
                position(this, centerX, offset);
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
        let isLast = false;
        let page = parseInt(currentPage)+1;
        if (page >= pageList.length()) {
            page = pageList.length()-1;
            isLast = true;
        }
        setPage(page, DEFAULT_PAGE_TRANSITION);
        return !isLast;
    }
    function prev() {
        let isFirst = false;
        let page = parseInt(currentPage)-1;
        if (page < 0) {
            page = 0;
            isFirst = true;
        }
        setPage(page, DEFAULT_PAGE_TRANSITION);
        return !isFirst;
    }
    function first() {
        setPage(0, DEFAULT_PAGE_TRANSITION);
    }
    function last() {
        setPage(pageList.length()-1, DEFAULT_PAGE_TRANSITION);
    }

    function slideNext() {
        setPage(parseInt(currentPage) + slideDirection, DEFAULT_PAGE_TRANSITION);
        resetAutoSlide();
    }

    function resetAutoSlide(timeout) {
        stopAutoSlide();
        if (enableAutoSlide === true) {
            const visible = cp.view().position().visible;
            if (visible) {
                if (!wasVisible) {
                    zuix.componentize(cp.view());
                }
                slideTimeout = setTimeout(slideNext, slideIntervalMs);
            } else {
                slideTimeout = setTimeout(resetAutoSlide, 500);
            }
            wasVisible = visible;
        }
    }
    function stopAutoSlide() {
        if (slideTimeout != null) {
            clearTimeout(slideTimeout);
        }
    }

    function getItemIndexAt(x, y) {
        let focusedPage = 0;
        pageList.each(function(i, el) {
            let data = getData(this);
            focusedPage = i;
            const size = getSize(el);
            const rect = {
                x: data.position.x,
                y: data.position.y,
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
        } else if (n !== currentPage) {
            slideDirection = (currentPage < n) ? SLIDE_DIRECTION_FORWARD : SLIDE_DIRECTION_BACKWARD;
        }
        currentPage = n;
        if (currentPage != oldPage) {
            pageList.eq(currentPage).css('z-index', 1);
            if (oldPage !== -1) {
                pageList.eq(oldPage).css('z-index', 0);
            }
            cp.trigger('page:change', {in: currentPage, out: oldPage});
        }
        const el = pageList.eq(n);
        const data = getData(el);
        const elSize = getSize(el.get());
        const viewSize = getSize(cp.view().get());
        const focusPoint = {
            x: (viewSize.width - elSize.width) / 2 - data.position.x,
            y: (viewSize.height - elSize.height) / 2 - data.position.y
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

        pageList.each(function(i, el) {
            const data = getData(this);
            const frameSpec = getFrameSpec();
            data.dragStart = {
                x: frameSpec.marginLeft + data.position.x,
                y: frameSpec.marginTop + data.position.y
            };
        });

        if (layoutType === LAYOUT_HORIZONTAL) {
            let x = targetPoint.x;
            if (firstData.position.x + targetPoint.x > 0) {
                x = -firstData.position.x;
            } else {
                if (lastData.position.x + lastPage.get().offsetWidth + targetPoint.x < viewSize.width) {
                    x = -spec.marginLeft*2 + viewSize.width - (lastData.position.x + lastPage.get().offsetWidth);
                }
            }
            if (targetPoint.x-x !== 0 && transition != null) {
                transition = {
                    duration: transition.duration,
                    easing: transition.easing
                };
                transition.duration *= (x / targetPoint.x);
                if (transition.duration < 0) transition.duration = 0.15;
            }
            dragShift(x, 0, transition);
        } else {
            let y = targetPoint.y;
            if (firstData.position.y + targetPoint.y > 0) {
                y = -firstData.position.y;
            } else {
                if (lastData.position.y + lastPage.get().offsetHeight + targetPoint.y < viewSize.height) {
                    y = -spec.marginTop*2 + viewSize.height - (lastData.position.y + lastPage.get().offsetHeight);
                }
            }
            if (targetPoint.y-y !== 0 && transition != null) {
                transition = {
                    duration: transition.duration,
                    easing: transition.easing
                };
                transition.duration *= (y / targetPoint.y);
                if (transition.duration < 0) transition.duration = 0.15;
            }
            dragShift(0, y, transition);
        }
    }

    function getSize(el) {
        const rect = el.getBoundingClientRect();
        const width = rect.width || el.offsetWidth;
        const height = el.offsetHeight || rect.height;
        return {width: width, height: height};
    }

    function getData(el) {
        const data = el.get().data = el.get().data || {};
        data.position = data.position || {x: 0, y: 0};
        return data;
    }

    function componentizeStart() {
        if (isLazyContainer()) {
            componentizeStop();
            if (componentizeTimeout != null) {
                clearTimeout(componentizeTimeout);
            }
            if (componentizeInterval != null) {
                clearInterval(componentizeInterval);
            }
            componentizeInterval = setInterval(function() {
                if (hideOffViewElements) {
                    const viewSize = getSize(cp.view().get());
                    pageList.each(function (i, el) {
                        // hide elements if not inside the view_pager
                        const computed = window.getComputedStyle(el, null);
                        const size = {
                            width: parseFloat(computed.width.replace('px', '')),
                            height: parseFloat(computed.height.replace('px', ''))
                        };
                        const x = parseFloat(computed.left.replace('px', ''));
                        const y = parseFloat(computed.top.replace('px', ''));
                        if (size.width > 0 && size.height > 0) {
                            el = zuix.$(el);
                            // check if element is inside the view_pager
                            if (x + size.width < 0 || y + size.height < 0 || x > viewSize.width || y > viewSize.height) {
                                if (el.visibility() !== 'hidden') {
                                    el.visibility('hidden');
                                }
                            } else if (el.visibility() !== 'visible') {
                                el.visibility('visible');
                            }
                        }
                    });
                }
                zuix.componentize(cp.view());
            }, 10);
        }
    }

    function componentizeStop() {
        if (isLazyContainer() && componentizeTimeout == null) {
            clearInterval(componentizeInterval);
        }
    }

    function dragStart() {
        isDragging = true;
        componentizeStart();
        pageList.each(function(i, el) {
            const data = getData(this);
            const frameSpec = getFrameSpec();
            const computed = window.getComputedStyle(el, null);
            data.position.x = parseFloat(computed.left.replace('px', ''));
            data.position.y = parseFloat(computed.top.replace('px', ''));
            this.css('left', data.position.x+'px');
            this.css('top', data.position.y+'px');
            data.dragStart = {x: frameSpec.marginLeft+data.position.x, y: frameSpec.marginTop+data.position.y};
        });
    }

    function getFrameSpec() {
        const spec = {
            w: 0,
            h: 0,
            marginLeft: 0,
            marginTop: 0
        };
        const viewSize = getSize(cp.view().get());
        pageList.each(function(i, el) {
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

    function dragShift(x, y, tr) {
        if (tr != null) {
            componentizeStart();
            componentizeTimeout = setTimeout(function() {
                componentizeTimeout = null;
                componentizeStop();
            }, tr.duration*1000);
            tr = tr.duration+'s '+tr.easing;
        } else if (isLazyContainer()) {
            zuix.componentize(cp.view());
        }
        pageList.each(function(i, el) {
            const data = getData(this);
            transition(this, tr);
            position(this, data.dragStart.x+x, data.dragStart.y+y);
        });
    }

    function dragStop(tp) {
        if (enablePaging && componentizeTimeout == null) {
            setTimeout(function() {
                setPage(currentPage, DEFAULT_PAGE_TRANSITION);
            }, 10);
        }
        if (tp != null) tp.done = true;
        componentizeStop();
        isDragging = false;
    }

    function isLazyContainer() {
        const lazy = cp.view().find('[data-ui-lazyload="true"]').length() > 0;
        return lazy;
    }

    // Gesture handling

    function handlePan(e, tp) {
        if (!tp.scrollIntent() || tp.done) {
            return;
        }
        if (inputCaptured
            || ((tp.direction === 'left' || tp.direction === 'right') && layoutType === LAYOUT_HORIZONTAL)
            || ((tp.direction === 'up' || tp.direction === 'down') && layoutType === LAYOUT_VERTICAL)) {
            // capture click event
            if (!inputCaptured && tp.event.touches == null) {
                cp.view().get().addEventListener('click', function(e) {
                    if (inputCaptured) {
                        inputCaptured = false;
                        e.cancelBubble = true;
                        // TODO: 'preventDefault' should not be used with passive listeners
                        e.preventDefault();
                    }
                    // release mouse click capture
                    cp.view().get().removeEventListener('click', this, true);
                }, true);
            }
            inputCaptured = true;
            tp.cancel();
        }
        const spec = getFrameSpec();
        if (layoutType === LAYOUT_HORIZONTAL && tp.scrollIntent() === 'horizontal') {
            dragShift(tp.shiftX-spec.marginLeft, 0);
        } else if (layoutType === LAYOUT_VERTICAL && tp.scrollIntent() === 'vertical') {
            dragShift(0, tp.shiftY-spec.marginTop);
        }
    }

    function handleTap(e, tp) {
        let vp = cp.view().position();
        let page = getItemIndexAt(tp.x-vp.x, tp.y-vp.y);
        cp.trigger('page:tap', page, tp);
        if (enablePaging) focusPageAt(tp);
    }

    function handleSwipe(e, tp) {
        const decelerateEasing = {
            duration: (1+(1/Math.abs(tp.velocity))),
            easing: 'cubic-bezier(0.1,0.45,0.35,1.1)'
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
        const fastSwipe = (!enablePaging && Math.abs(tp.velocity) > 0.35) || (Math.abs(tp.velocity) > 1.25);
        const ap = {
            x: (tp.velocity * 1000),
            y: (tp.velocity * 1000)
        };
        switch (tp.direction) {
            case 'right':
                if (layoutType === LAYOUT_HORIZONTAL) {
                    if (fastSwipe) fly(tp, ap);
                    else if (enablePaging) prev();
                }
                break;
            case 'left':
                if (layoutType === LAYOUT_HORIZONTAL) {
                    if (fastSwipe) fly(tp, ap);
                    else if (enablePaging) next();
                }
                break;
            case 'down':
                if (layoutType === LAYOUT_VERTICAL) {
                    if (fastSwipe) fly(tp, ap);
                    else if (enablePaging) prev();
                }
                break;
            case 'up':
                if (layoutType === LAYOUT_VERTICAL) {
                    if (fastSwipe) fly(tp, ap);
                    else if (enablePaging) next();
                }
                break;
        }
    }

    function position(el, x, y) {
        const data = getData(el);
        if (!isNaN(x) && !isNaN(y)) {
            data.position = {'x': x, 'y': y};
            el.css({'left': data.position.x+'px', 'top': data.position.y+'px'});
        }
        return data;
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
