const {JSDOM} = require('jsdom');

const template = `
<div z-load="@lib/components/menu-overlay" z-context="{{ contextId }}" z-lazy="false" class="visible-on-ready">

{{ content | safe  }}

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
<script>
function navigateTo(anchor) {
  const target = zuix.$.find('a[name="' + anchor + '"]');
  scrollHelper.scrollTo(target, 300);
}
</script>
`;

const markdownIt = require('markdown-it')();
module.exports = (render, content, contextId) => {
  // convert markdown list to HTML
  content = markdownIt.render(content, {});
  const itemsList = new JSDOM(content).window.document.querySelectorAll('li');
  content = '';
  itemsList.forEach((item) => {
    const elements = item.childNodes;
    let icon = '';
    if (elements.length > 1) {
      icon = item.childNodes.item(item.childNodes.length - 1);
      item.removeChild(icon);
      icon = `<i class="material-icons">${icon.textContent}</i>`;
    }
    const link = item.querySelector('a');
    let href;
    if (link) {
      href = link.getAttribute('href');
      if (href && href.trim()[0] === '#') {
        href = `javascript:navigateTo('${href.trim().substring(1)}')`;
      }
      content += `    <button onclick="${href}" style="height:42px;"><span>${link.innerHTML}</span>${icon}</button>
`;
    }
  });
  content = `<div #items>${content}</div>`;
  return render(template, {content, contextId});
};
