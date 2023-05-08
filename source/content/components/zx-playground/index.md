---
layout: side_drawer.liquid
tags:
- components
- documentation
group: components
order: 4
options: mdl highlight sponsor
theme: indigo-pink
icon: sports_soccer
title: Playground
description: Client-side web component editor with live preview and download functionality.  
keywords:
- Playground
- Components editor
- Web component
- zuix.js
---


The *Playground* component is an online editor for creating and testing components.
It features error reporting, component's live preview and download.
It also allows to load any existing component by adding to the URL of the page hosting the *playground*
a `#` followed by the path of the component to be loaded. Either relative or absolute URL can be provided 
even if pointing to a component located on a different server.

{% zx "button" "https://zuixjs.org/playground/" "raised" "colored" %}
Try the Playground
{% endzx %}


## Usage

<div class="mdl-tabs mdl-js-tabs mdl-js-ripple-effect">
  <div class="mdl-tabs__tab-bar" layout="row top-left">
      <a href="#module" class="mdl-tabs__tab is-active">Method #1</a>
      <a href="#script" class="mdl-tabs__tab">Method #2</a>
  </div>
  <div class="mdl-tabs__panel is-active" id="module">

### 1. Import `zx-playground` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}components/zx-playground.module.js";
</script>
```

### 2. Add component to the page

```html
<zx-playground></zx-playground>
```

  </div>
  <div class="mdl-tabs__panel" id="script">

{% include 'common/zkit-basic-usage.liquid' %}

### 2. Add component to the page

```html
<div z-load="{{ app.zkit.libraryPath }}components/zx-playground"></div>
```

  </div>
</div>


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:menu-items= <items_list>` <small>optional</small>  
  list of custom menu items `[ {link: '<url>', description: '<desc>'}, ... ]`.
