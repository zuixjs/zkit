/**
 * ZUIX - ScrollHelper Controller
 *
 * @version 1.0.1 (2017-06-16)
 * @author Gene
 *
 */

zuix.controller(function(cp) {
    const scrollInfo = {
        timestamp: 0,
        size: {
            width: 0,
            height: 0
        },
        viewport: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        }
    };
    let watchList;
    let watchCallback;
    let scrollToEndTs = 0;

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
            scrollTo(scrollInfo.size.height, duration);
            return cp.context;
        }).expose('scrollTo', function(to, duration) {
            if (duration == null) duration = -1;
            scrollTo(to, duration);
            return cp.context;
        }).expose('info', function() {
            return scrollInfo;
        });
        // TODO: that's a temp hack to force measure at start
        scrollTo(5, -1);
        scrollTo(0, 200);
    };

    function scrollCheck() {
        // TODO: implement code for horizontal scroll as well
        const scrollable = cp.view().get();
        const vp = scrollable.getBoundingClientRect();

        scrollInfo.size.width = vp.width;
        scrollInfo.size.height = vp.height;
        if (scrollable === document.body) {
            scrollInfo.size.width = document.body.offsetWidth;
            scrollInfo.size.height = document.body.offsetHeight;
            scrollInfo.viewport.width = document.documentElement.offsetWidth;
            scrollInfo.viewport.height = document.documentElement.offsetHeight;
        } else {
            scrollInfo.viewport.width = scrollable.offsetWidth;
            scrollInfo.viewport.height = scrollable.offsetHeight;
        }

        const now = new Date().getTime();
        const endScroll = scrollInfo.size.height+vp.y-scrollInfo.viewport.height;
        if ((endScroll === 0 || vp.y === 0)) {
            cp.trigger('scroll:change', {event: vp.y === 0 ? 'hit-top' : 'hit-bottom', info: scrollInfo});
        } else if (now - scrollInfo.timestamp > 200) {
            // TODO: last event might be lost... fix this
            scrollInfo.timestamp = now;
            scrollInfo.shift = {
                x: vp.x - scrollInfo.viewport.x,
                y: vp.y - scrollInfo.viewport.y
            };
            scrollInfo.viewport.x = vp.x;
            scrollInfo.viewport.y = vp.y;
            cp.trigger('scroll:change', {event: 'scroll', info: scrollInfo});
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
                    right: scrollInfo.viewport.width,
                    bottom: scrollInfo.viewport.height,
                    width: scrollInfo.viewport.width,
                    height: scrollInfo.viewport.height
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
            scrollToEndTs = currentTs + duration;
        }
        duration = scrollToEndTs-currentTs;

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
            scrollCheck();
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
