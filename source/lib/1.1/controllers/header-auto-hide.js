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
    showEnd = cp.options().showEnd || cp.view().attr('data-o-show-end') === 'true';
    headerBar = cp.options().header || cp.view().attr('data-o-header');
    if (headerBar) {
      headerBar = zuix.field(headerBar);
    } else {
      throw new Error('Header element not specified.');
    }
    if (headerBar.length() === 0) {
      throw new Error('Header element not found: "' + headerBar + '".');
    }
    headerHeight = headerBar.position().rect.height;
    const hp = getComputedStyle(headerBar.get()).position;
    if (hp !== 'fixed' && hp !== 'absolute') {
      autoHideOffset = headerHeight;
    }
    const scrollerParent = cp.view();
    addHeaderStyle();
    // footer options parsing
    const footer = cp.options().footer || cp.view().attr('data-o-footer');
    if (footer != null) {
      footerBar = zuix.field(footer);
      footerBar.css({position: 'fixed', zIndex: 1});
      footerHeight = footerBar.position().rect.height;
      addFooterStyle();
    }
    zuix.load('@lib/controllers/scroll-helper', {
      view: scrollerParent,
      on: {
        'scroll:change': function(e, data) {
          if (data.event === 'scroll' && data.info.viewport.y < -autoHideOffset) {
            if (data.info.shift.y < -4) {
              // scrolling up
              if (autoHideOffset > 0 && headerBar.css('position') !== 'fixed') {
                scrollerParent.css({paddingTop: headerHeight + 'px'});
                headerBar.hide().css({position: 'fixed', zIndex: 1});
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
    zuix.$.appendCss('\n' +
            '/* Header bar shrink/expand */\n' +
            '@keyframes header-collapse-anim {\n' +
            '  from { top: 0; }\n' +
            '  to { top: -'+headerHeight+'px; }\n' +
            '}\n' +
            '@keyframes header-expand-anim {\n' +
            '  from { top: -'+headerHeight+'px; }\n' +
            '  to { top: 0; }\n' +
            '}\n' +
            '.header-collapse {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: header-collapse-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  top: -'+headerHeight+'px;\n' +
            '}\n' +
            '.header-expand {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: header-expand-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  top: 0px;\n' +
            '}\n', null, 'onscroll_header_hide_show');
  }
  function addFooterStyle() {
    zuix.$.appendCss('\n' +
            '/* Footer bar shrink/expand */\n' +
            '@keyframes footer-collapse-anim {\n' +
            '  from { bottom: 0; }\n' +
            '  to { bottom: -'+footerHeight+'px; }\n' +
            '}\n' +
            '@keyframes footer-expand-anim {\n' +
            '  from { bottom: -'+footerHeight+'px; }\n' +
            '  to { bottom: 0; }\n' +
            '}\n' +
            '.footer-collapse {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: footer-collapse-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  bottom: -'+footerHeight+'px;\n' +
            '}\n' +
            '.footer-expand {\n' +
            '  animation-fill-mode: forwards;\n' +
            '  animation-name: footer-expand-anim;\n' +
            '  animation-duration: 0.5s;\n' +
            '  bottom: 0;\n' +
            '}\n', null, 'zkit_onscroll_hide_show');
  }
}

module.exports = HeaderAutoHide;
