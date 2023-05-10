'use strict';

/**
 * MdlButton class.
 *
 * @author Gene
 * @version 1.0.2 (2023-04-30)
 * @version 1.0.1 (2022-06-03)
 * @version 1.0.0 (2021-12-19)
 *
 * @constructor
 * @this {ContextController}
 */
function MdlButton() {
  this.init = () => {
    const theme = this.options().theme || 'indigo-pink';
    if (this.view().parent().get().mode) { // "mode" -> ShadowRoot
      this.options().fetchOptions = {priority: 'low'};
      if (!self.MaterialButton) {
        this.using('script', '@cdnjs/material-design-lite/1.3.0/material.min.js');
      }
      this.using('style', '@cdnjs/material-design-lite/1.3.0/material.' + theme + '.min.css');
      // loads fonts as a global resource
      zuix.using('style', 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');
    }
  };

  this.create = () => {
    const view = this.view();
    const options = this.options();
    const type = options.type || 'raised';
    view.addClass('mdl-button mdl-js-button mdl-button--' + type + ' mdl-js-ripple-effect');
    if (options.class) {
      const classes = options.class.split(' ');
      classes.forEach((c) => {
        view.addClass('mdl-button--' + c);
      });
    }
    if ((type === 'fab' || type === 'icon') && view.html().indexOf('material-icons') === -1) {
      const iconText = view.get().textContent;
      view.html(`<i class="material-icons">${iconText}</i>`);
    }
    initializeMdl(view);
  };

  function initializeMdl(view) {
    // initializes MDL component as soon as MDL library is available
    zuix.activeRefresh(view, view, null, ($view, $element, data, nextCallback) => {
      if (window['componentHandler']) {
        componentHandler.upgradeElements($view.get());
      } else {
        nextCallback(data, 33, true);
      }
    }).start();
  }
}
module.exports = MdlButton;
