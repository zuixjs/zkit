'use strict';

/**
 * DrawerLayout class.
 *
 * @version 1.0.1 (2018-07-27)
 * @author Gene
 *
 * @version 1.0.0 (2018-07-09)
 * @author Gene
 *
 * @constructor
 * @this {ContextController}
 */
function DrawerLayout() {
  let isDrawerOpen = true;
  let isDrawerLocked = false;
  let isSmallScreen = false;
  let isTransitionOn = false;
  let firstCheck = true;

  let overlay = null;
  let drawerLayout = null;
  let mainContent = null;

  let drawerWidth = 280;
  let autoHideWidth = 960;
  let forceFloating = false;

  let initialOffset = 0;

  const cp = this;
  cp.init = onInit;
  cp.create = onCreate;

  function onInit() {
    const view = cp.view();
    this.options().html = false;
    this.options().css = false;
    if (!isNaN(this.options().drawerWidth)) {
      drawerWidth = parseInt(this.options().drawerWidth);
    } else {
      const w = parseInt(view.attr('data-o-width'));
      if (!isNaN(w)) drawerWidth = w;
    }
    if (!isNaN(this.options().autoHideWidth)) {
      autoHideWidth = parseInt(this.options().autoHideWidth);
    } else {
      const w = parseInt(view.attr('data-o-hide-width'));
      if (!isNaN(w)) autoHideWidth = w;
    }
  }

  function onCreate() {
    drawerLayout = cp.view();
    mainContent = cp.options().mainContent;
    // add overlay for small screens when menu is open
    overlay = zuix.$(document.createElement('div'));
    overlay.css({
      'position': 'fixed',
      'top': 0,
      'left': 0,
      'bottom': 0,
      'right': 0,
      'z-index': 100,
      //      '-ms-touch-action': 'none',
      //      'touch-action': 'none',
      'background-color': 'rgba(0, 0, 0, 0.5)'
    }).on('click', function() {
      if (!isDrawerLocked) {
        closeDrawer();
      }
    }).hide();
    drawerLayout.parent().append(overlay.get());

    // set drawer style
    drawerLayout.css({
      'position': 'fixed',
      'overflow-y': 'auto',
      'left': 0, 'width': drawerWidth + 'px', 'top': 0, 'bottom': 0,
      'z-index': 101,
      //      '-ms-touch-action': 'none',
      //      'touch-action': 'none',
      '-webkit-box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)',
      '-moz-box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)',
      'box-shadow': '8px 0 6px -6px rgba(0,0,0,0.25)'
    }).attr('tabindex', 0);

    let isDragging = false;
    // handle gesture to open/close the drawer menu
    zuix.load('@lib/controllers/gesture-helper', {
      view: document.documentElement,
      on: {
        'gesture:touch': function(e, tp) {
          if (isDrawerLocked) return;
          transitionOn();
          if (isDrawerOpen && tp.startX < drawerWidth) {
            initialOffset = drawerWidth - tp.startX;
          } else {
            initialOffset = 0;
          }
        },
        'gesture:release': function(e, tp) {
          if (isDrawerLocked) return;
          if (isDragging) {
            isDragging = false;
            transitionOn();
            if (tp.velocity > 0) {
              openDrawer();
            } else {
              closeDrawer();
            }
          }
        },
        'gesture:pan': function(e, tp) {
          // wait until horizontal scrolling gesture is detected (tp.scrollIntent() === 'horizontal')
          if (isDrawerLocked || tp.scrollIntent() !== 'horizontal') return;
          if ((isDragging || isDrawerOpen) && tp.x < drawerWidth || (!isDragging && tp.x < 50)) {
            if (!isDragging) {
              isDragging = true;
            }
            transitionOn();
            dragTo(tp);
            transitionOff();
          }
        }
      }
    });

    // public component methods
    cp.expose('toggle', function() {
      transitionOn();
      toggleDrawer();
    });
    cp.expose('open', function() {
      transitionOn();
      openDrawer();
    });
    cp.expose('close', function() {
      transitionOn();
      closeDrawer();
    });
    cp.expose('isOpen', isOpen);
    cp.expose('lock', function(locked) {
      if (locked == null) {
        return isDrawerLocked;
      }
      isDrawerLocked = locked;
    });
    cp.expose('float', function(floating) {
      if (floating == null) {
        return forceFloating;
      }
      forceFloating = floating;
      sizeCheck();
    });

    // close drawer if ESC key is pressed
    drawerLayout.on('keydown', function(evt) {
      evt = evt || window.event;
      if (evt.keyCode === 27) {
        closeDrawer();
      }
    });

    // detect screen size and set large/small layout
    sizeCheck();
    firstCheck = false;

    // listen to window resize event to make layout responsive
    window.addEventListener('resize', function() {
      sizeCheck();
    });
  }

  function openDrawer() {
    drawerLayout
        .visibility('initial')
        .css('left', 0)
        .get().focus();
    if (isSmallScreen) {
      drawerLayout.find('a').one('click', function() {
        closeDrawer();
      });
      overlay.css('opacity', 'initial');
      overlay.show();
    }
    if (!isDrawerOpen) {
      isDrawerOpen = true;
      cp.trigger('drawer:open', {smallScreen: isSmallScreen});
    }
  }

  function closeDrawer() {
    if (isSmallScreen) {
      transitionEnd(function() {
        if (!isDrawerOpen) {
          drawerLayout.visibility('hidden');
        }
      });
      drawerLayout.css('left', -drawerWidth + 'px');
      overlay.hide();
      if (isDrawerOpen) {
        isDrawerOpen = false;
        cp.trigger('drawer:close', {smallScreen: isSmallScreen});
      }
    }
    isDrawerOpen = false;
    drawerLayout.find('a').off('click');
  }

  function toggleDrawer() {
    if (isDrawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  function isOpen() {
    return isDrawerOpen;
  }

  function dragTo(tp) {
    let x = tp.x;
    if (x > 0 && x <= drawerWidth - initialOffset) {
      x = -drawerWidth + x + initialOffset;
      if (drawerLayout.visibility() === 'hidden') {
        drawerLayout.visibility('initial');
      }
      drawerLayout.css('left', x + 'px');
      if (overlay.display() === 'none') {
        overlay.show();
      }
      overlay.css('opacity', (drawerWidth + x) / drawerWidth);
    }
  }

  function sizeCheck() {
    const width = window.innerWidth || document.body.clientWidth;
    if (width < autoHideWidth || autoHideWidth === -1 || forceFloating) {
      if (!isSmallScreen || firstCheck) {
        isSmallScreen = true;
        isDrawerLocked = false;
        layoutChange();
      }
      closeDrawer();
    } else {
      if (isSmallScreen || firstCheck) {
        if (isSmallScreen) {
          overlay.hide();
          if (isDrawerOpen) {
            closeDrawer();
          }
        }
        isSmallScreen = false;
        isDrawerLocked = true;
        layoutChange();
        openDrawer();
      }
    }
  }

  function layoutChange() {
    if (!firstCheck) {
      transitionOn();
    }
    if (mainContent) {
      const leftPadding = parseFloat(getComputedStyle(mainContent.get(), null).getPropertyValue('padding-left'));
      if (!isSmallScreen) {
        mainContent.css({paddingLeft: (drawerWidth + leftPadding) + 'px'});
      } else {
        mainContent.css({paddingLeft: (leftPadding - drawerWidth) + 'px'});
      }
    }
    cp.trigger('layout:change', {
      smallScreen: isSmallScreen,
      drawerLocked: isDrawerLocked
    });
  }

  function transitionOn() {
    if (!isTransitionOn) {
      isTransitionOn = true;
      const transition = 'ease .15s';
      drawerLayout.css({
        'transition-property': 'left',
        'transition': transition
      });
      overlay.css({
        'transition-property': 'opacity',
        'transition': transition
      });
    }
  }

  function transitionOff() {
    if (isTransitionOn) {
      isTransitionOn = false;
      const transition = 'none';
      drawerLayout.css({
        'transition': transition
      });
      overlay.css({
        'transition': transition
      });
    }
  }

  function transitionEnd(callback) {
    drawerLayout.one('transitionend transitioncancel', function() {
      callback();
    });
  }
}

module.exports = DrawerLayout;
