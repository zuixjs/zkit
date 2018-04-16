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
        cp.view().on('scroll', scrollCheck);
        cp.expose('watch', function(filter, callback) {
            setWatchList(filter, callback);
            return cp.context;
        });
        cp.expose('scrollStart', function() {
            cp.view().get().scrollTop = 0;
            scrollCheck();
            return cp.context;
        }).expose('scrollEnd', function(){
            cp.view().get().scrollTop = cp.view().get().scrollHeight;
            scrollCheck();
            return cp.context;
        }).expose('scrollTo', function(target){
            scrollTo(target);
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
        let scrollTop;
        let scrollHeight;
        let visibleHeight;

        if (scrollable === document) {
            scrollTop = (window.pageYOffset !== undefined)
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
            scrollHeight = document.body.offsetHeight;
            visibleHeight = document.documentElement.offsetHeight;
        } else {
            scrollTop = scrollable.scrollTop;
            scrollHeight = scrollable.scrollHeight;
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
                    return false;
                }
                if (tolerance == null) tolerance = 0;
                const r1 = (el.offsetParent).getBoundingClientRect();
                const r2 = el.getBoundingClientRect();
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
                    watchCallback(this, position);
                } else if (!visible) {
                    position.event = 'off-scroll';
                    watchCallback(this, position);
                } else if (visible) {
                    if (!this.hasClass(visibleClass)) {
                        position.event = 'enter';
                        this.addClass(visibleClass);
                    } else position.event = 'scroll';
                    watchCallback(this, position);
                }
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

    let scrollEndTs;
    function scrollTo(element, to, duration) {
        const currentTs = Date.now();
        if (duration != null) {
            scrollEndTs = currentTs + duration;
        }
        duration = scrollEndTs-currentTs;

        /*
        const scrollable = cp.view();
        let scrollTop = 0;
        if (scrollable === document) {
            scrollTop = (window.pageYOffset !== undefined)
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        } else {
            scrollTop = scrollable.scrollTop;
        }
        */

        const difference = to - scrollTop;
        if (duration <= 0) {
            setScroll(to);
            return;
        }

        requestAnimationFrame(function() {
            setScroll(scrollTop + (difference / (duration/2)));
            scrollTo(element, to);
        });
    }
    function setScroll(to) {
        if (cp.view().get() === document) {
            document.documentElement.scrollTop = to;
            document.body.scrollTop = to;
        } else element.scrollTop = to;
    }

});
