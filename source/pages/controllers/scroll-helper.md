---
layout: side_drawer.html
options: mdl highlight
theme: indigo-pink
order: 3
icon: swap_vert
title: Scroll Helper
description: Scroll helper to improve page scrolling handling, watching elements and get notified when they scroll into view.
keywords:
- Scroll
- Smooth
- Control
- Watch
- Elements
---

{% include 'common/zkit-basic-usage.md' %}

## 2. Load the scroll helper

Add the `ctrl z-load` attributes to the host element implementing the scrollbar (usually the main `body` or a `div` element):

```html
<html>
<!-- ... -->
<body ctrl z-load="@lib/controllers/scroll-helper"
      z-context="scroll-helper">
<!-- ... -->
</body>
</html>
```

## Option attributes

- `ctrl z-load="@lib/controllers/scroll-helper"` <small>constructor</small>  
  load the `scroll-helper` controller on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.


## Scripting

### Get a reference to the scroll helper object

Before component is loaded

```js
var scrollHelper; // it will be == null until component is loaded
zuix.context('scroll-helper', function() {
  // component loaded
  scrollHelper = this;
});
```

or at any time after component is loaded

```js
var scrollHelper = zuix.context('scroll-helper');
```

### Listen to events

```js
scrollHelper.on('scroll:change', function(e, data) {
  switch (data.event) {

    case 'hit-top':
      // reached top of page
      break;

    case 'scroll':
      if (data.info.shift.y < 0) {
        // scrolling up
      } else if (data.info.shift.y > 0) {
        // scrolling down
      }
      // for all fields of the data.info
      // object see next paragraph
      break;

    case 'hit-bottom':
      // reached end of page
      break;

  }
});
```

### Get scroll information

```js
// get the scroll info object
const info = scrollHelper.info();

info -> {

  // last event timestamp
  timestamp: 1524263175438,

  // movement since previous event
  shift: {
    x: 0,
    y: -3
  },

  // total scroll area size
  size: {
    width: 1280,
    height: 5281
  },

  // visible area size and position
  viewport: {
    x: 0,
    y: -3313,
    width: 1280,
    height: 720
  }

}
```

## Watching DOM elements

The `watch` method takes one argument that can be either an element object or a valid  DOM query selector expression.

```js
// watch elements having the 'watchable' class
scrollHelper.watch('.watchable', function(el, data) {
  switch (data.event) {

    case 'enter':
      // element entered the visible area
      break;

    case 'exit':
      // element out of the visible area
      break;

    case 'scroll':
      // element is being scrolled in the visible area
      break;

    case 'off-scroll':
      // element is being scrolled out of the visible area
      break;

  }
});
```

The `data` object passed to the watch callback is described below

```js
data = {

    // event: 'enter' | 'exit' | 'scroll' | 'off-scroll'
    event,

    // element position, status, rect and frame
    x,       // float
    y,       // float

    visible, // boolean

    rect: {  // DOMRect
        x,
        y,
        height,
        width,
        left,
        right,
        top,
        bottom
    },

    frame: { // relative center position
        dx,
        dy,
    }

}
```

The `frame` object represents the position of the center of the element relative to the viewport size. Specifically, `dx`
and `dy` are float numbers that have values between `0` and `1` when the element is inside the viewport. So when the
element is at the center of the viewport, `dx` and `dy` will have a value of `0.5`.  
Otherwise, it will be less than `0` if the element is above the viewport top or lastly greater than `1` when the element
is below the viewport bottom.

This value can be used to create responsive and synchronized scroll animations based on current viewport
offset and elements position.

### Other methods

```js
// scroll to the start of page
scrollHelper.scrollStart( [duration_ms] );

// scroll to the end of page
scrollHelper.scrollEnd( [duration_ms] );

// scroll to element or offset
scrollHelper.scrollTo( element | offset_px );
```


## Demos

- [Demo page](../../../1.0/docs/controllers/scroll_helper) from older `zKit` release
