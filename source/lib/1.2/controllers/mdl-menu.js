/**
 * MdlMenu class.
 *
 * @author Gene
 * @version 1.0.0 (2021-12-19)
 *
 * @constructor
 * @this {ContextController}
 */
class MdlMenu extends ControllerInstance {
  onInit() {
    const theme = this.options().theme || 'indigo-pink';
    const isShadowRoot = this.view().parent().get() instanceof ShadowRoot;
    if (isShadowRoot) {
      this.options().fetchOptions = {priority: 'low'};
    }
    if (!self.MaterialMenu) {
      this.using('script', '@cdnjs/material-design-lite/1.3.0/material.min.js');
    }
    if (!zuix.$.classExists('.mdl-button') || isShadowRoot) {
      this.using('style', '@cdnjs/material-design-lite/1.3.0/material.' + theme + '.min.css');
    }
    // loads fonts as a global resource
    if (!zuix.$.classExists('.material-icons')) {
      zuix.using('style', 'https://fonts.googleapis.com/icon?family=Material+Icons&display=swap');
    }
    // apply custom css
    this.options().css = `ul{
       margin:0 !important;
       padding:0 !important;
    }
    li {
      width:100%;
      display:flex!important;
      flex-direction:row;
      gap:8px;
      align-items:center
    }
    li[disabled] {
      pointer-events: none;
    }
    a {
      text-decoration: none;
    }`;
  }

  onCreate() {
    // position relative must be set on the container
    // in order to make MaterialMenu positioning work properly
    this.view().css('position', 'relative');
    const position = this.options().position;
    // generate unique identifier for this instance
    const menuId = 'menu-' + this.context.contextId;
    // add required MDL classes to elements
    const ul = this.view('ul');
    if (!ul.length()) return;
    if (position) ul.addClass('mdl-menu--' + position);
    ul.addClass('mdl-menu mdl-js-menu mdl-js-ripple-effect')
        .attr('for', menuId);
    ul.get().__mdl_menu_forel = this.options().forel;
    ul.find('li').on('click', function(e, $li) {
      if (e.target === $li.get()) {
        this.find('a').each((i, el, $el) => {
          el.click();
        });
      }
    });
    this.view('li')
        .addClass('mdl-menu__item mdl-menu__item--full-bleed-divider')
        .on('click', (e, $el) => {
          // trigger a custom event when option is selected,
          // the 'action' attribute of the clicked element
          // is used to pass custom data
          this.trigger('menu:select', {action: $el.attr('action'), $el});
        });
    const getPositionClass = (source) => {
      if (ul.hasClass('mdl-menu--unaligned')) return;
      const menuPosition = this.guessPosition(this.options(), source.position());
      if (menuPosition) {
        const positionClasses = 'mdl-menu--bottom-left mdl-menu--bottom-right mdl-menu--top-left mdl-menu--top-right';
        ul.removeClass(positionClasses)
            .addClass(menuPosition);
        ul.prev().removeClass(positionClasses)
            .addClass(menuPosition);
        // reset container position as a work-around to MaterialMenu bug
        this.view('div.mdl-menu__container').css({
          top: '', left: '', right: '', bottom: ''
        });
      }
    };
    this.expose({
      toggle: (el) => ul.get().MaterialMenu.toggle(el),
      show: (el) => ul.get().MaterialMenu.show(el),
      hide: () => ul.get().MaterialMenu.hide()
    });
    // if anchor or button is present in the view template, then use it as button to toggle the menu
    let button = this.view('a,button');
    if (this.options().forel) {
      button = zuix.$(this.options().forel);
      button.detach();
      this.view().prepend(button);
    } else if (button.length() >= 1) {
      button = button.eq(button.length() - 1);
      button.attr('id', menuId)
          .addClass('mdl-button mdl-js-button mdl-js-ripple-effect');
    }
    if (button) button.on('click', () => getPositionClass(button));
    getPositionClass(this.view());

    // Upgrade MDL elements
    zuix.activeRefresh(this.view(), this.view(), null, ($view, $element, data, nextCallback) => {
      if (window['componentHandler']) {
        this.patchMDL();
        new MaterialMenu(ul.get());
        componentHandler.upgradeElements(ul.get().querySelectorAll('li'));
        if (button.length() >= 1) {
          componentHandler.upgradeElements(button.get());
        }
        this.context.isReady = true;
      } else {
        nextCallback(data, 33, true);
      }
    }).start();
  }

  /**
   * @param {ContextOptions|any} options
   * @param {ElementPosition} p
   */
  guessPosition(options, p) {
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

  patchMDL() {
    if (window['__mdl_patched'] !== true) {
      Object.defineProperty(window, '__mdl_patched', {value: true});
      /**
       * Patch MDL init
       */
      MaterialMenu.prototype.init = function() {
        if (this.element_) {
          // Create container for the menu.
          const container = document.createElement('div');
          container.classList.add(this.CssClasses_.CONTAINER);
          this.element_.parentElement.insertBefore(container, this.element_);
          this.element_.parentElement.removeChild(this.element_);
          container.appendChild(this.element_);
          this.container_ = container;

          // Create outline for the menu (shadow and background).
          const outline = document.createElement('div');
          outline.classList.add(this.CssClasses_.OUTLINE);
          this.outline_ = outline;
          container.insertBefore(outline, this.element_);

          // Find the "for" element and bind events to it.
          const forElId = this.element_.getAttribute('for') ||
              this.element_.getAttribute('data-mdl-for');
          let forEl = this.element_.__mdl_menu_forel;

          if (forEl == null && forElId) {
            forEl = document.getElementById(forElId);
          }
          if (forEl) {
            this.forElement_ = forEl;
            forEl.addEventListener('click', this.handleForClick_.bind(this));
            forEl.addEventListener('keydown',
                this.handleForKeyboardEvent_.bind(this));
          }

          const items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
          this.boundItemKeydown_ = this.handleItemKeyboardEvent_.bind(this);
          this.boundItemClick_ = this.handleItemClick_.bind(this);
          for (let i = 0; i < items.length; i++) {
            // Add a listener to each menu item.
            items[i].addEventListener('click', this.boundItemClick_);
            // Add a tab index to each menu item.
            items[i].tabIndex = '-1';
            // Add a keyboard listener to each menu item.
            items[i].addEventListener('keydown', this.boundItemKeydown_);
          }

          // Add ripple classes to each item, if the user has enabled ripples.
          if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
            this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

            for (let i = 0; i < items.length; i++) {
              const item = items[i];

              const rippleContainer = document.createElement('span');
              rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);

              const ripple = document.createElement('span');
              ripple.classList.add(this.CssClasses_.RIPPLE);
              rippleContainer.appendChild(ripple);

              item.appendChild(rippleContainer);
              item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
            }
          }

          // Copy alignment classes to the container, so the outline can use them.
          if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
            this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
          }
          if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
            this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
          }
          if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
            this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
          }
          if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
            this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
          }
          if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
            this.outline_.classList.add(this.CssClasses_.UNALIGNED);
          }

          container.classList.add(this.CssClasses_.IS_UPGRADED);

          if (forEl) {
            setTimeout(() => {
              zuix.context(forEl, (ctx) => {
                const isMini = ctx.$.hasClass('mdl-button--mini-fab');
                const isIcon = ctx.$.hasClass('mdl-button--icon');
                ctx.$.find('.material-icons').css({
                  transition: 'none',
                  transform: 'translate(0,0)', WebkitTransform: 'translate(0,0)',
                  marginTop: isMini ? '8px' : isIcon ? '0' : '16px',
                  marginLeft: isMini || isIcon ? '1px' : '2px',
                  position: 'initial'
                });
              });
            }, 250);
          }
        }
      };

      if (!MaterialMenu.prototype._hide) {
        MaterialMenu.prototype._hide = MaterialMenu.prototype.hide;
        MaterialMenu.prototype.hide = function() {
          if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
            zuix.context(this.container_.parentElement, (ctx) => {
              ctx._c.trigger('menu:hide', this.forElement_);
            });
            this._hide();
          }
        };
      }
      if (!MaterialMenu.prototype._show) {
        MaterialMenu.prototype._show = MaterialMenu.prototype.show;
        MaterialMenu.prototype.show = function(p) {
          zuix.context(this.container_.parentElement, (ctx) => {
            ctx._c.trigger('menu:show', this.forElement_);
          });
          this._show(p);
        };
      }
    }
  }
}
