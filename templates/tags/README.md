# `zx` tag templates

This is the place where the paired shortcode `{% zx %}` loads custom tags from.

Examples tag:
**file:** `templates/tags/mytag.js`
```js
const template = `
<h1>This is an example tag</h1>
<p>
  {{ content | safe }}
</p>
<pre>
Arguments:
  1 = {{ arg1 }}
  2 = {{ arg2 }}
</pre>`;
module.exports = (render, content, arg1, arg2) => {
  return render(template, {content, arg1, arg2});
};
```

That can be then rendered with the following code:
```liquid
{% zx 'mytag' 'test 1' 'test 2' %}
My content
{% endzx %}
```
**output:**
```html
<h1>This is an example tag</h1>
<p>
  My content
</p>
<pre>
Arguments:
  1 = test 1
  2 = test 2
</pre>`;
```

Tag examples:
- [zuix-web-starter](https://github.com/zuixjs/zuix-web-starter/tree/master/templates/tags) `zx` tags

References:
- [nunjuck templating](https://mozilla.github.io/nunjucks/templating.html)
