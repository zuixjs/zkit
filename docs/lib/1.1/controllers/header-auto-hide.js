/**
 * zUIx - Header Auto Hide (on scroll =))
 *
 * @version 1.1.0 (2018-07-27)
 * @author Gene
 *
 * @version 1.0.0 (2018-07-25)
 * @author Gene
 *
 */

'use strict';

zuix.controller(function(cp) {
  let headerBar;
  let footerBar;
  let headerHeight = 0;
  let footerHeight = 0;
  let scrollHelper;
  cp.init = function() {
    cp.options().css = false;
    cp.options().html = false;
  };
  cp.create = function() {
    // options parsing
    const header = cp.options().header || cp.view().attr('data-o-header');
    if (header != null) {
      headerBar = zuix.field(header);
      headerBar.css({position: 'fixed', zIndex: 1});
    }
    const footer = cp.options().footer || cp.view().attr('data-o-footer');
    if (footer != null) {
      footerBar = zuix.field(footer);
      footerBar.css({position: 'fixed', zIndex: 1});
    }
    const height = cp.options().height || cp.view().attr('data-o-height');
    if (height != null && !isNaN(height)) {
      headerHeight = footerHeight = parseInt(height);
      addHeaderStyle(); addFooterStyle();
    }
    // TODO: this can be optimized (do not replace CSS, skip if already exists)
    const startTime = new Date().getTime();
    zuix.load('@lib/controllers/scroll-helper', {
      view: cp.view(),
      on: {
        'scroll:change': function(e, data) {
          if (data.event === 'scroll' && (new Date().getTime()-startTime > 1000)) {
            if (data.info.shift.y < 0) {
              // scrolling up
              hideBars();
            } else if (data.info.shift.y > 0) {
              // scrolling down
              showBars();
            }
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
    if (headerBar != null && !headerBar.hasClass('header-collapse')) {
      if (headerHeight === 0) {
        headerHeight = headerBar.position().rect.height;
        if (headerHeight > 0) {
          addHeaderStyle();
        }
      }
      headerBar.removeClass('header-expand')
          .addClass('header-collapse');
    }
    if (footerBar != null && !footerBar.hasClass('footer-collapse')) {
      if (footerHeight === 0) {
        footerHeight = footerBar.position().rect.height;
        if (headerHeight > 0) {
          addFooterStyle();
        }
      }
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
});
