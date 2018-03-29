/**
 * ZUIX - Gesture Controller
 *
 * @version 1.0.0 (2018-03-11)
 * @author Gene
 *
 */
"use strict";

zuix.controller(function (cp) {

    var touchPointer = null, ignoreSession = false;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().on('dragstart', function(e) {
            if (!ignoreSession)
                e.preventDefault();
        }).on('mousedown', function (e) {
            var targetElement = zuix.$(e.target);
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
            var targetElement = zuix.$(e.target);
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
            touchPointer.shiftX = (x - touchPointer.startX);
            touchPointer.shiftY = (y - touchPointer.startY);
            touchPointer.endTime = new Date().getTime();
            cp.trigger('gesture:pan', touchPointer);
            var gesture = detectGesture();
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
    var currentGesture = null, swipeDirection = null;
    function touchStop(e) {
        touchPointer.event = e;
        if (currentGesture == null)
            currentGesture = detectGesture();
        if (currentGesture != null && currentGesture !== false)
            cp.trigger(currentGesture, touchPointer);
        else
            cp.trigger('gesture:release', touchPointer);
        swipeDirection = null;
        currentGesture = null;
        touchPointer = null;
    }

    function detectGesture() {
        var gesture = null;
        var elapsedTime = touchPointer.endTime-touchPointer.startTime;
        var l = { x: (touchPointer.shiftX), y: (touchPointer.shiftY) };
        var d = Math.sqrt(l.x*l.x+l.y*l.y);
        touchPointer.velocity = (d/elapsedTime);
        var cx = Math.abs(touchPointer.shiftX)/(Math.abs(touchPointer.shiftY)+1);
        var cy = 1/(cx+1);
        var minDistance = 30;
        if ((touchPointer.shiftX) === 0 && (touchPointer.shiftY) === 0 && elapsedTime < 1000) {
            // gesture TAP
            gesture = 'gesture:tap';
        } else if (d > minDistance && cx > 3 && Math.sign(touchPointer.shiftX-touchPointer.stepX) > 0) {
            // gesture swipe LEFT
            touchPointer.direction = 'left';
            gesture = 'gesture:swipe';
        } else if (d > minDistance && cx > 3 && Math.sign(touchPointer.shiftX-touchPointer.stepX) < 0) {
            // gesture swipe RIGHT
            touchPointer.direction = 'right';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
        } else if (d > minDistance && cy > 0.3 && Math.sign(touchPointer.shiftY-touchPointer.stepY) > 0) {
            // gesture swipe UP
            touchPointer.direction = 'up';
            gesture = 'gesture:swipe';
        } else if (d > minDistance && cy > 0.3 && Math.sign(touchPointer.shiftY-touchPointer.stepY) < 0) {
            // gesture swipe DOWN
            touchPointer.direction = 'down';
            touchPointer.velocity *= -1;
            gesture = 'gesture:swipe';
        }
        return gesture;
    }

});