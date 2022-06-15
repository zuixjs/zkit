---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 3
options: mdl highlight sponsor
theme: indigo-pink
icon: perm_media
title: Media Browser
description: A gestures enabled media browser supporting image, videos and text.
keywords:
- Media
- Browser
- Video
- Pictures
- Slideshow
- Carousel
- Blog
---

An image/video gallery component configurable with minimal HTML code.

**Features:**
- navigation by onscreen controls, keyboard or gestures
- thumbnails carousel
- images with customizable title/description overlay
- MP4, WebM, and Ogg videos 
- youtube videos
- fullscreen mode
- inline / detached mode
- automatic play/pause when entering or going off-screen

## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `media-browser` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}components/media-browser.module.js";
</script>
```

### 2. Add component to the page

```html
<media-browser z-context="media-browser"
               :inline="true" :slide="5000">

    <!-- List of images/videos (#media container) -->
    <div #media>

        <!-- Example image item -->
        <article>
            <h1 #title>Title</h1>
            <h2 #description>Description of the image.</h2>
            <!-- Image thumbnail url -->
            <img #preview src="https://picsum.photos/400/300/?image=201">
            <!-- Full-size image url -->
            <a #url href="https://picsum.photos/1600/1200/?image=201">Open media</a>
        </article>
  
        <!-- Example video item -->
        <article data-type="video" slide-interval="15000">
          <!-- Video thumbnail url -->
          <img #preview src="sample/images/BigBuckBunny.jpg">
          <!-- video URL -->
          <a #url href="sample/BigBuckBunny.mp4">Open media</a>
        </article>

        <!-- Example YouTube video item -->
        <article data-type="video-yt">
          <!-- Video thumbnail url -->
          <img #preview src="https://img.youtube.com/vi/IdtM6OPdaio/2.jpg">
          <!-- YouTube video URL -->
          <a #url href="https://youtu.be/IdtM6OPdaio">Open media</a>
        </article>

    </div> <!-- end of #media container -->

</media-browser>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' -%}

### 2. Add the media list markup

Put inside the field <code>media</code> the markup defining image and video list.

```html
<div z-load="{{ app.zkit.libraryPath }}components/media-browser"
     z-context="media-browser" :inline="true" :slide="5000">

    <!-- List of images/videos (#media container) -->
    <div #media>

        <!-- Example image item -->
        <article>
            <h1 #title>Title</h1>
            <h2 #description>Description of the image.</h2>
            <!-- Image thumbnail url -->
            <img #preview src="https://picsum.photos/400/300/?image=201">
            <!-- Full-size image url -->
            <a #url href="https://picsum.photos/1600/1200/?image=201">Open media</a>
        </article>
  
        <!-- Example video item -->
        <article data-type="video" slide-interval="15000">
          <!-- Video thumbnail url -->
          <img #preview src="sample/images/BigBuckBunny.jpg">
          <!-- video URL -->
          <a #url href="sample/BigBuckBunny.mp4">Open media</a>
        </article>

        <!-- Example YouTube video item -->
        <article data-type="video-yt">
          <!-- Video thumbnail url -->
          <img #preview src="https://img.youtube.com/vi/IdtM6OPdaio/2.jpg">
          <!-- YouTube video URL -->
          <a #url href="https://youtu.be/IdtM6OPdaio">Open media</a>
        </article>

    </div> <!-- end of #media container -->

</div>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:inline="<show_inline>"` <small>optional</small>  
  if set to `true`, the media browser will be displayed inline rather than detached. The default value is `false` and  
  the media-browser will open only programmatically in fullscreen.
- `:slide="<interval_ms>"` <small>optional</small>  
  enables auto-slide mode. The value of the attribute indicates the amount of milliseconds to pause between each slide.  
  A different sliding interval can be specified for each item by adding the `slide-interval` attribute on the item  
  with the amount of milliseconds to wait before next slide.
- `:button="'<button_name>'"` <small>optional</small>  
  The `<button_name>` associated to the element that will open the media-browser when clicked.  
  The attribute `#<button_name>` must be added to the button element. Only works in detached mode (not inline).


## Events


- `open` - occurs when the media-browser opens
- `close` - occurs when the media-browser is closed
- `fullscreen:open`
- `fullscreen:close`
- `controls:hide`
- `controls:show`
- `page:change`
- `refresh:active`
- `refresh:inactive`


&nbsp;


<script type="module">
  import "{{ app.zkit.libraryPath }}components/media-browser.module.js";
</script>

**Example 1 (inline)**

Using `:inline` attribute set to `true`.

{% include "./_inc/example_inline.wc.liquid" %}


&nbsp;


**Example 2 (detached)**

Without the `:inline` attribute and using the `:button` option. In this case the media-browser is not visible
in the page unless the button is clicked.

{% zx "button" "javascript:void(0);" "raised" "colored" 'z-field=open-button' %}
Open fullscreen
{% endzx %}
{% rawFile "_inc/example.wc.html" %}

Multiple instances of the media-browser are allowed on the same page.


## Scripting

Get a reference to the component instance:

```js
zuix.context('media-browser', (mb) => {

  // store a global reference for later use
  self.mediaBrowser = mb;

  // open the media browser
  mediaBrowser.open();

});
```

Methods

```js
// show the media browser
mediaBrowser.open();

// hide the media browser
mediaBrowser.close();

// get the current page
let currentPage = mediaBrowser.current();

// set the current page
mediaBrowser.current(4);

// go to the previous page
mediaBrowser.prev();

// go to the next page
mediaBrowser.next();

// show/hide/toggle controls overlay
mediaBrowser.showControls();
mediaBrowser.hideControls();
mediaBrowser.toggleControls();

// set fullscreen mode
mediaBrowser.fullScreen(true);
```
