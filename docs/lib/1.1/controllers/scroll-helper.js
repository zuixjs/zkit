/**
 * ScrollHelper Controller class.
 *
 * @version 1.1.0 (2018-04-22)
 * @author Gene
 *
 * @version 1.0.1 (2017-06-16)
 * @author Gene
 *
 * @constructor
 * @this {ContextController}
 */
function ScrollHelper() {
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
  let updateTimeout;
  let watchList;
  let watchCallback;
  let scrollToEndTs = 0;
  let frameSkipTs;

  const cp = this;
  cp.init = onInit;
  cp.create = onCreate;

  function onInit() {
    cp.options().html = false;
    cp.options().css = false;
  }

  function onCreate() {
    if (cp.view().get() === document.body) {
      if (cp.options().throttle > 0) {
        window.onscroll = throttle(scrollCheck, cp.options().throttle);
      } else {
        window.onscroll = scrollCheck;
      }
    } else {
      if (cp.options().throttle > 0) {
        cp.view().on('scroll', {
          handler: throttle(scrollCheck, cp.options().throttle),
          passive: true
        });
      } else {
        cp.view().on('scroll', {
          handler: scrollCheck,
          passive: true
        });
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
    }).expose('check', scrollCheck);
    // TODO: that's a temp hack to force measure at start
    //scrollTo(5, -1);
    //scrollTo(0, 200);
  }

  function scrollCheck() {
    // TODO: implement code for horizontal scroll as well

    if (updateTimeout != null) {
      clearTimeout(updateTimeout);
    }
    const now = new Date().getTime();
    if (now - scrollInfo.timestamp > 100) {
      updateScrollInfo();
    } else {
      updateTimeout = setTimeout(function() {
        updateScrollInfo();
      }, 99);
    }

    if (now < scrollToEndTs && now-frameSkipTs < 66) {
      return;
    }
    frameSkipTs = now;

    const visibleClass = 'scroll-helper-visible';
    if (watchList != null && watchCallback != null) {
      watchList.each(function(i, el) {
        const position = this.position();
        if (!position.visible && this.hasClass(visibleClass)) {
          this.removeClass(visibleClass);
          position.event = 'exit';
        } else if (!position.visible) {
          position.event = 'off-scroll';
        } else if (position.visible) {
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

  function updateScrollInfo() {
    const scrollable = cp.view().get();
    const rect = scrollable.getBoundingClientRect();
    const vp = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y
    };
    vp.y = -cp.view().get().scrollTop || (vp.y ? vp.y : 0);
    vp.height = cp.view().get().scrollHeight || (vp.height ? vp.height : 0);
    scrollInfo.size.width = vp.width;
    scrollInfo.size.height = vp.height;
    if (scrollable === document.body) {
      scrollInfo.size.width = document.body.offsetWidth;
      scrollInfo.size.height = document.body.offsetHeight;
      scrollInfo.viewport.width = document.documentElement.clientWidth || scrollInfo.size.width;
      scrollInfo.viewport.height = document.documentElement.clientHeight || scrollInfo.size.height;
    } else {
      scrollInfo.viewport.width = scrollable.offsetWidth;
      scrollInfo.viewport.height = scrollable.offsetHeight;
    }
    scrollInfo.timestamp = new Date().getTime();
    scrollInfo.shift = {
      x: vp.x - scrollInfo.viewport.x,
      y: vp.y - scrollInfo.viewport.y
    };
    scrollInfo.viewport.x = vp.x;
    scrollInfo.viewport.y = vp.y;
    const endScroll = scrollInfo.size.height+vp.y-scrollInfo.viewport.height;
    if ((endScroll === 0 || vp.y === 0)) {
      cp.trigger('scroll:change', {event: vp.y === 0 ? 'hit-top' : 'hit-bottom', info: scrollInfo});
    } else {
      cp.trigger('scroll:change', {event: 'scroll', info: scrollInfo});
    }
  }

  function scrollTo(to, duration) {
    if (to instanceof Element || to instanceof zuix.$.ZxQuery) {
      to = zuix.$(to).position().y - scrollInfo.viewport.y;
    }
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
      scrollTop = (window.pageYOffset !== undefined) ?
        window.pageYOffset :
        (document.documentElement || document.body.parentNode || document.body).scrollTop;
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

module.exports = ScrollHelper;
