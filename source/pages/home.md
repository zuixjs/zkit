---
layout: side_drawer.html
options: mdl highlight no-title no-footer
theme: green-pink
order: 0
icon: home
title: Welcome
description: zKit, a collection of framework-agnostic components for the web
keywords:
- zuix
- zuix.js
- web starter
- home
- components
- web
- pwa
---


{% unpre %}
```html
<div self="size-x1" layout="column center-center" style="margin: 24px; margin-bottom: 72px; margin-top: 72px; width:auto!important">
    <div layout="row center-center" class="animate__animated animate__fadeInDown animate__fast" style="font-size: 300%">
        <strong>Z</strong>
        <i style="font-size: 150%; margin-bottom: 6px; color: mediumseagreen; margin-right: 4px; margin-left: 4px" class="material-icons animate__animated animate__bounce">
            extension
        </i>
        <strong>K</strong>
        <strong style="font-size: 50%">IT</strong>
    </div>
    <small class="animate__animated animate__fadeIn animate__slower">web enhancing bits</small>
    <code class="animate__animated animate__fadeInUp animate__slower" style="margin-top: 12px; padding: 0">
        made with <a href="https://zuixjs.org">zUIx.js</a>
    </code>
</div>
```
{% endunpre %}

`zKit` is a collection of framework-agnostic components for the web, built with `zuix.js` as an example of the library
features.

These components can also be loaded at runtime without requiring to copy any file to the local website.

{% include 'common/zkit-basic-usage.md' %}

### 2. Load components 

Add the `z-load` attributes to the host element specifying the component to be loaded
```html
<div z-load="path/to/my/component"></div>
```

{% include "common/zkit-components-list.html" %}


## See also
- [zuix.js](https://zuixjs.org)  
  A small library (18.5kB gzipped) for component-based web development
- [zuix.js Web Starter](https://github.com/zuixjs/zuix-web-starter)  
  A web starter with templates and examples, based on *zuix.js* and [Eleventy](https://www.11ty.dev/), a simple static site generator.
- Older zKit release [v1.0]({{ '/1.0' | url }}) (2016)


{% layout 'column top-stretch' 'style="margin-top: 48px;margin-bottom: 96px"' %}
{% endlayout %}
