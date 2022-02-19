---
layout: side_drawer.html
options: mdl highlight hide-title hide-footer
theme: green-pink
order: 0
icon: home
title: Welcome
description: zKit, a collection of framework-agnostic components for the web
keywords:
- zuix
- web starter
- home
---


{% unpre %}
```html
<div self="size-x1" layout="column center-center" style="margin: 24px; margin-bottom: 72px; width:auto!important">
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


{% layout 'rows start-spread' 'class="components-summary"' %}

<div>
  <label>Controllers</label>
  <ul>
      {%- for post in collections.posts_controllers -%}
      {% assign match = page.url | split:post.url %}
      <li {% if match[0] == blank %} aria-current="page"{% endif %}>
          <a href="{{ post.url | url }}">
              <div layout="row center-lett">
                  <i class="material-icons">{{ post.data.icon }}</i>
                  <span>{{ post.data.title }}</span>
              </div>
          </a>
      </li>
      {%- endfor -%}
  </ul>
</div>

<div>
<label>Components</label>
  <ul>
      {%- for post in collections.posts_components -%}
      {% assign match = page.url | split:post.url %}
      <li {% if match[0] == blank %} aria-current="page"{% endif %}>
          <a href="{{ post.url | url }}">
              <div layout="row center-lett">
                  <i class="material-icons">{{ post.data.icon }}</i>
                  <span>{{ post.data.title }}</span>
              </div>
          </a>
      </li>
      {%- endfor -%}
  </ul>
</div>

{% endlayout %}
{% unpre %}
```html
<style>
.components-summary {
  margin-top: 80px;  
}
.components-summary label {
  font-weight: bold;
  color: var(--primary-color);
}
.components-summary ul {
  margin: 0;
  padding-left: 0;
}
.components-summary li {
  list-style: none;
}
.components-summary li a {
  color: darkslategrey;
}
.components-summary li i {
  margin-right: 12px;
}
</style>
```
{% endunpre %}



## See also

- [zuix.js](https://zuixjs.org)  
  A small library (18.5kB gzipped) for component-based web development 
- [zuix.js Web Starter](https://github.com/zuixjs/zuix-web-starter)  
  A web starter with templates and examples, based on *zuix.js* and [Eleventy](https://www.11ty.dev/), a simple static site generator.
- Older zKit release [v1.0](../../../1.0) (2016)