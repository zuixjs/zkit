'use strict';

/**
 * MenuOverlay class.
 *
 * @author Gene
 * @version 1.0.0 (2018-04-20)
 *
 * @constructor
 * @this {ContextController}
 */
function ContextMenu() {
  let menuOpenTimeout;
  let menu;
  let container;
  let view;
  const cp = this;

  cp.create = function() {
    menu = cp.field('menu');
    menu.css('bottom', -(menu.position().rect.height)+'px');
    view = cp.view();
    container = view.hide().find('.container').css('opacity', 0)
        .on('click', function() {
          hideMenu();
        })
        .on('keydown', function(evt) {
          evt = evt || window.event;
          if (evt.keyCode === 27) {
            hideMenu();
          }
        });
    zuix.load('@lib/controllers/gesture-helper', {
      view: view,
      on: {
        'gesture:pan': function(e, tp) {
          if (!menu.hasClass('no-transition')) {
            menu.addClass('no-transition');
          }
          if (tp.shiftY > 0) {
            menu.css('bottom', -tp.shiftY + 'px');
          }
        },
        'gesture:release': function(e, tp) {
          menu.removeClass('no-transition');
          if (tp.velocity <= 0 && tp.direction === 'up') {
            menu.css('bottom', 0);
          } else if (tp.direction === 'down') {
            hideMenu();
          }
        }
      }
    });
    cp.expose('show', showMenu);
    cp.expose('hide', hideMenu);
  };

  function showMenu() {
    view.show();
    // animation will not work without this delay =/
    clearTimeout(menuOpenTimeout);
    menuOpenTimeout = setTimeout(function() {
      container.css('opacity', 1);
      menu.css('bottom', 0)
          .get().focus();
      cp.trigger('open');
    }, 10);
  }

  function hideMenu() {
    menu.one('transitionend', function() {
      container.one('transitionend', function() {
        view.hide();
        cp.trigger('close');
      });
    });
    container.css('opacity', 0);
    menu.css('bottom', -(menu.position().rect.height)+'px');
  }
}

module.exports = ContextMenu;
