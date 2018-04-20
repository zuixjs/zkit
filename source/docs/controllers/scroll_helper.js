const pauseCapGuy = function(el) {
    el.css('animation-play-state', 'paused');
};
let scrollHelper;
let guyAnimationTimeout;
let guyLastPosition = 0;
var scroll_opts = {
    ready: function(ctx) {
        scrollHelper = this;
        this.on('scroll:change', function(e, data) {
            // console.log(data);
            switch (data.event) {
                case 'hit-top':
                    // TODO: reached top of the page
                    break;
                case 'scroll':
                    // TODO: scrolling...
                    break;
                case 'hit-bottom':
                    // TODO: reached end of the page
                    break;
            }
        }).watch('.watch', function(el, data) {
            if (data.event === 'scroll' || data.event === 'off-scroll') {
                el = zuix.$(el);
                playStoryBoard(el, data);
            }
        });
        zuix.field('arrow-down').on('click', function() {
            const viewport = scrollHelper.viewport();
            scrollHelper.scrollTo(viewport.height, 2000);
        });
    }
};

function playStoryBoard(el, data) {
    let dy = data.frame.dy;
    if (el.hasClass('sh--capguy')) {
        // CapGuy walking animation
        const position = el.position();
        const availableWidth = scrollHelper.viewport().width;
        dy = (1 - dy);
        if (dy <= 1.5) {
            let offsetX = (availableWidth*2*(dy - 0.2));
            let offsetY = zuix.field('landscape').position().rect.bottom-position.y+50;
            offsetY -= el.get().clientHeight;
            let transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
            if (guyLastPosition > dy) {
                transform = 'scaleX(-1) translate(' + (-offsetX) + 'px,' + offsetY + 'px)';
            }
            guyLastPosition = dy;
            el.css('transition', 'none');
            el.css('transform', transform);
            el.css('animation-play-state', 'initial');
            if (guyAnimationTimeout != null) {
                clearTimeout(guyAnimationTimeout);
            }
            guyAnimationTimeout = setTimeout(function() {
                pauseCapGuy(el);
            }, 200);
        }
        fadeInOut(el, data);
    } else if (el.hasClass('sh-parallax')) {
        // Castle Hills parallax animation
        if (dy < 0) return;
        const dt = parseFloat(el.attr('data-translate'));
        let translate = -(dy * dt * document.documentElement.offsetHeight);
        el.css('transform-origin', 'center bottom');
        el.css('transform', 'translateY(' + translate + 'px)');
        // TODO: blur effect is likely to cause scroll jumps/glitches
        // blur(el, (dy - dt), -0.25, 0.25);
        fadeInOut(el, data, 0, 0.15);
    } else if (el.hasClass('sh-title')) {
        if (dy < 1.1 && dy > 0.5) {
            const scale = dy / 0.5;
            el.css('transform', 'scale('+scale+')');
        }
        fadeInOut(el, data);
    } else {
        // Default "watchable" animation:
        //     ---> Fade-In enter / Fade-Out exit
        fadeInOut(el, data);
    }
}
/*
function blur(el, dy, startOffset, endOffset) {
    if (dy >= startOffset && dy <= endOffset) {
        const radius = Math.round((endOffset - dy) * 100 / 5);
        el.css('-webkit-filter', 'blur(' + radius + 'px)');
        el.css('filter', 'blur(' + radius + 'px)');
    } else {
        el.css('-webkit-filter', null);
        el.css('filter', null);
    }
}
*/
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
