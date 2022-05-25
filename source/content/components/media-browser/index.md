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

{% include 'common/zkit-basic-usage.md' -%}

### 2. Add the media list markup

Put inside the field <code>media</code> the markup defining image and video list.

```html
<div z-load="@lib/components/media-browser"
     z-context="media-browser" data-o-inline="true" data-o-slide="5000">

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

That's all.


**Example 1 (inline)**

Using `data-o-inline` attribute set to `true`.

{% include './_inc/example_inline.liquid' %}

---

**Example 2 (detached)**

Without the `data-o-inline` attribute and using the `data-o-button` option. In this case the media-browser is not visible
in the page unless the button is clicked. 

{% zx "button" "javascript:void(0);" "raised" "colored" 'z-field=open-button' %}
Open fullscreen
{% endzx %}

{% rawFile "_inc/example.html" %}

Multiple instances of the media-browser are allowed on the same page.


## Option attributes

- `z-load="@lib/components/media-browser"` <small>constructor</small>  
  load the `media-browser` component on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `data-o-inline` <small>optional</small>  
  if set to `true`, the media browser will be displayed inline rather than detached. The default value is `false` and  
  the media-browser will open only programmatically in fullscreen.
- `data-o-slide` <small>optional</small>  
  enables auto-slide mode. The value of the attribute indicates the amount of milliseconds to pause between each slide.  
  A different sliding interval can be specified for each item by adding the `slide-interval` attribute on the item  
  with the amount of milliseconds to wait before next slide.
- `data-o-button` <small>optional</small>  
  The `<button_name>` associated to the element that will open the media-browser when clicked.  The attribute  
  `z-field="<button_name>"` must be added to the button element. Only works in detached mode (not inline).


## Scripting

The media-browser component can also be controlled with JavaScript.

### Get a reference to the media browser object

```js
var mediaBrowser;
zuix.context('media-browser', (mb) => {

  // store a global reference of the
  // component for eventual later use
  mediaBrowser = mb;

  // open the media browser
  mediaBrowser.open();

});
```

### Methods

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

### Events

```js
mediaBrowser.on({
  'open': (e) => { /* ... */ },
  'close': (e) => { /* ... */ },
  'fullscreen:open': (e) => { /* ... */ },
  'fullscreen:close': (e) => { /* ... */ },
  'controls:hide': (e) => { /* ... */ },
  'controls:show': (e) => { /* ... */ },
  'page:change': (e, pageInfo) => { /* ... */ },
  'refresh:active': (e, pageInfo) => { /* ... */ },
  'refresh:inactive': (e, pageInfo) => { /* ... */ }
});
```
