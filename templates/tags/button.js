const templateHref = `
<a ctrl z-load="@lib/controllers/mdl-button" z-options="{ type: '{{ buttonType }}', class: '{{ buttonClass }}' }"
     href="{{ linkUrl | safe }}" class="visible-on-ready" style="min-height: {{ height }}px;display: inline-block" {{ attributes }}>{{ content | safe }}</a>`;
const templateButton = `
<button ctrl z-load="@lib/controllers/mdl-button" z-options="{ type: '{{ buttonType }}', class: '{{ buttonClass }}' }"
     class="visible-on-ready" style="min-height: {{ height }}px;display: inline-block" {{ attributes }}>{{ content | safe }}</button>`;

module.exports = (render, content, linkUrl, buttonType, buttonClass, attributes) => {
  // buttonType :==  'flat' | 'raised' | 'fab' | 'icon'
  // buttonClass :==  'mini-fab' | 'accent' | 'colored' | 'primary'
  let height = 36;
  if (buttonType === 'fab') {
    height = 56;
    if (buttonClass.indexOf('mini-fab') > -1) {
      height = 40;
    }
  } else if (buttonType === 'icon') {
    height = 32;
  }
  if (buttonType === 'fab') {
    content = `<i class="material-icons">${content}</i>`;
  }
  const output = render(linkUrl ? templateHref : templateButton, {content, linkUrl, buttonType, buttonClass, attributes, height});
  return output;
};
