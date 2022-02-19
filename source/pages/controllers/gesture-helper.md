---
layout: side_drawer.html
options: mdl highlight
theme: indigo-pink
order: 2
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

Detect tap and swipe gestures over elements.

{% unpre %}
```html
<div self="size-large center">
    <div ctrl z-load="@lib/controllers/gesture-helper"
         z-options="gesture_opts"
         layout="column center-center"
         self="center"
         class="no-select gesture-box">
        <!-- gesture detection area -->
        <div #gesture-xy></div>
        <div #gesture-shift></div>
        <div #gesture layout="row center-center">Try me!</div>
    </div>

</div>
<script>
gesture_opts = {
    passive: false,
    ready: function() {
        let gh = this;
        let view = zuix.$(gh.view());
        let infoXy = zuix.field('gesture-xy');
        let infoShift = zuix.field('gesture-shift');
        let info = zuix.field('gesture');
        view.css('opacity', 1.0);
        // register event callbacks
        gh.on('gesture:touch', function(e, tp) {
            view.addClass('active');
            info.html('touch').animateCss('flash');
            tp.cancel();
        }).on('gesture:pan', function(e, tp) {
            infoXy.show().html(Math.round(tp.x) + ' ; ' + Math.round(tp.y));
            infoShift.show().html(Math.round(tp.shiftX) + ' ;' + Math.round(tp.shiftY));
            info.html('pan').animateCss('fadeIn');
        }).on('gesture:release', function(e, tp) {
            view.removeClass('active');
            infoXy.hide();
            infoShift.hide();
        }).on('gesture:tap', function(e, tp) {
            info.html('tap').animateCss('tada');
        }).on('gesture:swipe', function(e, tp) {
            info.html('swipe <i class="material-icons animated tada">keyboard_arrow_' + tp.direction + '</i> ' + tp.direction);
        });
    }
};
</script>
<style>
    .gesture-box {
        border: solid 2px rgba(255,255,255,0.5);
        position: relative;
        background: #5f99cf;
        border-radius: 16px;
        width: 70%;
        height: 200px;
        color: white;
        font-size: 160%;
        line-height: 120%;
        margin: 32px 16px 16px;
        font-family: Helvetica, sans-serif;
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
        -webkit-box-shadow: 0 0 40px -8px rgba(0,0,0,0.75);
        -moz-box-shadow: 0 0 40px -8px rgba(0,0,0,0.75);
        box-shadow: 0 0 40px -8px rgba(0,0,0,0.75);
        opacity: 0.75;
    }
    .gesture-box.active {
        -webkit-box-shadow: 0 0 20px -2px rgba(0,0,0,0.75);
        -moz-box-shadow: 0 0 20px -2px rgba(0,0,0,0.75);
        box-shadow: 0 0 20px -2px rgba(0,0,0,0.75);
        opacity: 1.0;
    }
    [z-field="gesture"] {
        transition: 0.1s ease-out;
    }
    [z-field="gesture"] i {
        font-size: 300%;
        color: lime;
    }
    [z-field="gesture-xy"] {
        position: absolute;
        top: 8px; left: 16px;
        font-size: 50%;
        font-weight: 700;
    }
    [z-field="gesture-shift"] {
        position: absolute;
        top: 8px; right: 16px;
        font-size: 50%;
        font-weight: 700;
    }
</style>
```
{% endunpre %}


{% include 'common/zkit-basic-usage.md' %}

### 2. Load the gesture helper on the target element 

Add the `ctrl z-load` attributes to the element you want to detect gesture over

```html
<div ctrl z-load="@lib/controllers/gesture-helper"
     z-options="gesture_options">

    <!-- gesture detection area -->

</div>
<script>
gesture_options = {
  on: {
    'gesture:touch': function(e, tp) {
      // TODO: handle touch
    },
    'gesture:pan': function(e, tp) {
      // TODO: handle pan
    },
    'gesture:release': function(e, tp) {
      // TODO: handle release
    },
    'gesture:tap': function(e, tp) {
      // TODO: handle tap
    },
    'gesture:swipe': function(e, tp) {
      // TODO: handle swipe
      switch(tp.direction) {
        case 'up':
          break;
        case 'down':
          break;
        case 'left':
          break;
        case 'right':
          break;
      }
    }
  }
}
</script>
```

Event callbacks receive the `tp` *(TouchPointer)* argument that is described below:

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

## Option attributes

- `ctrl z-load="@lib/controllers/gesture-helper"` <small>constructor</small>  
  load the `gesture-helper` controller on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `data-o-passive` <small>optional</small>  
  use [passive mode](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
  for best performance or disable passive mode to prevent default scrolling.  
  The default value is `true`.
