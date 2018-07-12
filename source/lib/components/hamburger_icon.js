zuix.controller(function(cp) {
    let icon;
    cp.create = function() {
        const view = cp.view();
        icon = view.children().eq(0);
        icon.on('click', function() {
            if (icon.hasClass('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        cp.expose('open', openMenu)
          .expose('close', closeMenu);
    };

    function openMenu() {
        icon.addClass('open');
        cp.trigger('menu:open');
    }
    function closeMenu() {
        icon.removeClass('open');
        cp.trigger('menu:close');
    }
});
