---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 3
options: mdl highlight sponsor
theme: indigo-pink
icon: list_alt
title: List View
description: List View with lazy-loaded elements
keywords:
- Header
- Hide
- Auto
- Scroll
---

The `list-view` controller renders items of a list using a component or view template associated to each item.  
It supports the following list rendering modes:

- **full**:  
  the full items list is rendered in one pass
- **incremental**:  
  items are appended to the list as the list is being scrolled down
- **paginated**:  
  items list is organized into browsable pages

Regardless of the selected mode, the generated list consists of simple empty <code>div</code> containers with a fixed height
matching the height of the associated components, and that are later replaced with the actual components when they
are about to become visible in the scroll area (components loaded lazily).

Components preload threshold can be adjusted using the [`zuix.lazyLoad(..)`](https://zuixjs.org/pages/documentation/api/zuix/Zuix/#lazyLoad) method.  


**Example**

*Client-side rendered list of 500 components from a <a href="./test-data.json" target="blank">JSON data file</a>.*

{% unpre %}
```html
{% include './_inc/example.liquid' %}
```
{% endunpre %}


## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `list-view` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/list-view.module.js";
</script>
```

### 2. Add component

Add the `list-view` component:

```html
<list-view z-context="my-list-view"
           :items-per-page="50"
           :list-mode=" 'incremental' "
           :model="myDataSource"
           :adapter="myDataAdapter"></list-view>
```

  </div>
  <div class="mdl-tabs__panel" id="script">


{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the `list-view` controller

Add the `ctrl z-load` attributes to the element hosting the *list-view*:

```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/list-view"
     z-context="my-list-view"
     :items-per-page="50"
     :list-mode=" 'incremental' "
     :model="myDataSource"
     :adapter="myDataAdapter">
</div>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"`
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:list-mode` <small>optional</small>  
  list mode can be `full`, `incremental` or `paginated`. The default value is `full`.
- `:items-per-page` <small>optional</small>
  pages to load for a single page. Works for `paginated` and `incremental` modes. The default value is `30`.
- `:model`  
  sets the data model (array of items) that will be used to render the list
- `:adapter`  
  sets the adapter callback that will return the component configuration for a given `(index, item)` pair.

####


## Events

- `list:busy` &rarr; *()*  
  the list view is busy rendering
- `list:ready` &rarr; *()*  
  the list view is ready
- `list:update` &rarr; *(e, info)*  
  data has been updated
- `page:change` &rarr; *(e, info)*  
  page changed

The `info` object passed to the `list:update` and `page:change` events, has the following format:

```json
{
  "page": {
    "current": 0,
    "count": 17
  },
  "items": {
    "current": 8,
    "loaded": 9,
    "count": 500
  }
}
```



## Scripting

### The data `:model` and the `:adapter` callback

The data items passed to the `:model` option, is an array of objects that can be of any type.  
Then, the `:adapter` callback will be called as needed by the `list-view` controller for each item that
is being rendered to get all required data to display the item.

```js
const myDataAdapter = (index, item) => ({
  componentId: item.componentId,
  type: item.type,
  options: {
    on: {click: (e, data, $el) => console.log('clicked', $el)},
    model: item.model
  },
  className: item.className
});
```

In the data returned by the adapter, the `componentId` field sets the component or template to be used to display the
item.

For example, an `inline/banner-example` template, can be defined with the following *HTML* code:

```html
<template z-view="inline/banner-example">

  <div #title class="title"></div>
  <div #text class="text"></div>

  <style>
    :host {
      background-color: white;
    }
    .title {
      font-size: 200%;
      color:  deeppink;
    }
    .text {
      padding: 12px;
    }
  </style>

</template>
```

The above template will be applied to each item with `componentId` set to `inline/banner-example`, and the content of the
two `div`s with the `#title` and `#text` attributes, will be replaced with the corresponding fields in the data returned
as `model` by the data adapter.

The other fields returned by the data adapter, `type` and `options` are also required to create the component.  
The `type` attribute must be set to `view` in case the `componentId` is a view template, like in this example, or
it can be omitted if it's a regular component with also a `.js` controller.  
With the `options` object it's possible to set the data passed to the component by using the `options.model` field.  
A complete description of all `options` fields is available in the [*zuix.js* Context Options](https://zuixjs.org/pages/documentation/context_options/) documentation. 

The `className` is an optional but strongly recommended parameter for best performance. It sets a name of a CSS class that
will be added to the component's container, so that the container will have the same size of the rendered component even
if it's not loaded yet.


### Getting a reference to the `list-view` component:

```js
zuix.context('my-list-view', (lv) => {
  // store a global reference for later use
  self.listView = lv;
});
```


### Methods

```js
// sets the list-view mode and items per page
listView.config({
  listMode: 'paginated',
  itemsPerPage: 50,
  data: myDataSource,
  adapter: myDataAdapter
});

// get the data model
const data = listView.model();
// add more data
data.push(...newData);

// clear all items
listView.clear();
```

When mode is set to `paginated`, the following methods can be used:

```js
// go to current page or get current page if no argument is specified
listView.page(4);
let currentPage = listView.page(); 

// goto previous page
listView.prev();

// goto next page
listView.next();
```

When mode is `incremental`, the following method can be used

```js
// load more items
listView.more();
```
