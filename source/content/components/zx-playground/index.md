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


The *Playground* is a client-side editor for creating and testing web components.  
It features error reporting, live preview and download of created components that can be then
added to your page by just importing the component module. No dependencies, no extra tools required!  

It also allows to load any existing component by adding to the URL of the page hosting the *playground*
a `#` followed by the path of the component to be loaded. Either relative or absolute URL can be provided 
even if pointing to a component located on a different server.

{% zx "button" "https://zuixjs.org/playground/#/app/widgets/analog-clock" "raised" "colored" %}
Try the Playground on zuixjs.org
{% endzx %}

... or see the example below.


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
- `:load="'<component_id>'"` <small>optional</small>  
  identifier of an existing component to load. It can also be an *absolute
  URL* if the component to be loaded is located on a different server.
- `:menu-items="<items_list>"` <small>optional</small>  
  list of custom menu items `[ {link: '<url>', description: '<desc>'}, ... ]`.


### Example

<style>
zx-playground {
    display: block;
    height: 85vh!important;
}
</style>

{% capture example -%}
<script type="module">
  import "{{ app.zkit.libraryPath }}components/zx-playground.module.js";
</script>
<zx-playground :load="'https://zuixjs.org/app/widgets/analog-clock'" :menu-items="[
    {link: 'https://zuixjs.org/app/examples/new-component', description: 'Hello World'},
    {link: 'https://zuixjs.org/app/widgets/time-clock', description: 'Time Clock'},
    {link: 'https://zuixjs.org/app/widgets/analog-clock', description: 'Analog Clock'},
    {link: 'https://zuixjs.org/app/examples/custom-elements-01', description: 'Custom Elements'}
]"></zx-playground>
{% endcapture %}

```html
{{ example }}
```

### Result

{{ example }}
