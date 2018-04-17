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

    cp.init = function() {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function() {
        if (cp.view().get() === document.body) {
            window.onscroll = scrollCheck;
        } else {
            cp.view().on('scroll', scrollCheck);
        }
        cp.expose('watch', function(filter, callback) {
            setWatchList(filter, callback);
            return cp.context;
        });
        cp.expose('scrollStart', function() {
            setScroll(0);
            scrollCheck();
            return cp.context;
        }).expose('scrollEnd', function() {
            setScroll(cp.view().get().scrollHeight);
            scrollCheck();
            return cp.context;
        }).expose('scrollTo', function(to, duration) {
            scrollTo(to, duration);
            scrollCheck();
            return cp.context;
        });
    };

    const scrollInfo = {
        lastTop: 0,
        timestamp: 0
    };

    function scrollCheck() {
        const scrollable = cp.view().get();
        const viewport = scrollable.getBoundingClientRect();
        let scrollTop;
        let scrollLeft;
        let scrollHeight;
        let visibleWidth;
        let visibleHeight;
        scrollTop = viewport.y;
        scrollHeight = viewport.height;
        if (scrollable === document.body) {
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
            cp.trigger('scroll:change', {event: scrollTop === 0 ? 'hitTop' : 'hitBottom', delta: dy});
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
                    r2.left += pr.left;
                    r2.rop += pr.top;
                    r2.right += pr.left;
                    r2.bottom += pr.top;
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

    let scrollEndTs = 0;
    function scrollTo(to, duration) {
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

        if (duration <= 0) {
            setScroll(to);
            return;
        }

        const difference = to - scrollTop;
        setTimeout(function() {
            setScroll(scrollTop + (difference / duration));
            scrollCheck();
            scrollTo(to);
        }, 30);
    }
    function setScroll(to) {
        const el = cp.view().get();
        if (el === document.body) {
            document.documentElement.scrollTop = to;
            document.body.scrollTop = to;
        } else el.scrollTop = to;
    }
});
