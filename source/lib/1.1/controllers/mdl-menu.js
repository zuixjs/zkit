'use strict';

/**
 * MdlMenu class.
 *
 * @author Gene
 * @version 1.0.0 (2021-12-19)
 *
 * @constructor
 * @this {ContextController}
 */
function MdlMenu() {
  const cp = this;
  cp.init = onInit;
  cp.create = onCreate;

  function onInit() {
    this.options().css = 'ul{ margin:0 !important; padding:0 !important; } li{width:100%} li[disabled]{ pointer-events: none; } a{text-decoration: none;}';
  }

  function onCreate() {
    // position relative must be set on the container
    // in order to make MaterialMenu positioning work properly
    this.view().css('position', 'relative');
    const position = this.options().position || 'unaligned';
    // generate unique identifier for this instance
    const menuId = 'menu-' + this.context.contextId;
    // add required MDL classes to elements
    const ul = this.view('ul');
    ul.addClass('mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--' + position)
        .attr('for', menuId);
    ul.find('li').on('click', function(e, $li) {
      if (e.target === $li.get()) {
        this.find('a').each((i, el, $el) => {
          el.click();
        });
      }
    });
    this.view('li')
        .addClass('mdl-menu__item mdl-menu__item--full-bleed-divider')
        .on('click', function(e, $el) {
        // trigger a custom event when option is selected,
        // the 'action' attribute of the clicked element
        // is used to pass custom data
          cp.trigger('menu:select', {action: $el.attr('action'), $el});
        });
    let a = this.view('a');
    if (a.length() >= 1) {
      a = a.eq(a.length() - 1);
      a.attr('id', menuId)
          .addClass('mdl-button mdl-js-button mdl-js-ripple-effect')
          .on('click', function() {
            const menuPosition = guessPosition(cp.options(), this.position());
            if (menuPosition) {
              const positionClasses = 'mdl-menu--bottom-left mdl-menu--bottom-right mdl-menu--top-left mdl-menu--top-right mdl-menu--unaligned';
              ul.removeClass(positionClasses)
                  .addClass(menuPosition);
              ul.prev().removeClass(positionClasses)
                  .addClass(menuPosition);
              // reset container position as a work-around to MaterialMenu bug
              cp.view('div.mdl-menu__container').css({
                top: '', left: '', right: '', bottom: ''
              });
            }
          });
    } else {
      return false;
    }

    // Upgrade MDL elements
    zuix.activeRefresh(cp.view(), cp.view(), null, ($view, $element, data, nextCallback) => {
      if (window['componentHandler']) {
        // patch MaterialMenu to implement show/hide events
        if (MaterialMenu && !MaterialMenu.prototype._hide) {
          MaterialMenu.prototype._hide = MaterialMenu.prototype.hide;
          MaterialMenu.prototype.hide = function() {
            if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
              cp.trigger('menu:hide');
              this._hide();
            }
          };
        }
        if (MaterialMenu && !MaterialMenu.prototype._show) {
          MaterialMenu.prototype._show = MaterialMenu.prototype.show;
          MaterialMenu.prototype.show = function(p) {
            cp.trigger('menu:show');
            this._show(p);
          };
        }
        componentHandler.upgradeElements(ul.get());
        componentHandler.upgradeElements(a.get());
        // a little patch to FAB buttons
        if (a.attr('z-load')) {
          zuix.context(a, () => {
            const isMini = a.hasClass('mdl-button--mini-fab');
            const isIcon = a.hasClass('mdl-button--icon');
            a.find('.material-icons').css({
              transition: 'transform .2s ease-in-out',
              transform: 'translate(0,0)', WebkitTransform: 'translate(0,0)',
              marginTop: isMini ? '8px' : isIcon ? '0' : '16px',
              marginLeft: isMini || isIcon ? '1px' : '2px',
              position: 'initial'
            });
          });
        }
      } else {
        nextCallback(data, 100, true);
      }
    }).start();
  }

  /**
   * @param {ContextOptions|any} options
   * @param {ElementPosition} p
   */
  function guessPosition(options, p) {
    // Auto-position menu if no 'position' option was passed
    if (options.position == null) {
      // auto-positioning
      let menuPosition = 'mdl-menu--';
      if (p.frame.dy < 0.5) {
        menuPosition += 'bottom-';
      } else {
        menuPosition += 'top-';
      }
      if (p.frame.dx < 0.5) {
        menuPosition += 'left';
      } else {
        menuPosition += 'right';
      }
      return menuPosition;
    }
  }
}

module.exports = MdlMenu;
