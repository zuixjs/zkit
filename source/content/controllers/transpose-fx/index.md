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

<div layout="row center-center">
  <video controls autoplay loop width="100%" style="max-width: 560px">
    <source src="transpose-fx-example.m4v" type="video/webm">
  </video>
</div> 

{% include 'common/zkit-basic-usage.md' %}

### 2. Load the `transpose-fx` controller

Add the `ctrl z-load` attributes to the element hosting the target view, and, inside, add the class
`transpose-fx-container` to the destination container into which the source element will be transposed:

```html
<div ctrl z-load="@lib/controllers/transpose-fx"
     z-context="tfx" class="my-dialog-view">

    <div class="transpose-fx-container">
        <!-- the element will be transposed here -->
    </div>

    <!-- view contents ... -->

</div>
```

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

Source elements can be also components, not just images.

{% unpre %}
```html
{% include './_inc/example.liquid' %}
```
{% endunpre %}

## Option attributes

- `ctrl z-load="@lib/controllers/transpose-fx"` <small>constructor</small>  
  load the `transpose-fx` controller on the hosting element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.


## Scripting

### Event listeners


```js
var transposeFx;
// since the component loads asynchronously
// a callback is required to ensure the component is ready
zuix.context('tfx', (tfx) => {
  // add event listeners
  tfx.on({
    'transpose:begin': function() { /* ... */ },
    'transpose:end': function() { /* ... */ }
  });
  // store a global reference of
  // the component for later use
  transposeFx = tfx;
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
