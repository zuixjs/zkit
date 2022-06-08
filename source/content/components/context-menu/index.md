---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 1
options: mdl highlight sponsor
theme: indigo-pink
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

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `context-menu` component module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}components/context-menu.module.js";
</script>
```

### 2. Add component to the page

Put inside the `#menu` field the code of your menu items.

```html
<context-menu z-context="my-menu">

  <div #menu>

    <!-- menu items list -->
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>

  </div>

</context-menu>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Add component to the page

Put inside the `#menu` field the code of your menu items.

```html
<div z-load="{{ app.zkit.libraryPath }}components/context-menu"
     z-context="my-menu">

  <div #menu>

    <!-- menu items list -->
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>

  </div>

</div>
```

  </div>
</div>


The context menu already provides basic styling for the `button` element, though you can use any kind of element and
custom styling.


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`


## Events

- `open` - occurs when the menu opens
- `close` - occurs when the menu is closed


## Scripting

Get a reference to the component instance:

```js
zuix.context('my-menu', (menu) => {
  // store a global reference for later use
  self.contextMenu = menu;
});
```

Programmatically show/hide:

```js
// show the menu
contextMenu.show();

// hide the menu
contextMenu.hide();
```

{% zx "button" "javascript:zuix.context('my-menu').show()" "raised" "colored" %}
Example
{% endzx %}

{% unpre %}
```html
{% include "./_inc/example.liquid" %}
```
{% endunpre %}
