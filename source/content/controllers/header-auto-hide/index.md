---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 5
options: mdl highlight sponsor
theme: indigo-pink
icon: table_chart
title: Header Auto Hide
description: Automatically hides/reveals header on scroll.
keywords:
- Header
- Hide
- Auto
- Scroll
---

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `header-auto-hide` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/header-auto-hide.module.js";
</script>
```

### 2. Add component to the page

```html
<body>

  <header-auto-hide z-context="header-auto-hide"
                    :header=" 'header-field' "
                    :footer=" 'footer-field' "></header-auto-hide>

  <header #header-field> ... </header>

  <!-- page content -->

  <footer #header-field> ... </footer>

</body>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the `header-auto-hide` controller

Add the `ctrl z-load` attributes to the component with the scrollbar
```html
<body ctrl z-load="{{ app.zkit.libraryPath }}controllers/header-auto-hide"
     z-context="header-auto-hide"
     :header=" 'header-field' "
     :footer=" 'footer-field' ">

  <header #header-field> ... </header>
  
  <!-- page content -->

  <footer #header-field> ... </footer>

</body>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:header`  
  field name of the header element.
- `:footer` <small>optional</small>  
  field name of the footer element.
- `:show-end` <small>optional</small>  
  show header when scroll hits page's bottom (default: `false`).
- `:z-index` <small>optional</small>  
  set the specified `z-index` to header/footer elements
- `:scroll-host` <small>optional</small>  
  field name of the element hosting the scrollbar. This value is auto-detected by default.


## Events

- `page:scroll` (e, data) - occurs when the page is scrolling


## Scripting

Get a reference to the component instance:

```js
zuix.context('header-auto-hide', (ah) => {
  // store a global reference for later use
  self.headerAutoHide = ah;
});
```

### Methods

```js
// shows header/footer
headerAutoHide.show();
// hides header/footer
headerAutoHide.hide();
// gets a reference to the Scroll Helper component
const scrollHelper = headerAutoHide.scroll();
```
