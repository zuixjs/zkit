---
layout: side_drawer.html
options: mdl highlight
theme: indigo-pink
order: 1
icon: menu
title: Context Menu
description: A bottom popping context menu, like the one commonly used on mobile devices.
keywords:
- Bottom
- Context
- Menu
- Overlay
- Mobile
- Responsive
---

Animated context menu component that does not require JavaScript coding for a basic use.
This component is framework-agnostic, it will play nicely in combination with any UI framework.

{% zx "button" "javascript:zuix.context('my-menu').show()" "raised" "colored" %}
Example
{% endzx %}

{% include 'common/zkit-basic-usage.md' %}

### 2. Add the context menu `div` markup

Put inside the field `menu` the code of your menu items.

```html
<div z-load="@lib/components/context-menu"
     z-context="my-menu">
  <div #menu>
    <!-- menu items list -->
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
  </div>
</div>
```

The context menu already provides basic styling for the `button` element, though you can use any kind of element and
custom styling.

## Option attributes

- `z-load="@lib/components/context-menu"` <small>constructor</small>  
  load the `context-menu` component on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.

## Scripting

### Event listeners

```js
var contextMenu;

// since the component loads asynchronously
// a callback is required to ensure the component is ready
zuix.context('my-menu', function() {

  // add event listeners
  this
    .on('open', function() { /* ... */})
    .on('close', function() { /* ... */});

  // store a global reference of
  // the component for later use
  contextMenu = this;

});
```

### Programmatically show/hide

```js
// show the menu
contextMenu.show();

// hide the menu
contextMenu.hide();
```

{% zx "button" "javascript:zuix.context('my-menu').show()" "raised" "colored" %}
Example
{% endzx %}

{% rawFile "example.html" %}
