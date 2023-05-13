const setup = () => {
  customElements.define('list-view', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/list-view', 'ctrl');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.1.26/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
