'use strict';

/**
 * MdlCheckbox class.
 *
 * @author Gene
 * @version 1.0.0 (2021-12-19)
 *
 * @constructor
 * @this {ContextController}
 */
function MdlCheckbox() {
  const cp = this;
  let view;
  cp.create = onCreate;

  function onCreate() {
    view = cp.view();
    view.addClass('mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect')
        .css({margin: '12px'});
    view.find('input').addClass('mdl-checkbox__input');
    let textNode;
    zuix.$.each(view.get().childNodes, (i, n) => {
      if (n.nodeType === 3 && n.nodeValue.trim().replace('\n', '').length > 0) {
        textNode = n;
      }
      return textNode == null; // continue iterating if textNode is null
    });
    if (textNode) {
      const text = textNode.nodeValue;
      view.get().removeChild(textNode);
      view.append('<span class="mdl-checkbox__label">' + text + '</span>');
    }
    // Exposes public methods
    cp.expose('checked', {
      get() {
        return checked();
      },
      set(v) {
        checked(v);
      }
    });
    cp.expose('disabled', {
      get() {
        return disabled();
      },
      set(v) {
        disabled(v);
      }
    });
    initializeMdl(view);
  }

  function checked(cv) {
    if (cv != null) {
      if (cv && !view.hasClass('is-checked')) {
        view.get().click();
      } else if (cv === false && view.hasClass('is-checked')) {
        view.get().click();
      }
    }
    return cp.view().hasClass('is-checked');
  }

  function disabled(cv) {
    if (cv != null) {
      if (cv) {
        view.addClass('is-disabled')
            .find('input').attr('disabled', '');
      } else {
        view.removeClass('is-disabled')
            .find('input').attr('disabled', null);
      }
    }
    return view.hasClass('is-disabled');
  }

  function initializeMdl(view) {
    // initializes MDL component as soon as MDL library is available
    zuix.activeRefresh(view, view, null, ($view, $element, data, nextCallback) => {
      if (window['componentHandler']) {
        componentHandler.upgradeElements($view.get());
      } else {
        nextCallback(data, 100, true);
      }
    }).start();
  }
}

module.exports = MdlCheckbox;
