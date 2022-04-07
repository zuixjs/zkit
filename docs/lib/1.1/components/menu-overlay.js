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
    const buttonColor = cp.options().buttonColor || $view.attr('data-o-button-color'); // eg. header
    if (buttonColor != null) {
      $view.find('.circle-button').css({background: buttonColor});
    }
    const iconColor = cp.options().iconColor || $view.attr('data-o-icon-color'); // eg. header
    if (iconColor != null) {
      $view.find('.circle-button i').css({
        fill: iconColor,
        color: iconColor
      });
    }

    const scrollerName = $view.attr('data-o-scroller');
    if (scrollerName != null) {
      scroller = zuix.field(scrollerName);
    } else {
      scroller = zuix.$(window);
    }
    if (scroller != null) {
      let beforeElement = cp.options().before || $view.attr('data-o-before'); // eg. footer
      if (beforeElement) {
        beforeElement = zuix.field(beforeElement).get();
      }
      let afterElement = cp.options().after || $view.attr('data-o-after'); // eg. header
      if (afterElement) {
        afterElement = zuix.field(afterElement).get();
      }
      scroller.on('scroll', function(e) {
        const scrollTop = scroller.get() === window ? (document.documentElement.scrollTop || document.body.scrollTop) : scroller.get().scrollTop;
        if (menuButtonShowing) {
          if ((currentOffset - scrollTop) < -2) {
            if (afterElement == null || (scrollTop > afterElement.offsetTop + afterElement.offsetHeight - 56)) {
              setTimeout(hideButton, 100);
            }
          }
        } else if (!menuButtonShowing) {
          if ((currentOffset - scrollTop) > 2) {
            if (beforeElement == null || (scrollTop + window.innerHeight < beforeElement.offsetTop + 56)) {
              showButton();
            }
          }
        }
        currentOffset = scrollTop;
        if (menuOverlayShowing) {
          toggleMenu();
        }
      });
    }

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
    initializeAnimations();
    // show floating action button
    setTimeout(function() {
      if (!menuButtonShowing) {
        showButton();
      }
    }, 1000);
  };

  function toggleButton() {
    if (menuButtonShowing) {
      hideButton();
    } else {
      showButton();
    }
  }

  function hideButton() {
    if (!menuButton.isPlaying()) {
      menuButtonShowing = false;
      menuButton.playTransition({
        classes: 'fadeIn fadeOutDown',
        onEnd: function() {
          this.hide();
          cp.trigger('hide');
        }
      });
    }
  }

  function showButton() {
    if (!menuButton.isPlaying()) {
      menuButtonShowing = true;
      menuButton.playTransition('fadeOutDown fadeIn');
      menuButton.show();
      cp.trigger('show');
    }
  }

  function toggleMenu() {
    if (menuOverlay.isPlaying()) {
      return;
    }
    const itemsRevealAnimation = 'fadeIn';
    let itemsHideAnimation = 'fadeOutDown';
    if (menuPosition === 'right') {
      itemsHideAnimation = 'fadeOutRight';
    } else if (menuPosition === 'left') {
      itemsHideAnimation = 'fadeOutLeft';
    }
    let speedFactor = 200 / menuItems.length();
    if (!menuOverlayShowing) {
      menuOverlayShowing = true;
      cp.trigger('open');
      menuButton.playTransition({
        classes: 'rotateIn rotateOutRight',
        onEnd: menuButton.hide
      });
      menuButtonClose.playTransition('rotateOutLeft rotateIn').show();
      let transitionDelay = 0;
      if (menuPosition === 'left' || menuPosition === 'right') {
        transitionDelay = speedFactor * menuItems.length();
        speedFactor *= -1;
      }
      menuOverlay.playTransition('fadeOut fadeIn').visibility('');
      menuItems.each(function(i, el) {
        transitionDelay += speedFactor;
        this.playTransition({
          classes: [itemsHideAnimation, itemsRevealAnimation],
          options: {
            duration: '200ms',
            delay: transitionDelay + 'ms'
          }
        }).show();
      });
    } else if (menuOverlayShowing) {
      menuOverlayShowing = false;
      cp.trigger('close');
      if (menuButtonShowing) {
        menuButtonClose.playTransition({
          classes: 'rotateIn rotateOutLeft',
          onEnd: menuButtonClose.hide
        });
        menuButton.playTransition('rotateOutRight rotateIn');
      } else {
        menuButtonClose.playTransition({
          classes: 'fadeIn fadeOutDown',
          onEnd: menuButtonClose.hide
        });
      }
      menuOverlay.playTransition({
        classes: 'fadeIn fadeOut',
        holdState: true,
        onEnd: function() {
          this.visibility('hidden');
        }
      });
      let transitionDelay = speedFactor * menuItems.length();
      if (menuPosition === 'left' || menuPosition === 'right') {
        transitionDelay = 0;
        speedFactor *= -1;
      }
      menuItems.each(function(i, item, $item) {
        transitionDelay -= speedFactor;
        $item.playTransition({
          classes: [itemsRevealAnimation, itemsHideAnimation],
          options: {
            duration: '200ms',
            delay: transitionDelay + 'ms'
          },
          onEnd: $item.hide
        }).show();
      });
      menuButton.show();
    }
  }

  function initializeAnimations() {
    const commonOptions = {
      duration: '0.25s',
      timingFunction: 'ease-in-out'
    };
    cp.addTransition( 'fadeIn', {
      transform: 'translateXY(0,0)',
      opacity: '1'
    }, commonOptions);
    cp.addTransition( 'fadeOut', {
      transform: 'translateXY(0,0)',
      opacity: '0'
    }, commonOptions);
    cp.addTransition( 'fadeOutUp', {
      transform: 'translateY(-200px)',
      opacity: '0'
    }, commonOptions);
    cp.addTransition( 'fadeOutDown', {
      transform: 'translateY(200px)',
      opacity: '0'
    }, commonOptions);
    cp.addTransition('fadeOutLeft', {
      transform: 'translateX(-200px)',
      opacity: 0
    }, commonOptions);
    cp.addTransition('fadeOutRight', {
      transform: 'translateX(200px)',
      opacity: 0
    }, commonOptions);
    cp.addTransition('rotateIn', {
      transform: 'rotate(0)',
      opacity: 1
    }, commonOptions);
    cp.addTransition('rotateOutRight', {
      transform: 'rotate(+135deg)',
      opacity: 0
    }, commonOptions);
    cp.addTransition('rotateOutLeft', {
      transform: 'rotate(-135deg)',
      opacity: 0
    }, commonOptions);
  }
}

module.exports = MenuOverlay;
