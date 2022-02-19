/**
 * zUIx - ListView Component
 *
 * @version 1.0.3 (2017-06-11)
 * @author Gene
 *
 */

zuix.controller(function(cp) {
  // Set list type: [ 'full', 'paged', 'incremental' ] (default: 'full')
  const MODE_FULL = 'full';
  const MODE_PAGED = 'paged';
  const MODE_INCREMENTAL = 'incremental';
  let listMode = MODE_FULL;

  // How many items per page to show/add (for 'paged' and 'incremental' modes) (default: 30)
  let itemsPerPage = 30;

  // Structure used to store component state info
  const statusInfo = {
    page: {
      current: 0,
      count: 0
    },
    items: {
      loaded: 0,
      count: 0
    }
  };

  // Objects data persistence
  const listItems = [];

  cp.init = function() {
    cp.options().html = false;
    cp.options().css = false;
  };

  // TODO: describe the model and options used by this component
  cp.create = function() {
    // exposed methods through this component context
    cp.expose('config', configure);
    cp.expose('page', setPage);
    cp.expose('status', triggerStatus);
    cp.expose('more', function() {
      statusInfo.page.current++;
      cp.update();
    });
    cp.expose('clear', clear);
    // init
    clear();
  };

  cp.destroy = function() {
    clear();
  };

  cp.update = function() {
    const modelList = cp.model().itemList;
    if (modelList == null) return;

    statusInfo.page.count = pageCount();
    statusInfo.items.count = modelList.length;

    const startItem = statusInfo.page.current*itemsPerPage;
    let i = 0;
    if (listMode === MODE_PAGED && startItem > 0) {
      i = startItem;
    }

    for ( ; i < modelList.length; i++) {
      const dataItem = cp.model().getItem(i, modelList[i]);
      const id = dataItem.itemId;

      if ((listMode === MODE_FULL) ||
                (listMode === MODE_PAGED && i >= startItem && i < startItem+itemsPerPage) ||
                (listMode === MODE_INCREMENTAL && i < startItem+itemsPerPage)) {
        if (typeof listItems[id] === 'undefined') {
          const container = zuix.createComponent(dataItem.componentId, dataItem.options).container();
          // use a responsive CSS class if provided
          if (dataItem.options.className != null) {
            // this class should set the min-height property
            container.classList.add(dataItem.options.className);
          } else {
            // set a temporary height for the container (for lazy load to work properly)
            container.style['min-height'] = dataItem.options.height || '48px';
          }
          // register a callback to know when the component is actually loaded
          const listener = function(itemIndex, el) {
            const l = function() {
              el.removeEventListener('component:ready', l);
              // trigger status update event
              statusInfo.items.loaded++;
              triggerStatus();
              // if all components have been loaded, then trigger 'complete' event
              if (itemIndex === modelList.length - 1) {
                cp.trigger('complete');
              }
            };
            container.addEventListener('component:ready', l);
          }(i, container);
          // keep track of already allocated items
          listItems[id] = container;
          // add item container to the list-view, the component will be lazy-loaded later as needed
          cp.view().insert(i-startItem, listItems[id]);
        } else if (!dataItem.options.static) {
          // update existing item model's data
          // TODO: should check if the data in the model has changed before calling this
          // TODO: should also call the `model` method in the `zuix.context` callback
          zuix.context(listItems[id]).model(dataItem.options.model);
        }
      }

      if (typeof listItems[id] !== 'undefined') {
        if ((listMode === MODE_PAGED && i < statusInfo.page.current * itemsPerPage) ||
                    (listMode !== MODE_FULL && i > ((statusInfo.page.current + 1) * itemsPerPage - 1))) {
          listItems[id].style['display'] = 'none';
        } else {
          listItems[id].style['display'] = '';
        }
      }

      if ((listMode === MODE_PAGED || listMode === MODE_INCREMENTAL) && i > startItem+itemsPerPage) {
        break;
      }
    }

    // trigger status update event
    triggerStatus();

    // `componentize` is required to process lazy-loaded items
    zuix.componentize(cp.view());
  };

  function setPage(number) {
    if (!isNaN(number) && number >= 0 && number < pageCount()) {
      if (listMode == MODE_PAGED) {
        clearPage(statusInfo.page.current);
      }
      statusInfo.page.current = parseInt(number);
      cp.update();
    }
    return statusInfo.page.current;
  }

  function clearPage(number) {
    const modelList = cp.model().itemList;
    if (modelList == null) return;
    const startItem = number*itemsPerPage;
    for (let i = startItem; i < listItems.length && i < startItem+itemsPerPage; i++) {
      const dataItem = cp.model().getItem(i, modelList[i]);
      const id = dataItem.itemId;
      if (typeof listItems[id] !== 'undefined') {
        listItems[id].style['display'] = 'none';
      }
    }
  }

  function triggerStatus() {
    cp.trigger('status', statusInfo);
  }

  function pageCount() {
    return Math.ceil(cp.model().itemList.length / itemsPerPage);
  }

  function configure(options) {
    if (options.itemsPerPage != null) {
      itemsPerPage = options.itemsPerPage;
    }
    if (options.listMode != null) {
      listMode = options.listMode;
    }
  }

  function clear() {
    // dispose components
    for (let i = 0; i < listItems.length; i++) {
      zuix.unload(listItems[i]);
    }
    listItems.length = 0;
    statusInfo.page.current = 0;
    statusInfo.page.count = 0;
    statusInfo.items.loaded = 0;
    statusInfo.items.count = 0;
    // clear the view
    cp.view().html('');
  }
});
