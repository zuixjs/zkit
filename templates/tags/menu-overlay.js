const template = `
<div z-load="@lib/components/menu-overlay" class="visible-on-ready"
     {% for s in config.settings -%}
     z-{{ s.name }}="{{ s.value }}"
     {%- endfor -%}
     {% for o in config.options -%}
     data-o-{{ o.name }}="{{ o.value }}"
     {%- endfor -%}>

  <div #items>
    {% for item in config.items -%}
    {% if item.link %}
    <a href="{{ item.link | safe }}" class="button">
      {%- if item.icon and position.value == 'left' %}
      <i class="material-icons" style="margin-left: 2px">{{ item.icon }}</i>
      {% endif -%}
      <span>{{ item.title }}</span>
      {%- if item.icon and position.value != 'left' %}
      <i class="material-icons" style="margin-right: 2px">{{ item.icon }}</i>
      {% endif -%}
    </a>
    {% else %}
    <div class="item-title">{{ item.title }}</div>
    {% endif %}
    {%- endfor %}
  </div>

  <!-- custom open/close menu button -->
  <div #menu_button>
    <a class="circle-button" href="javascript:;" title="Open menu" >
      <i class="material-icons">toc</i>
    </a>
  </div>

  <div #menu_button_close>
    <a class="circle-button" href="javascript:;" title="Close menu" >
      <i class="material-icons">close</i>
    </a>
  </div>

</div>
`;

const YAML = require('yaml');
module.exports = (render, config) => {
  config = YAML.parse(config);
  const position = config.options && config.options.find((o) => o.name === 'position');
  return render(template, {config, position});
};
