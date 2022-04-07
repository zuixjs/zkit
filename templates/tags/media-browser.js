const template = `
<div z-load="@lib/components/media-browser" class="visible-on-ready"
     {% for s in config.settings -%}
     z-{{ s.name }}="{{ s.value }}"
     {%- endfor -%}
     {% for o in config.options -%}
     data-o-{{ o.name }}="{{ o.value }}"
     {%- endfor -%}>
    <div #media>
    {%- for media in config['media'] %}
      <article data-type="{{ media.type }}" slide-interval="{{ media.interval }}">
        <h1 #title>{{ media.title | striptags }}</h1>
        <h2 #description>{{ media.description | striptags }}</h2>
        <img #preview src="{{ media.preview }}"><br>
        <a #url href="{{ media.url }}">Open media</a>
      </article>
    {%- endfor %}
    </div>
</div>
`;

const YAML = require('yaml');
module.exports = (render, config) => {
  config = YAML.parse(config);
  return render(template, {config});
};
