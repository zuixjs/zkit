'use strict';

/**
 * MenuOverlay class.
 *
 * @author Gene
 * @version 1.1.0 (2022-03-28)
 *
 * @author Gene
 * @version 1.0.0 (2018-04-20)
 *
 * @constructor
 * @this {ContextController}
 */
function ContextMenu(cp) {
  let menu;
  let container;
  let view;
  let isHidden = true;

  cp.create = function() {
    menu = cp.field('menu');
    menu.css('bottom', -(menu.position().rect.height)+'px');
    view = cp.view();
    container = view.hide().find('.container')
        .on({
          'click': hideMenu,
          'keydown': function(evt) {
            evt = evt || window.event;
            if (evt.keyCode === 27) {
              hideMenu();
            }
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
    if (isHidden && !menu.isPlaying()) {
      isHidden = false;
      view.show();
      menu.playTransition({onEnd: function(a, b) {
        cp.trigger('open');
      }});
      // start the transition
      menu.css('bottom', 0).get().focus();
      container.css('opacity', 1);
    }
  }

  function hideMenu() {
    if (!isHidden && !menu.isPlaying()) {
      isHidden = true;
      menu.playTransition({onEnd: function() {
        view.hide();
        cp.trigger('close');
      }});
      // start the transition
      container.css('opacity', 0);
      menu.css('bottom', -(menu.position().rect.height)+'px');
    }
  }
}

module.exports = ContextMenu;
