const template = `
<div view z-load="@lib/templates/mdl-card{{ type }}" class="visible-on-ready" style="margin: 12px;">
  <h1 #title style="font-size: 150%!important; position: absolute; padding: 12px" class="mdl-color-text--primary-contrast">{{ title }}</h1>
  <img #image src="{{ image }}" alt="Cover image" role="presentation">
  <p #text>{{ content }}</p>
  <a #link.url href="{{ linkUrl }}">
    <span #link.title>{{ linkTitle }}</span>
  </a>
</div>
`;

module.exports = (render, content, title, image, linkTitle, linkUrl, type) => {
  if (type) {
    type = '-' + type;
  }
  return render(template, {content, title, image, linkTitle, linkUrl, type});
};
