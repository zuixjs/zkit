---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 6
options: mdl highlight sponsor
theme: indigo-pink
icon: move_up
title: Transpose Fx
description: Transpose effect to transition a component between two views
keywords:
- Header
- Hide
- Auto
- Scroll
---

The `transpose-fx` controller can be used to swap an element from a view to another one.
For instance when an element in a list view is clicked and the detail view is shown.


**Demo:** Tap elements to pop up the details view:

{% unpre %}
```html
{% include './_inc/example.liquid' %}
```
{% endunpre %}


<!--
<div layout="row center-center">
  <video controls autoplay loop width="100%" style="max-width: 560px">
    <source src="transpose-fx-example.m4v" type="video/webm">
  </video>
</div> 
-->

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `transpose-fx` component module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/transpose-fx.module.js";
</script>
```

### 2. Add component

Add the component inside the details view/dialog/popup element:

```html
<div z-context="transpose-fx">
    <transpose-fx></transpose-fx>

    <!-- gesture detection area -->

    <div class="transpose-fx-container">
      <!-- the element will be transposed here -->
    </div>

    <!-- view contents ... -->

</div>
```

  </div>
  <div class="mdl-tabs__panel" id="script">


{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the `transpose-fx` controller

Add the `ctrl z-load` attributes to the element hosting the target view, and, inside, add the class
`transpose-fx-container` to the destination container into which the source element will be transposed:

```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/transpose-fx"
     z-context="tfx" class="my-dialog-view">

    <div class="transpose-fx-container">
        <!-- the element will be transposed here -->
    </div>

    <!-- view contents ... -->

</div>
```

  </div>
</div>


Use the `z-context` attribute to assign an identifier to the transpose controller, so that it can be easily referenced
in order to begin/end the transpose effect at any time. In the example above the identifier `tfx` is assigned using the
`z-context` attribute.

Set the initial `display` mode of the target view to `none`, the controller will take care of showing/hiding the
view when requested.

```css
.my-dialog-view {
    display: none;
    /* ... */
}
```


### 3. Transpose elements

To transpose an element to the target view, call the `toggle` method of the transpose controller,
passing to it a reference to the element to be transposed:

```js
<img src="my-image.png" onclick="zuix.context('tfx').toggle(this)">
```

Source elements can be also components, not just image.


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`


# Events

- `transpose:begin`
- `transpose:end`


## Scripting

Get a reference to the component instance:

```js
zuix.context('tfx', (tfx) => {
  // store a global reference for later use
  self.transposeFx = tfx;
});
```

### Methods

```js
// Transpose 'element' to the transposeFx container
transposeFx.begin(element);
// Transpose element back to its home position
transposeFx.end();
// toggle transposeFx on 'element'
transposeFx.toggle(element);
```
