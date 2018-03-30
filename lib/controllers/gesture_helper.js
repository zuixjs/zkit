/**
 * ZUIX - Gesture Controller
 *
 * @version 1.0.0 (2018-03-11)
 * @author Gene
 *
 */
"use strict";

zuix.controller(function (cp) {

    const SCROLL_MODE_NONE = 0, SCROLL_MODE_HORIZONTAL = 1, SCROLL_MODE_VERTICAL = 2;
    let scrollMode = SCROLL_MODE_NONE;
    let touchPointer = null, ignoreSession = false;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().on('dragstart', function(e) {
            if (!ignoreSession)
                e.preventDefault();
        }).on('mousedown', function (e) {
            const targetElement = zuix.$(e.target);
            if (targetElement.parent('[class*="no-gesture"]').length() === 0) {
                ignoreSession = false;
                touchStart(e, e.x, e.y);
            } else ignoreSession = true;
        }).on('mousemove', function (e) {
            if (!ignoreSession)
                touchMove(e, e.x, e.y);
        }).on('mouseup', function (e) {
            if (!ignoreSession)
                touchStop(e);
        }).on('touchstart', function (e) {
            const targetElement = zuix.$(e.target);
            if (targetElement.parent('[class*="no-gesture"]').length() === 0) {
                ignoreSession = false;
                touchStart(e, e.touches[0].clientX, e.touches[0].clientY);
            } else ignoreSession = true;
        }).on('touchmove', function (e) {
            if (!ignoreSession)
                touchMove(e, e.touches[0].clientX, e.touches[0].clientY);
        }).on('touchend', function (e) {
            if (!ignoreSession)
                touchStop(e);
        });
    };

    // Math.sign Polyfill
    Math.sign = Math.sign || function(x) {
        return ((x > 0) - (x < 0)) || +x;
    };

    function touchStart(e, x, y) {
        touchPointer = {
            event: e,
            cancel: function () {
                touchPointer.event.cancelBubble = true;
                touchPointer.event.preventDefault();
            },
            startTime: new Date().getTime(),
            endTime: 0,
            startX: x,
            startY: y,
            shiftX: 0,
            shiftY: 0,
            stepX: 0,
            stepY: 0,
            velocity: 0,
            'x': x,
            'y': y
        };
        cp.trigger('gesture:touch', touchPointer);
    }
    function touchMove(e, x, y) {
        if (touchPointer != null) {
            touchPointer.event = e;
            touchPointer.x = x;
            touchPointer.y = y;
            touchPointer.scrollMode = scrollMode;
            touchPointer.shiftX = (x - touchPointer.startX);
            touchPointer.shiftY = (y - touchPointer.startY);
            touchPointer.endTime = new Date().getTime();
            cp.trigger('gesture:pan', touchPointer);
            let gesture = detectGesture();
            if (gesture != null && currentGesture !== false) {
                if (swipeDirection != null && swipeDirection !== touchPointer.direction) {
                    currentGesture = false;
                    swipeDirection = touchPointer.direction = 'cancel';
                } else {
                    currentGesture = gesture;
                    swipeDirection = touchPointer.direction;
                }
                // reset
                touchPointer.stepX = touchPointer.shiftX;
                touchPointer.stepY = touchPointer.shiftY;
            }
        }
    }
    let currentGesture = null, swipeDirection = null;
    function touchStop(e) {
        touchPointer.event = e;
        if (currentGesture == null)
            currentGesture = detectGesture();
        if (currentGesture != null && currentGesture !== false)
            cp.trigger(currentGesture, touchPointer);
        else
            cp.trigger('gesture:release', touchPointer);
        scrollMode = SCROLL_MODE_NONE;
        swipeDirection = null;
        currentGesture = null;
        touchPointer = null;
    }

    function detectGesture() {
        let gesture = null;
        const elapsedTime = touchPointer.endTime-touchPointer.startTime;
        const l = { x: (touchPointer.shiftX), y: (touchPointer.shiftY) };
        const d = Math.sqrt(l.x*l.x+l.y*l.y);
        touchPointer.velocity = (d/elapsedTime);
        const minDistance = 20;
        const angle = Math.atan2(touchPointer.shiftY, touchPointer.shiftX) * 180 / Math.PI;
        if ((touchPointer.shiftX) === 0 && (touchPointer.shiftY) === 0 && elapsedTime < 1000) {
            // gesture TAP
            gesture = 'gesture:tap';
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_HORIZONTAL)
            && d > minDistance && ((angle >= 135 && angle <= 180) || (angle >= -180 && angle <= -135))) {
            // gesture swipe RIGHT
            touchPointer.direction = 'right';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_HORIZONTAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_HORIZONTAL)
            && d > minDistance && ((angle >= 0 && angle <= 45) || (angle >= -45 && angle < 0))) {
            // gesture swipe LEFT
            touchPointer.direction = 'left';
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_HORIZONTAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_VERTICAL)
            && d > minDistance && (angle > 45 && angle < 135)) {
            // gesture swipe UP
            touchPointer.direction = 'up';
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_VERTICAL;
        } else if ((scrollMode === SCROLL_MODE_NONE || scrollMode === SCROLL_MODE_VERTICAL)
            && d > minDistance && (angle > -135 && angle < -45)) {
            // gesture swipe DOWN
            touchPointer.direction = 'down';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
            scrollMode = SCROLL_MODE_VERTICAL;
        }
        return gesture;
    }

});