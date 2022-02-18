function HamburgerIcon(cp) {
  let icon;

  cp.create = function() {
    const view = cp.view();
    icon = view.children().eq(0);
    // Set the icon type
    let type = cp.options().type || view.attr('data-o-type');
    if (type == null) type = 'spin';
    icon.addClass('hamburger--' + type);
    icon.find('.hamburger-inner').addClass(cp.context.contextId);
    // Add CSS rule for custom color (if set)
    const color = cp.options().color || view.attr('data-o-color');
    if (color != null) {
      let cssRule = '.hamburger-inner.%,.hamburger-inner.%::after,.hamburger-inner.%::before'
          .replace(/%/g, cp.context.contextId);
      cssRule += ' {background-color: '+color+' !important;}';
      const sheet = document.createElement('style');
      sheet.innerHTML = cssRule;
      document.body.appendChild(sheet);
    }
    // Set click event handler
    icon.on('click', function() {
      if (icon.hasClass('is-active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    // Public available methods
    cp.expose('open', openMenu)
        .expose('close', closeMenu);
  };

  function openMenu() {
    icon.addClass('is-active');
    cp.trigger('menu:open');
  }
  function closeMenu() {
    icon.removeClass('is-active');
    cp.trigger('menu:close');
  }
}

module.exports = HamburgerIcon;
