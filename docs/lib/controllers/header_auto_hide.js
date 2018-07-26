zuix.controller(function(cp) {
    let headerBar;
    cp.init = function() {
        cp.options().css = false;
        cp.options().html = false;
    };
    cp.create = function() {
        headerBar = cp.options().target || cp.view().attr('data-o-target');
        headerBar = zuix.field(headerBar);
        const h = headerBar.position().rect.height;
        cp.context.style('\n' +
            '/* Header bar shrink/expand */\n' +
            '@keyframes header-collapse-anim {\n' +
            '  from { top: 0; }\n' +
            '  to { top: -'+h+'px; }\n' +
            '}\n' +
            '@keyframes header-expand-anim {\n' +
            '  from { top: -'+h+'px; }\n' +
            '  to { top: 0; }\n' +
            '}\n' +
            '.header-collapse {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: header-collapse-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  top: -'+h+'px;\n' +
            '}\n' +
            '.header-expand {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: header-expand-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  top: 0;\n' +
            '}\n');
        const startTime = new Date().getTime();
        zuix.load('@lib/controllers/scroll_helper', {
            view: cp.view(),
            on: {
                'scroll:change': function(e, data) {
                    if (data.event === 'scroll' && (new Date().getTime()-startTime > 1000)) {
                        if (data.info.shift.y < 0) {
                            // scrolling up
                            hideHeader();
                        } else if (data.info.shift.y > 0) {
                            // scrolling down
                            showHeader();
                        }
                    }
                }
            }
        });
    };
    function showHeader() {
        if (headerBar.hasClass('header-collapse')) {
            headerBar.removeClass('header-collapse')
                .addClass('header-expand');
        }
    }
    function hideHeader() {
        if (!headerBar.hasClass('header-collapse')) {
            headerBar.removeClass('header-expand')
                .addClass('header-collapse');
        }
    }
});
