/**
 * ZUIX - ScrollHelper Controller
 *
 * @version 1.0.1 (2017-06-16)
 * @author Gene
 *
 */

zuix.controller(function(cp) {
    let watchList;
    let watchCallback;
    let scrollEndTs = 0;
    let scrollWidth;
    let scrollHeight;
    let visibleWidth;
    let visibleHeight;

    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function() {
        if (cp.view().get() === document.body) {
            if (cp.options().throttle > 0) {
                window.onscroll = throttle(scrollCheck, cp.options().throttle);
            } else {
                window.onscroll = scrollCheck;
            }
        } else {
            if (cp.options().throttle > 0) {
                cp.view().on('scroll', throttle(scrollCheck, cp.options().throttle));
            } else {
                cp.view().on('scroll', scrollCheck);
            }
        }
        cp.expose('watch', function(filter, callback) {
            setWatchList(filter, callback);
            return cp.context;
        });
        cp.expose('scrollStart', function(duration) {
            if (duration == null) duration = -1;
            scrollTo(0, duration);
            return cp.context;
        }).expose('scrollEnd', function(duration) {
            if (duration == null) duration = -1;
            scrollTo(scrollHeight, duration);
            return cp.context;
        }).expose('scrollTo', function(to, duration) {
            if (duration == null) duration = -1;
            scrollTo(to, duration);
            return cp.context;
        }).expose('size', function() {
            return {width: scrollWidth, height: scrollHeight};
        }).expose('viewport', function() {
            return {width: visibleWidth, height: visibleHeight};
        });
        // TODO: that's a temp hack to force measure at start
        scrollTo(5, -1);
        scrollTo(0, 200);
    };

    const scrollInfo = {
        lastTop: 0,
        timestamp: 0
    };

    function scrollCheck() {
        // TODO: implement code for horizontal scroll as well
        const scrollable = cp.view().get();
        const viewport = scrollable.getBoundingClientRect();
        let scrollLeft;
        let scrollTop;
        scrollLeft = viewport.x;
        scrollTop = viewport.y;
        scrollWidth = viewport.width;
        scrollHeight = viewport.height;
        if (scrollable === document.body) {
            scrollWidth = document.body.offsetWidth;
            scrollHeight = document.body.offsetHeight;
            visibleWidth = document.documentElement.offsetWidth;
            visibleHeight = document.documentElement.offsetHeight;
        } else {
            visibleWidth = scrollable.offsetWidth;
            visibleHeight = scrollable.offsetHeight;
        }

        const now = new Date().getTime();
        const endScroll = scrollHeight-scrollTop-visibleHeight;
        const dy = scrollTop - scrollInfo.lastTop;
        if ((endScroll === 0 || scrollTop === 0)) {
            cp.trigger('scroll:change', {event: scrollTop === 0 ? 'hit-top' : 'hit-bottom', delta: dy});
        } else if (now - scrollInfo.timestamp > 200) {
            scrollInfo.timestamp = now;
            cp.trigger('scroll:change', {event: 'moving', delta: dy});
            scrollInfo.lastTop = scrollTop;
        }

        const visibleClass = 'scroll-helper-visible';
        if (watchList != null && watchCallback != null) {
            watchList.each(function(i, el) {
                const position = this.position();

                let visible = false;
                let tolerance = 0;
                if (el.offsetParent === null) {
                    // not attached yet.
                    return false;
                }
                if (tolerance == null) tolerance = 0;

                const r1 = {
                    left: 0,
                    top: 0,
                    right: visibleWidth,
                    bottom: visibleHeight,
                    width: visibleWidth,
                    height: visibleHeight
                };
                let r2 = el.getBoundingClientRect();
                let parent = el.offsetParent;
                while (parent !== null && parent !== scrollable) {
                    const pr = parent.getBoundingClientRect();
                    r2 = {
                        left: r2.left + pr.left,
                        top: r2.top + pr.top,
                        right: r2.right + pr.left,
                        bottom: r2.bottom + pr.top,
                        width: r2.width,
                        height: r2.height
                    };
                    parent = parent.offsetParent;
                }

                visible = !(r2.left > r1.right-tolerance ||
                    r2.right < r1.left+tolerance ||
                    r2.top > r1.bottom-tolerance ||
                    r2.bottom < r1.top+tolerance);

                position.frame = {
                    dx: (r2.left+(r2.width/2)-r1.left)/r1.width,
                    dy: (r2.top+(r2.height/2)-r1.top)/r1.height
                };
                position.visible = visible;

                if (!visible && this.hasClass(visibleClass)) {
                    this.removeClass(visibleClass);
                    position.event = 'exit';
                } else if (!visible) {
                    position.event = 'off-scroll';
                } else if (visible) {
                    if (!this.hasClass(visibleClass)) {
                        position.event = 'enter';
                        this.addClass(visibleClass);
                    } else position.event = 'scroll';
                } else return;
                watchCallback(this, position);
            });
        }
    }

    function setWatchList(filter, callback) {
        if (filter != null) {
            watchList = cp.view(filter);
            watchCallback = callback;
        } else {
            watchList = null;
            watchCallback = null;
        }
    }

    function scrollTo(to, duration) {
        if (duration === -1) {
            return setScroll(to);
        }
        const currentTs = Date.now();
        if (duration != null) {
            scrollEndTs = currentTs + duration;
        }
        duration = scrollEndTs-currentTs;

        const el = cp.view().get();
        let scrollTop = 0;
        if (el === document.body) {
            scrollTop = (window.pageYOffset !== undefined)
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        } else scrollTop = el.scrollTop;

        const difference = to - scrollTop;
        if (duration <= 0 || difference === 0) {
            setScroll(to);
            return;
        }

        const offset = scrollTop + (difference / duration * 33);
        requestAnimationFrame(function() {
            setScroll(offset);
            scrollTo(to);
        });
    }

    function setScroll(to) {
        const el = cp.view().get();
        if (el === document.body) {
            document.documentElement.scrollTop = to;
            document.body.scrollTop = to;
        } else el.scrollTop = to;
    }

    function throttle(func, limit) {
        let lastFunc = void 0;
        let lastRan = void 0;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

});
