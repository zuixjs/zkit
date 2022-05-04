---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 1
options: mdl highlight
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

{% include 'common/zkit-basic-usage.md' %}

### 2. Load the drawer layout

Add the `ctrl z-load` attributes to the container of your navigation drawer
```html
<div ctrl z-load="@lib/controllers/drawer-layout"
     z-context="menu-drawer"
     z-options="drawer_options">

  <!-- Add Navigation Drawer menu and content here -->

</div>
```

Set the options

```js
drawer_options = {
  on: {
    'drawer:open': function(e) {
      // things to do when drawer is open
    },
    'drawer:close': function(e) {
      // things to do when drawer is closed
    },
    'layout:change': function(e, status) {
        // where `status` object has two fields
        // {
        //    smallScreen, (boolean)
        //    drawerLocked (boolean)
        // }
    }
  },
  autoHideWidth: 960,
  drawerWidth: 280
};
```

### Option attributes

- `ctrl z-load="@lib/controllers/drawer-layout"` <small>(constructor)</small>  
  loads the `drawer-layout` controller on the host element
- `z-context` <small>optional</small>  
  identifier name to be used to reference this component from JavaScript.
- `data-o-width` <small>optional</small>  
  panel width. Default value is `280` pixels.
- `data-o-hide-width` <small>optional</small>  
  auto-hide panel if available width is less than specified value, otherwise show as fixed.
  Set to `-1` to always auto-hide. Default value is `960` pixels.


## Scripting
### Event listeners

```js
var menuDrawer;
// since the component loads asynchronously
// a callback is required to ensure the component is ready
zuix.context('menu-drawer', (md) => {
  // add event listeners
  md.on({
    'drawer:open': function(e) { /* ... */ },
    'drawer:close': function(e) { /* ... */ },
    'layout:change': function(e, d) { /* ... */ }
  });
  // store a global reference of
  // the component for later use
  menuDrawer = md;
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

You can try these command in the developer console right now from this page.
