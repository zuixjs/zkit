const template = `
<div ctrl z-load="@lib/controllers/mdl-menu" class="visible-on-ready"
     z-behavior="menuButtonBehavior" style="min-height: 56px"
     {% for s in config.settings -%}
     z-{{ s.name }}="{{ s.value }}"
     {%- endfor -%}
     {% for o in config.options -%}
     data-o-{{ o.name }}="{{ o.value }}"
     {%- endfor -%}>

    <ul>
        {% for item in config.items -%}
        <li><a href="{{ item.link }}">{{ item.title }}</a></li>
        {%- endfor %}
    </ul>

    <!-- the menu's FAB button -->
    <a ctrl z-load="@lib/controllers/mdl-button" title="Open menu" href="javascript:;"
       z-options="{ type: '{{ config.button.type }}', class: '{{ config.button.classes }}' }">
        <i class="material-icons">menu</i>
    </a>
</div>
<script>
  menuButtonBehavior = {
    'menu:show': function() {
      this.find('.material-icons').html('add')
        .css({ transform: 'rotate(135deg)' });
    },
    'menu:hide': function() {
      this.find('.material-icons').html('menu')
        .css({ transform: 'rotate(0)' });
    }
  }
</script>
`;

const YAML = require('yaml');
module.exports = (render, config) => {
  config = YAML.parse(config);
  console.log(config)
  return render(template, {config});
};
