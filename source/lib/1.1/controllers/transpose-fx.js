/**
 * zuix.js / zKit - Transpose Effect
 *
 * @version 1.1.1 (2022-05-25)
 * @version 1.1.0 (2022-05-23)
 * @author Gene
 *
 */
class TransposeFx extends ControllerInstance {
  isOpen = false;
  element;
  targetView;
  oldPosition;
  newPosition;
  placeHolder;
  elementSize;

  onCreate() {
    this.placeHolder = zuix.$(document.createElement('div'))
        .css({background: 'rgba(0,0,0,5%)'});
    this.targetView = this.view('.transpose-fx-container');
    // set component's public methods
    this.expose({
      begin: (el) => this.#begin(el),
      end: () => this.#end(),
      toggle: (el) => this.#toggle(el),
      active: () => this.isOpen
    });
    this.#setupTransitions();
    const backgroundDiv = zuix.$(document.createElement('div'))
        .css({
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -1
        });
    this.#copyBackground(backgroundDiv);
    this.view()
        .insert(0, backgroundDiv)
        .display('none')
        .find(':not(.transpose-fx-container)')
        .each((i, el, $el) => {
          $el.addClass('transpose-fx');
        });
    let parent = this.targetView.parent();
    while (parent.length() > 0 && parent.get() !== this.view().get()) {
      parent.removeClass('transpose-fx');
      parent = parent.parent();
    }
  }

  #begin(element) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.element = element;
    this.oldPosition = element.position();
    const parent = element.parent();
    // give placeHolder same size as element
    const style = this.elementStyle = element.get().currentStyle || window.getComputedStyle(element.get());
    this.elementSize = {width: element.css('width'), height: element.css('height')};
    this.placeHolder.css({
      marginLeft: style.marginLeft,
      marginTop: style.marginTop,
      marginRight: style.marginRight,
      marginBottom: style.marginBottom,
      width: this.oldPosition.rect.width + 'px',
      height: this.oldPosition.rect.height + 'px'
    }).detach();
    // detach the element and put a placeholder in place of it
    element.detach().css({zIndex: 10000});
    // TODO: think about something to avoid the use of zuix.js internal variables
    parent.insert(element.get().__zuix_oldIndex, this.placeHolder.get());
    // attach the element to its new parent
    this.targetView.insert(0, element.get());
    // show the host view with a fade-in effect
    this.view().display('block');
    this.view('.transpose-fx')
        .playTransition('fadeOut fadeIn');
    // animate the element with a translate-transform from old location to the new location
    this.newPosition = element.position();
    this.#resetTransition(element);
    // set initial position relative to the new view's container (targetView)
    element.css({
      width: style.width + 'px', height: style.height + 'px',
      transform: 'translate(' +
        (this.oldPosition.rect.x - this.newPosition.rect.x) + 'px,' +
        (this.oldPosition.rect.y - this.newPosition.rect.y) + 'px)'
    });
    if (element.get().tagName === 'IMG') {
      element.attr({width: style.width, height: style.height});
    }
    setTimeout(() => {
      // transpose element to the new position with a transition effect
      this.#addTransition();
      element.css({
        width: '100%', height: '100%',
        transform: 'translate(0,0)'
      });
    });
    this.view().trigger('transpose:active');
  }

  #end() {
    if (!this.isOpen) return;
    this.oldPosition = this.placeHolder.position();
    this.#resetTransition();
    // transpose element to the original position with a transition effect
    this.#addTransition();
    this.element.css({
      width: this.elementSize.width, height: this.elementSize.height,
      transform: 'translate(' +
          (this.oldPosition.rect.x - this.newPosition.rect.x) + 'px,' +
          (this.oldPosition.rect.y - this.newPosition.rect.y) + 'px)'
    });
    this.element.playTransition({onEnd: () => {
      // detach placeHolder and reattach the element to the original parent
      this.targetView.insert(0, this.placeHolder.get());
      this.element
          .attach()
          .css({transform: 'translate(0,0)', zIndex: null});
      this.placeHolder.detach();
    }});
    this.view('.transpose-fx')
        .playTransition({classes: 'fadeIn fadeOut', onEnd: () => {
          this.isOpen = false;
          this.view().hide();
          this.view().trigger('transpose:end');
        }});
  }

  #toggle(element) {
    if (!element.hasClass('--z-playing')) {
      if (this.isOpen) {
        this.#end();
      } else {
        this.#begin(element);
      }
    }
    return this.isOpen;
  }

  #addTransition() {
    // TODO: should restore original css states on close
    this.element.css({
      transition: 'all .35s'
    });
  }
  #resetTransition() {
    // TODO: should restore original css states on close
    this.element.css({
      transition: 'none'
    });
  }

  #setupTransitions() {
    const commonOptions = {
      duration: '0.35s',
      delay: '0.1',
      timingFunction: 'ease-in-out'
    };
    this.addTransition('fadeIn', {
      opacity: '1'
    }, commonOptions);
    this.addTransition('fadeOut', {
      opacity: '0'
    }, commonOptions);
    this.context.$
        .css({zIndex: 1000})
        // TODO: the following line can be removed as soon as
        //       zuix.js gets fixed (next coming release 1.1.4)
        .attr(this.context.getCssId(), '');
  }

  #copyBackground(backgroundDiv) {
    const props = [
      'background-attachment', 'background-clip',
      'background-color', 'background-image',
      'background-origin', 'background-position',
      'background-repeat', 'background-size',
      'box-shadow', 'border-radius', 'border', 'backdrop-filter'
    ];
    const view = this.view();
    const style = view.get().currentStyle || window.getComputedStyle(view.get());
    props.map((p) => {
      backgroundDiv.css(p, style[p]);
      view.css(p, 'unset');
    });
  }
}

module.exports = TransposeFx;
