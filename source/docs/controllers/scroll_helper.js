const pauseCapGuy = function(el) {
    el.css('animation-play-state', 'paused');
};
let guyAnimationTimeout;
var scroll_opts = {
    ready: function(ctx) {
        this.on('scroll:change', function(e, data) {
            // console.log(data);
            switch (data.event) {
                case 'hitTop':
                    // TODO: reached top of the page
                    break;
                case 'scroll':
                    // TODO: scrolling...
                    break;
                case 'hitBottom':
                    // TODO: reached end of the page
                    break;
            }
        }).watch('.watch', function(el, data) {
            el = zuix.$(el);
            if (data.event === 'scroll' || data.event === 'off-scroll') {

                if (el.hasClass('sh--capguy')) {
                    // CapGuy walking animation
                    const dy = (1 - data.frame.dy);
                    const position = el.position();
                    const availableWidth = ctx.view().clientWidth;
                    if (dy <= 1.5) {
                        let offsetX = (availableWidth*2*(dy - 0.2));
                        let offsetY = zuix.field('landscape').position().rect.bottom-position.y+50;
                        offsetY -= el.get().clientHeight;
                        el.css('transform', 'translate(' + offsetX + 'px,' + offsetY + 'px)');
                        el.css('animation-play-state', 'initial');
                        if (guyAnimationTimeout != null) {
                            clearTimeout(guyAnimationTimeout);
                        }
                        guyAnimationTimeout = setTimeout(function(){
                            pauseCapGuy(el);
                        }, 100);
                    }
                    fadeInOut(el, data);
                } else if (el.hasClass('sh-parallax') != null) {
                    // Castle Hills parallax animation
                    const dy = data.frame.dy;
                    if (dy < 0.001) return;
                    let translate = -(dy * parseFloat(el.attr('data-translate')) * document.documentElement.offsetHeight);
                    el.css('transform', 'translateY(' + translate + 'px)');
                    fadeInOut(el, data, 0, 0.15);
                } else {
                    // Default "watchable" animation:
                    //     ---> Fade-In enter / Fade-Out exit
                    fadeInOut(el, data);
                }

            }
        }).scrollStart().scrollEnd().scrollStart();
    }
};

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
