const template = `
<div view z-load="@lib/templates/mdl-card{{ type }}" class="visible-on-ready" style="margin: 12px;min-width: {{ minWidth }}px; min-height: {{ minHeight }}px">
  <h1 #title style="font-size: 150%!important; position: absolute; padding: 12px" class="mdl-color-text--primary-contrast">{{ title | striptags }}</h1>
  <img #image src="{{ image }}" alt="Cover image" role="presentation" width="100%">
  <div style="position: absolute; bottom: 0; background: #ffffffAA">
    <p #text>{{ content | trim | striptags }}</p>
    <a #link.url href="{{ linkUrl | safe }}">
      <span #link.title>{{ linkTitle | striptags }}</span>
    </a>
  </div>
</div>
`;

module.exports = (render, content, type, title, image, linkUrl, linkTitle) => {
  let minHeight = 330;
  let minWidth = 340;
  if (type === 'default') {
    type = '';
  }
  if (type) {
    if (type === 'square') {
      minHeight = 320;
      minWidth = 320;
    } else {
      minHeight = 256;
      minWidth = 256;
    }
    type = '-' + type;
  }
  return render(template, {content, type, title, image, linkUrl, linkTitle, minWidth, minHeight});
};
