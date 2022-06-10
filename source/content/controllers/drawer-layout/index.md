---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 3
options: mdl highlight sponsor
theme: indigo-pink
icon: space_dashboard
title: Drawer Layout
description: An adaptive drawer layout for both mobile and desktop displays, gestures enabled.
keywords:
- Navigation
- Drawer
- Material
- Design
- Touch
- Responsive
- Desktop
- Mobile
---

This is a responsive implementation of a *navigation drawer* that will also work on wide screens where the drawer will
stay open on the left side.

<blockquote cite="https://developer.android.com/guide/navigation/navigation-ui#add_a_navigation_drawer">
The navigation drawer is a UI panel that shows your app's main navigation menu.
It is hidden when not in use, but appears when the user swipes a finger from the left edge of the screen or,
when at the top level of the app, the user touches the drawer icon in the app bar.
</blockquote>

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `drawer-layout` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/drawer-layout.module.js";
</script>
```

### 2. Add component to the page

```html
<drawer-layout z-context="menu-drawer">

  <!-- Add Navigation Drawer menu and content here -->

</drawer-layout>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the drawer layout

Add the `ctrl z-load` attributes to the container of your navigation drawer
```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/drawer-layout"
     z-context="menu-drawer">

  <!-- Add Navigation Drawer menu and content here -->

</div>
```

  </div>
</div>


### Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:drawer-width="<width_px>"` <small>optional</small>  
  panel width. Default value is `280` pixels.
- `:auto-hide-width="<width_px>"` <small>optional</small>  
  auto-hide panel if available width is less than specified value, otherwise show as fixed.
  Set to `-1` to always auto-hide. Default value is `960` pixels.
- `:main-content` <small>optional</small>
  element hosting the main page content. The drawer will automatically resize the content when open and
  page width is greater than `:auto-hide-width` 


### Events


- `drawer:open` - occurs when the drawer opens
- `drawer:close` - occurs when the drawer is closed
- `layout:change` - occurs when the page layout changed.  
  The second argument of the callback is a status object with two fields:  
  `{smallScreen: boolean, drawerLocked: boolean}`


## Scripting

Get a reference to the component instance:

```js
zuix.context('menu-drawer', (md) => {
  // store a global reference for later use
  self.menuDrawer = md;
});
```

### Methods

```js
// open the drawer
menuDrawer.open();
// close the drawer
menuDrawer.close();
// toggle open/close drawer
menuDrawer.toggle();
// enable/disable control by gesture
menuDrawer.lock(true);
```
