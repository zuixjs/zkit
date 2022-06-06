/**
 * zuix.js / zKit - Transpose Effect
 *
 * @version 1.1.1 (2022-05-25)
 * @version 1.1.0 (2022-05-23)
 * @author Gene
 * @param {ContextController} ctrl
 * @this {ContextController}
 */
function TransposeFx(ctrl) {
  let isOpen = false;
  let element;
  let targetView;
  let oldPosition;
  let newPosition;
  let placeHolder;
  let elementSize;

  ctrl.create = () => {
    placeHolder = zuix.$(document.createElement('div'))
        .css({background: 'rgba(0,0,0,5%)'});
    targetView = ctrl.view('.transpose-fx-container');
    // set component's public methods
    ctrl.expose({
      begin: (el) => begin(el),
      end: () => end(),
      toggle: (el) => toggle(el),
      active: () => isOpen
    });
    setupTransitions();
    const backgroundDiv = zuix.$(document.createElement('div'))
        .css({
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1
        });
    copyBackground(backgroundDiv);
    ctrl.view()
        .insert(0, backgroundDiv)
        .display('none')
        .find(':not(.transpose-fx-container)')
        .each((i, el, $el) => {
          $el.addClass('transpose-fx');
        });
    let parent = targetView.parent();
    while (parent.length() > 0 && parent.get() !== ctrl.view().get()) {
      parent.removeClass('transpose-fx');
      parent = parent.parent();
    }
  };

  function begin(el) {
    if (isOpen) return;
    isOpen = true;
    element = el;
    oldPosition = element.position();
    const parent = element.parent();
    // give placeHolder same size as element
    const style = element.get().currentStyle || window.getComputedStyle(element.get());
    elementSize = {width: element.css('width'), height: element.css('height')};
    placeHolder.css({
      marginLeft: style.marginLeft,
      marginTop: style.marginTop,
      marginRight: style.marginRight,
      marginBottom: style.marginBottom,
      width: oldPosition.rect.width + 'px',
      height: oldPosition.rect.height + 'px'
    }).detach();
    // detach the element and put a placeholder in place of it
    element.detach().css({zIndex: 10000});
    // TODO: think about something to avoid the use of zuix.js internal variables
    parent.insert(element.get().__zuix_oldIndex, placeHolder.get());
    // attach the element to its new parent
    targetView.insert(0, element.get());
    // show the host view with a fade-in effect
    ctrl.view().display('block');
    ctrl.view('.transpose-fx')
        .playTransition('fadeOut fadeIn');
    // animate the element with a translate-transform from old location to the new location
    newPosition = element.position();
    resetTransition(element);
    // set initial position relative to the new view's container (targetView)
    element.css({
      width: style.width + 'px', height: style.height + 'px',
      transform: 'translate(' +
        (oldPosition.rect.x - newPosition.rect.x) + 'px,' +
        (oldPosition.rect.y - newPosition.rect.y) + 'px)'
    });
    if (element.get().tagName === 'IMG') {
      element.attr({width: style.width, height: style.height});
    }
    setTimeout(() => {
      // transpose element to the new position with a transition effect
      addTransition();
      element.css({
        width: '100%', height: '100%',
        transform: 'translate(0,0)'
      });
    });
    ctrl.view().trigger('transpose:active');
  }

  function end() {
    if (!isOpen) return;
    oldPosition = placeHolder.position();
    resetTransition();
    // transpose element to the original position with a transition effect
    addTransition();
    element.css({
      width: elementSize.width, height: elementSize.height,
      transform: 'translate(' +
          (oldPosition.rect.x - newPosition.rect.x) + 'px,' +
          (oldPosition.rect.y - newPosition.rect.y) + 'px)'
    });
    element.playTransition({onEnd: () => {
      // detach placeHolder and reattach the element to the original parent
      targetView.insert(0, placeHolder.get());
      element
          .attach()
          .css({transform: 'translate(0,0)', zIndex: null});
      placeHolder.detach();
    }});
    ctrl.view('.transpose-fx')
        .playTransition({classes: 'fadeIn fadeOut', onEnd: () => {
          isOpen = false;
          ctrl.view().hide();
          ctrl.view().trigger('transpose:end');
        }});
  }

  function toggle(element) {
    if (!element.hasClass('--z-playing')) {
      if (isOpen) {
        end();
      } else {
        begin(element);
      }
    }
    return isOpen;
  }

  function addTransition() {
    // TODO: should restore original css states on close
    element.css({
      transition: 'all .35s'
    });
  }
  function resetTransition() {
    // TODO: should restore original css states on close
    element.css({
      transition: 'none'
    });
  }

  function setupTransitions() {
    const commonOptions = {
      duration: '0.35s',
      delay: '0.1',
      timingFunction: 'ease-in-out'
    };
    ctrl.addTransition('fadeIn', {
      opacity: '1'
    }, commonOptions);
    ctrl.addTransition('fadeOut', {
      opacity: '0'
    }, commonOptions);
    ctrl.context.$
        .css({zIndex: 1000});
  }

  function copyBackground(backgroundDiv) {
    const props = [
      'background', 'box-shadow', 'border-radius', 'border', 'backdrop-filter'
    ];
    const view = ctrl.view();
    const style = view.get().currentStyle || window.getComputedStyle(view.get());
    props.map((p) => {
      backgroundDiv.css(p, style[p]);
      view.css(p, 'unset');
    });
  }
}

module.exports = TransposeFx;
