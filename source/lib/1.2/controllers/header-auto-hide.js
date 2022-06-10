/**
 * zUIx - Header Auto Hide (on scroll =))
 *
 * @version 1.2.0 (2022-03-21)
 * @author Gene
 *
 * @version 1.1.0 (2018-07-27)
 * @author Gene
 *
 * @version 1.0.0 (2018-07-25)
 * @author Gene
 *
 */

'use strict';

function HeaderAutoHide(cp) {
  let headerBar;
  let footerBar;
  let showEnd;
  let headerHeight = 0;
  let footerHeight = 0;
  let autoHideOffset = 0;
  let scrollHelper;

  cp.init = function() {
    cp.options().css = false;
    cp.options().html = false;
  };

  cp.create = function() {
    showEnd = cp.options().showEnd;
    headerBar = cp.options().header;
    const zIndex = cp.options().zIndex || 10;
    if (headerBar) {
      headerBar = zuix.field(headerBar);
    } else {
      throw new Error('Header element not specified.');
    }
    if (headerBar.length() === 0) {
      throw new Error('Header element not found: "' + headerBar + '".');
    }
    const headerStyle = getComputedStyle(headerBar.get());
    addHeaderStyle();
    // footer options parsing
    const footer = cp.options().footer;
    let footerStyle = null;
    if (footer != null) {
      footerBar = zuix.field(footer);
      footerBar.css({position: 'fixed', zIndex});
      footerStyle = getComputedStyle(footerBar.get());
      addFooterStyle();
    }
    const scrollerParent = cp.options().scrollHost || cp.view();
    zuix.load('@lib/controllers/scroll-helper', {
      view: scrollerParent,
      on: {
        'scroll:change': function(e, data) {
          headerHeight = parseFloat(headerStyle.height);
          if (headerStyle.position !== 'fixed' && headerStyle.position !== 'absolute') {
            autoHideOffset = headerHeight;
          }
          document.documentElement.style.setProperty('--header-height', -headerHeight+'px');
          if (footerStyle) {
            footerHeight = parseFloat(footerStyle.height);
            document.documentElement.style.setProperty('--footer-height', -footerHeight+'px');
          }
          if (data.event === 'scroll' && data.info.viewport.y < -autoHideOffset) {
            if (data.info.shift.y < -4) {
              // scrolling up
              if (autoHideOffset > 0 && headerBar.css('position') !== 'fixed') {
                scrollerParent.css({paddingTop: headerHeight + 'px'});
                headerBar.hide().css({position: 'fixed', zIndex});
              }
              hideBars();
            } else if (data.info.shift.y > 4) {
              // scrolling down
              headerBar.show();
              showBars();
            }
          } else if (data.event === 'hit-bottom' && showEnd) {
            headerBar.show();
            showBars();
          } else if (autoHideOffset > 0 && data.info.viewport.y === 0) {
            scrollerParent.css({paddingTop: null});
            headerBar.show().css({position: null, zIndex: null});
          }
          cp.trigger('page:scroll', data);
        }
      },
      ready: function(ctx) {
        scrollHelper = ctx;
        cp.expose('scroll', {get: function() {
          return scrollHelper;
        }});
        cp.trigger('scroll:ready', scrollHelper);
      }
    });
    cp.expose('show', showBars);
    cp.expose('hide', hideBars);
  };

  function showBars() {
    if (headerBar != null && headerBar.hasClass('header-collapse')) {
      headerBar.removeClass('header-collapse')
          .addClass('header-expand');
    }
    if (footerBar != null && footerBar.hasClass('footer-collapse')) {
      footerBar.removeClass('footer-collapse')
          .addClass('footer-expand');
    }
    if (scrollHelper) {
      scrollHelper.check();
    }
  }

  function hideBars() {
    if (!headerBar.hasClass('header-collapse')) {
      headerBar.removeClass('header-expand')
          .addClass('header-collapse');
    }
    if (footerBar != null && !footerBar.hasClass('footer-collapse')) {
      footerBar.removeClass('footer-expand')
          .addClass('footer-collapse');
    }
  }

  function addHeaderStyle() {
    zuix.$.appendCss(`
/* Header bar shrink/expand */
@keyframes header-collapse-anim {
  from { top: 0; }
  to { top: var(--header-height); }
}
@keyframes header-expand-anim {
  from { top: var(--header-height); }
  to { top: 0; }
}
.header-collapse {
  animation-fill-mode: forwards;
  animation-name: header-collapse-anim;
  animation-duration: 0.5s;
  top: var(--header-height);
}
.header-expand {
  animation-fill-mode: forwards;
  animation-name: header-expand-anim;
  animation-duration: 0.5s;
  top: 0px;
}
`, null, 'zkit_header_auto_hide');
  }
  function addFooterStyle() {
    zuix.$.appendCss(`
/* Footer bar shrink/expand */
@keyframes footer-collapse-anim {
  from { bottom: 0; }
  to { bottom: var(--footer-height); }
}
@keyframes footer-expand-anim {
  from { bottom: var(--footer-height); }
  to { bottom: 0; }
}
.footer-collapse {
  animation-fill-mode: forwards;
  animation-name: footer-collapse-anim;
  animation-duration: 0.5s;
  bottom: var(--footer-height);
}
.footer-expand {
  animation-fill-mode: forwards;
  animation-name: footer-expand-anim;
  animation-duration: 0.5s;
  bottom: 0;
}
`, null, 'zkit_header_auto_hide');
  }
}

module.exports = HeaderAutoHide;
