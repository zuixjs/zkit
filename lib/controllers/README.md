# zUIx components library

This folder contains a collection of **framework agnostic UI controllers**.

Either you are using plain HTML or an UI framework
(eg. Bootstrap, Material Design Lite, ..) these controllers will work.

## kit/controllers

#### scroll_helper

This component will trigger the following events when attached to a
scrollable view:

- *scrollHelper* **->** *moving*
- *scrollHelper* **->** *hitTop*
- *scrollHelper* **->** *hitBottom*

Can also be loaded as an additional controller for other components
(eg. a list_view):

Example:

```javascript
zuix.load('kit/controllers/scroll_helper', {
    view: myLvScroll.view(),
    on: {
        'scroll:change': function (e, data) {
            switch (data.event) {
                case 'moving':
                    hideFooter();
                    break;
                case 'hitTop':
                    showFooter();
                    break;
                case 'hitBottom':
                    showFooter();
                    break;
            }
        }
    }
});
```

// TODO: document method 'watch(<selector_of_elements_to_watch>)'
// TODO: document watch events: 'enter', 'exit', 'off-scroll', 'scroll'


#### list_view

A lazy-loadable list view component supporting *paged*, *incremental* and
*full* list modes.

Each item in the list can be displayed using a different component/template
(similar concept to heterogeneous view adapters in Android's list/recycler view).

An example using the `list_view` control is the Hacker News Reader:

https://github.com/g-labs-sw/zuix-hackernews

To include this control in your page use:

```html
<div data-ui-load="@lib/controllers/list_view"
     data-ui-options="my_lv_options"></div>
```

Example javascript code for `my_lv_options`:

```javascript
var my_lv_options = {
    ready: function(listView){
        listView = ctx;
        // set list mode to 'paged' and number of items per page
        listView.config({
            listMode: 'paged',
            itemsPerPage: 30
        });
        // listen to the listView 'status' event
        // this event gets called when an item is loaded
        // or page is changed
        listView.on('status', function (e, status) {
            console.log(status.page.current,
                    status.page.count,
                    status.items.loaded,
                    status.items.count);
        });
        // pass the data model to the component
        listView.model({
            itemList: myItemsList,
            // this method is called by the `list_view`
            // when an item is about to be loaded
            getItem: function (index, item) {
                return {
                    // Unique identifier for this item.
                    itemId: index,
                    // Display item using "my_components/card_item" component.
                    componentId: 'my_components/card_item',
                    // Component options.
                    options: {
                        // Set the item model's data.
                        model: { index: index, data: item },
                        // Do not check for item's model updates
                        // if it does not change once created.
                        static: true,
                        // Load the component only when
                        // it's about to come into the user's screen view
                        lazyLoad: true,
                        // The min-height of the item container
                        // should be specified before the component
                        // is loaded in order to prevent list resize
                        // flickering after lazy-loading an item.
                        // So we either define a responsive 'className'
                        // or a fixed 'height' property.
                        className: 'list-item',
                        //height: '48px',
                        // Event handlers that the `card_item` component
                        // may trigger.
                        on: {
                            'item:enter': function (e, item) {
                                item.view.addClass('active');
                            },
                            'item:leave': function (e, item) {
                                item.view.removeClass('active');
                            }
                            // ...
                        },
                        ready: function (cardCtx) {
                            // ...
                        }
                    }
                }
            }
        });
    }

};
```

Methods of the **list_view** component:

```javascript
// set configuration options
listView.config({
    listMode: 'paged',
    itemsPerPage: 50
});
// get status informations (current page, loaded items, etc...)
var info = listView.getStatus();
// get current page (used for 'paged' list mode)
var currentPage = listView.page();
// set current page
listView.page(10);
// load more items (used for 'incremental' list mode)
listView.more();
// list for 'status' event
listView.on('status', function(info) {
    // ...
});
```

#### gesture_helper

// TODO: Document gesture detector for touch/pointer gestures...


#### view_pager

// TODO: Document view pager controller...
