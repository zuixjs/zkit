---
layout: side_drawer.liquid
options: mdl highlight sponsor
theme: indigo-pink
icon: list_alt
title: List View
description: List View with lazy-loaded elements
keywords:
- Header
- Hide
- Auto
- Scroll
permalink: /content/controllers/list-view/test-2.html
---


{% unpre %}
```html
{% include './_inc/example-3.liquid' %}
```
{% endunpre %}


&nbsp;


This is how the list is statically generated:

```liquid
{%- raw %}
{% for n in (1..500) %}
  <div z-load="@lib/templates/mdl-card-square" class="item" z-model="{
      image: 'https://picsum.photos/seed/list-view-{{ n }}/320/160',
      title: 'Lazy-loaded {{ n }}',
      text: '12345 abdcef ...'
  }"></div>
{% endfor %}
{% endraw %}
```


(back to ListView page)
