---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 2
options: mdl highlight sponsor
theme: indigo-pink
icon: swipe
title: Gesture Helper
description: Helper class for detecting common touch gestures.
keywords:
- Gesture
- Detection
- Swipe
- Pan
- Touch
---

{% include './_inc/demo.liquid' %}

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `gesture-helper` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/gesture-helper.module.js";
</script>
```

### 2. Add component

Add the gesture helper component inside the detection area element: 

```html
<div>

    <gesture-helper z-context="gesture-helper"></gesture-helper>

    <!-- gesture detection area -->

</div>
```

  </div>
  <div class="mdl-tabs__panel" id="script">


{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the gesture helper on the target element 

Add the `ctrl z-load` attributes to the element you want to detect gesture over

```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/gesture-helper"
     z-context="gesture-helper">

    <!-- gesture detection area -->

</div>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:passive` <small>optional</small>  
  use [passive mode](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
  for best performance or disable passive mode to prevent default scrolling.  
  The default value is `true`.
- `:start-gap` <small>optional</small>


## Events

- `gesture:touch` 
- `gesture:pan`
- `gesture:release`
- `gesture:tap`
- `gesture:swipe`

Event handlers receive as second argument the `tp` *(TouchPointer)* object that is described below:

```js
tp = {

  // time frame
  startTime,
  endTime,

  // initial touch position
  startX,
  startY,

  // relative movement
  shiftX,
  shiftY,

  // actual direction, speed, position
  direction, // 'left' | 'right' | 'up' | 'down'
  velocity,
  x: x,
  y: y,

  // guessed scrolling direction
  scrollIntent(),  // false | 'horizontal' | 'vertical'

  // original event + cancel method
  event,
  cancel()
};
```
