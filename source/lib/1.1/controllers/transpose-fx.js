/**
 * zuix.js / zKit - Transpose Effect
 *
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
  fadingElements;

  onCreate() {
    this.placeHolder = zuix.$(document.createElement('div'))
        .css({background: 'rgba(0,0,0,5%)'});
    // set component's public methods
    this.expose({
      begin: (el) => this.#begin(el),
      end: () => this.#end(),
      toggle: (el) => this.#toggle(el),
      active: () => this.isOpen
    });
    this.#setupTransitions();
    this.view().display('none');
  }

  #begin(element) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.element = element;
    this.targetView = this.view('.transpose-fx-container');
    this.fadingElements = this.view('.transpose-fx');
    if (this.fadingElements.length() === 0) {
      this.fadingElements = this.view();
    }
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
    this.fadingElements
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
    this.fadingElements
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
}

module.exports = TransposeFx;
