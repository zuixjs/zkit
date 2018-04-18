const pauseCapGuy = function(el) {
    el.css('animation-play-state', 'paused');
};
let capGuyAnimationTimeout;
var scroll_opts = {
    ready: function(ctx) {
        this.on('scroll:change', function(e, data) {
            // console.log(data);
            if (data.event === 'hitTop') {
                // TODO: ...
            } else if (data.event === 'hitBottom') {
                // TODO: ...
            }
        }).watch('.watch', function(el, data) {
            el = zuix.$(el);
            //if (el.hasClass('animated'))
            //    return;

            if (data.event === 'enter') {
                // TODO: ...
            } else if (data.event === 'exit') {
                // TODO: ...
            } else if (data.event === 'scroll' || data.event === 'off-scroll') {
                const position = el.position();

                // CapGuy walking animation
                if (el.hasClass('sh--capguy')) {
                    const dy = (1 - data.frame.dy);
                    const width = ctx.view().clientWidth;
                    if (dy <= 1.5) {
                        let offsetX = (width*1.5*(dy - 0.2));
                        let offsetY = zuix.field('landscape').position().rect.bottom-position.y+50;
                        offsetY -= el.get().clientHeight;
                        el.css('transform', 'translate(' + offsetX + 'px,' + offsetY + 'px)');
                        el.css('animation-play-state', 'initial');
                        if (capGuyAnimationTimeout != null) {
                            clearTimeout(capGuyAnimationTimeout);
                        }
                        capGuyAnimationTimeout = setTimeout(function(){
                            pauseCapGuy(el);
                        }, 100);
                    }
                    fadeInOut(el, data);
                } else if (el.get().className.indexOf('sh-alpha--') > -1) {
                    // TODO:
                    if (data.frame.dy < 0.45 && data.frame.dy >= 0) {
                        el.css('opacity', data.frame.dy/0.5);
                    } else if (el.css('opacity') !== '1') {
                        el.css('opacity', '1');
                    }
                } else if (el.hasClass('sh--follow-landscape')) {
                    const marginTop = parseFloat(el.css('margin-top'))-2;
                    let offsetY = zuix.field('landscape').position().rect.bottom-position.y;
                    if (!isNaN(marginTop)) {
                        offsetY+=marginTop;
                    }
                    el.css('margin-top', offsetY+'px');
                } else if (el.hasClass('sh-parallax') != null) {
                    // Castle Hills parallax animation
                    const dy = data.frame.dy;
                    const stop = parseFloat(el.attr('data-stop'));
                    let translate =
                        - (dy * parseFloat(el.attr('data-translate'))
                            * document.documentElement.offsetHeight);
                    if (!isNaN(stop) && dy < stop) {
                        return;
                    }
                    el.css('transform', 'translateY(' + translate + 'px)');
                    fadeInOut(el, data, 0, 0.1);
                } else if (el.hasClass('sh-fade--in-out')) {
                    if (data.frame.dy >= -0.5 && data.frame.dy <= 1.5) {
                        el.css('transform', 'rotate(' + (360 * data.frame.dy) + 'deg)');
                    }
                } else {
                    // Default "watchable" animation:
                    //     ---> Fade-In enter / Fade-Out exit
                    fadeInOut(el, data);
                }

            }
        }).scrollStart().scrollEnd().scrollStart();
    }
};
zuix.field('arrow-down').on('click', function () {
    zuix.context('scroll-helper').scrollTo(500, 2000);
});
function fadeInOut(el, data, startOffset, endOffset) {
    if (startOffset == null) {
        startOffset = 0.2;
    }
    if (endOffset == null) {
        endOffset = 0.2;
    }
    if (data.frame.dy < startOffset) {
        el.css('opacity', data.frame.dy / startOffset);
    } else if (data.frame.dx < startOffset) {
        el.css('opacity', data.frame.dx / startOffset);
    } else if (data.frame.dy > 1-endOffset) {
        el.css('opacity', (1 - data.frame.dy) / endOffset);
    } else if (data.frame.dx > 1-endOffset) {
        el.css('opacity', (1 - data.frame.dx) / endOffset);
    } else if (parseFloat(el.css('opacity')) !== 1) {
        el.css('opacity', 1);
    }
}
// rotate point around [cx, cy] by given angle
function rotate(cx, cy, x, y, angle) {
    const radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}