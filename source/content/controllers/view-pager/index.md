---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 4
options: mdl highlight sponsor
theme: indigo-pink
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

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">


### 1. Import `view-pager` component module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/view-pager.module.js";
</script>
```

### 2. Add component to the page

```html
<view-pager z-context="my-view-pager">

  <!-- Content pages of this ViewPager -->

  <div>Page 1</div>

  <div>Page 2</div>

  <div>Page 3</div>

</view-pager>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Load the view pager

Add the `ctrl z-load` attributes to the host element:

```html
<div ctrl z-load="{{ app.zkit.libraryPath }}controllers/view-pager"
     z-context="my-view-pager">

    <!-- Content pages of this ViewPager -->

    <div>Page 1</div>

    <div>Page 2</div>

    <div>Page 3</div>

</div>
```

  </div>
</div>


The ViewPager will re-arrange all elements stacked horizontally or vertically accordingly to the chosen layout mode.  
Elements do not necessarily require to be sized full screen, they can have different sizes, in which case the ViewPager
will center the active element in the view.


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:vertical-layout` <small>optional</small>  
  layouts elements vertically. The default value is `false`.
- `:paging` <small>optional</small>  
  after scrolling, automatically select and focus the closest element centering it in the view. The default value is `false`.
- `:auto-slide` <small>optional</small>  
  slide-show mode (cycle elements). The default value is `false`.
- `:slide-interval` <small>optional</small>  
  interval between each slide (milliseconds). The default value is `750`.
- `:passive` <small>optional</small>  
  use <a href="https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md" target="_blank" rel="noopener">passive mode</a>
  for best performance or disable passive mode to prevent default scrolling. The default value is <code>true</code>.
- `:hold-touch`  <small>optional</small>
  prevent touch events from being propagated to other elements off the view. The default value is `false`.
- `:auto-hide`  <small>optional experimental</small>  
  set page visibility to `hidden` when off view. The default value is `false`.
- `:start-gap` <small>optional</small>


### Events

- `page:change` - occurs when the page is changed  
  The second argument of the callback is an object containing the fields `in` (the new page number) and `out` (the old page number):  
  `{in: <current_page>, out: <old_page>}`
- `page:tap` - occurs when a page is tapped  
  The second argument of the callback is the tapped page number.


## Scripting

Get a reference to the component instance:

```js
zuix.context('my-view-pager', (vp) => {
  // store a global reference for later use
  self.viewPager = vp;
});
```


## Examples

<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/view-pager.module.js";
</script>


{% layout "rows center-spread" 'style="margin-bottom: 56px"' %}

{% rawFile "_inc/example-1.html" %}
{% rawFile "_inc/example-2.html" %}

{% endlayout %}


## Demos

- [News Blog](https://zuixjs.github.io/news-blog/) starter template
- [News Reader PWA](https://zuixjs.github.io/zuix-html-pwa/) demo
- [Media Browser](../../components/media-browser) component
