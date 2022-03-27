'use strict';

/**
 * MenuOverlay class.
 *
 * @author Gene
 * @version 1.0.0 (2018-02-12)
 *
 * @constructor
 * @this {ContextController}
 */
function MenuOverlay(cp) {
  let menuOverlayShowing = false;
  let menuButtonShowing = false;
  let menuButton;
  let menuButtonClose;
  let menuOverlay;
  let itemsWrapper;
  let menuItems;
  let scroller = null;
  let currentOffset = 0;
  let menuPosition = 'right';

  cp.create = function() {
    menuPosition = cp.options().position || cp.view().attr('data-o-position') || menuPosition;
    menuButton = cp.field('menu_button')
        .addClass(menuPosition).hide()
        .on('click', toggleMenu);
    menuButtonClose = cp.field('menu_button_close')
        .addClass(menuPosition).hide()
        .on('click', toggleMenu);
    menuOverlay = cp.field('menu_overlay')
        .addClass(menuPosition)
        .visibility('hidden')
        .on('click', toggleMenu);
    itemsWrapper = cp.field('items_wrapper')
        .addClass(menuPosition);

    const items = zuix.$(cp.model().items).children();
    items.each(function(i, el) {
      const wrapperDiv = zuix.$(document.createElement('div'))
          .addClass('menu-item')
          .append(el.observableTarget || el);
      itemsWrapper.append(wrapperDiv.get());
    });
    menuItems = itemsWrapper
        .find('div[class*="menu-item"]');

    // apply custom color to menu button
    const $view = cp.view();
    if ($view.attr('data-o-button-color') != null) {
      $view.css('background', $view.attr('data-o-button-color'));
    }
    if ($view.attr('data-o-icon-color') != null) {
      $view.css('fill', $view.attr('data-o-icon-color'));
    }

    const scrollerName = $view.attr('data-o-scroller');
    if (scrollerName != null) {
      scroller = zuix.field(scrollerName);
    } else {
      scroller = zuix.$(window);
    }
    if (scroller != null) {
      scroller.on('scroll', function(e) {
        const scrollTop = scroller.get() === window ? (document.documentElement.scrollTop || document.body.scrollTop) : scroller.get().scrollTop;
        if (menuButtonShowing) {
          if ((currentOffset - scrollTop) < -2) {
            hideButton();
          }
        } else if (!menuButtonShowing) {
          if ((currentOffset - scrollTop) > 2) {
            showButton();
          }
        }
        currentOffset = scrollTop;
        if (menuOverlayShowing) {
          toggleMenu();
        }
      });
    }

    // Animate CSS extension
    zuix.using('component', '@lib/extensions/animate-css', function(res, ctx) {
      // show floating action button
      setTimeout(function() {
        if (!menuButtonShowing) {
          showButton();
        }
      }, 1000);
    });

    cp.expose('show', function() {
      $view.show();
    });
    cp.expose('hide', function() {
      $view.hide();
    });
    document.body.addEventListener('keyup', function(evt) {
      if (evt.defaultPrevented) {
        return;
      }
      if (evt.key === 'Escape') {
        evt.cancelBubble = true;
        evt.preventDefault();
        setTimeout(function() {
          if (menuOverlayShowing) {
            hideButton();
            toggleMenu();
          } else if (!menuButtonShowing) {
            showButton();
          } else {
            hideButton();
          }
        }, 100);
      }
    });
    cp.expose('toggleButton', toggleButton);
    cp.expose('showButton', showButton);
    cp.expose('hideButton', hideButton);
    cp.expose('showing', function() {
      return menuButtonShowing;
    });
  };

  function toggleButton() {
    if (menuButtonShowing) {
      hideButton();
    } else {
      showButton();
    }
  }

  function hideButton() {
    menuButtonShowing = false;
    menuButton.animateCss('fadeOutDown', {duration: '0.3s'}, function() {
      this.hide();
      cp.trigger('hide');
    });
  }

  function showButton() {
    menuButtonShowing = true;
    menuButton.animateCss('fadeInUp').show();
    cp.trigger('show');
  }

  function toggleMenu() {
    if (menuOverlay.hasClass('animate__animated')) {
      return;
    }
    let itemsRevealAnimation = 'fadeInUp';
    let itemsHideAnimation = 'fadeOutDown';
    if (menuPosition === 'right') {
      itemsRevealAnimation = 'bounceInRight';
      itemsHideAnimation = 'fadeOutRight';
    } else if (menuPosition === 'left') {
      itemsRevealAnimation = 'bounceInLeft';
      itemsHideAnimation = 'fadeOutLeft';
    }
    let speedFactor = 300 / menuItems.length();
    if (!menuOverlayShowing) {
      menuOverlayShowing = true;
      cp.trigger('open');
      menuButton.animateCss('rotateOut', {duration: '0.3s'});
      menuButtonClose.animateCss('rotateIn', {duration: '0.5s'}, function() {
        menuButton.hide();
      }).show();
      let transitionDelay = 0;
      if (menuPosition === 'left' || menuPosition === 'right') {
        transitionDelay = speedFactor * menuItems.length();
        speedFactor *= -1;
      }
      menuOverlay.animateCss('fadeIn', {duration: '0.5s'}).visibility('');
      menuItems.each(function(i, el) {
        transitionDelay += speedFactor;
        this.animateCss(itemsRevealAnimation, {duration: '0.5s', delay: transitionDelay + 'ms'})
            .show();
      });
    } else if (menuOverlayShowing) {
      menuOverlayShowing = false;
      cp.trigger('close');
      if (menuButtonShowing) {
        menuButtonClose.animateCss('rotateOut', {duration: '0.3s'}, function() {
          this.hide();
        });
        menuButton.animateCss('rotateIn', {duration: '0.5s'});
      } else {
        menuButtonClose.animateCss('fadeOutDown', {duration: '0.3s'}, function() {
          this.hide();
        });
      }
      menuOverlay.animateCss('fadeOut', {duration: '0.5s', delay: '0.2s'}, function() {
        this.visibility('hidden');
      });
      let transitionDelay = speedFactor * menuItems.length();
      if (menuPosition === 'left' || menuPosition === 'right') {
        transitionDelay = 0;
        speedFactor *= -1;
      }
      menuItems.each(function(i, el) {
        transitionDelay -= speedFactor;
        this.animateCss(itemsHideAnimation, {duration: '0.5s', delay: transitionDelay + 'ms'}, function() {
          this.hide();
        });
      });
      menuButton.show();
    }
  }
}

module.exports = MenuOverlay;
