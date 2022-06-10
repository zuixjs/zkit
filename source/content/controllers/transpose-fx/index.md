---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 1
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
For instance when an element in a list view is clicked and the detail view of that element is then shown.


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

### 1. Import `transpose-fx` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/transpose-fx.module.js";
</script>
```

### 2. Add component

Add the `transpose-fx` component inside the element hosting the target view:

```html
<div class="my-dialog-view">

    <transpose-fx z-context="tfx"></transpose-fx>

    <div class="transpose-fx-container">
      <!-- the element will be transposed here -->
    </div>

    <!-- view content ... -->

</div>
```

  </div>
  <div class="mdl-tabs__panel" id="script">


{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the `transpose-fx` controller

Add the `ctrl z-load` attributes to the element hosting the target view:

```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/transpose-fx"
     z-context="tfx" class="my-dialog-view">

    <div class="transpose-fx-container">
        <!-- the element will be transposed here -->
    </div>

    <!-- view content ... -->

</div>
```

  </div>
</div>

Use the `z-context` attribute to assign an identifier to the transpose controller. In the example above the assigned
identifier is `tfx`.

Add the class `transpose-fx-container` to the container that will host the transposed element once clicked.

Set the initial `display` mode of the target view to `none` (the details view), the controller will take care of
showing/hiding the view when required.

```css
.my-dialog-view {
    display: none;
    /* ... */
}
```


### 3. Transpose elements

Add the attribute `[transpose-to="<context_id>"]` to elements you want to be opened in the detail view when clicked.
In this example the `<context_id>` is `tfx`. 

```html
   <img transpose-to="tfx" src="...">
```

Source elements can be also components, not just images.


## Option attributes

- `z-context="<context_id>"`
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`


# Events

- `transpose:begin` (e, element)
- `transpose:end` (e, element)


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
