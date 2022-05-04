---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 2
options: mdl highlight
theme: blue-pink
icon: menu_open
title: Menu Overlay
description: A classic floating action button activated menu for page-contextual operations. 
keywords:
- Menu
- Overlay
- Animated
- Floating
- Action
- Button
---

A menu overlay activated by a floating action button. The pink button in the lower right corner of this page is a sample
usage. No JavaScript coding is required for a basic use.

This component is framework-agnostic, so it can be used with any UI framework or even with just plain `HTML/CSS`.

{% include 'common/zkit-basic-usage.md' %}

### 2. Add the menu markup

Put inside the field `items` the code for your menu items.

```html
<div z-load="@lib/components/menu-overlay"
     z-context="menu-overlay">

  <div #items>

    <!-- menu items list -->
    <a href="#link_1">Menu Item 1</a>
    <a href="#link_2">Menu Item 2</a>
    <a href="#link_3">Menu Item 3</a>

  </div>

</div>
```

... and that's it! Super duper easy **: )**

## Option attributes

- `z-load="@lib/components/menu-overlay"` <small>constructor</small>  
  load the `menu-overlay` component on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `data-o-scroller` <small>optional</small>  
  if the scrolling container it is not the main document, use this parameter to specify the value of field attribute  
  assigned to the container with the scroll.
- `data-o-button-color` <small>optional</small>  
  color of the menu button. The default value is `deeppink`.
- `data-o-icon-color` <small>optional</small>  
  color of the menu button icon. The default value is `white`.
- `data-o-position` <small>optional</small>  
  sets the position of the button. It can be `left`, `center` or `right`. The default value is `right`.
- `data-o-before` <small>optional</small>  
  show only before the element with the specified field name (eg. 'footer')
- `data-o-after` <small>optional</small>  
  show only after the element with the specified field name (eg. 'header')


## Customizing

You can customize the appearance of the menu button by overriding the template fields:

- {% zx 'button' '#noop' 'fab' 'mini-fab primary' %}add{% endzx %}  
  `#menu_button` for the normal state button
  
- {% zx 'button' '#noop' 'fab' 'mini-fab primary' %}close{% endzx %}  
  `#menu_button_close` for the open state button


For instance the example menu in this page is using Material Design Lite FAB (floating action buttons):

```html
<div z-load="@lib/components/menu-overlay">

  <div #items>

        <!-- menu items list -->

  </div>

  <!-- custom open/close menu button -->

  <div #menu_button>
    <a ctrl z-load="@lib/controllers/mdl-button" z-options="toggleButton">
      <i class="material-icons">message</i>
    </a>
  </div>

  <div #menu_button_close>
    <a ctrl z-load="@lib/controllers/mdl-button" z-options="toggleButton">
      <i class="material-icons">close</i>
    </a>
  </div>

</div>
<script>
toggleButton = { type: 'fab', class: 'accent', lazyLoad: false };
</script>
```

## Scripting

### Event listeners

```js
var menuOverlay;
// since the component loads asynchronously
// a callback is required to ensure the component is ready
zuix.context('menu-overlay', (mo) => {
  // add event listeners
  mo.on({
    open: function() { /* ... */ },
    close: function() { /* ... */ }
  });
  // store a global reference of
  // the component for later use
  menuOverlay = mo;
});
```

### Programmatically show/hide

```js
// show the menu (enable)
menuOverlay.show();
// hide the menu (disable)
menuOverlay.hide();
// show the menu button
menuOverlay.showButton();
// hide the menu button
menuOverlay.hideButton();
// whether the button is showing or not
buttonShowing = menuOverlay.showing();
```

{% rawFile "_inc/example.html" %}
