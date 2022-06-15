---
layout: side_drawer.liquid
tags:
- controllers
- documentation
group: controllers
order: 0
options: mdl highlight sponsor
theme: indigo-pink
icon: beach_access
title: Shadow View
description: Declarative shadow DOM view component
keywords:
- ShadowDOM
- Shadow DOM
- Shadow View
- Scoped Javascript
- Scoped CSS
- Scoped Stylesheet
---

Decralative [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) component that
supports not just scoped CSS styles, but also:

- Scoped JavaScript
- Data model with two-way binding (model &rlarr; view)
- Templating
- Dynamic component interface with definable public methods and properties
- Component's interoperability with the `using` directive
- Nested components
- Custom events
- Behaviors
- Lazy loading


## Usage

### 1. Import `shadow-view` module

```html
<script type="module">
  import "{{ app.zkit.libraryPath }}controllers/shadow-view.module.js";
</script>
```

### 2. Add component to the page

```html
<shadow-view :mode="closed"
             :ready="onContextReady">
  
  <!-- anything inside here will
       be hosted in a shadow DOM -->    

  <style media="#">

    /* this is a scoped CSS */

  </style>

  <script type="jscript">

    // This is a scoped script
    console.log(this, $, context);

    // expose component's methods
    expose = {
      testMethod: () => console.log('This is a method of this component'),
      get testProp() { return 'this is a read-only property'; }
    }

  </script>
  
</shadow-view>
```


{% tryLink 'Example on CodePen' 'https://codepen.io/genielabs/pen/PoQyKPE' %}


## Option attributes

- `z-context="<context_id>"` <small>optional</small>  
  identifier name to be used to access this component from JavaScript.
- `:on:<event_name>="<handler>"` <small>optional</small>  
  set handler function for event `<event_name>`
- `:ready` <small>optional</small>  
  sets a callback to call when the component is ready. 
- `:mode` <small>optional</small>  
  sets the *attachShadow* mode. It can be `open` or `closed`. Default is `closed`.

&nbsp;

Find out how to use scoped scripts and all other *zuix.js* component's features from
[zuix.js](https://zuixjs.org/pages/documentation/active_refresh/) website.


## Scripting

Get a reference to the component instance using the `:ready` callback:

```js
function onContextReady(sc) {
  self.myShadowComponent = sc;
}
```

### Methods

Methods can be exposed using the `expose` object like shown in the usage example.

```js
myShadowComponent.testMethod();
let a = myShadowComponent.testProp; 
```
