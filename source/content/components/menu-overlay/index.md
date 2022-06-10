---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 2
options: mdl highlight sponsor
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

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `menu-overlay` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}components/menu-overlay.module.js";
</script>
```

### 2. Add component to the page

```html
<menu-overlay z-context="menu-overlay">

  <div #items>

    <!-- menu items list -->
    <a href="#link_1">Menu Item 1</a>
    <a href="#link_2">Menu Item 2</a>
    <a href="#link_3">Menu Item 3</a>

  </div>

</menu-overlay>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Add the menu markup

Put inside the field `items` the code for your menu items.

```html
<div z-load="{{ app.zkit.libraryPath }}components/menu-overlay"
     z-context="menu-overlay">

  <div #items>

    <!-- menu items list -->
    <a href="#link_1">Menu Item 1</a>
    <a href="#link_2">Menu Item 2</a>
    <a href="#link_3">Menu Item 3</a>

  </div>

</div>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:scroller="'<field_id>'"` <small>optional</small>  
  if the scrolling container it is not the main document, use this parameter to specify the value of field attribute  
  assigned to the container with the scroll.
- `:button-color="'<color>'"` <small>optional</small>  
  color of the menu button. The default value is `deeppink`.
- `:icon-color="'<color>'"` <small>optional</small>  
  color of the menu button icon. The default value is `white`.
- `:position="'<position>'"` <small>optional</small>  
  sets the position of the button. It can be `left`, `center` or `right`. The default value is `right`.
- `:before="'<field_id>'"` <small>optional</small>  
  show only before the element with the specified field name (eg. 'footer')
- `:after="'<field_id>'"` <small>optional</small>  
  show only after the element with the specified field name (eg. 'header')


## Events

- `open` - occurs when the menu opens
- `close` - occurs when the menu is closed


## Customizing button

You can customize the appearance of the menu button by overriding the template fields:

- {% zx 'button' '#noop' 'fab' 'mini-fab primary' %}add{% endzx %}  
  `#menu_button` for the normal state button
  
- {% zx 'button' '#noop' 'fab' 'mini-fab primary' %}close{% endzx %}  
  `#menu_button_close` for the open state button


For instance the example menu in this page is using Material Design Lite FAB (floating action buttons):

```html
<menu-overlay>

  <div #items>

        <!-- menu items list -->

  </div>

  <!-- custom open/close menu button -->

  <template #menu_button>

    <mdl-button :type="'fab'" :class="'primary'">
      add
    </mdl-button>

  </template>

  <template #menu_button_close>

    <mdl-button :type="'fab'" :class="'primary'">
      remove
    </mdl-button>

  </template>

</menu-overlay>
```

## Scripting

Get a reference to the component instance:

```js
zuix.context('menu-overlay', (mo) => {
  // store a global reference for later use
  self.menuOverlay = mo;
});
```

Programmatically show/hide:

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

{% include "./_inc/example.wc.liquid" %}
