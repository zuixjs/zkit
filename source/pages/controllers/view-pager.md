---
layout: side_drawer.html
options: mdl highlight
theme: indigo-pink
order: 4
icon: view_carousel
title: View Pager
description: View Pager component for implementing carousel, gallery, tab-views. Gesture enabled, for desktop and mobile.
keywords:
- ViewPager
- Tabs
- Horizontal scroll
- Vertical scroll
- Swipe
- Carousel
- Gallery
---

A versatile ViewPager controller, featuring both horizontal and vertical layout, gestures and automatic sliding.

{% include 'common/zkit-basic-usage.md' %}

### 2. Load the scroll helper

Add the `ctrl z-load` attributes to the host element implementing the scrollbar (usually the main `body` or a `div` element):

```html
<div ctrl z-load="@lib/controllers/view-pager">
    <!-- Content pages of this ViewPager -->
    <div>Page 1</div>
    <div>Page 2</div>
    <div>Page 3</div>
</div>
```

The ViewPager will re-arrange all elements stacked horizontally or vertically accordingly to the chosen layout mode.  
Elements do not necessarily require to be sized full screen, they can have different sizes, in which case the ViewPager
will center the active element in the view.


## Options

// TODO: ...

- `ctrl z-load="@lib/controllers/view-pager"` <small>constructor</small>  
  load the <code>view-pager</code> controller on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to reference this component from JavaScript.
- `z-options` <small>optional</small>  
  name of a global variable defining options to use for this component. See next page for details.
- `data-o-layout` <small>optional</small>  
  layout of elements can be `horizontal` or `vertical`. The default value is `horizontal`.
- `data-o-paging` <small>optional</small>  
  after scrolling, automatically select and focus the closest element centering it in the view. The default value is `false`.
- `data-o-slide` <small>optional</small>  
  slide-show mode (cycle elements). The default value is `false`.
- `data-o-slide-interval` <small>optional</small>  
  interval between each slide (milliseconds). The default value is `750`.
- `data-o-passive` <small>optional</small>  
  use <a href="https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md" target="_blank" rel="noopener">passive mode</a>
  for best performance or disable passive mode to prevent default scrolling. The default value is <code>true</code>.
- `data-o-hold`  <small>optional</small>
  prevent touch events from being propagated to other elements off the view. The default value is `false`.
- `data-o-hide`  <small>optional experimental</small>  
  set page visibility to `hidden` when off view. The default value is `false`.


## Scripting

### ViewPager object

A reference to a ViewPager instance can be obtained through its context identifier which is assigned by adding the `z-context`
attribute to the ViewPager element and finally by using the `zuix.context(...)` method.

Since components are loaded asynchronously the `zuix.context` method might return `null` if called before the component
is actually ready.  
So, when not sure if the component is ready, a `callback` function can be passed as the `zuix.context` argument and it will be
called once the component has been loaded, passing a reference to it as argument of the callback function.

```html
<div z-context="my-view-pager" ctrl
     z-load="@lib/controllers/view-pager">

  <!-- view pager content -->

</div>

<script>
let viewPager;
zuix.context('my-view-pager', function(ctx) {

  viewPager = ctx; // also `this` === ctx 

});
</script>
```

Alternatively the `ready` callback function can be passed with the `z-options` attribute:

```html
<div ctrl z-load="@lib/controllers/view-pager"
     z-options="vp_options">

  <!-- ... -->

</div>
<script>
let viewPager;
vp_options = {
  ready: (ctx) => viewPager = ctx
}
</script>
```

Other `z-options` fields:

```js
vp_options = {
  autoSlide: true,      // default `false`
  enablePaging: true,   // default `false`
  slideInterval: 500,   // default `750`
  verticalLayout: true, // default `false`
  holdTouch: true,      // default `false`
  passive: false,       // default `true`
  autoHide: true        // default `false`
}
```


## Examples

{% layout "rows center-spread" 'style="margin-bottom: 56px"' %}

{% rawFile "example-1.html" %}
{% rawFile "example-2.html" %}

{% endlayout %}


## Demos

- [Media Browser](../../components/media-browser) component
