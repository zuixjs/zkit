/**
 * ListView controller class.
 *
 * @version 1.1.0 (2022-06-14)
 * @version 1.0.3 (2017-06-11)
 * @author Gene
 *
 * @constructor
 * @this {ContextController}
 */
function ListView() {
  const cp = this;

  // List type
  const MODE_FULL = 'full';
  const MODE_PAGINATED = 'paginated';
  const MODE_INCREMENTAL = 'incremental';
  // Initial mode set to 'full'
  let listMode = MODE_FULL;

  // How many items per page to show/add (for 'paginated' and 'incremental' modes) (default: 30)
  let itemsPerPage = 30;

  // Structure used to store component state info
  const updateInfo = {
    page: {
      current: 0,
      count: 0
    },
    items: {
      current: -1,
      loaded: 0,
      count: 0
    }
  };

  // Data list and adapter
  let dataAdapter;

  // Loaded component reference
  const loadedComponents = [];

  // Component's life-cycle interface

  cp.create = () => {
    // expose public component's methods
    cp.expose({
      config,
      page,
      prev: () => page(updateInfo.page.current - 1),
      next: () => page(updateInfo.page.current + 1),
      more: () => {
        updateInfo.page.current++;
        renderList();
      },
      clear
    });
    // set initial config
    cp.options().itemsPerPage = cp.options().itemsPerPage || itemsPerPage;
    cp.options().listMode = cp.options().listMode || listMode;
    config(cp.options());
  };
  cp.update = () => renderList();
  cp.dispose = () => clear();

  // Private methods

  function renderList() {
    const dataModel = cp.model();
    if (!dataModel || typeof dataAdapter !== 'function') {
      clear();
      return;
    }

    cp.trigger('list:busy');

    updateInfo.page.count = pageCount();
    updateInfo.items.count = dataModel.length;

    const startItem = updateInfo.page.current * itemsPerPage;
    let i = 0;
    if (listMode === MODE_PAGINATED && startItem > 0) {
      i = startItem;
    }

    for ( ; i < dataModel.length; i++) {
      const item = JSON.parse(JSON.stringify(dataModel[i]));
      const dataItem = dataAdapter(i, item);
      if ((listMode === MODE_FULL) ||
        (listMode === MODE_PAGINATED && i >= startItem && i < startItem+itemsPerPage) ||
        (listMode === MODE_INCREMENTAL && i < startItem+itemsPerPage)) {
        if (!loadedComponents[i]) {
          // allocate component
          const container = zuix
              .$(document.createElement('div'))
              .attr('z-lazy', 'true');

          // use a responsive CSS class if provided
          if (dataItem.className != null) {
            // this class should set the min-height property
            container.addClass(dataItem.className);
          } else {
            // set a temporary height for the container (for lazy load to work properly)
            container.css({minHeight: dataItem.height || '48px'});
          }

          // register a callback to know when the component is actually loaded
          const setupListener = (itemIndex, el) => {
            const componentReady = () => {
              // update info and trigger status update event
              updateInfo.items.loaded++;
              updateInfo.items.current = itemIndex;
              // if all components have been loaded, then trigger 'complete' event
              if (itemIndex === dataModel.length - 1) {
                cp.trigger('list:end');
              } else if (itemIndex + 1 === (updateInfo.page.current + 1) * itemsPerPage) {
                if (listMode === MODE_INCREMENTAL) {
                  page(updateInfo.page.current + 1);
                }
              }
              triggerStatusUpdate();
            };
            el.one({'component:ready': componentReady});
          };
          setupListener(i, container);
          //const options = JSON.parse(JSON.stringify(dataItem.options));
          zuix.loadComponent(container, dataItem.componentId, dataItem.type, dataItem.options);
          // keep track of already allocated items
          loadedComponents[i] = container;
          // add item container to the list-view, the component will be lazy-loaded later as needed
          cp.view().insert(startItem + i, loadedComponents[i]);
        } else if (!dataItem.static) {
          // update existing item dataModel's data
          const ctx = zuix.context(loadedComponents[i]);
          if (ctx) {
            if (JSON.stringify(ctx.model()) !== JSON.stringify(dataItem.options.model)) {
              ctx.model(dataItem.options.model);
            }
          }
        }
      }

      if (typeof loadedComponents[i] !== 'undefined') {
        if ((listMode === MODE_PAGINATED && i < updateInfo.page.current * itemsPerPage) ||
          (listMode !== MODE_FULL && i > ((updateInfo.page.current + 1) * itemsPerPage - 1))) {
          loadedComponents[i].hide();
        } else {
          loadedComponents[i].show();
        }
      }

      if ((listMode === MODE_PAGINATED || listMode === MODE_INCREMENTAL) && i > startItem+itemsPerPage) {
        break;
      }
    }

    cp.trigger('list:ready');

    // `componentize` is required to process lazy-loaded items
    zuix.componentize(cp.view());
  }

  function page(number) {
    if (!isNaN(number) && number >= 0 && number < pageCount()) {
      if (listMode === MODE_PAGINATED) {
        clearPage(updateInfo.page.current);
      }
      updateInfo.page.current = parseInt(number);
      cp.trigger('page:change', updateInfo);
      renderList();
    }
    return updateInfo.page.current;
  }
  function clearPage(number) {
    if (!cp.model()) return;
    const startItem = number * itemsPerPage;
    for (let i = startItem; i < cp.model().length && i < startItem + itemsPerPage; i++) {
      if (typeof loadedComponents[i] !== 'undefined') {
        loadedComponents[i].hide();
      }
    }
  }

  function pageCount() {
    return Math.ceil(cp.model().length / itemsPerPage);
  }

  function config(options) {
    if (options == null) {
      return {
        itemsPerPage,
        listMode,
        adapter: dataAdapter
      };
    }
    const refresh = () => {
      renderList();
      cp.trigger('page:change', updateInfo);
    };
    let changed = false;
    if (options.itemsPerPage != null) {
      itemsPerPage = options.itemsPerPage;
      changed = true;
    }
    if ([MODE_FULL, MODE_PAGINATED, MODE_INCREMENTAL].indexOf(options.listMode) !== -1 && listMode !== options.listMode) {
      listMode = options.listMode;
      changed = true;
    }
    if (typeof options.adapter === 'function') {
      dataAdapter = options.adapter;
      changed = true;
    }
    changed && clear(refresh);
  }

  function clear(callback) {
    cp.trigger('list:busy');
    setTimeout(() => {
      // dispose components
      loadedComponents.forEach((c) => zuix.unload(c));
      loadedComponents.length = 0;
      if (callback) callback();
      cp.trigger('list:ready');
    });
    updateInfo.page.current = 0;
    updateInfo.page.count = 0;
    updateInfo.items.loaded = 0;
    updateInfo.items.count = 0;
    // clear the view
    cp.view().html('');
  }

  function triggerStatusUpdate() {
    cp.trigger('list:update', updateInfo);
  }
}

module.exports = ListView;
