/**
 * zUIx - Gesture Controller
 *
 * @version 1.0.0 (2018-03-11)
 * @author Gene
 *
 */

'use strict';

zuix.controller(function(cp) {
    const SCROLL_MODE_NONE = 0;
    const SCROLL_MODE_HORIZONTAL = 1;
    const SCROLL_MODE_VERTICAL = 2;
    const GESTURE_TAP_TIMEOUT = 750;

    let scrollMode = SCROLL_MODE_NONE;
    let touchPointer = null;
    let ignoreSession = false;
    let passiveMode = true;
    let startGap = -1;
    let currentGesture = null;
    let swipeDirection = null;
    let mouseButtonDown = false;
    let lastTapTime = new Date().getTime();

    // Math.sign Polyfill
    Math.sign = Math.sign || function(x) {
        return ((x>0)-(x<0))||+x;
    };

    cp.init = function() {
        let view = cp.view();
        const options = cp.options();
        options.html = false;
        options.css = false;
        passiveMode = (options.passive !== false && (view.attr('data-o-passive') !== 'false'));
        startGap = (options.startGap || view.attr('data-o-startGap'));
    };

    cp.create = function() {
        // TODO: should use event "capturing" instead of "bubbling"
        cp.view().on('dragstart', {
            handler: function(e) {
                if (!ignoreSession && !passiveMode) {
                    e.preventDefault();
                }
            },
            passive: passiveMode
        }).on('mousedown', {
            handler: function(e) {
                const targetElement = zuix.$(e.target);
                if (e.which === 1 && targetElement.parent('[class*="no-gesture"]').length() === 0 && e.x > startGap) {
                    mouseButtonDown = true;
                    ignoreSession = false;
                    // targetElement.css('touch-action', 'none');
                    // TODO: add 'cp.options().preventDrag'
                    targetElement.get().draggable = false;
                    touchStart(e, e.x, e.y);
                } else ignoreSession = true;
            },
            passive: passiveMode
        }).on('mousemove', {
            handler: function(e) {
                if (!ignoreSession && mouseButtonDown) {
                    touchMove(e, e.x, e.y);
                }
            },
            passive: passiveMode
        }).on('mouseup', function(e) {
            if (e.which === 1 && !ignoreSession) {
                mouseButtonDown = false;
                touchStop(e);
            }
        }).on('touchstart', {
            handler: function(e) {
                const targetElement = zuix.$(e.target);
                if (targetElement.parent('[class*="no-gesture"]').length() === 0 && e.touches[0].clientX > startGap) {
                    ignoreSession = false;
                    // targetElement.css('touch-action', 'none');
                    targetElement.get().draggable = false;
                    touchStart(e, e.touches[0].clientX, e.touches[0].clientY);
                } else ignoreSession = true;
            },
            passive: passiveMode
        }).on('touchmove', {
            handler: function(e) {
                if (!ignoreSession) {
                    touchMove(e, e.touches[0].clientX, e.touches[0].clientY);
                }
            },
            passive: passiveMode
        }).on('touchend', function(e) {
            if (!ignoreSession) {
                touchStop(e);
            }
        });
    };

    function touchStart(e, x, y) {
        let timestamp = new Date().getTime();
        touchPointer = {
            // original event + cancel method
            event: e,
            cancel: function() {
                touchPointer.event.cancelBubble = true;
                if (!passiveMode) {
                    touchPointer.event.preventDefault();
                }
            },
            // initial touch position
            startX: x,
            startY: y,
            startTime: timestamp,
            // relative movement
            shiftX: 0,
            shiftY: 0,
            endTime: 0,
            // relative movement at every step
            stepX: 0,
            stepY: 0,
            stepTime: timestamp,
            // actual position and speed
            velocity: 0,
            x: x,
            y: y,
            scrollIntent: function() {
                switch (scrollMode) {
                    case SCROLL_MODE_HORIZONTAL:
                        return 'horizontal';
                    case SCROLL_MODE_VERTICAL:
                        return 'vertical';
                }
                return false;
            }
        };
        cp.trigger('gesture:touch', touchPointer);
    }
    function touchMove(e, x, y) {
        if (touchPointer != null) {
            touchPointer.event = e;
            touchPointer.x = x;
            touchPointer.y = y;
            touchPointer.shiftX = (x - touchPointer.startX);
            touchPointer.shiftY = (y - touchPointer.startY);
            touchPointer.endTime = new Date().getTime();
            // detect actual gesture
            let gesture = detectGesture();
            if (gesture != null && currentGesture !== false) {
                if (swipeDirection != null && swipeDirection !== touchPointer.direction) {
                    // stop gesture detection if not coherent
                    currentGesture = false;
                    swipeDirection = touchPointer.direction = 'cancel';
                } else {
                    currentGesture = gesture;
                    swipeDirection = touchPointer.direction;
                }
            }
            cp.trigger('gesture:pan', touchPointer);
        }
    }

    function touchStop(e) {
        if (touchPointer != null) {
            touchPointer.event = e;
            if (currentGesture == null) {
                currentGesture = detectGesture();
            }
            if (currentGesture != null && currentGesture !== false) {
                cp.trigger(currentGesture, touchPointer);
            }
        }
        cp.trigger('gesture:release', touchPointer);
        scrollMode = SCROLL_MODE_NONE;
        swipeDirection = null;
        currentGesture = null;
        touchPointer = null;
    }

    function detectGesture() {
        let gesture = null;
        const elapsedTime = touchPointer.endTime-touchPointer.stepTime;
        const l = {x: (touchPointer.shiftX-touchPointer.stepX), y: (touchPointer.shiftY-touchPointer.stepY)};
        const d = Math.sqrt(l.x*l.x+l.y*l.y);
        touchPointer.velocity = (d/elapsedTime);
        const minDistance = 3;
        const angle = Math.atan2(touchPointer.shiftY-touchPointer.stepY, touchPointer.shiftX-touchPointer.stepX) * 180 / Math.PI;
        if ((touchPointer.shiftX) === 0 && (touchPointer.shiftY) === 0 && touchPointer.startTime > lastTapTime+100 && elapsedTime < GESTURE_TAP_TIMEOUT) {
            // gesture TAP
            lastTapTime = new Date().getTime();
            gesture = 'gesture:tap';
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_HORIZONTAL)
            && d > minDistance && ((angle >= 135 && angle <= 180) || (angle >= -180 && angle <= -135))) {
            // gesture swipe RIGHT
            touchPointer.direction = 'left';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_HORIZONTAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_HORIZONTAL)
            && d > minDistance && ((angle >= 0 && angle <= 45) || (angle >= -45 && angle < 0))) {
            // gesture swipe LEFT
            touchPointer.direction = 'right';
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_HORIZONTAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_VERTICAL)
            && d > minDistance && (angle > 45 && angle < 135)) {
            // gesture swipe UP
            touchPointer.direction = 'down';
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_VERTICAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_VERTICAL)
            && d > minDistance && (angle > -135 && angle < -45)) {
            // gesture swipe DOWN
            touchPointer.direction = 'up';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_VERTICAL;
        }
        // reset touch step data
        if (d > minDistance) {
            touchPointer.stepTime = touchPointer.endTime;
            touchPointer.stepX = touchPointer.shiftX;
            touchPointer.stepY = touchPointer.shiftY;
        }
        return gesture;
    }
});
