---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 3
options: mdl highlight
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

An image/video gallery component configurable with a minimal HTML code.

{% capture exampleButton %}
{% zx "button" "javascript:zuix.context('media-browser').open();void(0)" "raised" "colored" %}
Example
{% endzx %}
{% endcapture %}
{{ exampleButton}}

{% include 'common/zkit-basic-usage.md' %}

### 2. Add the media list markup

Put inside the field <code>media</code> the markup defining image and video list.

```html
<div z-load="@lib/components/media-browser"
     z-context="media-browser">

    <!-- List of images/videos (#media container) -->
    <div #media>

        <!-- Example image item -->
        <article>
            <h1 #title>Title</h1>
            <h2 #description>Description of the image.</h2>
            <div #preview>
                <!-- Image thumbnail url -->
                <img src="https://picsum.photos/400/300/?image=201">
            </div>
            <!-- Full-size image url -->
            <a #full href="https://picsum.photos/1600/1200/?image=201">Full Size</a>
        </article>

        <!-- Example YT video item -->
        <article data-type="video">
            <!-- YouTube video id -->
            <div #video>yYVz4RPyuDk</div>
            <div #preview>
                <!-- Video thumbnail url -->
                <img src="https://img.youtube.com/vi/yYVz4RPyuDk/2.jpg">
            </div>
        </article>

    </div> <!-- end of #media container -->

</div>
```

That's all.

## Options attributes

- `z-load="@lib/components/media-browser"` <small>constructor</small>  
  load the `media-browser` component on the element.
- `z-context` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.

## Scripting

### Get a reference to the media browser object

```js
var mediaBrowser;
// since the component loads asynchronously
// a callback is required to ensure the component is ready
zuix.context('media-browser', function () {

  // store a global reference of the
  // component for eventual later use
  mediaBrowser = this;

  // open the media browser
  mediaBrowser.open();

});
```

### Programmatically show/hide

```js
// show the media browser
mediaBrowser.open();
// hide the media browser
mediaBrowser.close();
```


{{ exampleButton }}

{% rawFile "_inc/example.html" %}
