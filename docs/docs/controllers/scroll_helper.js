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
            switch (data.event) {
                case 'hit-top':
                    // TODO: reached top of the page
                    break;
                case 'scroll':
                    // scrolling...
                    if (zuix.field('btn-go-bottom').hasClass('mdl-button--disabled')) {
                        zuix.field('btn-go-bottom').removeClass('mdl-button--disabled');
                    }
                    break;
                case 'hit-bottom':
                    // reached end of the page
                    zuix.field('btn-go-bottom').addClass('mdl-button--disabled');
                    showMenu();
                    break;
            }
        }).watch('.watch', function(el, data) {
            if (data.event === 'scroll' || data.event === 'off-scroll') {
                el = zuix.$(el);
                playStoryBoard(el, data);
            }
        });
        zuix.field('arrow-down').on('click', function() {
            const viewport = scrollHelper.info().viewport;
            scrollHelper.scrollTo(viewport.height*1.75, 1500);
        });
        zuix.field('arrow-docs').on('click', function() {
            scrollHelper.scrollTo(zuix.$.find('.sh-usage-anchor'), 500);
            showMenu();
        });
    }
};

let scrollDirection = 1;
function playStoryBoard(el, data) {
    let dy = data.frame.dy;
    if (el.hasClass('sh--capguy')) {
        // CapGuy walking animation
        const position = el.position();
        const availableWidth = scrollHelper.info().viewport.width;
        dy = (1 - dy);
        if (dy <= 1.5) {
            let offsetX = (availableWidth*1.5*(dy - 0.2));
            let offsetY = zuix.field('landscape').position().rect.bottom-position.y+50;
            offsetY -= el.get().clientHeight;
            let transform = 'translate(' + offsetX + 'px,' + offsetY + 'px)';
            let changedDirection = false;
            if (guyLastPosition > dy) {
                changedDirection = scrollDirection > 0;
                scrollDirection = -1;
                transform = 'scaleX(-1) translate(' + (-offsetX) + 'px,' + offsetY + 'px)';
            } else {
                changedDirection = scrollDirection < 0;
                scrollDirection = 1;
            }
            guyLastPosition = dy;
            if (changedDirection) {
                el.css('transition', 'none');
            } else el.css('transition', '');
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
        if (dy < 1.2 && dy > 0.4) {
            const scale = dy / 0.4;
            el.css('transform', 'scale('+scale+')');
        }
        fadeInOut(el, data);
    } else if (el.hasClass('sh-usage-anchor')) {
        // show/hide header-menu when below/above the 'Usage' title
        if (dy <= 0) {
            if (scrollHelper.info().shift.y >= 0) {
                showMenu();
            } else {
                hideMenu();
            }
        } else {
            hideMenu();
        }
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

function showMenu() {
    const menu = zuix.field('header-menu');
    if (menu.hasClass('hidden')) {
        menu.removeClass('hidden')
            .animateCss('fadeInDown').show();
    }
}

function hideMenu() {
    const menu = zuix.field('header-menu');
    if (!menu.hasClass('hidden') && !menu.hasClass('animated')) {
        menu.animateCss('fadeOutUp', function() {
            this.addClass('hidden');
        });
    }
}
